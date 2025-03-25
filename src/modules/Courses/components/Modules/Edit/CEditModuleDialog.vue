<template>
  <CDialog
    v-bind="{ show }"
    @close="$emit('close')"
    :title="$t('edit_module')"
    body-class="!max-w-[532px]"
  >
    <div class="p-5">
      <div class="flex flex-col gap-4">
        <FGroup :label="$t('module_name')">
          <FInput
            :placeholder="$t('enter_name')"
            v-model="values.name"
            :error="editForm.$v.value.name.$error"
          />
        </FGroup>
        <FGroup
          :label="$t('duration')"
          wrapper-class="!justify-start gap-1 relative"
        >
          <FInput
            v-model="values.days"
            :error="editForm.$v.value.days.$error"
            placeholder="0"
            v-maska="'###'"
            :disabled="!data?.can_edit_duration_days.can"
            @mouseover="showDisabled = true"
          />
          <template #labelOpposite>
            <p class="text-xs leading-normal font-normal text-gray">
              {{ $t("in_days") }}
            </p>
          </template>
          <Transition name="fade" mode="out-in">
            <div
              v-if="showDisabled && !data?.can_edit_duration_days.can"
              class="absolute bg-white shadow text-dark-100 text-xs px-2 py-1 rounded-md validation-message"
              v-html="data?.can_edit_duration_days.message"
            ></div>
          </Transition>
        </FGroup>
        <FGroup
          :label="t('duration')"
          wrapper-class="!justify-start gap-1 mt-4"
        >
          <MultipleFileUploader
            @change="values.photo = $event"
            :clear="!loading"
            class="flex gap-5"
            files-class="!mt-0"
          />
          <template #labelOpposite>
            <p class="text-xs leading-normal font-normal text-gray">
              {{ t("each_50_mb", { mb: 50 }) }}
            </p>
          </template>
        </FGroup>
      </div>

      <div class="flex-y-center gap-3 mt-5">
        <CButton class="w-full" variant="info" :text="$t('cancel')" />
        <CButton
          class="w-full"
          :text="$t('save')"
          @click="submit"
          v-bind="{ loading }"
        />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { TForm } from "@/composables/useForm";
import { ref, unref, watch } from "vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import CButton from "@/components/Common/CButton.vue";
import MultipleFileUploader from "@/components/Form/Uploader/MultipleFileUploader.vue";
import { useI18n } from "vue-i18n";
import { IModuleSingle } from "@/modules/Courses/types";

interface Props {
  editForm?: TForm<any>;
  show?: boolean;
  loading?: boolean;
  data: IModuleSingle;
}

const props = defineProps<Props>();
const { editForm } = unref(props);
const { values, $v } = editForm;
const emit = defineEmits(["submit", "close"]);
const { t } = useI18n();
const showDisabled = ref(false);

function submit() {
  editForm?.$v.value.$touch();
  if (!editForm?.$v.value.$invalid) {
    emit("submit");
  }
}
watch(
  () => showDisabled.value,
  (val) => {
    if (val) {
      setTimeout(() => {
        showDisabled.value = false;
      }, 3000);
    }
  }
);
</script>
