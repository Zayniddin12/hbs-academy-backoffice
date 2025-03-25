<template>
  <CCard class="p-6">
    <p class="text-xl leading-normal font-semibold text-dark-100">
      {{ t("additional") }}
    </p>
    <FGroup
      :label="t('upload_photo')"
      wrapper-class="!justify-start gap-1 mt-4"
    >
      <MultipleFileUploader
        :default-images="mode === 'edit' ? oldFiles : []"
        accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .csv, .zip, .rar"
        @change="values.files = $event"
        :clear="clear"
        class="flex gap-5"
        files-class="!mt-0"
      />
      <template #labelOpposite>
        <p class="text-xs leading-normal font-normal text-gray">
          {{ t("each_50_mb", { mb: 50 }) }}
        </p>
      </template>
    </FGroup>
    <div class="flex-y-center gap-3 mt-4">
      <p
        class="text-sm leading-normal font-normal text-dark-100 cursor-pointer"
      >
        {{ t("students_also_attach_file") }}
      </p>
      <FToggle v-model="values.canStudentSubmitFile" />
    </div>
  </CCard>
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import FGroup from "@/components/Form/FGroup.vue";
import MultipleFileUploader from "@/components/Form/Uploader/MultipleFileUploader.vue";
import { ref, unref, watch } from "vue";
import FToggle from "@/components/Form/FToggle.vue";
import { useI18n } from "vue-i18n";
import { TForm } from "@/composables/useForm";
import { IFiles } from "@/modules/Assignments/types";

const { t } = useI18n();

const toggle = ref(false);

interface Props {
  mode?: string;
  oldFiles?: IFiles[];
  form: TForm<any>;
  clear?: boolean;
}

const props = defineProps<Props>();
const { form } = unref(props);
const { values } = form;

// watch(
//   () => values.files,
//   (val) => {
//     console.log("FILE: ", val);
//   }
// );
</script>
