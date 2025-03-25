<template>
  <div class="w-full flex items-center justify-end gap-5 pb-5 pt-4">
    <slot name="beforePagination" />

    <div class="flex-y-center gap-5">
      <CommonPageLimitChange
        v-model:itemsPerPage="itemsCountInTable"
        v-if="total > 5"
      />

      <CommonPagination
        v-if="totalPages > 1"
        pagination-buttons
        v-bind="{ total, currentPage, limit }"
        @input="$emit('page-change', $event)"
        :item-class="paginationClasses"
        :active-class="paginationClasses"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CommonPagination from "@/components/Common/Table/CPagination.vue";
import CommonPageLimitChange from "@/components/Common/Table/CPageLimitChange.vue";
import { computed, ref, WritableComputedRef } from "vue";

interface Props {
  total?: number;
  limit: number;
  currentPage: number;
  itemsPerPage: number;
  paginationClasses?: string;
  activePaginationClasses?: string;
}
const props = defineProps<Props>();
const emit = defineEmits(["itemsPerPage"]);

const totalPages = computed(() => {
  if (props.total < props.limit) {
    return 1;
  } else {
    return props.total / props.limit;
  }
});
const inputItemsPerPage = ref(10);

const itemsCountInTable: WritableComputedRef<number> = computed({
  get(): number {
    return props.itemsPerPage;
  },
  set(value: number): void {
    inputItemsPerPage.value = value;
    emit("itemsPerPage", value);
  },
});
</script>

<style scoped></style>
