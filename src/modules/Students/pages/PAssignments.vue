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
            name: 'AssignmentSingle',
            params: { id: data?.id },
          }"
          class="text-sm leading-130 font-medium text-dark-100 hover:text-green transition-300 block max-w-[70%]"
        >
          {{ data?.details?.title ?? "" }}
        </RouterLink>
      </template>
      <template #deadline="{ row: data }">
        <p class="whitespace-nowrap">
          {{ dayjs.utc(data?.end_date).format("DD MMMM YYYY, HH:mm") }}
        </p>
      </template>
      <template #status="{ row: data }">
        <div v-if="data?.submitted">
          <p
            class="text-xs leading-130 font-medium text-green flex-y-center gap-1"
          >
            <i class="icon-tick-circle text-base" />
            {{ $t("delivered") }}
          </p>
          <p class="whitespace-nowrap text-xs leading-normal text-dark-100">
            {{ dayjs(data?.submitted_at).format("DD MMMM YYYY, HH:mm") }}
          </p>
        </div>
        <div v-else>
          <p
            class="text-xs leading-130 font-medium text-red flex-y-center gap-1 whitespace-nowrap"
          >
            <i class="icon-forbidden text-base" />
            {{ $t("not_delivered") }}
          </p>
          <p class="whitespace-nowrap text-xs leading-normal text-dark-100">
            -
          </p>
        </div>
      </template>
      <template #attempts="{ row: data }">
        <p class="font-medium w-[120px]">{{ data?.attempts_count }}</p>
      </template>
      <template #point="{ row: data }">
        <p
          class="text-xs leading-130 font-medium text-gray text-right whitespace-nowrap"
        >
          <span class="text-dark-100">{{ data?.ball ?? 0 }}</span> /
          {{ data?.details?.ball ?? 0 }}
        </p>
      </template>
      <template #no-data>
        <CNodata
          :title="$t('no_assignments')"
          :subtitle="$t('no_assignments_text')"
          image="/images/svg/no-data/no-groups.svg"
        />
      </template>
    </CTableWrapper>
  </div>
</template>

<script setup lang="ts">
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useTableFetch } from "@/composables/useTableFetch";
import CNodata from "@/components/Common/CNodata.vue";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { t } = useI18n();
const route = useRoute();

const { paginationData, tableData, onPageChange, onChangeLimit } =
  useTableFetch(
    `/backoffice/assignment/StudentModuleAssignments/${
      route.params.moduleId as string
    }/`
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
    title: "deadline",
    key: "deadline",
  },
  {
    title: "status",
    key: "status",
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

// Fetch data
// store.fetchStudentModuleAssignments(route.params.moduleId as string);
</script>
