<template>
  <CDialog
    v-bind="{ show }"
    body-class="!max-w-[532px] max-h-screen overflow-scroll"
    :title="$t(edit ? 'lessons_edit' : 'lessons_add')"
    @close="closeModal"
  >
    <div class="p-5">
      <p
        v-if="(video?.percent !== 100 || video?.status !== 'ready') && edit"
        class="bg-yellow/20 text-yellow rounded-xl font-medium px-4 py-2 w-full mb-5 flex-y-center flex-x-center"
      >
        {{ $t("video_is_getting_ready_to_processing") }}
      </p>
      <p class="text-dark-100 text-sm mb-2">
        {{ $t("upload_video") }}
        <span class="text-gray"> {{ $t("max_limit", { limit: 100 }) }} </span>
      </p>
      <CVideoUploader
        @on-change="values.video = $event"
        :default="values.video"
        :edit="edit"
        @on-status="videoUploadStatus = $event"
      />
      <FGroup :label="$t('name')" class="mt-4">
        <FInput
          :placeholder="$t('enter_name')"
          v-model="values.title"
          :error="form.$v.value.title?.$error"
        />
      </FGroup>
      <FGroup :label="$t('lesson_description')" class="mt-4">
        <FTextarea
          :placeholder="$t('enter_lesson_description')"
          v-model="values.description"
          :error="form.$v.value.description?.$error"
          maxlength="500"
        />
      </FGroup>
      <label
        for="_toggle"
        class="text-dark-100 text-sm mt-4 flex items-center cursor-pointer"
      >
        {{ $t("extra_files") }}
        <span class="text-gray ml-0.5 mr-4">
          {{ $t("max_limit", { limit: 100 }) }}
        </span>
        <FToggle v-model="values.extraFiles" />
      </label>
      <Transition mode="out-in" name="fade">
        <div v-if="values.extraFiles" class="mt-4">
          <MultipleFileUploader
            accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .csv, .zip, .rar"
            :default-images="values.files"
            type="doc"
            @change="onChangedFiles"
          />
        </div>
      </Transition>
      <div class="w-full flex-y-center gap-3 mt-5 h-11">
        <FInput
          class="max-w-[88px] !pr-0"
          placeholder="0"
          v-maska="'###'"
          v-model="values.ball"
          :error="form.$v.value.ball.$error"
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
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { unref, ref } from "vue";
import CButton from "@/components/Common/CButton.vue";
import { TForm } from "@/composables/useForm";
import CVideoUploader from "@/components/Form/Uploader/CVideoUploader.vue";
import FTextarea from "@/components/Form/FTextarea.vue";
import FToggle from "@/components/Form/FToggle.vue";
import MultipleFileUploader from "@/components/Form/Uploader/MultipleFileUploader.vue";

interface Props {
  show: boolean;
  video: {
    status: string | undefined;
    percent: number | undefined;
  };
  form: TForm<any>;
  loading?: boolean;
  edit?: boolean;
}

const props = defineProps<Props>();
const { values, $v } = unref(props.form);

const emit = defineEmits(["submit"]);
const videoUploadStatus = ref({});
function onChangedFiles(files: File[]) {
  values.files = files;
}
function submit() {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    emit("submit");
  }
}
function closeModal() {
  // if()
}
</script>
