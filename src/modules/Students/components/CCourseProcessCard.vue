<template>
  <div>
    <slot name="title">
      <p class="text-xs leading-130 font-medium text-gray">
        <span class="text-dark-100">{{
          $t("lesson_count", { count: value })
        }}</span>
        /
        {{ $t("lesson_count", { count: max }) }}
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
</template>

<script setup lang="ts">
import { ICourse } from "@/modules/Students/types";

interface Props {
  value: number;
  max: number;
}

defineProps<Props>();
</script>
