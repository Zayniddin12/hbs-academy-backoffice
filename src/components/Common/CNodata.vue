<template>
  <div class="py-[128px] flex-center">
    <div class="text-center">
      <img :src="image" alt="no-events" class="mx-auto" />
      <p class="text-base leading-130 font-semibold text-dark-100 mt-6">
        {{ title }}
      </p>
      <p class="mt-1.5 text-sm leading-130 font-normal text-gray">
        {{ subtitle }}
      </p>
      <CButton
        class="mt-6"
        v-if="buttonText"
        :text="buttonText"
        icon="icon-add"
        icon-position="left"
        @click="$emit('submit')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from "@/components/Common/CButton.vue";

interface Props {
  image: string;
  title: string;
  subtitle: string;
  buttonText?: string;
}

withDefaults(defineProps<Props>(), {
  image: "/images/svg/no-data/no-groups.svg",
  title: "Title",
  subtitle: "Subtitle",
});
</script>

<style scoped></style>
