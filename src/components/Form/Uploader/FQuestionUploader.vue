<template>
  <div
    class="flex-center-between w-full gap-4 relative p-2 rounded-lg bg-gray-100 !h-10"
    @dragover.prevent="handleDragOver"
    @drop.prevent="handleDrop"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    :class="{ 'border border-red-500 bg-red-100': error }"
  >
    <input
      :id="randomId"
      type="file"
      name="file"
      class="w-0 h-0 absolute"
      accept="image/png, image/jpeg"
      multiple
      @change="handleFile"
      @click="$event.target.value = ''"
    />
    <div class="w-full max-w-[90%]">
      <div v-if="image?.url" class="flex-y-center gap-2">
        <div
          class="w-6 h-6 rounded relative overflow-hidden border border-gray-800 shrink-0"
        >
          <img
            :src="image?.url"
            alt="image"
            class="object-cover w-full h-full"
          />
        </div>
        <p class="text-xs leading-normal font-normal text-dark-100 truncate">
          {{ image?.name }}
        </p>
        <i
          class="icon-close text-xl text-gray hover:text-red transition-300 cursor-pointer"
          @click="removeImage"
        />
      </div>
      <div v-else class="w-full">
        <div class="flex-y-center gap-2">
          <i class="icon-photo text-2xl text-green" />

          <i18n-t
            keypath="drag_your_image_or_select"
            tag="p"
            class="text-xs leading-normal font-normal text-dark-100"
          >
            <template #select>
              <span
                class="text-green hover:text-dark transition-300 cursor-pointer"
                @click="getFile('create')"
                >{{ $t("select_image") }}</span
              >
            </template>
          </i18n-t>
        </div>
      </div>
    </div>
    <slot name="value" />
  </div>
</template>
<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from "vue";
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
const randomId = computed(() => {
  return Math.random().toString(36).substr(2, 9);
});
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
      image.value.name = value;
    }
  },
  {
    immediate: true,
  }
);
const handleFile = async (event: Event) => {
  event.preventDefault();
  const target = event?.target as HTMLInputElement | null;
  if (target?.files === null) {
    return;
  }

  if (target?.files?.length) {
    const file = event.target?.files[0];
    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("file_type", "image");
    ApiService.post("common/MediaUpload/", formData, config).then(
      (response) => {
        image.value = {
          id: response.data?.id,
          url: response.data?.file as string,
          name: target.files[0].name,
          file: target.files[0],
          type: "image",
        };
        send();
      }
    );
  }
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
        formData.append("file", target?.files[0], target[0].name);
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
  const input = document.getElementById(randomId.value);
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
