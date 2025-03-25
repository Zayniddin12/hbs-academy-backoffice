<template>
  <div>
    <Teleport v-if="mounted" to="#header-breadcrumbs">
      <CBreadcrumb v-bind="{ routes }" />
    </Teleport>

    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="assignmentHeadData"
        :data="tableData"
        no-search
        :items-per-page="paginationData?.defaultLimit"
        :limit="paginationData?.defaultLimit"
        :total="paginationData?.total"
        th-class="last:!text-left"
        :current-page="paginationData?.currentPage"
        :title="$t('course_module')"
        :subtitle="t('course_module_count', { count: tableData?.length })"
        :loading="loading"
        @search="onSearch"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
      >
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data?._index + '.'"
          />
        </template>
        <template #name="{ row: data }">
          <RouterLink
            @click="saveId(data.id)"
            :to="{
              name: 'AssignmentMentorSingle'
            }"
            class="text-dark-100 text-sm font-medium hover:text-green transition-300"
          >
            {{ data?.title }}
          </RouterLink>
        </template>
        <template #duration="{ row: data }">
          <p>{{ t("days", { day: data?.duration_days }) }}</p>
        </template>
        <template #lessons="{ row: data }">
          <p>{{ data?.lessons_count }}</p>
        </template>
        <template #task="{ row: data }">
          <p class="">{{ data?.assignments_count }}</p>
        </template>
        <template #no-data>
          <CNodata
            image="/images/svg/no-data/no-modules.svg"
            :title="$t('no_modules')"
            :subtitle="$t('no_modules_text')"
          />
        </template>
      </CTableWrapper>
    </section>
  </div>
</template>
<script setup lang="ts">
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import CNodata from "@/components/Common/CNodata.vue";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { useCoursesStore } from "@/modules/Courses/store";

const route = useRoute();
const { mounted } = useMounted();
const { t } = useI18n();

const { tableData, paginationData, onSearch, onPageChange, onChangeLimit, loading } =
  useTableFetch(`/backoffice/Courses/${route?.params?.id}/Modules/`, {}, true);

const store = useCoursesStore();
const single = computed(() => store.courseSingle);

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
    name: single.value?.title,
    route: "/",
  },
]);

const assignmentHeadData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "naming",
    key: "name",
  },
  {
    title: "duration_module",
    key: "duration",
  },
  {
    title: "lessons_count",
    key: "lessons",
  },
  {
    title: "tasks_count",
    key: "task",
  },
];
const saveId = (id) => {
  localStorage.setItem("moduleId", id);
};
</script>
