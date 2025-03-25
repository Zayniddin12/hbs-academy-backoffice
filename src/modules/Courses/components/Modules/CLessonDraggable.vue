<template>
  <div>
    <table class="w-full c-table">
      <thead class="thead-dark">
        <tr>
          <th
            v-for="(item, index) in moduleDraggableHeadData"
            :key="index"
            scope="col"
            class="p-3 bg-gray-800 first:rounded-l-md last:rounded-r-md text-xs text-left last:text-right first:pl-4 last:pr-4 text-gray font-semibold"
          >
            {{ $t(item.title) }}
          </th>
        </tr>
      </thead>
      <Draggable
        v-model="list"
        v-if="mounted"
        tag="tbody"
        class="w-full border-b border-gray-100 relative draggable-table"
        item-key="id"
        ghost-class="ghost"
        v-bind="dragOptions"
        @start="drag = true"
        @end="onDragEnd"
      >
        <template #item="{ element }">
          <tr class="bg-white hover:!bg-dark/5">
            <td scope="row" class="py-3 px-4 text-xs text-dark-100">
              {{ element.id }}
            </td>
            <td class="py-3 px-4 text-sm font-medium text-dark-100">
              {{ element.title }}
            </td>
            <td class="py-3 px-4 text-right cursor-pointer">
              <i class="icon-menu text-xl text-gray"> </i>
            </td>
          </tr>
        </template>
      </Draggable>
    </table>
    <div class="flex justify-end mt-4">
      <CButton
        :text="$t('save')"
        variant="missing"
        @click="$emit('on-save')"
        v-bind="{ loading }"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import Draggable from "vuedraggable";
import { useMounted } from "@/composables/useMounted";
import { ref } from "vue";
const { mounted } = useMounted();
import { moduleDraggableHeadData } from "@/modules/Courses/data";
import CButton from "@/components/Common/CButton.vue";

interface Props {
  tableData?: any;
  loading?: boolean;
}

const props = defineProps<Props>();

// ******* EMITS *******
const emit = defineEmits<{
  (
    e: "update:modelValue",
    value?: { answer: number; question: number }[]
  ): void;
}>();

const dragOptions = {
  animation: 250,
  disabled: false,
};
const drag = ref(false);
const list = ref(props.tableData);
function onDragEnd() {
  drag.value = false;
  emit("update:modelValue", list.value);
}
</script>
<style>
.draggable-table tr[draggable="true"]:active {
  border-radius: 8px !important;
  border: 1px solid #16cc53;
  background: white;
  /*box-shadow: 1px 1px 1px 1px rgb(22, 204, 83);*/
}
.draggable-table tr[draggable="true"] td:first-child {
  border-radius: 8px 0 0 8px !important;
}
.draggable-table tr[draggable="true"] td:last-child {
  border-radius: 0 8px 8px 0 !important;
}
.ghost {
  border-radius: 8px !important;
  border: 1px dashed rgb(200, 207, 214);
  background: #f7f9fa;
  /*box-shadow: 0 0 0 1px rgb(200, 207, 214);*/
}
.ghost td:first-child {
  border-radius: 8px 0 0 8px !important;
}
.ghost td:last-child {
  border-radius: 0 8px 8px 0 !important;
}
</style>
