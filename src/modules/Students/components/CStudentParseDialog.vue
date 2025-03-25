<template>
  <CDialog
    v-bind="{ show }"
    :title="$t('parsing_student')"
    body-class="!max-w-[420px]"
  >
    <div class="p-5 flex flex-col space-y-4">
      <MultipleFileUploader
        :error="form.$v.value.file.$error"
        @change="form.values.file = $event"
        class="flex gap-5 flex-col"
        files-class="!mt-0"
        accept=".xlsx"
        max-length="1"
      />
      <SFormGroup class="mb-4" :label="$t('password')">
        <SInput
          :error="form.$v.value.password.$error"
          v-model="form.values.password"
          :placeholder="$t('password')"
        />
      </SFormGroup>

      <div class="pt-1 flex-y-center gap-4">
        <CButton
          :disabled="loading"
          variant="info"
          class="w-full"
          @click="$emit('close')"
          :text="$t('cancel')"
        />
        <CButton
          :disabled="!form.values.file"
          :variant="'primary'"
          class="w-full"
          :text="$t('submit')"
          @click="submit"
          :loading="loading"
        />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { defineEmits, ref } from "vue";
import MultipleFileUploader from "@/components/Form/Uploader/MultipleFileUploader.vue";
import SInput from "@/components/Form/Input/FInput.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import SFormGroup from "@/components/Form/FGroup.vue";
import CButton from "@/components/Common/CButton.vue";
import ApiService from "@/services/ApiService";
import { useI18n } from "vue-i18n";
import { useCustomToast } from "@/composables/useCustomToast";
import { handleError } from "@/utils";
interface Props {
  show?: boolean;
}

defineProps<Props>();

const { t } = useI18n();
const { showToast } = useCustomToast();
const emit = defineEmits(["change"]);

const form = useForm(
  {
    file: "",
    password: "cryptoInvest12345",
  },
  {
    file: {
      required,
    },
    password: {
      required,
    },
  }
);

const loading = ref<boolean>(false);
const submit = async () => {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    try {
      loading.value = true;
      await ApiService.post(`/backoffice/ImportStudentsFromExcel/`, {
        new_file: form.values.file[0].id,
        password: form.values.password,
      });

      showToast(t("successfully"), "success");
      emit("close");
    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
    }
  }
};
</script>
