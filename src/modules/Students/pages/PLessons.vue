<template>
  <div>
    <CTableWrapper
      no-header
      :head="headData"
      :data="tableData"
      :items-per-page="paginationData.defaultLimit"
      :limit="paginationData.defaultLimit"
      :total="paginationData.total"
      :current-page="paginationData.currentPage"
      :title="t('modules')"
      :subtitle="t('modules_count', { count: paginationData.total ?? 0 })"
      @itemsPerPage="onChangeLimit"
      @pageChange="onPageChange"
    >
      <template #_index="{ row: data }">
        <span
          class="text-sm text-dark-100 font-semibold leading-normal"
          v-text="data._index + '.'"
        />
      </template>
      <template #name="{ row: data }">
        <RouterLink
          :to="{
            name: 'StudentsModuleSingleLessons',
            params: { moduleId: data?.id },
          }"
          class="text-sm leading-130 font-medium text-dark-100 hover:text-green transition-300"
        >
          {{ data?.details?.title }}
        </RouterLink>
      </template>
      <template #status_lesson="{ row: data }">
        <CCourseProcessCard
          :value="data?.viewed_duration"
          :max="data?.details?.video_duration ?? 0"
        >
          <template #title>
            <p class="text-xs leading-130 font-medium text-gray">
              <span class="text-dark-100">{{
                secondsToTime(data?.viewed_duration, true)
              }}</span>
              /
              {{ secondsToTime(data?.details?.video_duration ?? 0, true) }}
            </p>
          </template>
        </CCourseProcessCard>
      </template>
      <template #start_end="{ row: data }">
        <p class="text-xs leading-130 text-dark-100">
          {{
            data?.start_at
              ? dayjs(data?.start_at).format("DD.MM.YYYY, HH:mm")
              : "-"
          }}
          /
          {{
            data?.finish_at
              ? dayjs(data?.finish_at).format("DD.MM.YYYY, HH:mm")
              : "-"
          }}
        </p>
      </template>
      <template #point="{ row: data }">
        <p class="text-xs leading-130 font-medium text-gray text-right">
          <span class="text-dark-100">{{
            data?.point ? t("point_count", { point: data?.received_ball }) : 0
          }}</span>
          /
          {{ t("point_count", { point: data?.details?.ball }) }}
        </p>
      </template>
      <template #no-data>
        <CNodata
          :title="$t('no_lessons')"
          :subtitle="$t('no_lessons_text')"
          image="/images/svg/no-data/no-groups.svg"
        />
      </template>
    </CTableWrapper>
  </div>
</template>

<script setup lang="ts">
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CCourseProcessCard from "@/modules/Students/components/CCourseProcessCard.vue";
import { secondsToTime } from "@/utils";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useTableFetch } from "@/composables/useTableFetch";
import CNodata from "@/components/Common/CNodata.vue";

const { t } = useI18n();

const route = useRoute();

const { tableData, paginationData, onChangeLimit, onPageChange } =
  useTableFetch(
    `/backoffice/StudentModuleLessons/?student=${
      route.params.id as string
    }&lesson__module__student_modules=${route.params.moduleId as string}`
  );

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "name",
    key: "name",
  },
  {
    title: "status_lesson",
    key: "status_lesson",
  },
  {
    title: "start_end",
    key: "start_end",
  },
  {
    title: "point",
    key: "point",
  },
];
</script>
