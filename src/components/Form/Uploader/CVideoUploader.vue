<template>
  <div
    class="h-[186px] w-full inline-flex items-center relative overflow-hidden rounded-lg"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop="handleDrop"
  >
    <input
      v-if="!isRemoveClicked"
      :id="randomId"
      type="file"
      name="file"
      class="w-0 h-0 absolute"
      accept=".mp4, .avi"
      @change="handleFile"
      @click="$event.target.value = null"
    />
    <div
      v-if="videoInfo?.otp"
      class="w-full flex-y-center relative rounded-lg transition-300 hover:border-blue cursor-pointer h-[186px] overflow-hidden"
    >
      <Transition name="fade" mode="out-in">
        <iframe
          v-if="videoStatusInfo?.status === 'ready'"
          :src="`https://player.vdocipher.com/v2/?otp=${videoInfo?.otp}&playbackInfo=${videoInfo?.playback_info}`"
          style="border: 0; width: 100%; height: 100%"
          allow="encrypted-media"
          allowfullscreen
        ></iframe>
        <div v-else class="w-full h-full relative">
          <img
            :src="videoStatusInfo?.preview"
            alt=""
            class="w-full h-full object-cover"
          />
          <div
            class="w-full h-full absolute top-0 left-0 bg-dark/70 flex-center flex-col text-base text-white"
          >
            <div class="w-full flex-y-center flex-col justify-center px-6">
              <span class="text-dark text-base font-semibold">
                {{ finishProgress.toFixed(0) }}%
              </span>
              <Progress :model-value="finishProgress" />
            </div>
            {{ statusMessage }}
          </div>
        </div>
      </Transition>
      <div class="absolute top-2 right-2 space-y-2">
        <div
          class="duration-200 transition-all group w-9 h-9 bg-white/[16%] flex items-center justify-center z-20 rounded-lg cursor-pointer border border-transparent hover:scale-110 hover:bg-red/20"
          @click="removeImage"
        >
          <span
            class="transition-300 icon-trash text-white text-2xl group-hover:text-red"
          />
        </div>
      </div>
      <!--      <div-->
      <!--        class="absolute top-1/2 left-1/2 -translate-1/2 -mt-5"-->
      <!--        @click="showVideo = true"-->
      <!--      >-->
      <!--        <div-->
      <!--          class="duration-200 transition-all group w-[44px] h-[44px] bg-white/[16%] flex items-center justify-center z-20 rounded-full cursor-pointer border border-transparent hover:scale-110"-->
      <!--        >-->
      <!--          <span class="transition-300 icon-player text-white text-3xl" />-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <div
      v-else
      class="w-full h-full flex items-center justify-center flex-col rounded-lg transition-300 hover:border-gray-100 cursor-pointer px-6 py-11 border-2 border-dashed border-gray-800"
      :class="[
        {
          '!border-red': error,
        },
      ]"
      @click="getFile('create')"
    >
      <slot>
        <div class="flex flex-col items-center">
          <i class="icon-video-add text-green text-4xl"></i>
          <p class="text-base leading-normal font-medium text-dark-100 mt-2">
            {{ $t("drop_video") }}
          </p>
          <i18n-t
            keypath="drag_ur_video_or"
            tag="p"
            class="text-xs leading-130 font-normal text-gray"
          >
            <template #choose>
              <span class="text-green">
                {{ $t("choose_file") }}
              </span>
            </template>
          </i18n-t>
        </div>
      </slot>
    </div>
    <div
      v-if="dragging"
      class="delay-75 ease-in w-full h-full bg-dark-100 bg-opacity-80 rounded-lg absolute p-2"
    >
      <div
        class="w-full h-full border-dashed border-2 rounded-md border-white border-opacity-60 flex items-center justify-center"
      >
        <p class="text-white text-base font-bold !leading-[130%]">
          {{ $t("drop_file_here") }}
        </p>
      </div>
    </div>
    <Transition name="fade">
      <div
        v-if="loading"
        class="absolute w-full h-full inset-0 flex-center bg-white border-2 border-dashed border-gray-800 rounded-lg"
      >
        <div class="w-full flex-y-center flex-col justify-center px-6">
          <span class="text-dark text-base font-semibold">
            {{ progress.toFixed(0) }}%
          </span>
          <Progress :model-value="progress" />
        </div>
      </div>
    </Transition>
    <CVideoLightbox
      :show="showVideo"
      :video-id="credentials?.video_id"
      @close="showVideo = false"
    />
  </div>
  <p
    v-if="props.default"
    @click="copyTextToClipboard(props.default)"
    class="text-xs text-dark-100 py-1 px-3 rounded bg-gray/20 inline-block cursor-pointer"
  >
    ID: <span>{{ props.default }}</span>
  </p>
</template>
<script setup lang="ts">
import { computed, defineProps, onUnmounted, ref, watch } from "vue";
import { useCustomToast } from "@/composables/useCustomToast";
import { useI18n } from "vue-i18n";
import apiService from "@/services/ApiService";
import { IVdoCipher } from "@/types/common";
import axios from "axios";
import { useCoursesStore } from "@/modules/Courses/store";
import CVideoLightbox from "@/components/Common/Dialog/CVideoLightbox.vue";
import { Progress } from "@/components/ui/progress";
import { useHandleError } from "@/composables/useHandleError";

const store = useCoursesStore();
const { t } = useI18n();
const { showToast } = useCustomToast();
const credentials = computed(() => store.vdoCipherData);

interface Props {
  error?: boolean;
  default?: string;
  size?: string;
  format?: string;
  edit?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["on-status", "on-change"]);
const videoStatusInfo = ref({});
const intervalId = ref("");
const currentTarget = ref(null);
const showVideo = ref(false);
const dragging = ref(false);
const videoInfo = ref({});
const isRemoveClicked = ref(false);
const randomId = computed(() => {
  return Math.random();
});
const progress = ref(0);
const secondProgress = ref(0);
const loading = ref(false);
const status = {
  "PRE-Upload": t("video_being_uploaded"),
  Queued: t("video_is_getting_ready_to_processing"),
  Processing: t("video_processing"),
  ready: t("video_ready"),
};
const statusMessage = computed(() => status[videoStatusInfo.value?.status]);
watch(
  () => props.default,
  async (value) => {
    if (value) {
      await getVideoInfo(value);
      emit("on-status", { status: "ready" });
      store.vdoCipherData.video_id = value;
      videoStatusInfo.value.status = "ready";
    }
  },
  {
    immediate: true,
  }
);
const getFile = (type: string) => {
  isRemoveClicked.value = false;
  setTimeout(() => {
    const input = document.getElementById(randomId.value);
    input?.click();
  }, 100);
};
const handleFile = async (event: Event) => {
  // await obtainUploadAccess();
  // if (!credentials.value) {
  //   return;
  // }
  const target = event?.target as HTMLInputElement | null;
  if (target?.files === null) {
    return;
  }
  if (target?.files?.length) {
    await handleUploader(target);
  }
};
const handleDrop = async (event: any) => {
  // event.preventDefault();
  // await obtainUploadAccess();
  // dragging.value = false;
  // const files = event.dataTransfer?.files;
  // console.log(files, "fiiles");
  // files?.forEach((el) => console.log(el));
  // await handleOnDropUploader(files);
};

const { handleError } = useHandleError();

function obtainUploadAccess() {
  return new Promise((resolve, reject) => {
    apiService
      .post<object, IVdoCipher>("backoffice/vdocipher/ObtainUploadAccess/", {})
      .then((res) => {
        store.vdoCipherData = res?.data;
        emit("on-change", res.data?.video_id);
        resolve(res?.data);
      })
      .catch((err) => {
        reject(err?.response);
      });
  });
}

async function sendRequest(file: File, fileName: string) {
  await obtainUploadAccess().catch((error) => {
    handleError(error);
  });

  const formData = new FormData();
  formData.append("x-amz-credential", credentials.value["x_amz_credential"]);
  formData.append("x-amz-algorithm", credentials.value["x_amz_algorithm"]);
  formData.append("x-amz-date ", credentials.value["x_amz_date"]);
  formData.append("x-amz-signature", credentials.value["x_amz_signature"]);
  formData.append("key", credentials.value["key"]);
  formData.append("policy", credentials.value["policy"]);
  formData.append("success_action_status", 201);
  formData.append("success_action_redirect", "");
  formData.append("file", file, fileName);
  const config = {
    headers: {
      Authorization: undefined,
    },
    onUploadProgress: (progressEvent) => {
      progress.value = (progressEvent.loaded / progressEvent.total) * 100;
      uploaderProgressBar();
    },
  };

  if (credentials.value?.upload_link) {
    axios
      .post(credentials.value?.upload_link, formData, config)
      .then(async () => {
        await getVideoInfo(credentials.value.video_id);
        await checkForVideoStatus(credentials.value.video_id);
        setCheckerInterval();
      })
      .catch((err) => {
        showToast(t("error"), "error");
        console.log(err);
      })
      .finally(() => (loading.value = false));
  }
}

const handleUploader = async (target) => {
  const file = target.files[0];
  const fileName = file?.name;
  const modifiedFile = new File([file], fileName, { type: "video/mp4" });
  loading.value = true;
  sendRequest(modifiedFile, fileName);
};
const handleOnDropUploader = async (target) => {
  loading.value = true;
  sendRequest(target, "");
};

const removeImage = () => {
  isRemoveClicked.value = true;
  videoInfo.value = {};
  emit("on-change", "");
  emit("on-status", { status: "other" });
  videoStatusInfo.value.status = "other";
  store.vdoCipherData.video_id = "";
};
const handleDragOver = (event: Event) => {
  event.preventDefault();
};
const handleDragEnter = (e) => {
  dragging.value = true;
  currentTarget.value = e?.target;
};
const handleDragLeave = (e) => {
  if (e?.target === currentTarget.value) {
    currentTarget.value = null;
    dragging.value = false;
  }
};

function uploaderProgressBar() {
  const $statCircle = document.querySelector(".stat-circle .progress");
  setTimeout(() => {
    const offset = -51 - (51 / 100) * progress.value;
    $statCircle.style.strokeDashoffset = offset;
  }, 100);
}

function statusProgressBar(percent) {
  const $statCircle = document.querySelector(".finish .progress");
  setTimeout(() => {
    const offset = -51 - (51 / 100) * percent;
    $statCircle.style.strokeDashoffset = offset;
  }, 100);
}

function getVideoInfo(videoId: string) {
  return new Promise((resolve, reject) => {
    apiService
      .post("/study/vdocipher/ObtainOTP/", {
        video_id: videoId,
      })
      .then((res) => {
        videoInfo.value = res?.data;
        if (videoInfo.value?.otp) {
          setTimeout(() => {
            startProgressBarAnimation();
          }, 500);
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function checkVideoStatus() {
  // Replace the following line with your code to check the video status
  await checkForVideoStatus(credentials.value.video_id); // Replace with your actual function

  if (videoStatusInfo.value?.status === "ready") {
    // Video is ready, do something
    clearInterval(intervalId.value); // Stop the interval
    await getVideoInfo(credentials.value.video_id);
  }
}

function setCheckerInterval() {
  intervalId.value = setInterval(checkVideoStatus, 10000);
}

function checkForVideoStatus(videoId: string) {
  return new Promise((resolve, reject) => {
    apiService
      .get(`/study/vdocipher/ObtainVideoInfo/${videoId}`)
      .then((res) => {
        videoStatusInfo.value = res?.data;
        emit("on-status", res?.data);
        secondProgress.value = res?.data?.percent ?? 0;
        resolve(res?.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const finishProgress = ref(0);
const finishSetTimeOut = ref();

watch(
  () => secondProgress.value,
  (val, old) => {
    if (old < val) {
      finishProgress.value = val === 100 ? val : old;
      clearTimeout(finishSetTimeOut.value);
      startProgressBarAnimation();
    }
  }
);

function startProgressBarAnimation() {
  function update() {
    if (finishProgress.value <= secondProgress.value) {
      statusProgressBar(finishProgress.value);
      finishProgress.value += 0.25;
      finishSetTimeOut.value = setTimeout(update, 500); // Update every second (adjust as needed)
    }
  }

  update();
}

function copyTextToClipboard(text: string) {
  // Use the Clipboard API to write the text to the clipboard
  navigator.clipboard
    .writeText(text)
    .then(function () {
      showToast(t("copied"), "success");
    })
    .catch(function (err) {
      console.error("Unable to copy text to clipboard:", err);
    });
}

window.addEventListener("drop", async (event) => {
  event.preventDefault();
  event.dataTransfer.effectAllowed = "none";
  event.dataTransfer.dropEffect = "none";
  dragging.value = false;
  event.dataTransfer?.files?.forEach((el) => handleOnDropUploader(el));
});
onUnmounted(() => {
  clearInterval(intervalId.value);
  window.removeEventListener("drop", () => {
    console.log("EventListener removed");
  });
});
</script>
<style>
.color {
  color: #e74c3c;
}
</style>

<style scoped>
.spinner {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(farthest-side, #16cc53 94%, #0000) top/9px 9px
      no-repeat,
    conic-gradient(#0000 30%, #16cc53);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 0);
  animation: spinner-c7wet2 1s infinite linear;
}

@keyframes spinner-c7wet2 {
  100% {
    transform: rotate(1turn);
  }
}

.stat-circle circle.bg {
  fill: none;
  stroke: #f1f1f1;
  stroke-width: 1;
}

.stat-circle circle.progress {
  fill: none;
  stroke: #2ecc71;
  stroke-width: 2;
  stroke-dasharray: 51 51;
  stroke-dashoffset: -51;
  stroke-linecap: round;
  transition: 0.3s ease-in-out;
}

.stat-circle text {
  font-size: 3px;
  text-anchor: middle;
  fill: #555;
}

#stat-circle-finish text {
  font-size: 3px;
  text-anchor: middle;
  fill: #fff;
}

.progress {
  width: 72px;
  height: 12px;
  -webkit-mask: linear-gradient(90deg, #16cc53 70%, #0000 0) left/20% 100%;
  background: linear-gradient(#16cc53 0 0) left/0% 100% no-repeat #dbdcef;
  animation: progress-422c3u 2.8s infinite steps(6);
}

@keyframes progress-422c3u {
  100% {
    background-size: 120% 100%;
  }
}
</style>
