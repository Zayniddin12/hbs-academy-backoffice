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
        <FGroup :label="$t('new_password')" class="mt-4">
          <FInput
            :type="isNewPassword ? 'password' : 'text'"
            :placeholder="$t('enter_new_password')"
            v-model="values.new_password"
            :error="form.$v.value.new_password.$error"
            @change="form.$v.value.new_password?.$touch()"
          >
            <template #suffix>
              <SEyeToggle
                class="translate-y-0.5"
                :type-password="isNewPassword"
                @click="isNewPassword = !isNewPassword"
                hover-color="#333"
              />
            </template>
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
          class="w-full"
          :disabled="form.$v.value.$invalid"
          :variant="'warning-yellow'"
          :text="$t('student_profile.edit_parole')"
          @click="$emit('submit')"
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
import { ref, unref } from "vue";
import SEyeToggle from "@/components/Form/Input/CEyeToggle.vue";

const isNewPassword = ref(true);

interface Props {
  show: boolean;
  form: TForm<any>;
  loading: boolean;
}

const props = defineProps<Props>();
const { values, $v } = unref(props.form);
const { t } = useI18n();
</script>
