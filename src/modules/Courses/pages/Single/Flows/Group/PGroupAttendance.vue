<template>
  <Teleport v-if="mounted" to="#group-actions">
    <FInput
      v-model="filter.search"
      prefix-class="pr-2.5"
      :placeholder="$t('search')"
      class="border border-gray-100 min-w-[240px]"
    >
      <template #prefix>
        <span class="icon-search-normal text-gray text-xl"></span>
      </template>
      <template #suffix>
        <button
          :class="{ '!opacity-100 !visible': filter.search?.length }"
          class="w-5 h-5 flex-center bg-gray/[16%] rounded-full p-1 transition-200 group hover:bg-red opacity-0 invisible"
          @click="filter.search = ''"
        >
          <span
            class="icon-close text-gray text-[10px] transition-200 group-hover:text-white"
          />
        </button>
      </template>
    </FInput>
  </Teleport>
  <div class="w-full">
    <CTableWrapper
      no-header
      :head="headData"
      :data="tableData"
      :items-per-page="paginationData?.defaultLimit"
      :limit="paginationData?.defaultLimit"
      :total="paginationData?.total"
      :current-page="paginationData?.currentPage"
      @itemsPerPage="onChangeLimit"
      @pageChange="onPageChange"
      :loading="loading"
    >
      <template #_index="{ row: data }">
        <p class="font-semibold">{{ data?._index }}.</p>
      </template>
      <template #student="{ row: data }">
        <CStudentCard
          :card="{
            name: data?.full_name,
            image: data?.avatar,
            isBlocked: !data?.is_active,
            isOnline: data?.is_online,
          }"
        />
      </template>
      <template #attendance_been_count="{ row: data }">
        <p>{{ data?.attended_lessons }}</p>
      </template>
      <template #attendance_not_been_count="{ row: data }">
        <p class="text-right">{{ data?.missed_lessons }}</p>
      </template>

      <!--   Actions   -->
      <template #no-data>
        <div class="py-[128px] flex-center">
          <div class="text-center">
            <img
              src="/images/svg/no-data/no-groups.svg"
              alt="no-events"
              class="mx-auto"
            />
            <p class="text-base leading-130 font-semibold text-dark-100 mt-6">
              {{ $t("no_groups_yet") }}
            </p>
            <p class="mt-1.5 text-sm leading-130 font-normal text-gray">
              {{ $t("no_groups_yet_text") }}
            </p>
          </div>
        </div>
      </template>
    </CTableWrapper>
  </div>
</template>

<script setup lang="ts">
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { useRoute } from "vue-router";
import { useTableFetch } from "@/composables/useTableFetch";
import CStudentCard from "@/modules/Students/components/CStudentCard.vue";
import { useMounted } from "@/composables/useMounted";
import { reactive, ref, watch } from "vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { useCoursesStore } from "@/modules/Courses/store";
import { debounce } from "@/utils";

const { mounted } = useMounted();

const route = useRoute();

const store = useCoursesStore();
const search = ref("");

const filter = reactive({
  search: route.query?.search || "",
});

const {
  tableData,
  paginationData,
  onPageChange,
  onChangeLimit,
  onSearch,
  loading,
} = useTableFetch(
  `backoffice/GroupStudents/${route.params.groupId}/Attendance/`
);

watch(
  () => search.value,
  (value) => {
    debounce("worker_search", () => {
      store.fetchWorkers(value);
    });
  }
);
watch(
  () => filter.search,
  () => onSearch(filter.search)
);

watch(
  () => search.value,
  (value) => {
    debounce("worker_search", () => {
      store.fetchWorkers(value);
    });
  }
);
const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "student",
    key: "student",
  },
  {
    title: "attendance_been_count",
    key: "attendance_been_count",
  },
  {
    title: "attendance_not_been_count",
    key: "attendance_not_been_count",
  },
];
</script>
