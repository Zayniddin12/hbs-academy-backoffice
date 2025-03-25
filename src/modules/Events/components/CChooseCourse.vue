<template>
  <FSelect
    :options="courses"
    v-model="course"
    :selected-option-styles="['!h-auto !p-2', { '!border-green': isOpen }]"
    @on-toggle="isOpen = $event"
  >
    <template #selectedOption>
      <div class="flex-center-between w-full">
        <div>
          <div
            v-if="!getActiveCourse"
            class="flex-y-center gap-2.5 border border-transparent"
          >
            <div class="w-9 h-9 rounded-md bg-green-100 flex-center">
              <i class="icon-dashboard text-xl text-green font-bold" />
            </div>
            <p class="text-sm leading-130 font-medium text-dark-100">
              {{ $t("choose_course") }}
            </p>
          </div>
          <div v-else class="flex-y-center gap-2.5">
            <CAvatar
              class="!w-9 !h-9 !rounded-md before:!rounded-md"
              :image="getActiveCourse?.photo"
            />
            <p class="text-dark-100 text-sm leading-130 font-medium">
              {{ getActiveCourse?.title }}
            </p>
          </div>
        </div>
        <i
          class="icon-chevron-down text-xl text-gray-700 transition-300"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </template>
    <template #option="option">
      <div
        class="flex-y-center gap-2.5 p-2 pb-3 hover:bg-green-100 transition-300"
      >
        <CAvatar
          class="!w-9 !h-9 !rounded-md before:!rounded-md"
          :image="option?.option?.photo"
        />
        <p class="text-dark-100 text-sm leading-130 font-medium">
          {{ option?.option?.title }}
        </p>
      </div>
    </template>
  </FSelect>
</template>

<script setup lang="ts">
import FSelect from "@/components/Form/Select/FSelect.vue";
import CAvatar from "@/components/CAvatar.vue";
import { computed, ref } from "vue";
interface Props {
  courses: {
    id: number;
    photo: string;
    title: string;
  }[];
  modelValue: string;
}
interface Emits {
  (event: "update:modelValue", value: string): void;
}
const emit = defineEmits<Emits>();

const props = defineProps<Props>();
const isOpen = ref(false);

const course = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const getActiveCourse = computed(() => {
  if (course.value) {
    return props?.courses?.find((item) => item.id === course.value);
  } else {
    return null;
  }
});
</script>
