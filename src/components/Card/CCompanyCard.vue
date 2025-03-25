<template>
  <div class="flex-y-center gap-3">
    <div class="w-10 h-10 rounded-lg relative overflow-hidden">
      <img
        v-if="card?.image"
        :src="card?.image"
        :alt="`company-${card?.title}`"
        class="w-full h-full object-cover"
      />
      <img
        v-else
        src="/images/default-avatar.png"
        alt="company-default"
        class="w-full h-full object-cover"
      />
    </div>
    <div>
      <p class="font-medium text-dark text-sm leading-130 mb-0.5">
        {{ card?.title }}
      </p>
      <p class="text-xs leading-130 text-gray-200">{{ card?.type }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ICard {
  id?: number;
  title: string;
  type: string;
  image: string;
}

interface Props {
  card: ICard;
}

defineProps<Props>();
</script>
