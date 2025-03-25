<template>
  <div
    class="h-full w-full relative"
    @dragover.prevent="handleDragOver"
    @drop.prevent="handleDrop"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
  >
    <div v-if="!file">
      <input
        id="file"
        type="file"
        name="file"
        class="w-0 h-0 absolute"
        :accept="accept ?? 'image/png, image/jpeg'"
        @change="handleFile"
        @click="$event.target.value = ''"
      />
      <div
        class="w-full relative h-[142px] flex items-center justify-center flex-col rounded-lg transition-300 cursor-pointer px-6 py-11 border-2 border-dashed border-gray-800 hover:border-gray-400/50"
        :class="[{ '!border-red': error }]"
        @click="getFile"
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
                  @click="getFile"
                >
                  {{ $t("choose_text") }}
                </span>
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
    </div>
    <div
      class="flex flex-col gap-3 mt-2 max-h-[250px] overflow-y-auto w-full"
      :class="filesClass"
      v-if="file"
    >
      <div
        class="flex-center-between relative rounded-xl border border-secondary p-2 transition-300 cursor-pointer"
      >
        <div class="flex-y-center gap-2">
          <div class="w-8 h-8 flex-center rounded-lg bg-green-100 shrink-0">
            <i class="icon-document-text text-green text-2xl" />
          </div>
          <div>
            <p class="text-xs leading-130 text-dark font-medium">
              {{ file.name }}
            </p>
            <p class="text-xs leading-130 font-normal text-gray">
              {{ convertBytes(file.size) }}
            </p>
          </div>
        </div>
        <i
          class="icon-close text-xl text-gray hover:text-red transition-300 cursor-pointer"
          @click="removeFile"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from "vue";
import { convertBytes } from "@/utils";

const emit = defineEmits(["change"]);

interface Props {
  error?: boolean;
  filesClass?: string;
  accept?: string;
  clear?: boolean;
}

const props = defineProps<Props>();

const file = ref<File | null>(null);
const dragging = ref(false);
const currentTarget = ref(null);

watch(
  () => props.clear,
  (value) => {
    if (value) {
      file.value = null;
    }
  }
);

const handleFile = (event: Event) => {
  const target = event?.target as HTMLInputElement | null;
  if (target?.files?.length) {
    file.value = target.files[0]; // Single file upload
    emit("change", file.value); // Emit file to the parent component
  }
};

const getFile = () => {
  const input = document.getElementById("file");
  input?.click();
};

const removeFile = () => {
  file.value = null;
  emit("change", null); // Emit null when the file is removed
};

const handleDragOver = (event: Event) => {
  event.preventDefault();
};

const handleDragEnter = (e: Event) => {
  dragging.value = true;
  currentTarget.value = e?.target;
};

const handleDragLeave = (e: Event) => {
  if (e?.target === currentTarget.value) {
    currentTarget.value = null;
    dragging.value = false;
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  dragging.value = false;

  if (event.dataTransfer?.files?.length) {
    file.value = event.dataTransfer.files[0]; // Single file upload from drag and drop
    emit("change", file.value); // Emit file to the parent component
  }
};
</script>
