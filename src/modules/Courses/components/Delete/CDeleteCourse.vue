<template>
  <CDialog
    :show="show"
    body-class="!max-w-[376px]"
    no-header
    @close="$emit('close')"
  >
    <Transition name="fade" mode="out-in">
      <div :key="step">
        <CDeleteCourseWarning
          v-if="step === 1"
          @submit="handleSubmit"
          @close="$emit('close')"
          :loading="buttonLoading"
        />
        <CDeleteCourseOtp
          v-if="step === 2"
          :phone="valueData?.phone_number"
          :purpose="valueData?.verification_purpose"
          :secret="useClientSecret().secretId"
          :sid="sid"
          @close="$emit('close')"
          @on-resend="sendOtp"
          :timeout="time"
          @submit="submit"
          v-bind="{ id }"
        />
        <CDeleteError v-if="step === 3" @close="$emit('close')" :time="time" />
      </div>
    </Transition>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { ref, watch } from "vue";
import CDeleteCourseWarning from "@/modules/Courses/components/Delete/CDeleteCourseWarning.vue";
import CDeleteCourseOtp from "@/modules/Courses/components/Delete/CDeleteCourseOtp.vue";
import { useClientSecret } from "@/composables/useClientSecretToken";
import ApiService from "@/services/ApiService";
import CDeleteError from "@/modules/Courses/components/Delete/CDeleteError.vue";
import { useHandleError } from "@/composables/useHandleError";

interface Props {
  show: boolean;
  id: string;
  userRole: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "submit"]);

const step = ref(1);
const time = ref(60);
const sid = ref("");
const buttonLoading = ref(false);
const { handleError } = useHandleError();
const valueData = ref<{
  verification_purpose: string;
  phone_number: string;
}>();

function getPhone() {
  buttonLoading.value = true;
  ApiService.get("backoffice/CourseDeletionInfo")
    .then((res) => {
      valueData.value = res.data;
      sendOtp();
    })
    .finally(() => (buttonLoading.value = false));
}
function sendOtp() {
  const data = {
    type: "phone",
    address: valueData.value?.phone_number?.replaceAll(" ", ""),
    purpose: valueData.value?.verification_purpose,
    client_secret: useClientSecret().secretId,
  };
  ApiService.post("verification/request-otp/", data)
    .then((res: any) => {
      time.value = res?.data?.wait;
      sid.value = res?.data?.sid;
      step.value = 2;
    })
    .catch((err) => {
      time.value = +err?.response?.headers["retry-after"] || 60;
      if (err?.response?.status === 429 && time.value > 60) {
        step.value = 3;
      } else {
        step.value = 2;
      }
    });
}
function submit() {
  step.value = 1;
  emit("submit");
  emit("close");
}

function handleSubmit() {
  if (props.userRole === "admin") {
    deleteCourse();
  } else {
    getPhone();
  }
}

watch(
  () => props.show,
  (val) => {
    if (!val) {
      step.value = 1;
    }
  }
);

async function deleteCourse() {
  buttonLoading.value = true;
  const data = {
    course: props.id,
    verification: {
      sid: sid.value,
      client_secret: useClientSecret().secretId,
    },
  };
  await ApiService.post("backoffice/CourseDelete/", data)
    .then(() => {
      emit("submit");
      emit("close");
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}
</script>
