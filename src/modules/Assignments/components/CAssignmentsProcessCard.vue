<template>
  <div v-if="!assignsingle">
    <slot name="title">
      <p class="text-xs leading-130 font-medium text-gray">
        <span class="text-dark-100">{{ value }}%</span>
      </p>
    </slot>
    <div
      class="mt-2 h-2 w-full max-w-[200px] bg-gray-100 rounded-full relative overflow-hidden"
      :class="{ 'bg-green-100': value > 0 }"
    >
      <div
        class="h-2 bg-green w-0 rounded-full transition-300"
        :style="{
          width: `${(value / max) * 100}%`,
        }"
      />
    </div>
  </div>
  <div v-else-if="assignsingle">
    <slot name="title">
      <div class="flex items-center gap-0.5">
        <p class="text-xs leading-130 text-dark font-semibold">
          <span class="text-dark-100"
            >{{ value }} {{ $t("course_students") }}</span
          >
        </p>
        /
        <p class="text-xs leading-130 font-medium text-gray-100">
          <span class="text-dark-100"
            >{{ max }} {{ $t("course_students") }}</span
          >
        </p>
      </div>
    </slot>
    <div
      class="mt-2 h-2 w-full max-w-[200px] bg-gray-100 rounded-full relative overflow-hidden"
      :class="{ 'bg-green-100': value > 0 }"
    >
      <div
        class="h-2 bg-green w-0 rounded-full transition-300"
        :style="{
          width: `${(value / max) * 100}%`,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICourse } from "@/modules/Students/types";

interface Props {
  value: number;
  max: number;
  assignsingle: boolean;
}

defineProps<Props>();
</script>
