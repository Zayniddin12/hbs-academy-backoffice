<template>
  <CDialog
    v-bind="{ show }"
    body-class="!max-w-[420px]"
    :title="t('student_profile.edit_parole')"
    title-style="!text-xl !leading-normal font-semibold"
    @close="$emit('close')"
  >
    <div class="p-5 pt-0 text-center">
      <form>
        <FGroup :label="$t('new_phone')" class="mt-4">
          <FInput
            placeholder="+000 00 000 00 00"
            v-model="values.new_phone"
            :error="formPhone.$v.value.new_phone.$error"
          >
          </FInput>
        </FGroup>
      </form>
      <div class="flex-y-center gap-4 mt-7">
        <CButton
          class="w-full"
          variant="info"
          :text="$t('cancel')"
          @click="$emit('close')"
        />
        <CButton
          :disabled="$v.$invalid"
          class="w-full"
          :variant="'warning-yellow'"
          :text="$t('student_profile.edit_phone')"
          @click="submit"
          v-bind="{ loading }"
        />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { useI18n } from "vue-i18n";
import CButton from "@/components/Common/CButton.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { TForm } from "@/composables/useForm";
import { unref } from "vue";

interface Props {
  show: boolean;
  formPhone: TForm<any>;
  loading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["submit"]);
const { values, $v } = unref(props.formPhone);

const { t } = useI18n();

function submit() {
  $v.value.$touch();
  emit("submit");
}
</script>
