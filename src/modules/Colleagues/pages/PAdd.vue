<template>
  <CDialog
    :show="visible"
    header-style="!px-5 !py-4"
    body-class="!max-w-[421px]"
    :title="t('add_worker')"
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
        <FGroup :label="t('workers.form.role')" for-text="role">
          <FSelect
            v-model="form.values.role"
            :options="leadRoles"
            value-key="value"
            label-key="label"
            :placeholder="t('workers.placeholders.role')"
            :error="form.$v.value.role.$error"
          />
        </FGroup>
        <FGroup :label="t('workers.form.phone')" for-text="phone">
          <FInput
            id="phone"
            v-model="form.values.phone"
            :error="form.$v.value.phone.$error"
            :placeholder="t('workers.placeholders.phone')"
            v-maska="'+998 ## ### ## ##'"
          />
        </FGroup>
        <FGroup :label="t('workers.form.login')" for-text="login">
          <FInput
            id="login"
            v-model="form.values.login"
            :error="form.$v.value.login.$error"
            :placeholder="t('workers.placeholders.login')"
          />
        </FGroup>
        <FGroup :label="t('workers.form.password')" for-text="password">
          <FInput
            id="password"
            v-model="form.values.password"
            :error="form.$v.value.password.$error"
            :placeholder="t('workers.placeholders.password')"
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
            :text="t('workers.form.add')"
            class="!h-11"
            :loading="buttonLoading"
            @click="onCreate"
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
import { computed, ref } from "vue";
import { useWorkersStore } from "@/modules/Colleagues/store";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import { useCustomToast } from "@/composables/useCustomToast";

const { handleError } = useHandleError();
const { showToast } = useCustomToast();

const { t } = useI18n();

interface Props {
  visible: boolean;
}

const store = useWorkersStore();

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
    login: "",
    password: "",
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
    login: {
      required: true,
    },
    password: {
      required: true,
    },
  }
);

// States
const buttonLoading = ref(false);

const onCreate = () => {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    buttonLoading.value = true;
    const data = {
      full_name: form.values.name,
      role: form.values.role,
      phone_number: form.values.phone,
      username: form.values.login,
      password: form.values.password,
    };
    ApiService.post("backoffice/WorkerCreate/", data)
      .then(() => {
        form.values.name = "";
        form.values.role = "";
        form.values.phone = "";
        form.values.login = "";
        form.values.password = "";
        form.$v.value.$reset();
        showToast(t("worker_added_successfully"), "success");
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
