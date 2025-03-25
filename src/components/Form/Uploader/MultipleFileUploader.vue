<template>
  <div
    class="h-full w-full relative"
    @dragover.prevent="handleDragOver"
    @drop.prevent="handleDrop"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
  >
    <input
      v-if="files.length < maxLength"
      id="file"
      type="file"
      name="file"
      class="w-0 h-0 absolute"
      :accept="accept ?? 'image/png, image/jpeg'"
      multiple
      @change="handleFile"
      @click="$event.target.value = ''"
    />
    <div
      v-if="files.length < maxLength"
      class="w-full relative h-[142px] flex items-center justify-center flex-col rounded-lg transition-300 cursor-pointer px-6 py-11 border-2 border-dashed border-gray-800 hover:border-gray-400/50"
      :class="[
        {
          '!border-red': error,
        },
      ]"
      @click="getFile('create')"
    >
      <slot>
        <div class="text-base flex items-center flex-col">
          <i class="icon-doc-text text-green text-[32px]"></i>
          <p class="mt-4 text-sm leading-130 font-medium text-dark-100">
            {{ $t("drop_files") }}
          </p>
          <i18n-t
            keypath="choose_file"
            tag="p"
            class="mt-1 text-xs leading-130 font-normal text-gray"
          >
            <template #choose>
              <span
                class="text-green font-semibold cursor-pointer hover:text-dark transition-300"
                @click="handleFile"
                >{{ $t("choose_text") }}</span
              >
            </template>
          </i18n-t>
        </div>
      </slot>
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
    <div
      class="flex flex-col gap-3 mt-2 max-h-[250px] overflow-y-auto w-full"
      :class="filesClass"
      v-if="files.length"
    >
      <div
        class="flex-center-between relative rounded-xl border border-secondary p-2 transition-300 cursor-pointer"
        v-for="(item, index) in files"
        :key="index"
      >
        <div class="flex-y-center gap-2">
          <div class="w-8 h-8 flex-center rounded-lg bg-green-100 shrink-0">
            <i class="icon-document-text text-green text-2xl" />
          </div>
          <div>
            <p class="text-xs leading-130 text-dark font-medium">
              {{ item?.name }}
            </p>
            <p class="text-xs leading-130 font-normal text-gray">
              {{ convertBytes(item?.size) }}
            </p>
          </div>
        </div>
        <i
          class="icon-close text-xl text-gray hover:text-red transition-300 cursor-pointer"
          @click="removeImage(index)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineEmits, defineProps, onMounted, ref, watch } from "vue";
import { convertBytes } from "@/utils";
import ApiService from "@/services/ApiService";

const emit = defineEmits(["change"]);

interface Props {
  error?: boolean;
  defaultImages?: string[];
  filesClass?: string;
  accept?: string;
  type?: string;
  clear?: boolean;
  maxLength?: number;
}

type image = {
  id: string;
  url: string;
  name: string;
  file?: File;
  size: number;
  type: string;
};
const props = withDefaults(defineProps<Props>(), {
  maxLength: 99,
});
const files = ref<image[]>([]);
const uploadType = ref("");
const currentTarget = ref(null);
const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};
const images = ref([]);

watch(
  () => props.clear,
  (value) => {
    if (value) {
      files.value.length = 0;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const handleFile = async (event: Event) => {
  const target = event?.target as HTMLInputElement | null;
  if (target?.files === null) {
    return;
  }
  if (target?.files?.length) {
    const files = Array.from(target?.files);
    for (let key in files) {
      await handleUploader(key, target);
    }
  }
  send();
};
const handleUploader = (el: string | number, target) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(target?.files[el]);
    reader.onerror = (error) => reject(error);
  })
    .then(async () => {
      const formData = new FormData();
      formData.append("file", target?.files[el], target?.files[el].name);
      formData.append("file_type", "doc");

      const data = await ApiService.post(
        "common/MediaUpload/",
        formData,
        config
      );
      if (data) {
        files.value.push({
          id: data?.data?.id,
          url: data.data.file,
          name: data?.data?.file_name,
          file: target?.files[el],
          size: data?.data?.size,
          type: "image",
        });
      }
    })
    .catch(() => {
      // Todo: Toast show
    });
};
const getFile = (type: string) => {
  uploadType.value = type;
  const input = document.getElementById("file");
  input?.click();
};
const removeImage = (index: number) => {
  files.value.splice(index, 1);
  send();
};
function send() {
  emit("change", files.value);
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

const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  dragging.value = false;
  uploadType.value = "create";
  if (event.dataTransfer?.items) {
    // Handle multiple items being dropped
    for (let i = 0; i < event.dataTransfer.items.length; i++) {
      if (event.dataTransfer.items[i].kind === "file") {
        const file = event.dataTransfer.items[i]?.getAsFile();
        const formData = new FormData();
        formData.append("file", file, file?.name);
        formData.append("file_type", props.type ?? "image");
        const data = await ApiService.post("common/MediaUpload/", formData);
        if (data) {
          files.value.push({
            id: data?.data?.id,
            url: data.data.file,
            name: data?.data?.file_name,
            file,
            size: data?.data?.size,
            type: "image",
          });
        }
      } else if (event.dataTransfer.items[i].kind === "string") {
        const url = event.dataTransfer.items[i].getData("text/plain");
        // Handle the URL instead of the file object
      }
    }
  }
};
onMounted(() => {
  setTimeout(() => {
    if (props.defaultImages) {
      props.defaultImages.forEach((item: any) => {
        files.value.push({
          id: item?.id,
          url: item?.file,
          name: item?.file_name,
          file: item,
          type: "image",
          size: item?.file_size ?? item?.size,
        });
      });
    }
  }, 500);
});
</script>
