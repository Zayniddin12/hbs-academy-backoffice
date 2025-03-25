<template>
  <div
    class="flex-center-between p-2.5 pr-3 rounded-lg border border-gray-800 bg-white"
  >
    <div class="flex-y-center gap-2 justify-between w-full">
      <div class="flex-y-center gap-2">
        <div class="flex-center w-10 h-10 bg-green-100 rounded-lg">
          <i
            :class="
              file?.type === 'video'
                ? 'icon-video-linear'
                : 'icon-document-text'
            "
            class="text-green text-2xl"
          />
        </div>
        <div>
          <p
            class="text-xs leading-130 font-medium text-dark truncate hover:text-primary transition-300 break-all block max-w-[330px]"
          >
            {{ file?.file_name }}
          </p>
          <p
            class="text-xs leading-130 font-medium text-gray"
            v-if="file?.size"
          >
            {{ convertBytes(file?.size) }}
          </p>
        </div>
      </div>
      <div
        v-if="!hasClose && file?.type === 'video'"
        class="icon-player text-gray mr-1 text-xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
        @click="showVideo = true"
      ></div>
      <div
        v-if="hasDownload"
        class="icon-document-download text-gray mr-1 text-xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
        @click="downloadFile"
      ></div>
    </div>

    <i
      v-if="hasClose"
      class="icon-close text-xl text-gray hover:text-red transition-300"
      @click="$emit('remove', file?.id)"
    />
  </div>
  <CVideoLightbox
    :show="showVideo"
    :video-id="file.file_name"
    @close="showVideo = false"
  />
</template>

<script setup lang="ts">
import { convertBytes } from "@/utils";
import { IFiles } from "@/modules/Assignments/types";
import { ref } from "vue";
import CVideoLightbox from "@/components/Common/Dialog/CVideoLightbox.vue";
import apiService from "@/services/ApiService";
import axios from "axios";

interface Props {
  file: IFiles;
  hasClose?: boolean;
  hasDownload?: boolean;
}

const props = defineProps<Props>();

const showVideo = ref(false);
// function getVideoInfo() {
//   return new Promise((resolve, reject) => {
//     apiService
//       .post("/study/vdocipher/ObtainOTP/", {
//         video_id: props.file?.file_name,
//       })
//       .then((res) => {
//         showVideo.value = true;
//         resolve(res);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// }

const downloadFile = async () => {
  const link = document.createElement("a");
  link.href = props.file?.file;
  link.target = "_blank";
  link.download = props.file?.file_name;

  // Simulate a click on the element <a>
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const videoTypeList = [
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  "m4v",
  "3gp",
  "mpeg",
  "m2ts",
  "ts",
  "vob",
  "rm",
  "divx",
  "ogv",
  "mpg",
  "qt",
  "swf",
  "mxf",
  "asf",
  "rmvb",
  "ogm",
  "tsv",
  "flv",
  "ogx",
  "nut",
  "h264",
  "h265",
  "ts",
  "mts",
  "m2v",
  "m2ts",
  "m4p",
  "m4v",
  "f4v",
  "3g2",
  "ogg",
  "mp3",
  "wav",
  "flac",
  "amr",
  "aac",
  "wma",
  "ra",
  "ogg",
  "au",
  "aiff",
  "mka",
  "mpc",
  "opus",
  "ac3",
  "dts",
];
</script>
