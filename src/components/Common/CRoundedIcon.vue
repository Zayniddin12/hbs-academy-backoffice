<template>
  <div
    class="w-16 h-16 border-[4px] border-white/10 rounded-full flex-center text-[32px] leading-8 text-white mx-auto shadow-purple"
    :class="[color, icon]"
  />
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  color: string;
}

defineProps<Props>();
</script>

<style scoped>
.shadow-purple {
  filter: drop-shadow(0px 4px 50px rgba(113, 122, 249, 0.22));
}
</style>
