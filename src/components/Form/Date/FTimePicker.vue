<template>
  <div class="flex items-center space-x-[6px]">
    <Select
      selected-option-styles="border border-gray-100 !py-2"
      :options="startOptions"
      value-key="id"
      :disabled="disabled"
      label-key="title"
      :model-value="startTime"
      @update:model-value="handleUpdateStart"
    />
    <div class="w-3 h-1 bg-gray-100 rounded-lg" />
    <Select
      selected-option-styles="border border-gray-100 !py-2"
      :options="endOptions"
      value-key="id"
      :disabled="disabled"
      label-key="title"
      :model-value="endTime"
      @update:model-value="handleUpdateEnd"
    />
  </div>
</template>

<script lang="ts" setup>
import Select from "@/components/Form/Select/FSelect.vue";
import { ref, watch } from "vue";

interface Props {
  disabled: boolean;
}
defineProps<Props>();
const emit = defineEmits<{
  (e: "startTime", value: string | number): void;
  (e: "endTime", value: string | number): void;
}>();

const startOptions = ref(generateTime());
const endOptions = ref(generateTime());

const startTime = ref(startOptions.value[0]);
const endTime = ref(endOptions.value[0]);

function generateTime() {
  const times = [];
  for (let i = 0; i < 24; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    const title = `${hour}:00`;
    const id = `${hour}:00:00`;
    times.push({ title, id });
  }
  return times;
}
const handleUpdateStart = (value: string | number) => {
  emit("startTime", value);
};
const handleUpdateEnd = (value: string | number) => {
  emit("endTime", value);
};
watch(
  () => startTime.value,
  (value) => {
    emit("startTime", value?.id);
  },
  { deep: true, immediate: true }
);
watch(
  () => endTime.value,
  (value) => {
    emit("endTime", value?.id);
  },
  { deep: true, immediate: true }
);
</script>

<style scoped></style>
