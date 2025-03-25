<template>
  <CDialog
    :show="show"
    body-class="!max-w-[376px]"
    no-header
    @close="$emit('close')"
  >
    <Transition name="fade" mode="out-in">
      <div class="p-5">
        <CRoundedIcon color="!text-yellow bg-yellow-100" icon="icon-copy" />
        <p
          class="text-center mt-5 text-xl leading-130 font-semibold text-dark-100"
        >
          {{ $t("copy_course_warring") }}
        </p>
        <p
          class="text-base leading-130 font-normal text-gray-700 text-center mt-2 mx-auto"
        >
          {{ $t("copy_course_warring_subtitle") }}
        </p>
        <div class="mt-7 flex-y-center gap-4">
          <CButton
            :disabled="loading"
            variant="info"
            class="w-full"
            @click="$emit('close')"
            :text="$t('cancel')"
          />
          <CButton
            :disabled="loading"
            :loading="loading"
            variant="warning-yellow"
            class="w-full"
            :text="$t('table.dropdown.copy')"
            @click="deepCopyCourseFn"
          />
        </div>
      </div>
    </Transition>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import CButton from "@/components/Common/CButton.vue";
import CRoundedIcon from "@/components/Common/CRoundedIcon.vue";
import { ref } from "vue";
import ApiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";
import { useI18n } from "vue-i18n";

interface Props {
  show: boolean;
  id: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "submit"]);

const loading = ref(false);
const { t } = useI18n();
const { showToast } = useCustomToast();

const deepCopyCourseFn = async () => {
  loading.value = true;
  try {
    await ApiService.post(`/backoffice/CourseDeepCopy/${props.id}/`);
    emit("close");
    showToast(t("course_successfully_copied"), "success");
  } catch (error) {
    showToast(error?.data?.[0]?.error?.message, "error");
  } finally {
    loading.value = false;
  }
};
</script>
