<template>
  <div>
    <div class="px-5 py-4 flex-center-between border-b border-gray-800">
      <p class="text-xl leading-normal font-semibold text-dark-100">
        {{ $t("enter_code") }}
      </p>
      <button
        class="icon-close text-xl text-gray-400 hover:text-red transition-300"
        @click="$emit('close')"
      />
    </div>
    <div class="p-5 pt-4">
      <p class="text-sm leading-130 font-normal text-gray-500 mt-4">
        {{ $t("we_send_code") }}
      </p>
      <button
        class="flex-y-center px-2 py-1.5 gap-2.5 rounded bg-gray-200 group mt-2"
      >
        <span class="text-sm leading-130 font-normal text-dark-100">
          {{ phone }}
        </span>
      </button>

      <FGroup :label="$t('confirm_code')" class="my-8">
        <FOtp
          :key="resend + ''"
          v-model="form.values.code"
          :error="form.$v.value.code?.$error || otpError"
        />
      </FGroup>
      <div
        v-if="!resend"
        :key="resend + ''"
        class="flex items-center justify-center gap-2 mt-4 mb-8"
      >
        <span class="text-sm text-gray">{{ $t("resend_code") }}:</span>
        <CTimer :seconds="time" @timeout="timeout" />
      </div>
      <div
        v-else
        class="flex items-center justify-center gap-2 mt-4 mb-8 cursor-pointer"
        @click="onResend"
      >
        <span class="text-sm text-green">{{ $t("resend_code_f") }}</span>
        <img src="/images/svg/refresh.svg" alt="refresh" />
      </div>
      <CButton
        class="w-full"
        :text="$t('confirm')"
        @click="submit"
        v-bind="{ disabled }"
        :loading="loadingButton"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPhoneNumber } from "@/utils";
import CTimer from "@/components/CTimer.vue";
import CButton from "@/components/Common/CButton.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FOtp from "@/components/Form/FOtp.vue";
import { useCustomToast } from "@/composables/useCustomToast";
import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
import { useForm } from "@/composables/useForm";
import { minLength, required } from "@vuelidate/validators";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";

interface Props {
  phone?: string;
  purpose?: string;
  secret?: string;
  id: string;
  timeout?: number;
  sid: string;
}
const props = defineProps<Props>();

const emit = defineEmits(["submit", "back", "on-resend", "on-block"]);

const { showToast } = useCustomToast();
const { t } = useI18n();
const { handleError } = useHandleError();

const disabled = ref(true);
const resend = ref(false);
const otpError = ref(false);
const time = ref(60);
const loadingButton = ref(false);
const sid = ref("");
const form = useForm(
  {
    code: "",
  },
  {
    code: { required, minLength: minLength(6) },
  }
);
function onResend() {
  resend.value = false;
  form.values.code = "";
  form.$v.value.$reset();
  emit("on-resend");
}
function timeout() {
  resend.value = true;
  form.values.code = "";
  form.$v.value.$reset();
}
watch(
  () => props.timeout,
  (val) => (time.value = val || 60),
  {
    immediate: true,
  }
);
watch(
  () => form.values.code,
  () => {
    otpError.value = false;
    if (form.values.code?.length === 6) submit();
  }
);
async function submit() {
  form.$v.value.$touch();

  if (!form.$v.value.$invalid) {
    try {
      loadingButton.value = true;
      ApiService.post("verification/submit-otp/", {
        sid: props.sid || undefined,
        otp: form.values.code,
        client_secret: props.secret,
      })
        .then((res: any) => {
          sid.value = res?.data?.sid;
          deleteCourse();
        })
        .catch(({ response }) => {
          handleError(response);
          loadingButton.value = false;
          otpError.value = true;
        });
    } catch (err) {
      showToast(t("error"), "error");
      otpError.value = true;
    }
  } else {
    showToast(t("fill_code"), "error");
  }
}

function deleteCourse() {
  const data = {
    course: props.id,
    verification: {
      sid: sid.value,
      client_secret: props.secret,
    },
  };
  ApiService.post("backoffice/CourseDelete/", data)
    .then(() => {
      emit("submit");
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (loadingButton.value = false));
}

watch(
  () => form.values.code,
  (val: string) => {
    disabled.value = val?.length !== 6;
  }
);
</script>

<style scoped></style>
