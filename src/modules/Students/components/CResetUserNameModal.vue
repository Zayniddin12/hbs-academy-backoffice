<template>
  <CDialog
    v-bind="{ show }"
    body-class="!max-w-[420px]"
    :title="t('student_profile.edit_user_name')"
    title-style="!text-xl !leading-normal font-semibold"
    @close="$emit('close')"
  >
    <div class="p-5 pt-0 text-center">
      <form>
        <FGroup :label="$t('student_profile.enter_new_user_name')" class="mt-4">
          <FInput
            v-model="values.username"
            :error="formUser.$v.value.username.$error"
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
          :text="$t('student_profile.edit_user_name')"
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
  formUser: TForm<any>;
  loading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["submit"]);
const { values, $v } = unref(props.formUser);

const { t } = useI18n();

function submit() {
  $v.value.$touch();
  emit("submit");
}
</script>
