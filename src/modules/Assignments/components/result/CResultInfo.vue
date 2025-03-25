<template>
  <div class="p-4 rounded-xl bg-white info-card-shadow">
    <div class="flex gap-3">
      <div class="w-9 h-9 rounded-lg relative overflow-hidden">
        <img :src="card?.image" alt="test" />
      </div>
      <div>
        <p class="text-sm leading-130 font-bold text-dark-100">
          {{ card?.title }}
        </p>
        <p v-if="card?.value" class="text-xs leading-130 text-gray mt-0.5">
          {{ card?.value }}
        </p>
      </div>
    </div>
    <p class="text-sm leading-130 font-normal text-gray-700 mt-3">
      {{ card?.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  card: {
    image: string;
    title: string;
    description: string;
    value: string;
  };
}

defineProps<Props>();
</script>

<style scoped>
.info-card-shadow {
  box-shadow: 0 0 30px 0 rgba(56, 71, 109, 0.09);
}
</style>
