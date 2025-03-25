<template>
  <CCard class="p-6">
    <p class="text-xl leading-normal font-semibold text-dark-100">
      {{ $t("file_task") }}
    </p>

    <FGroup
      :label="t('upload_photo')"
      wrapper-class="!justify-start gap-1 mt-4"
    >
      <MultipleFileUploader
        :old-files="mode === 'edit' ? oldFiles : []"
        @change="values.files = $event"
        :clear="clear"
        accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .csv, .zip, .rar"
        class="flex gap-5"
        files-class="!mt-0"
      />
      <template #labelOpposite>
        <p class="text-xs leading-normal font-normal text-gray">
          {{ t("each_50_mb", { mb: 10 }) }}
        </p>
      </template>
    </FGroup>
  </CCard>
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import FGroup from "@/components/Form/FGroup.vue";
import MultipleFileUploader from "@/components/Form/Uploader/MultipleFileUploader.vue";
import { TForm } from "@/composables/useForm";
import { unref } from "vue";
import { useI18n } from "vue-i18n";
import { IFiles } from "@/modules/Assignments/types";

const { t } = useI18n();

interface Props {
  mode?: string;
  oldFiles?: IFiles[];
  form: TForm<any>;
  clear?: boolean;
}

const props = defineProps<Props>();
const { form } = unref(props);
const { values } = form;
</script>
