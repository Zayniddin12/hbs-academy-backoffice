<template>
  <CDialog
    no-header
    has-close-icon
    :show="show"
    body-class="!max-w-[1000px]"
    @close="$emit('close')"
  >
    <div class="aspect-video">
      <iframe
        :src="`https://player.vdocipher.com/v2/?otp=${videoInfo?.otp}&playbackInfo=${videoInfo?.playback_info}`"
        style="border: 0; width: 100%; height: 100%"
        allow="encrypted-media"
        allowfullscreen
      ></iframe>
    </div>
  </CDialog>
</template>
<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { ref, watch } from "vue";
import apiService from "@/services/ApiService";
interface Props {
  show: boolean;
  videoId: string;
}
const props = defineProps<Props>();
const videoInfo = ref({});
const videoStatusInfo = ref({});
function getVideoInfo() {
  return new Promise((resolve, reject) => {
    apiService
      .post("/study/vdocipher/ObtainOTP/", {
        video_id: props.videoId,
      })
      .then((res) => {
        videoInfo.value = res?.data;
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
function checkForVideoStatus() {
  return new Promise((resolve, reject) => {
    apiService
      .get(`/study/vdocipher/ObtainVideoInfo/${props.videoId}`)
      .then((res) => {
        videoStatusInfo.value = res?.data;
        resolve(res?.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
watch(
  () => props.show,
  async (val) => {
    if (val) {
      await checkForVideoStatus();
      await getVideoInfo();
    }
  },
  {
    immediate: true,
  }
);
</script>
