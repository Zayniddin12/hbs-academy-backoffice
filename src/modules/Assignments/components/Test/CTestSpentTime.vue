<template>
  <div
    class="py-3 px-4 border border-[#C8CFD6] border-dashed rounded-lg bg-gray-100 flex-center-between gap-4"
  >
    <div class="flex-y-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M18.3327 9.99984C18.3327 14.5998 14.5993 18.3332 9.99935 18.3332C5.39935 18.3332 1.66602 14.5998 1.66602 9.99984C1.66602 5.39984 5.39935 1.6665 9.99935 1.6665C14.5993 1.6665 18.3327 5.39984 18.3327 9.99984Z"
          stroke="#16CC53"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13.0914 12.65L10.5081 11.1083C10.0581 10.8416 9.69141 10.2 9.69141 9.67497V6.2583"
          stroke="#16CC53"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <p class="text-xs leading-130 font-medium text-gray">
        {{ $t("spent_time") }}:
      </p>
    </div>

    <p class="text-[28px] text-primary leading-130 font-semibold">
      {{ secondsToTime(time) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { secondsToTime } from "@/utils";

interface Props {
  time: number;
}

defineProps<Props>();
</script>
