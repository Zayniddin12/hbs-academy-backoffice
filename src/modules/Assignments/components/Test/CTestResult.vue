<template>
  <div
    class="flex-center-between p-2 pr-2.5 rounded-xl"
    :class="answerClass?.bg"
  >
    <div class="flex-y-center gap-3">
      <div class="w-7 h-7 rounded-md flex-center" :class="answerClass?.point">
        <p class="text-xs leading-130 text-white font-semibold">{{ order }}</p>
      </div>
      <p class="text-sm leading-130 font-semibold text-dark">
        {{ $t("point_count", { point: answer?.point }) }}
      </p>
    </div>
    <div class="flex-y-center gap-3">
      <p
        v-if="!answer?.is_answered"
        class="text-sm leading-130 font-medium text-gray"
      >
        {{ $t("not_answered") }}
      </p>
      <i class="text-2xl" :class="answerClass?.icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  answer: {
    point: number;
    is_answered: boolean;
    is_right: boolean;
  };
  order: number;
}

const props = defineProps<Props>();

const answerClass = computed(() => {
  if (!props.answer?.is_answered) {
    return {
      bg: "bg-gray-100",
      point: "bg-gray",
      icon: "icon-close-stroke text-red",
    };
  } else if (props.answer.is_right) {
    return {
      bg: "bg-green-200",
      point: "bg-green",
      icon: "icon-tick-stroke text-green",
    };
  } else {
    return {
      bg: "bg-red-200/[8%]",
      point: "bg-red-200",
      icon: "icon-close-stroke text-red-200",
    };
  }
});
</script>
