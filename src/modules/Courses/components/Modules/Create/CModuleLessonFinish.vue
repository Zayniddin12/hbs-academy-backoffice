<template>
  <div class="rounded-lg bg-gray-100 p-2.5 relative">
    <div class="flex-y-center space-x-1 absolute right-3 top-3">
      <div
        class="duration-200 transition-all group w-7 h-7 bg-white/[16%] flex items-center justify-center z-20 rounded-lg cursor-pointer border border-transparent hover:scale-110 hover:bg-green/20"
        @click="$emit('editLesson')"
      >
        <span
          class="transition-300 icon-edit text-gray text-xl group-hover:text-green"
        />
      </div>
      <div
        class="duration-200 transition-all group w-7 h-7 bg-white/[16%] flex items-center justify-center z-20 rounded-lg cursor-pointer border border-transparent hover:scale-110 hover:bg-red/20"
        @click="$emit('removeLesson', lesson?.id)"
      >
        <span
          class="transition-300 icon-trash text-gray text-xl group-hover:text-red"
        />
      </div>
    </div>
    <p class="text-xl leading-130 font-semibold text-dark-100">
      {{ lesson?.title }}
    </p>
    <p class="mt-2.5 text-sm leading-130 font-medium text-dark-100">
      {{ lesson?.name }}
    </p>
    <p class="text-xs leading-140 font-normal text-gray-700 mt-1">
      {{ formatDuration(lesson?.video?.duration ?? 0) }}
    </p>
    <p class="mt-4 text-sm leading-130 text-dark-100">
      {{ lesson?.description }}
    </p>
    <CFile
      :file="{
        ...lesson.video,
        file_name: lesson?.video,
        type: 'video',
        size: 0,
      }"
      class="mt-2 rounded-lg border border-gray-800 !p-2"
    />
    <div class="mt-4 mb-2.5">
      <p class="text-sm text-dark-100">
        {{ $t("total_point") }} <span>{{ $t("in_days") }}</span>
      </p>
      <div class="w-full flex-y-center gap-3 mt-2 h-11">
        <FInput
          class="max-w-[88px] !pr-0 bg-white"
          placeholder="0"
          v-maska="'###'"
          :model-value="lesson?.ball"
          autocomplete
          readonly
        >
          <template #suffix>
            <div class="bg-gray-800 w-11 h-11 flex-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.4421 2.92495L12.9087 5.85828C13.1087 6.26662 13.6421 6.65828 14.0921 6.73328L16.7504 7.17495C18.4504 7.45828 18.8504 8.69162 17.6254 9.90828L15.5587 11.975C15.2087 12.325 15.0171 13 15.1254 13.4833L15.7171 16.0416C16.1837 18.0666 15.1087 18.85 13.3171 17.7916L10.8254 16.3166C10.3754 16.05 9.63375 16.05 9.17541 16.3166L6.68375 17.7916C4.90041 18.85 3.81708 18.0583 4.28375 16.0416L4.87541 13.4833C4.98375 13 4.79208 12.325 4.44208 11.975L2.37541 9.90828C1.15875 8.69162 1.55041 7.45828 3.25041 7.17495L5.90875 6.73328C6.35041 6.65828 6.88375 6.26662 7.08375 5.85828L8.55041 2.92495C9.35041 1.33328 10.6504 1.33328 11.4421 2.92495Z"
                  stroke="#8898AA"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </template>
        </FInput>
        <CButton
          class="w-full"
          :text="$t(edit ? 'edit' : 'add')"
          @click="submit"
          v-bind="{ loading }"
        />
      </div>
    </div>
    <div v-if="lesson.files?.length" class="mt-4 flex flex-col gap-2">
      <p class="text-sm leading-normal font-normal text-dark-100">
        {{ $t("additional_files") }}
      </p>
      <CFile
        v-for="(file, i) in files"
        :file="{
          ...file,
          file_name: file?.name,
        }"
        :key="i"
        has-close
        @remove="(i) => removeFiles(i)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CFile from "@/components/Common/CFile.vue";
import { formatDuration } from "@/utils";
import { ref, watch } from "vue";
import FInput from "@/components/Form/Input/FInput.vue";

interface Props {
  lesson: {
    id: number;
    title: string;
    name: string;
    video: string;
    extraFiles: boolean;
    description: string;
    files: any[];
  };
}

const props = defineProps<Props>();

const files = ref<any>([]);
const emit = defineEmits(["editLesson", "removeLesson", "modifiedLessons"]);

watch(
  () => props.lesson.files,
  (val) => {
    files.value = val;
  },
  { deep: true, immediate: true }
);
const removeFiles = (id: string) => {
  files.value = files.value?.filter((i) => i?.id !== id);
  emit("modifiedLessons", files.value);
};
</script>
