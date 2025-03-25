<template>
  <div class="w-[340px] h-full flex items-center">
    <Transition :name="transitionName" mode="out-in">
      <div :key="step">
        <SStepLogin
          v-if="step === 1"
          @on-block="step = 3"
          v-bind="{ form }"
          @submit="step = 2"
        />
        <SStepConfirm
          v-if="step === 2"
          v-bind="{ phone }"
          @back="step = 1"
          @on-resend="resendCode"
          @submit="finishLogin"
          @on-block="step = 3"
        />
        <SStepBlocked v-if="step === 3" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import SStepLogin from "@/modules/Auth/components/SStepLogin.vue";
import { ref, watch } from "vue";
import SStepConfirm from "@/modules/Auth/components/SStepConfirm.vue";
import SStepBlocked from "@/modules/Auth/components/SStepBlocked.vue";
import { useAuthStore } from "@/modules/Auth/stores";
import apiService from "@/services/ApiService";

const store = useAuthStore();
const router = useRouter();

const phone = ref("+998996753211");

const step = ref(1);

const form = useForm(
  {
    username: "",
    password: "",
  },
  {
    username: {
      required,
    },
    password: {
      required,
    },
  }
);

async function resendCode() {
  try {
    await store.requestOtp();
    // showToast("success", "Code resent");
  } catch (err) {
    console.log(err);
  }
}

async function finishLogin() {
  try {
    await store.finishLogin(form.values);
    await apiService.setHeader();
    await store.fetchUserData();
    await router.push({ name: "PDashboard" });
  } catch (err) {
    console.log(err);
  }
}

const transitionName = ref("slide-right");
watch(
  () => step.value,
  (newValue, oldValue) => {
    if (newValue < oldValue) {
      transitionName.value = "slide-left";
    } else {
      transitionName.value = "slide-right";
    }
  }
);
</script>
