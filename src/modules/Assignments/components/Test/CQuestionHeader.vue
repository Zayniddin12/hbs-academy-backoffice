<template>
  <div>
    <p
      v-if="question?.details?.body"
      class="text-2xl leading-normal font-semibold text-dark"
    >
      {{ question?.details?.body }}
    </p>
    <div v-if="question?.details?.photo" class="rounded-xl">
      <img :src="question?.details?.photo" alt="question" />
    </div>
    <div
      v-if="question?.details?.video"
      class="w-full flex-y-center relative rounded-lg transition-300 hover:border-blue cursor-pointer h-fit overflow-hidden"
    >
      <video
        :src="question?.details?.video"
        ref="video"
        class="object-cover w-full h-full"
      ></video>
      <div
        class="absolute top-1/2 left-1/2 -translate-1/2 -mt-5"
        @click="showVideo = true"
      >
        <div
          class="duration-200 transition-all group w-[44px] h-[44px] bg-white/[16%] flex items-center justify-center z-20 rounded-full cursor-pointer border border-transparent hover:scale-110"
        >
          <span class="transition-300 icon-player text-white text-3xl" />
        </div>
      </div>
    </div>
    <CDialog
      no-header
      has-close-icon
      :show="showVideo"
      body-class="!max-w-[1000px]"
      @close="showVideo = false"
    >
      <div class="aspect-video">
        <video
          :src="question?.details?.video"
          class="w-full h-full object-contain"
          controls
          :autoplay="showVideo"
        />
      </div>
    </CDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CDialog from "@/components/Common/Dialog/CDialog.vue";

interface Props {
  question: {
    id: number;
    title: string;
    type: string;
  };
}

defineProps<Props>();

const showVideo = ref(false);
</script>
