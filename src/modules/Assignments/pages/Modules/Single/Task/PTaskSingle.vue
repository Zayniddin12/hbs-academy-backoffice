<template>
  <div>
    <Teleport v-if="mounted" to="#header-breadcrumbs">
      <CBreadcrumb v-bind="{ routes }" />
    </Teleport>
    <CCard class="p-6 flex gap-16 mb-5">
      <div class="w-full">
        <div class="flex justify-between w-full gap-4">
          <p class="text-xl leading-130 font-semibold text-dark-100">
            {{ single?.title }}
          </p>
          <div class="gap-3 flex items-center">
            <RouterLink
              :to="`/courses/${route.params.courseId}/module/${route.params.moduleId}/assignments/${single?.id}/edit?type=${single?.type}`"
            >
              <CButton
                variant="info"
                :text="t('edit')"
                icon-position="left"
                icon="icon-edit"
              />
            </RouterLink>
            <CButton
              variant="success-light"
              :text="t('extend_the_period')"
              icon-position="left"
              icon="icon-calendar"
              @click="show = true"
            />
          </div>
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
            <div class="space-y-2">
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
    </CCard>
    <CCard class="p-5">
      <CTableWrapper
        :head="headData"
        :data="tableData"
        :items-per-page="paginationData?.defaultLimit ?? 0"
        :limit="paginationData?.defaultLimit ?? 0"
        :total="paginationData?.total"
        :current-page="paginationData?.currentPage ?? 1"
        :title="t('students_come')"
        :subtitle="t('students_come_count', { count: paginationData?.total })"
        @search="onSearch"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
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
        <template #flow="{ row: data }">
          <div>
            <p class="text-sm leading-normal font-medium text-dark-100">
              {{ data?.flow_name }}
            </p>
            <p class="text-xs leading-normal font-normal text-gray-700 mt-0.5">
              {{ data?.group_name }}
            </p>
          </div>
        </template>
        <template #deadline="{ row: data }">
          <p class="mt-1 text-xs leading-normal font-normal text-dark-100">
            {{ dayjs(data?.end_date).format("D MMMM YYYY, HH:mm") }}
          </p>
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
        <template #attempts="{ row: data }">
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
              :key="flows?.length"
              v-bind="{ options: flows }"
              v-model="filter.flow"
              selected-option-styles="bg-white !border-gray-800 rounded-md "
              value-key="id"
              label-key="name"
              class="min-w-[160px]"
            />
            <FSelect
              :key="group?.length"
              v-bind="{ options: group }"
              selected-option-styles="bg-white !border-gray-800 rounded-md"
              v-model="filter.group"
              value-key="id"
              label-key="title"
              class="min-w-[160px]"
            />
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
    </CCard>
    <CAssignmentDeadlineModal :show="show" @close="show = false" />
  </div>
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CFile from "@/components/Common/CFile.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import dayjs from "dayjs";
import CUserCard from "@/components/Card/CUserCard.vue";
import ApiService from "@/services/ApiService";
import { useRoute } from "vue-router";
import { computed, reactive, ref, watch } from "vue";
import { IAssignmentSingle } from "@/modules/Courses/types";
import { useTableFetch } from "@/composables/useTableFetch";
import { useI18n } from "vue-i18n";
import { updateQueryParams } from "@/utils";
import CButton from "@/components/Common/CButton.vue";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import CAssignmentDeadlineModal from "@/modules/Courses/components/Modules/Assignments/CAssignmentDeadlineModal.vue";

const route = useRoute();
const { mounted } = useMounted();
const { t } = useI18n();
const show = ref(false);

const flows = ref([
  {
    id: 0,
    name: t("all_flows"),
  },
]);
const group = ref([
  {
    id: 0,
    title: t("all_groups"),
  },
]);
const single = ref<IAssignmentSingle>();
const filter = reactive({
  status: "all",
  group: route.query?.group_member__group
    ? +route.query?.group_member__group
    : 0,
  flow: route.query?.flow ? +route.query?.flow : 0,
});

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(
  `backoffice/assignment/AssignmentStudentAssignments/${route.params?.taskId}/`
);

function getSingle() {
  ApiService.get(
    `backoffice/assignment/AssignmentDetail/${route.params?.taskId}`
  ).then((res) => {
    single.value = res?.data;
  });
}

function getFlows() {
  ApiService.get(`backoffice/FlowsList/${route.params?.courseId}`).then(
    (res) => {
      res?.data?.forEach((el: any) => {
        flows.value.push(el);
      });
    }
  );
}

function getGroups() {
  ApiService.get(`backoffice/GroupsList/${route.params?.courseId}`).then(
    (res) => {
      res?.data?.forEach((el: any) => {
        group.value.push(el);
      });
    }
  );
}

getGroups();
getFlows();

getSingle();

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

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "name_student",
    key: "name",
  },
  {
    title: "flow_group",
    key: "flow",
  },
  {
    title: "deadline",
    key: "deadline",
  },
  {
    title: "status",
    key: "date",
  },
  {
    title: "attempts",
    key: "attempts",
  },
  {
    title: "point",
    key: "point",
  },
];

const courseTitle = ref();

function getCourseSingle() {
  ApiService.get(`backoffice/Courses/${route.params.courseId}`).then((res) => {
    courseTitle.value = res?.data?.title;
  });
}

getCourseSingle();

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("courses"),
    route: "/courses",
  },
  {
    name: courseTitle?.value ?? sessionStorage.getItem("courseTitle"),
    route: `/courses/${route.params.courseId}/module`,
  },
  {
    name: t("assignments"),
    route: `/courses/${route.params.courseId}/module/${route.params.moduleId}/assignments`,
  },
  {
    name: single.value?.title,
    route: "/",
  },
]);
</script>
