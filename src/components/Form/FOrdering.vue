<template>
  <div>
    <Draggable
      v-if="mounted"
      v-model="list"
      class="flex flex-col gap-3"
      :component-data="{
        tag: 'transition-group',
        type: 'transition-group',
        name: !drag ? 'flip-list' : null,
      }"
      item-key="id"
      ghost-class="ghost"
      v-bind="dragOptions"
      @start="drag = true"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <li
          class="flex-center-between p-3 pl-4 rounded-xl bg-gray-100"
          :class="{ '!cursor-grab': drag }"
          :style="{ cursor: 'grab !important' }"
        >
          <p
            v-if="element?.text"
            class="text-base leading-130 font-medium text-dark"
          >
            {{ element?.text }}
          </p>
          <div v-if="element?.photo" class="w-10 h-auto">
            <img :src="element?.photo" alt="image" />
          </div>
          <div>
            <i class="icon-menu text-xl text-gray" />
          </div>
        </li>
      </template>
    </Draggable>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import Draggable from "vuedraggable";

import { useMounted } from "@/composables/useMounted";

interface Props {
  answers: any;
}

const props = defineProps<Props>();

// ******* EMITS *******
const emit = defineEmits<{
  (
    e: "update:modelValue",
    value?: { answer: number; question: number }[]
  ): void;
}>();

const { mounted } = useMounted();

const dragOptions = {
  animation: 250,
  disabled: false,
};

const drag = ref(false);
const list = ref<any[]>([]);

watch(
  () => props.answers,
  (newValue) => {
    if (newValue) {
      list.value = [...newValue];
    }
  },
  { deep: true, immediate: true }
);

function onDragEnd() {
  drag.value = false;
  emit("update:modelValue", list.value);
}
</script>
