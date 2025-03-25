<template>
  <CDialog
    v-bind="{ show }"
    body-class="!max-w-[532px]"
    :title="edit ? $t('edit_group') : $t('add_group')"
    @close="$emit('close')"
    is-flow
  >
    <div class="p-5">
      <FGroup :label="$t('name')">
        <FInput
          :placeholder="$t('enter_name')"
          v-model="values.name"
          :error="form.$v.value.name?.$error"
        />
      </FGroup>

      <div class="grid grid-cols-2 gap-3 mt-4">
        <FGroup :label="$t('start_group')" class="relative">
          <FDatePicker
            v-model="values.start"
            :error="form.$v.value.start?.$error"
            :disabled="edit ? !data?.can_edit_dates?.can : false"
            @mouseover="showDisabled = true"
          />
          <Transition name="fade" mode="out-in">
            <div
              v-if="showDisabled && !data?.can_edit_dates.can && data"
              class="absolute bg-white shadow text-dark-100 text-xs px-2 py-1 rounded-md -top-4 validation-message"
              v-html="data?.can_edit_dates?.message"
            ></div>
          </Transition>
        </FGroup>
        <FGroup :key="values.start" :label="$t('end_group')" class="relative">
          <FDatePicker
            min-date="06.10.2023"
            v-model="values.end"
            :error="form.$v.value.end?.$error"
            :disabled="edit ? !data?.can_edit_dates?.can : false"
            @mouseover="showDisabledNext = true"
          />
          <Transition name="fade" mode="out-in">
            <div
              v-if="showDisabledNext && !data?.can_edit_dates.can && data"
              class="absolute bg-white shadow text-dark-100 text-xs px-2 py-1 rounded-md -top-4 validation-message"
              v-html="data?.can_edit_dates?.message"
            ></div>
          </Transition>
        </FGroup>
      </div>

      <div class="w-full flex-y-center gap-3 mt-5">
        <CButton
          class="w-full"
          variant="info"
          :text="$t('cancel')"
          @click="$emit('close')"
        />
        <CButton
          class="w-full"
          :text="edit ? $t('edit') : $t('add')"
          @click="submit"
          v-bind="{ loading }"
        />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import { ref, unref, watch } from "vue";
import CButton from "@/components/Common/CButton.vue";
import { TForm } from "@/composables/useForm";
import dayjs from "dayjs";

interface Props {
  show: boolean;
  form?: TForm<any>;
  loading?: boolean;
  edit?: boolean;
  data?: {
    can_edit_dates: {
      can: boolean;
      message: string;
    };
  };
}

const props = defineProps<Props>();
const { form } = unref(props);
const { values, $v } = form;
const emit = defineEmits(["submit"]);
const showDisabled = ref(false);
const showDisabledNext = ref(false);
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
watch(
  () => showDisabledNext.value,
  (val) => {
    if (val) {
      setTimeout(() => {
        showDisabledNext.value = false;
      }, 3000);
    }
  }
);
function submit() {
  form?.$v.value.$touch();
  if (!form?.$v.value.$invalid) {
    emit("submit");
  }
}
</script>
