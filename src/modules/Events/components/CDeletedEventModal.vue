<template>
  <CDialog
    :show="show"
    body-class="!max-w-[376px]"
    no-header
    @close="$emit('close')"
  >
    <div class="p-5">
      <CRoundedIcon color="!text-red bg-red-100" icon="icon-trash" />
      <p
        class="text-center mt-5 text-xl leading-130 font-semibold text-dark-100"
      >
        {{ $t("delete_event") }}
      </p>
      <div class="mt-7 flex-y-center gap-4">
        <CButton
          variant="info"
          class="w-full"
          @click="close"
          :text="$t('cancel')"
        />
        <CButton
          variant="error"
          class="w-full"
          :text="$t('delete')"
          @click="deleteCourse"
          v-bind="{ loading }"
        />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { ref } from "vue";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import CRoundedIcon from "@/components/Common/CRoundedIcon.vue";
import CButton from "@/components/Common/CButton.vue";

interface Props {
  show: boolean;
  id: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

const loading = ref(false);
const { handleError } = useHandleError();

const close = () => {
  emit("close");
};

async function deleteCourse() {
  loading.value = true;
  await ApiService.delete(`backoffice/Event/${props?.id}`)
    .then(() => {
      emit("close");
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (loading.value = false));
}
</script>
