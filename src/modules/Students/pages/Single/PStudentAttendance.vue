<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb :routes="routes" />
  </Teleport>
  <div>
    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="headData"
        :data="tableData"
        :items-per-page="paginationData.defaultLimit"
        :limit="paginationData.defaultLimit"
        :total="paginationData.total"
        :loading="loading"
        :current-page="paginationData.currentPage"
        :title="t('attendance')"
        :subtitle="t('lesson_count', { count: paginationData.total })"
        @items-per-page="onChangeLimit"
        @page-change="onPageChange"
        @search="onSearch"
      >
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data._index + '.'"
          />
        </template>
        <template #lesson="{ row: data }">
          <p class="text-sm font-medium">{{ data?.lesson?.title }}</p>
        </template>
        <template #date="{ row: data }">
          <p>
            {{ dayjs(data?.date_joined).locale("ru").format("D MMMM, YYYY") }}
          </p>
        </template>
        <template #attendance="{ row: data }">
          <div class="relative w-full flex-y-center justify-end">
            <FCheckbox
              class="text-right"
              value="present"
              :model-value="data?.status === 'present'"
              :checked="data?.status === 'present'"
              @change="(e) => handleChangeAttendance(data?.lesson?.id, e)"
            />
          </div>
        </template>
      </CTableWrapper>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import ApiService from "@/services/ApiService";

const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();
const {
  tableData,
  paginationData,
  loading,
  onChangeLimit,
  onPageChange,
  onSearch,
  fetchTableData,
} = useTableFetch(`/backoffice/StudentAttendance/?student=${route.params.id}`);

const handleChangeAttendance = (lesson_id: string, status: boolean) => {
  updateStudentAttendance(lesson_id, status ? "present" : "absent");
};
const updateStudentAttendance = (lesson_id: string, status: string) => {
  ApiService.put(
    `/backoffice/StudentOfflineAttendanceUpdateDetail/?student_id=${route.params.id}&lesson_id=${lesson_id}`,
    { status }
  )
    .then(() => {
      fetchTableData();
    })
    .catch((error) => {
      console.log(error, "error");
    });
};

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("students"),
    route: "/students",
  },
]);

const headData = computed(() => [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "course_name",
    key: "lesson",
  },
  {
    title: "date",
    key: "date",
  },
  {
    title: "attendance",
    key: "attendance",
  },
]);
</script>

<style scoped>
/* Add your scoped styles here */
</style>
