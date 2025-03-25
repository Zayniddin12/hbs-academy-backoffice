<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="headData"
        :data="tableData"
        :items-per-page="paginationData?.defaultLimit"
        :limit="paginationData?.defaultLimit"
        :total="paginationData?.total"
        :current-page="paginationData?.currentPage"
        :title="t('courses')"
        :subtitle="t('courses_count', { count: paginationData?.total })"
        :tr-class="{
          'animate-bg': $route.query.course,
        }"
        @search="onSearch"
        :loading="loading"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
      >
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data._index + '.'"
          />
        </template>
        <template #title="{ row: data }">
          <CAssignmentsCard
            :card="data"
            :params="{ mentorId: data?.id }"
            route-name="AssignmentModules"
          />
        </template>
        <template #progress="{ row: data }">
          <CAssignmentsProcessCard :max="100" :value="data.progress" />
        </template>
        <template #flow_count="{ row: data }">
          <p class="text-center">{{ data?.flow_count }}</p>
        </template>
        <template #mentor_count="{ row: data }">
          <p class="text-center">{{ data?.mentor_count }}</p>
        </template>
        <template #tasks_count="{ row: data }">
          <div class="flex items-center justify-center gap-1">
            <p class="text-center">{{ data?.submitted_tasks_count }}</p>
            /
            <p class="text-center text-gray">{{ data?.tasks_count }}</p>
          </div>
        </template>
        <template #course_students="{ row: data }">
          <p
            class="flex items-center justify-center text-dark-100 text-xs gap-1"
          >
            <i class="icon-people text-xl text-gray"></i
            >{{ data?.students_count }}
          </p>
        </template>
        <template #no-data>
          <CNodata
            :title="$t('no_courses')"
            :subtitle="$t('no_courses_text')"
          />
        </template>
      </CTableWrapper>
    </section>
  </div>
  <CDeleteCourse
    :show="showDelete"
    @close="showDelete = false"
    @submit="fetchTableData"
    :id="selectedCourse"
  />
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import dayjs from "dayjs";
import CCourseCard from "@/modules/Students/components/CCourseCard.vue";
import CButton from "@/components/Common/CButton.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { secondsToTime, updateQueryParams } from "@/utils";
import CNodata from "@/components/Common/CNodata.vue";
import CDeleteCourse from "@/modules/Courses/components/Delete/CDeleteCourse.vue";
import { useAuthStore } from "@/modules/Auth/stores";
import CAssignmentsProcessCard from "@/modules/Assignments/components/CAssignmentsProcessCard.vue";
import CAssignmentsCard from "@/modules/Assignments/components/CAssignmentsCard.vue";

const { t } = useI18n();
const { mounted } = useMounted();

const {
  tableData,
  paginationData,
  onSearch,
  loading,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(`/backoffice/assignment/AssignmentCourseList/`);

const showDelete = ref(false);
const selectedCourse = ref(null);

const routes = computed(() => [
  {
    name: t("home_task"),
    route: "/",
  },
]);

onMounted(() => {
  setTimeout(() => {
    updateQueryParams("course", undefined);
  }, 4000);
});

const authStore = useAuthStore();

const userRole = computed(() => authStore?.user?.role);

function grandAccess(role: string) {
  return ["admin", "manager"]?.includes(role);
}

const headData = computed(() => {
  let data = [
    {
      title: "table.head.title1",
      key: "_index",
      customClass: "",
    },
    {
      title: "course_name",
      key: "title",
      customClass: "",
    },
    {
      title: "process",
      key: "progress",
      customClass: "",
    },
    {
      title: "number_of_streams",
      key: "flow_count",
      customClass: "text-center",
    },
    {
      title: "number_of_mentors",
      key: "mentor_count",
      customClass: "text-center",
    },
    {
      title: "tasks_completed",
      key: "tasks_count",
      customClass: "text-center",
    },
    {
      title: "students_count",
      key: "course_students",
      customClass: "text-center",
    },
  ];

  if (userRole.value === "mentor") {
    return data.map((item) =>
      item.key === "action"
        ? { title: "", key: "" }
        : { title: item?.title, key: item?.key }
    );
  }

  return data;
});
</script>

<style>
.animate-bg:first-child {
  animation: fadeBg 4s ease-in forwards;
}

@keyframes fadeBg {
  0% {
    background-color: #f0fff4;
  }
  100% {
    background-color: #fff;
  }
}
</style>
