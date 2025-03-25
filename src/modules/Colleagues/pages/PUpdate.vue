<template>
  <CDialog
    :show="editVisible"
    header-style="!px-5 !py-4"
    body-class="!max-w-[421px]"
    :title="t('edit_worker')"
    title-style="!text-xl !leading-normal font-semibold"
    @close="$emit('close')"
  >
    <template #default>
      <form @submit.prevent class="border-none px-4 py-5 space-y-4">
        <FGroup :label="t('workers.form.name')" for-text="name">
          <FInput
            id="name"
            v-model="form.values.name"
            :placeholder="t('workers.placeholders.name')"
            :error="form.$v.value.name.$error"
          />
        </FGroup>
        <FGroup
          v-if="grandAccess(userRole ?? '')"
          :label="t('workers.form.role')"
          for-text="role"
        >
          <FSelect
            v-model="form.values.role"
            :options="leadRoles"
            value-key="value"
            label-key="label"
            active-icon
            selected-styles="!font-normal"
            :placeholder="t('workers.placeholders.role')"
            :error="form.$v.value.role.$error"
          />
        </FGroup>
        <FGroup :label="t('workers.form.phone')" for-text="phone">
          <VueTelInput
            ref="phoneInput"
            v-model="form.values.phone"
            :input-options="{
              placeholder: t('workers.placeholders.phone'),
              maxlength: 20,
            }"
            :autoDefaultCountry="false"
            valid-characters-only
            :class="{
              invalid: !form.$v.value.phone.$error,
              '!border-red !bg-[#FEF7F7]': form.$v.value.phone.$error,
            }"
          />
        </FGroup>
        <FGroup :label="t('workers.form.login')" for-text="login">
          <FInput
            id="login"
            v-model="form.values.username"
            :error="form.$v.value.username.$error"
            :placeholder="t('workers.placeholders.login')"
          />
        </FGroup>
        <div class="grid grid-cols-2 gap-3">
          <CButton
            variant="info"
            :text="t('workers.form.cancel')"
            class="!h-11"
            @click="$emit('close')"
          />
          <CButton
            :text="t('save')"
            class="!h-11"
            :loading="buttonLoading"
            @click="onUpdate"
          />
        </div>
      </form>
    </template>
  </CDialog>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useForm } from "@/composables/useForm";

import CDialog from "@/components/Common/Dialog/CDialog.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CButton from "@/components/Common/CButton.vue";
import { computed, ref, watch } from "vue";
import { useWorkersStore } from "@/modules/Colleagues/store";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import { useCustomToast } from "@/composables/useCustomToast";
import { VueTelInput } from "vue-tel-input";
// import "@/assets/styles/vue-tel-input.css";
import "vue-tel-input/vue-tel-input.css";
import { useAuthStore } from "@/modules/Auth/stores";
const { handleError } = useHandleError();
const { showToast } = useCustomToast();

const { t } = useI18n();

interface Props {
  editVisible: boolean;
}

const store = useWorkersStore();

const authStore = useAuthStore();

const userRole = computed(() => authStore?.user?.role);

function grandAccess(role: string) {
  return role === "admin";
}

const selectedWorkerDetail = computed(() => store.worker);

defineProps<Props>();
const emit = defineEmits(["close", "submit"]);

const leadRoles = computed(() => {
  return store.leadRoles.map((r) => {
    return {
      label: t(r.label),
      value: r.value,
    };
  });
});

const form = useForm(
  {
    name: "",
    role: "",
    phone: "",
    username: "",
  },
  {
    name: {
      required: true,
    },
    role: {
      required: true,
    },
    phone: {
      required: true,
    },
    username: {
      required: true,
    },
  }
);

// States
watch(
  () => selectedWorkerDetail.value,
  (val) => {
    if (val) {
      form.values.name = selectedWorkerDetail.value?.full_name;
      form.values.role = selectedWorkerDetail.value?.role;
      form.values.phone = selectedWorkerDetail.value?.phone_number;
      form.values.username = selectedWorkerDetail.value?.username;
    }
  }
);

const buttonLoading = ref(false);

const onUpdate = () => {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    buttonLoading.value = true;
    const data = {
      full_name: form.values.name,
      role: form.values.role,
      phone_number: form.values.phone,
      username: form.values.username,
    };
    ApiService.put(
      "backoffice/WorkerUpdate/" + selectedWorkerDetail.value?.id,
      data
    )
      .then(() => {
        form.values.name = "";
        form.values.role = "";
        form.values.phone = "";
        form.values.username = "";
        form.$v.value.$reset();
        showToast(t("worker_updated_successfully"), "success");
        emit("submit");
        emit("close");
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => (buttonLoading.value = false));
  }
};
</script>
