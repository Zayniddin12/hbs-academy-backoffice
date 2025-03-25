<template>
  <CDialog
    v-bind="{ show }"
    body-class="!max-w-[420px] !overflow-visible"
    :title="t('extend_the_period')"
    title-style="!text-xl !leading-normal font-semibold"
    @close="$emit('close')"
  >
    <div class="p-5 mt-3 pt-0 text-center">
      <form>
        <FGroup :label="$t('date')">
          <FDatePicker
            v-model="values.extended_end_date"
            :error="form.$v.value.extended_end_date.$error"
          />
        </FGroup>
        <FGroup class="mt-3" :label="$t('reason')">
          <FTextarea
            v-model="values.extended_deadline_reason"
            :placeholder="$t('enter_reason')"
          />
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
          variant="success"
          :text="$t('confirm')"
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
import { TForm } from "@/composables/useForm";
import { unref } from "vue";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import FTextarea from "@/components/Form/FTextarea.vue";

interface Props {
  show: boolean;
  form: TForm<any>;
  loading: boolean;
}

const props = defineProps<Props>();
const { values, $v } = unref(props.form);
const { t } = useI18n();
</script>
