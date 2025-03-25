<template>
  <div class="flex flex-col gap-5">
    <TransitionGroup name="fade">
      <CModuleLesson
        v-for="(lesson, index) in lessons"
        :key="index"
        v-bind="{ lesson }"
        ref="lessonRef"
        @on-status="uploadVideoStatus"
      />
    </TransitionGroup>
    <!--    NOTE: Need to check Lesson-->
    <CCard class="p-5" v-if="false">
      <div class="flex-y-center gap-10 pl-5">
        <img src="/images/svg/no-data/add-lesson.svg" alt="add-lesson" />
        <div>
          <p class="text-xl leading-normal font-semibold text-dark-100">
            {{ $t("you_add_lesson") }}
          </p>
          <CButton
            class="min-w-[186px] mt-3"
            icon-position="left"
            icon="icon-add"
            :text="$t('lessons_add')"
            @click="addLesson"
            :loading="buttonLoading"
          />
        </div>
      </div>
    </CCard>

    <CCard class="flex-center-between p-5">
      <CButton
        class="min-w-[190px]"
        variant="info"
        :text="$t('back')"
        @click="$emit('back', lessons)"
      />
      <CButton
        class="min-w-[190px]"
        icon="icon-arrow-right"
        :text="$t('next_continue')"
        @click="onSubmit"
      />
    </CCard>
  </div>
</template>

<script setup lang="ts">
import CModuleLesson from "@/modules/Courses/components/Modules/Create/CModuleLesson.vue";
import CCard from "@/components/Card/CCard.vue";
import CButton from "@/components/Common/CButton.vue";
import { reactive, ref } from "vue";

interface Props {
  defaultLessons: any[];
}

const emit = defineEmits(["next"]);
const props = defineProps<Props>();
const lessonRef = ref(null);
const buttonLoading = ref(false);
const videoUploadInfo = ref({});
const videoUploading = ref(false);
const lessons = reactive(
  props.defaultLessons?.length
    ? props.defaultLessons
    : [
        {
          id: 1,
          title: "Lesson 1",
          name: "",
          video: "",
          extraFiles: false,
          description: "",
          files: [],
        },
      ]
);
function uploadVideoStatus(e) {
  videoUploadInfo.value = e;
  videoUploading.value = true;
}
function addLesson() {
  let invalid = false;
  lessonRef.value?.forEach((lesson) => {
    lesson?.value.$touch();
    if (lesson?.value.$invalid) invalid = true;
  });

  if (invalid) return;
  lessons.push({
    id: lessons.length + 1,
    title: `Lesson ${lessons.length + 1}`,
    name: "",
    video: "",
    extraFiles: false,
    description: "",
    files: [],
  });
}
function onSubmit() {
  let invalid = false;
  lessonRef.value?.forEach((lesson) => {
    if (
      lesson?.lesson?.name ||
      lesson?.lesson?.description ||
      lesson?.lesson?.video
    ) {
      lesson?.v$.$touch();
      if (lesson?.v$.$invalid) invalid = true;
    }
  });

  if (invalid) return;
  emit("next", lessons);
}
</script>
