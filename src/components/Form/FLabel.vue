<template>
  <label class="text-sm text-dark-100" :class="labelClass" :for="forText">
    {{ label }}
  </label>
</template>
<script setup lang="ts">
interface Props {
  label: string;
  labelClass?: string;
  forText?: string;
}

withDefaults(defineProps<Props>(), {});
</script>
