<template>
  <CCard class="p-5">
    <p class="text-xl leading-130 font-semibold">{{ lesson?.title }}</p>
    <div class="mt-4 flex flex-col gap-4">
      <FGroup :label="$t('upload_video')" wrapper-class="!justify-start gap-1">
        <CVideoUploader
          @on-change="lesson.video = $event"
          @on-status="$emit('on-status', $event)"
          :default="lesson?.video"
          :error="v$.video?.$error"
        />
        <template #labelOpposite>
          <p class="text-xs leading-normal font-normal text-gray">
            {{ $t("max_limit", { limit: 100 }) }}
          </p>
        </template>
      </FGroup>
      <FGroup :label="$t('name')">
        <FInput
          :placeholder="$t('enter_name')"
          v-model="lesson.name"
          :error="v$.name?.$error"
        />
      </FGroup>
      <FGroup :label="$t('lesson_description')">
        <FTextarea
          v-model="lesson.description"
          :error="v$.description?.$error"
          :placeholder="$t('enter_lesson_description')"
        />
      </FGroup>
      <FGroup :label="$t('point_by_lesson')">
        <FInput
          placeholder="0"
          v-maska="'####'"
          v-model="lesson.ball"
          :error="v$.ball?.$error"
        />
      </FGroup>
      <div>
        <div class="flex-y-center gap-3">
          <p
            class="text-sm leading-normal font-normal text-dark-100 cursor-pointer"
            @click="lesson.extraFiles = !lesson.extraFiles"
          >
            {{ $t("extra_files") }}
            <span class="text-xs text-gray">{{
              $t("each_50_mb", { mb: 50 })
            }}</span>
          </p>
          <FToggle v-model="lesson.extraFiles" />
        </div>
        <CollapseTransition>
          <div v-show="lesson.extraFiles" class="pt-2 flex flex-col gap-2">
            <MultipleFileUploader
              accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .csv, .zip, .rar"
              @change="lesson.files = $event"
              :default-images="lesson?.files"
              :clear="!lesson.extraFiles"
            />
          </div>
        </CollapseTransition>
      </div>
    </div>
  </CCard>
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import CVideoUploader from "@/components/Form/Uploader/CVideoUploader.vue";
import FTextarea from "@/components/Form/FTextarea.vue";
import FToggle from "@/components/Form/FToggle.vue";
import { inject, ref, unref } from "vue";
import MultipleFileUploader from "@/components/Form/Uploader/MultipleFileUploader.vue";
import CollapseTransition from "@ivanv/vue-collapse-transition/src/CollapseTransition.vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
interface Props {
  lesson: {
    id: number;
    title: string;
    name: string;
    ball: number;
    video: string;
    extraFiles: boolean;
    description: string;
    files: any[];
  };
}

const props = defineProps<Props>();
const { lesson } = unref(props);
const empty = ref(false);

const noVideo = !inject<boolean>("hasVideo");
const rules = {
  name: { required },
  video: { required },
  description: { required },
  ball: { required },
};
const v$ = useVuelidate(rules, lesson);

defineExpose({ v$, lesson });
</script>
