<template>
  <div>
    <Teleport v-if="mounted" to="#header-breadcrumbs">
      <CBreadcrumb v-bind="{ routes }" />
    </Teleport>
    <CCard class="p-6 flex gap-16 mb-5">
      <div class="w-full">
        <div class="flex w-full gap-4">
          <img
            class="border-2 rounded-md max-w-[122px] min-h-[122px] object-cover border-gray-800"
            :src="single?.photo"
            alt=""
          />
          <div class="w-full">
            <div class="flex-center-between">
              <p class="text-xl leading-130 font-semibold text-dark-100">
                {{ single?.title }}
              </p>
              <RouterLink :to="`/courses/${route.params.id}/module/`">
                <CButton
                  class="!font-medium"
                  variant="info"
                  :text="t('go_to_course')"
                  icon-position="right"
                  icon="icon-arrow-right"
                />
              </RouterLink>
            </div>
            <p
              class="max-w-[530px] overflow-auto text-wrap text-sm leading-130 font-normal text-dark-100"
            >
              {{ single?.description }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-5 mt-6">
          <div
            v-for="item in infoCount"
            :key="item.title"
            class="border py-2 px-3 rounded-md border-dashed border-[#E4E6EF] group gap-2"
            :class="
              item.type === 'student' ? 'border-[#3DD641] bg-[#E8FAEE]' : ''
            "
          >
            <h3
              v-if="item.type !== 'date'"
              :class="item.type === 'student' ? 'text-[#16CC53]' : ''"
              class="text-dark-100 font-medium leading-130 text-sm font-roboto"
            >
              {{ item.count }}
            </h3>
            <h3
              v-else-if="item.type === 'date'"
              class="text-dark-100 font-medium leading-130 text-sm font-roboto"
            >
              {{ dayjs(item.count).format("D MMMM YYYY") }}
            </h3>
            <p class="text-gray text-xs mt-0.5">{{ item.title }}</p>
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
        :title="t('teachers')"
        :subtitle="t('person', { count: paginationData?.total })"
        @search="onSearch"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
      >
        <template #_index="{ row: data }">
          <p class="font-semibold">{{ data?._index }}.</p>
        </template>
        <template #name="{ row: data }">
          <RouterLink :to="`mentor/${data.id}`">
            <CUserCard
              :card="{
                full_name: data?.full_name,
                avatar: data?.avatar,
              }"
            />
          </RouterLink>
        </template>
        <template #role="{ row: data }">
          <div class="flex">
            <p
              class="text-sm py-1.5 px-2 rounded-md leading-normal font-medium text-yellow bg-yellow-100"
            >
              {{ data?.role }}
            </p>
          </div>
        </template>
        <template #number_of_streams="{ row: data }">
          <p
            class="mt-1 text-xs leading-normal font-normal text-dark-100 text-center"
          >
            {{ data?.flow_count }}
          </p>
        </template>
        <template #groups_count="{ row: data }">
          <p
            class="mt-1 text-xs leading-normal font-normal text-dark-100 text-center"
          >
            {{ data?.group_count }}
          </p>
        </template>
        <template #students_count="{ row: data }">
          <p
            class="flex items-center justify-center text-dark-100 text-xs gap-1"
          >
            <i class="icon-people text-xl text-gray"></i
            >{{ data?.student_count }}
          </p>
        </template>
        <template #point="{ row: data }">
          <p class="text-xs leading-130 font-normal text-gray text-right">
            <span class="text-dark-100">{{ data?.ball ?? 0 }}</span> /
            {{ data?.max_ball }}
          </p>
        </template>
        <!--    Actions    -->

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
import CAvatar from "@/components/CAvatar.vue";

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
} = useTableFetch(`/backoffice/Courses/${route.params?.id}/StuffMembers/`);

function getSingle() {
  ApiService.get(`backoffice/Courses/${route.params?.id}`).then((res) => {
    single.value = res?.data;
  });
}

function getFlows() {
  ApiService.get(`backoffice/FlowsList/${route.params?.id}`).then((res) => {
    res?.data?.forEach((el: any) => {
      flows.value.push(el);
    });
  });
}

function getGroups() {
  ApiService.get(`backoffice/GroupsList/${route.params?.id}`).then((res) => {
    res?.data?.forEach((el: any) => {
      group.value.push(el);
    });
  });
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
    title: "workers.table.user",
    key: "name",
  },
  {
    title: "workers.table.role",
    key: "role",
  },
  {
    title: "number_of_streams",
    key: "number_of_streams",
    customClass: "!text-center",
  },
  {
    title: "groups_count",
    key: "groups_count",
    customClass: "!text-center",
  },
  {
    title: "students_count",
    key: "students_count",
    customClass: "!text-center",
  },
];

const courseTitle = ref();

function getCourseSingle() {
  ApiService.get(`backoffice/Courses/${route.params.id}`).then((res) => {
    courseTitle.value = res?.data?.title;
  });
}

getCourseSingle();

const routes = computed(() => [
  {
    name: t("assignments"),
    route: "/assignments",
  },
  {
    name: single.value?.title,
    route: "/",
  },
]);

const infoCount = computed(() => [
  {
    title: t("module"),
    count: single.value?.modules_count,
  },
  {
    title: t("lessons"),
    count: single.value?.lessons_count,
  },
  {
    title: t("assignments"),
    count: single.value?.assignments_count,
  },
  {
    title: t("created_at"),
    count: single?.value?.created_at,
    type: "date",
  },
  {
    title: t("course_students"),
    count: single?.value?.students_count,
    type: "student",
  },
]);

</script>
