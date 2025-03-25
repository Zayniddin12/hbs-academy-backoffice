<template>
  <div>
    <div class="p-6 bg-white rounded-xl">
      <div class="flex justify-between items-center">
        <h3 class="text-xl leading-130 font-semibold text-dark-100">
          {{ single?.title }}
        </h3>
        <RouterLink
          :to="`/courses/${single?.module?.course.id}/module/${single?.module?.id}/assignments`"
          class="text-sm leading-130 font-normal text-blue"
        >
          <CButton
            variant="info"
            :text="t('go_to_task')"
            icon-position="right"
            icon="icon-arrow-right"
          />
        </RouterLink>
      </div>
      <div class="flex gap-5 mt-4">
        <p
          class="max-w-[530px] overflow-auto text-wrap text-sm leading-130 font-normal text-dark-100"
        >
          {{ single?.description }}
        </p>
        <div class="w-px h-auto bg-gray-800" />
        <div class="flex flex-col gap-4">
          <CProfileDashDetail
            :title="t('point_count', { point: single?.ball })"
            :description="t('max_point')"
          />
          <div v-if="single?.files.length" class="space-y-2">
            <p class="text-2xs leading-130 text-gray">
              {{ t("additional_file_for_task") }}
            </p>
            <CFile
              v-for="(file, index) in single?.files"
              :key="index"
              :file="{
                ...file,
                name: file?.file_name,
              }"
              class="!p-0 mt-2"
            />
          </div>
        </div>
      </div>
    </div>
    <CCard class="p-5 mt-6">
      <CTableWrapper
        td-class="first-child"
        th-class="first-child"
        :head="headData"
        :data="tableData"
        :items-per-page="paginationData?.defaultLimit ?? 0"
        :limit="paginationData?.defaultLimit ?? 0"
        :total="paginationData?.total"
        :current-page="paginationData?.currentPage ?? 1"
        :title="t('students_passed')"
        :subtitle="t('lesson_count', { count: paginationData?.total })"
        :loading="loading"
        @search="onSearch"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
        has-checkbox
        @handle-check="hasChecked = $event"
      >
        <template #_index="{ row: data }">
          <p class="font-semibold">{{ data?._index }}.</p>
        </template>
        <template #name="{ row: data }">
          <CUserCard
            :card="{
              full_name: data?.student_name,
              avatar: data?.student_avatar,
            }"
          />
        </template>
        <template #deadline="{ row: data }">
          <div>
            <p class="text-xs leading-normal font-normal text-dark-100">
              {{ dayjs(data?.end_date).format("D MMMM YYYY") }}
            </p>
            <p class="mt-1 text-xs leading-normal font-normal text-gray">
              {{ dayjs(data?.end_date).format("HH:mm") }}
            </p>
          </div>
        </template>
        <template #date="{ row: data }">
          <div v-if="data?.submitted">
            <p
              class="text-xs leading-normal font-medium text-green flex-y-center gap-1"
            >
              <i class="icon-tick-circle text-base" />
              {{ t("delivered") }}
            </p>
            <p class="mt-1 text-xs leading-normal font-normal text-dark-100">
              {{ dayjs(data?.submitted_at).format("D MMMM YYYY, HH:mm") }}
            </p>
          </div>
          <div v-else>
            <p
              class="text-xs leading-normal font-medium text-red flex-y-center gap-1"
            >
              <i class="icon-forbidden text-base" />
              {{ t("not_delivered") }}
            </p>
            <p class="mt-1 text-xs leading-normal font-normal text-dark-100">
              -
            </p>
          </div>
        </template>
        <template #try="{ row: data }">
          <p>{{ data?.attempts_count }}</p>
        </template>
        <template #point="{ row: data }">
          <p class="text-xs leading-130 font-normal text-gray text-right">
            <span class="text-dark-100">{{ data?.ball ?? 0 }}</span> /
            {{ data?.max_ball }}
          </p>
        </template>
        <!--    Actions    -->
        <template #beforeSearch>
          <div class="flex-y-center gap-5">
            <FSelect
              v-bind="{ options: status }"
              v-model="filter.status"
              selected-option-styles="bg-white !border-gray-800 rounded-md "
              value-key="value"
              label-key="name"
              class="min-w-[160px]"
            />
          </div>
        </template>

        <template #no-data>
          <div class="py-[128px] flex-center">
            <div class="text-center">
              <img
                src="/images/svg/no-data/no-events.svg"
                alt="no-events"
                class="mx-auto"
              />
              <p class="text-base leading-130 font-semibold text-dark-100 mt-6">
                {{ t("no_events_yet") }}
              </p>
              <p class="mt-1.5 text-sm leading-130 font-normal text-gray">
                {{ t("no_events_yet_text") }}
              </p>
            </div>
          </div>
        </template>
      </CTableWrapper>
      <div class="flex gap-3 items-center -mt-[54px]">
        <CButton
          variant="primary"
          :text="t('download')"
          icon-position="right"
          :loading="buttonLoading"
          icon="icon-file-assignment"
          @click="downloadSelectedData()"
        />
        <!--        <CButton-->
        <!--          variant="info"-->
        <!--          :text="t('cancel')"-->
        <!--          icon-position="right"-->
        <!--          icon="icon-close"-->
        <!--          @click="hasChecked = false"-->
        <!--        />-->
      </div>
    </CCard>
  </div>
</template>

<script setup lang="ts">
import CButton from "@/components/Common/CButton.vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/services/ApiService";
import { useRoute } from "vue-router";
import { reactive, ref, watch } from "vue";
import { IAssignmentSingle } from "@/modules/Courses/types";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import dayjs from "dayjs";
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CUserCard from "@/components/Card/CUserCard.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { updateQueryParams } from "@/utils";
import { useAssignmentStore } from "@/modules/Assignments/store";
const { t } = useI18n();

const route = useRoute();
const store = useAssignmentStore();
const single = ref<IAssignmentSingle>();
const buttonLoading = ref(false);
function getSingle() {
  ApiService.get(
    `backoffice/assignment/AssignmentDetail/${route.params?.id}`
  ).then((res) => {
    single.value = res?.data;
  });
}

getSingle();

const {
  tableData,
  paginationData,
  onSearch,
  loading,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(
  `backoffice/assignment/AssignmentStudentAssignments/${route.params?.id}`
);

const headData = [
  {
    title: "student",
    key: "name",
  },
  {
    title: "term",
    key: "deadline",
  },
  {
    title: "status",
    key: "date",
  },
  {
    title: "try",
    key: "try",
  },
  {
    title: "point",
    key: "point",
  },
];
const status = [
  {
    name: t("all_status"),
    value: "all",
  },
  {
    name: t("delivered"),
    value: "true",
  },
  {
    name: t("not_delivered"),
    value: "false",
  },
];
const filter = reactive({
  status: "all",
  group: route.query?.group_member__group
    ? +route.query?.group_member__group
    : 0,
  flow: route.query?.flow ? +route.query?.flow : 0,
});

const hasChecked = ref(false);

watch(
  () => filter,
  async () => {
    if (typeof filter.group === "number" && filter.group !== 0) {
      await updateQueryParams("group_member__group", filter?.group);
    } else {
      await updateQueryParams("group_member__group", undefined);
    }
    if (typeof filter.flow === "number" && filter.flow !== 0) {
      await updateQueryParams("flow", filter?.flow);
    } else {
      await updateQueryParams("flow", undefined);
    }

    if (filter.status === "all") {
      await updateQueryParams("submitted", undefined);
    } else {
      await updateQueryParams("submitted", filter?.status);
    }

    await fetchTableData();
  },
  {
    deep: true,
  }
);

const downloadSelectedData = () => {
  downloadExcelFile(
    import.meta.env.VITE_APP_BASE_URL +
      `/backoffice/assignment/AssignmentStudentAssignments/${
        route.params.id
      }?export=true&student_assignment_ids=${store.allIds?.join(",")}`,
    "assignments.xlsx"
  );
};

async function downloadExcelFile(url: string, filename: string) {
  buttonLoading.value = true;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("id_token")}`,
    },
  }).finally(() => (buttonLoading.value = false));
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const blob = await response.blob();
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename || "data.xlsx";
  link.click();
  window.URL.revokeObjectURL(link.href);
}
</script>

<style>
.first-child:nth-child(1) {
  display: flex;
  gap: 33px;
  align-items: center;
}
</style>
