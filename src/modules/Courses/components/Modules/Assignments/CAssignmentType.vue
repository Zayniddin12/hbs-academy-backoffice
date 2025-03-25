<template>
  <button
    class="border border-gray-800 rounded-2xl px-3 w-full flex-center flex-col py-4 transition-300"
    :class="{ 'border-green type-shadow': active }"
  >
    <div class="text-center">
      <img
        :src="card?.image"
        :alt="`image-${card?.title}`"
        class="mx-auto grayscale"
        :class="{ 'grayscale-0': active }"
      />
      <p
        class="text-sm leading-130 font-normal text-dark-100 whitespace-pre-line"
      >
        {{ card?.title }}
      </p>
    </div>
  </button>
</template>

<script setup lang="ts">
interface Props {
  card: {
    id: number;
    title: string;
    image: string;
  };
  active?: boolean;
}

defineProps<Props>();
</script>

<style scoped>
.type-shadow {
  box-shadow: 0 4px 20px 0 rgba(61, 214, 65, 0.1);
}
</style>
