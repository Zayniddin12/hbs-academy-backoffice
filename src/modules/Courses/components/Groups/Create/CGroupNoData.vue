<template>
  <div class="flex-center pb-3 pt-8">
    <div class="text-center">
      <img
        src="/images/svg/no-data/no-list.svg"
        alt="no-list"
        class="mx-auto"
      />
      <p class="text-base leading-130 font-semibold text-dark-100">
        {{ title }}
      </p>
      <p class="text-sm leading-130 font-normal text-gray mt-2">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  text?: string;
}

defineProps<Props>();
</script>
