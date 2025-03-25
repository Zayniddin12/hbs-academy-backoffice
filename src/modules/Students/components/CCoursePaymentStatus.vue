<template>
  <div
    v-if="isPaid"
    class="flex-y-center gap-1 p-2.5 pr-3 border border-green/[12%] rounded-full bg-green-100 w-max h-9"
  >
    <i class="icon-tick-circle text-base text-green" />
    <p class="text-xs leading-130 font-medium text-green">
      {{ $t("succeed") }}
    </p>
  </div>
  <div
    v-if="!isPaid"
    class="flex-y-center gap-1 p-2.5 pr-3 border border-red/[12%] rounded-full bg-red-100 w-max h-9"
  >
    <i class="icon-forbidden text-base text-red" />
    <p class="text-xs leading-130 font-medium text-red">
      {{ $t("no_succeed") }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isPaid: boolean;
}

defineProps<Props>();
</script>
