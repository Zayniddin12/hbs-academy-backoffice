<template>
  <RouterLink
    :to="link"
    class="w-7 h-7 rounded-full bg-white back-button-shadow flex-center absolute -left-3 top-6 z-10 hover:text-white hover:bg-green transition-300"
  >
    <i class="icon-chevron-left text-base" />
  </RouterLink>
</template>

<script setup lang="ts">
interface Props {
  link: string;
}

defineProps<Props>();
</script>

<style scoped>
.back-button-shadow {
  box-shadow: 0 4px 20px 0 rgba(8, 10, 21, 0.2);
}
</style>
