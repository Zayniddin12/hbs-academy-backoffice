<template>
  <div
    class="w-full inline-flex items-center relative"
    @dragover.prevent="handleDragOver"
    @drop.prevent="handleDrop"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
  >
    <input
      id="input"
      type="file"
      name="file"
      class="w-0 h-0 absolute"
      accept="image/png, image/jpeg"
      multiple
      @change="handleFile"
      @click="$event.target.value = ''"
    />
    <div
      v-if="image?.url"
      class="flex-y-center relative rounded-lg transition-300 hover:border-blue cursor-pointer h-[142px] w-[180px]"
    >
      <img
        :src="image.url"
        alt="avatar"
        class="w-full h-full object-cover relative z-0 rounded-lg"
      />
      <div class="absolute top-2 right-2 flex-y-center gap-2 z-0">
        <div
          class="duration-200 transition-all group w-7 h-7 bg-dark-100/[44%] flex items-center justify-center z-20 rounded-lg cursor-pointer border border-transparent hover:scale-110 hover:bg-dark/60"
          @click="getFile('create')"
        >
          <span class="transition-300 icon-edit text-white text-base" />
        </div>
        <div
          class="duration-200 transition-all group w-7 h-7 bg-dark-100/[44%] flex items-center justify-center z-20 rounded-lg cursor-pointer border border-transparent hover:scale-110 hover:bg-red/20"
          @click="removeImage"
        >
          <span
            class="transition-300 icon-trash text-white text-base group-hover:text-red"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      class="w-full flex items-center justify-center flex-col rounded-lg transition-300 hover:border-green cursor-pointer px-6 py-11 border-2 border-dashed border-green-100 h-[186px]"
      :class="[
        {
          '!border-red': error,
        },
      ]"
      @click="getFile('create')"
    >
      <slot>
        <div>
          <div class="flex-center gap-2">
            <i class="icon-file-fill text-green text-[40px] text-center" />
          </div>
          <p
            class="text-sm leading-130 font-medium text-dark-100 mt-4 mb-1 text-center"
          >
            {{ $t("drag_photo_here") }}
          </p>
          <i18n-t
            keypath="drag_photo_or"
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
  </div>
</template>
<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from "vue";
import ApiService from "@/services/ApiService";

const emit = defineEmits(["change"]);

interface Props {
  error?: boolean;
  defaultImage?: string | File;
  size?: string;
  format?: string;
}

type IImage = {
  id?: string;
  url?: string;
  name?: string;
  file?: File;
  type?: string;
};
const props = defineProps<Props>();
let image = ref<IImage>({});
const uploadType = ref("");
const currentTarget = ref(null);
const uploadedImageId = ref("");
const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

watch(
  () => props.defaultImage,
  (value) => {
    if (typeof value !== "string") {
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(value);
        reader.onerror = (error) => reject(error);
      })
        .then((res) => {
          //Do not touch this, or else You will find yourself DEAD!!!
          image.value = {
            url: res as string,
            name: value?.name,
            file: value,
            type: "image",
          };
          send();
        })
        .catch(() => {
          // Todo: Toast show
        });
    } else {
      image.value.url = value;
    }
  },
  {
    immediate: true,
  }
);
const handleFile = async (event: Event) => {
  const target = event?.target as HTMLInputElement | null;
  if (target?.files === null) {
    return;
  }
  if (target?.files?.length) {
    handleUploader(target);
  }
};
const handleUploader = (target) => {
  const formData = new FormData();
  formData.append("file", target?.files[0], target?.files[0].name);
  formData.append("file_type", "image");
  ApiService.post("common/MediaUpload/", formData, config).then((response) => {
    image.value = {
      id: response.data?.id,
      url: response?.data?.file as string,
      name: target?.files[0].name,
      file: target?.files[0],
      type: "image",
    };
    send();
  });
};
const handleOnDropUploader = (target) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(target?.[0]);
    reader.onerror = (error) => reject(error);
  })
    .then((res) => {
      //Do not touch this, or else You will find yourself DEAD!!!
      if (uploadType.value === "create") {
        const formData = new FormData();
        formData.append("file", target?.files[0], target?.files[0].name);
        formData.append("file_type", "image");

        ApiService.post("common/MediaUpload/", formData, config).then(
          (response) => {
            image.value = {
              id: response.data?.id,
              url: res as string,
              name: target?.files[0].name,
              file: target?.files[0],
              type: "image",
            };
            send();
          }
        );
      }
    })
    .catch(() => {
      // Todo: Toast show
    });
};

const getFile = (type: string) => {
  uploadType.value = type;
  const input = document.getElementById("input");
  input?.click();
};

const removeImage = () => {
  image.value = {};
  send();
};

function send() {
  emit("change", image.value);
}

const dragging = ref(false);
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
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  dragging.value = false;
  uploadType.value = "create";
  const files = event.dataTransfer?.files;
  handleOnDropUploader(files);
  send();
};
</script>
<style></style>
