<template>
  <div class="flex-y-center gap-2">
    <div class="relative">
      <CAvatar :image="card?.avatar" class="!w-8 !h-8" />
      <div
        class="w-2.5 h-2.5 border-[1.6px] border-white rounded-full absolute -bottom-0.5 -right-0.5"
        :class="[card?.isOnline ? 'bg-green' : 'bg-gray-50']"
      />
    </div>
    <RouterLink
      :to="{ name: slug, params: { id: card?.id } }"
      class="text-sm leading-130 text-dark-100 font-medium transition-300 hover:text-green"
    >
      <Highlighter
        class="text-sm leading-130 text-dark"
        highlight-class-name="bg-[#FFCD55] rounded p-0.5"
        :search-words="[$route.query?.search ?? '']"
        :text-to-highlight="card?.full_name"
      />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import CAvatar from "@/components/CAvatar.vue";
import Highlighter from "vue-highlight-words";
interface Props {
  card: {
    id: number;
    full_name: string;
    avatar: string;
    isOnline: boolean;
  };
  slug?: string;
}

defineProps<Props>();
</script>
