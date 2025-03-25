<template>
  <div class="flex-y-center gap-3">
    <div class="relative">
      <CAvatar :image="card?.avatar" avatar-class="!w-8 !h-8 before:border" />
      <div class="absolute right-0 bottom-0" v-if="isOnline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <circle
            cx="6"
            cy="6"
            r="4.75"
            fill="#16CC53"
            stroke="white"
            stroke-width="1.5"
          />
        </svg>
      </div>
    </div>
    <p class="font-medium text-dark text-sm leading-130 mb-0.5">
      {{ card?.full_name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import CAvatar from "@/components/CAvatar.vue";

interface ICard {
  id?: number;
  full_name: string;
  avatar: string;
}

interface Props {
  card: ICard;
  isOnline: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOnline: false,
});
</script>
