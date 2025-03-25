<template>
  <div>
    <CTableHeader
      class="hello"
      v-if="!noHeader"
      :search="filter.search"
      :title="title"
      :no-search="noSearch"
      :subtitle="subtitle"
      @search="handleTableSearch"
      search-placeholder="search"
    >
      <template #header_title>
        <slot name="header_title"></slot>
      </template>
      <template #afterSearch>
        <slot name="afterSearch"></slot>
      </template>
      <template #beforeSearch>
        <slot name="beforeSearch"></slot>
      </template>
    </CTableHeader>
    <slot name="filter" />
    <slot name="main">
      <CTable
        :type="type"
        :total="data?.length"
        :data="data"
        :head="head"
        :td-class="tdClass"
        :current-page="currentPage"
        :loading="loading"
        :limit="limit"
        :has-sort="hasSort"
        :sort-key="sortKey"
        v-bind="{ hasCheckbox }"
        :th-class="['bg-gray-800', thClass]"
        @checked="emit('handleCheck', $event)"
        @sortTable="handleSortTable"
        :body-tr-class="trClass"
      >
        <template
          v-for="(row, j) in head"
          :key="j"
          v-slot:[row?.key]="{ data }"
        >
          <slot v-if="row?.key" :name="`${row?.key}`" :row="data" />
        </template>
        <template #no-data>
          <slot name="no-data" />
        </template>
      </CTable>
    </slot>

    <slot v-if="data?.length" name="footer">
      <Transition name="dropdown" mode="out-in">
        <CTableFooter
          v-if="!loading"
          :total="total"
          :items-per-page="itemsPerPage"
          :class="footerClass"
          :limit="limit"
          :current-page="currentPage"
          @items-per-page="(e) => emit('itemsPerPage', e)"
          @page-change="(e) => emit('pageChange', e)"
        >
          <template v-slot:beforePagination>
            <slot name="beforePagination"></slot>
          </template>
        </CTableFooter>
      </Transition>
    </slot>
  </div>
</template>

<script setup lang="ts">
import CTable from "@/components/Common/Table/CTable.vue";
import CTableHeader from "@/components/Common/Table/CTableHeader.vue";
import CTableFooter from "@/components/Common/Table/CTableFooter.vue";
import { ITableHead } from "@/types/components/table";

import { reactive } from "vue";

interface Props {
  title?: string;
  subtitle?: string;

  type?: "filled" | "transparent";

  loading?: boolean;
  footerClass?: string;

  head: ITableHead[];
  data: Record<string, any>[];

  total?: number;
  limit: number;
  currentPage: number;
  itemsPerPage: number;
  thClass?: string;
  noHeader?: boolean;
  noSearch?: boolean;
  tdClass?: string;
  trClass?: string;
  hasSort?: boolean;
  sortKey?: string;
  hasCheckbox?: boolean;
}
withDefaults(defineProps<Props>(), {
  type: "transparent",
});
const emit = defineEmits<{
  (e: "search", value: string): void;
  (e: "itemsPerPage", value: number): void;
  (e: "pageChange", value: number): void;
  (e: "sortTable"): void;
}>();
function handleSortTable() {
  emit("sortTable");
}
const filter = reactive({
  status: "all" as "true" | "false",
  search: "",
  date: undefined as string | undefined,
  limit: 10,
  page: 1,
});
function handleTableSearch(q: string) {
  emit("search", q);
}
</script>
