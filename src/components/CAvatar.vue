<template>
  <div
    class="relative rounded-full before:rounded-full before:absolute before:inset-0 before:border-2 before:border-[rgba(255,255,255,0.4)] overflow-hidden shrink-0"
    :class="[avatarSize, avatarClass]"
  >
    <img
      v-if="!isError && image"
      :src="image"
      :key="image"
      :class="imageClass"
      alt="avatar-image"
      class="w-full h-full object-cover"
      @error="isError = true"
    />
    <img
      v-else
      src="/images/default-avatar.png"
      :class="imageClass"
      alt="avatar-default-image"
      class="w-full h-full object-cover"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { EAvatarSize } from "@/types/components/avatar";

interface Props {
  image?: string;
  size?: EAvatarSize;
  avatarClass?: string;
  imageClass?: string;
  loading?: boolean;
  isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: EAvatarSize.MD,
  avatarClass: "",
  imageClass: "",
  isActive: false,
});

const isError = ref(false);

watch(
  () => props.image,
  () => (isError.value = false)
);

const avatarSize = computed(() => {
  const sizes: Record<EAvatarSize, string> = {
    [EAvatarSize.MD]: "w-[50px] h-[50px]",
    [EAvatarSize.SM]: "w-10 h-10",
  };

  return sizes[props.size ?? EAvatarSize.MD];
});
</script>
