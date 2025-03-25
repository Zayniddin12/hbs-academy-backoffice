<template>
  <div
    class="h-[186px] w-full inline-flex items-center relative"
    @dragover.prevent="handleDragOver"
    @drop.prevent="handleDrop"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
  >
    <input
      id="input"
      :key="image?.url"
      type="file"
      name="file"
      class="w-0 h-0 absolute"
      accept="image/png, image/jpeg"
      multiple
      @change="handleFile"
    />
    <div
      v-if="image?.url"
      class="w-full h-full flex-y-center relative rounded-lg transition-300 hover:border-blue cursor-pointer"
    >
      <img
        :src="image.url"
        alt="avatar"
        class="w-full h-full object-cover relative z-0 rounded-lg"
        @error="image.url = null"
      />
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
    </div>
    <div
      v-else
      class="w-full h-full flex items-center justify-center flex-col rounded-lg transition-300 hover:border-green cursor-pointer px-6 py-11 border-2 border-dashed border-green-100"
      :class="[
        {
          '!border-red': error,
        },
      ]"
      @click="getFile('create')"
    >
      <slot>
        <div>
          <div class="flex-y-center gap-2" :class="wrapperClass">
            <i class="text-green text-2xl" :class="icon"></i>
            <span class="text-base leading-normal font-medium text-dark-100">
              {{ $t(title) }}
            </span>
          </div>
          <slot name="subtitle">
            <p class="text-xs leading-normal font-medium text-gray mt-2">
              {{ $t("max_shortcut") }} {{ size }}, {{ $t("format") }}
              {{ format }}
            </p>
          </slot>
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
import { ref, watch } from "vue";
import ApiService from "@/services/ApiService";
import { useI18n } from "vue-i18n";
import { useCustomToast } from "@/composables/useCustomToast";

const { showToast } = useCustomToast();
const { t } = useI18n();
const emit = defineEmits(["change"]);
interface Props {
  error?: boolean;
  defaultImage?: string | File;
  size?: string;
  format?: string;
  icon?: string;
  wrapperClass?: string;
  title?: string;
}
type IImage = {
  id?: string;
  url?: string;
  name?: string;
  file?: File;
  type?: string;
};
const props = withDefaults(defineProps<Props>(), {
  error: false,
  size: "2MB",
  format: "PNG, JPG",
  icon: "icon-gallery-add",
  wrapperClass: "",
  title: "add_image",
});
let image = ref<IImage>({
  url: "",
});
const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};
const uploadType = ref("");
const currentTarget = ref(null);
const handleFile = async (event: Event) => {
  const target = event?.target as HTMLInputElement | null;
  if (target?.files === null) {
    return;
  }
  if (target?.files?.length) {
    handleUploader(target);
  }
};
const handleUploader = (target: any) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(target?.files[0]);
    reader.onerror = (error) => reject(error);
  }).then((res) => {
    // console.log(formData.entries(), formData.get("file"), target.files);
    //Do not touch this, or else You will find yourself DEAD!!!
    let formData = new FormData();

    formData.append("file", target?.files[0], target?.files[0].name);
    formData.append("file_type", "image");
    ApiService.post("common/MediaUpload/", formData, config)
      .then((response: any) => {
        image.value = {
          id: response?.data?.id,
          url: res as string,
          name: target?.files[0].name,
          file: target?.files[0],
          type: "image",
        };
        send();
      })
      .catch(({ response }) => {
        showToast(response?.data?.[0]?.error?.message || t("error"), "error");
      });
  });
  // .catch((err) => {
  //   console.log(err);
  //   // Todo: Toast show
  // });
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
      let formData = new FormData();

      formData.append("file", target?.[0], target[0].name);
      formData.append("file_type", "image");
      ApiService.post("common/MediaUpload/", formData, config)
        .then((response: any) => {
          image.value = {
            id: response?.data?.id,
            url: res as string,
            name: target?.[0].name,
            file: target?.[0],
            type: "image",
          };
          send();
        })
        .catch(({ response }) => {
          showToast(response?.data?.[0]?.error?.message || t("error"), "error");
        });

      send();
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
watch(
  () => props.defaultImage,
  () => {
    if (typeof props.defaultImage === "string") {
      image.value.url = props.defaultImage;
    } else {
      image.value = props.defaultImage || {};
    }
  },
  {
    immediate: true,
  }
);
</script>
<style>
.color {
  color: #e74c3c;
}
</style>
