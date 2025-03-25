<template>
  <div>
    <CCommonHeader :title="fullName" :image="user.avatar" no-tabs>
      <template #subTitle>
        <CProfileStatus
          :status="user.is_online ? 'online' : 'offline'"
          :date-joined="user?.last_login ?? 'offline'"
          class="mt-2"
        />
      </template>
      <template #details>
        <CProfileDashDetail
          v-for="(detail, index) in dataDetails"
          :key="index"
          v-bind="{ ...detail, loading }"
        />
      </template>
      <template #actions>
        <CButton
          class="h-9 flex-center text-xs"
          variant="info"
          icon="icon-user"
          :text="$t('student_profile.edit_user_name')"
          icon-position="left"
          @click="handleShowResetUsername"
        />
        <CButton
          class="h-9 flex-center text-xs"
          variant="info"
          icon="icon-phone"
          :text="$t('student_profile.edit_phone_number')"
          icon-position="left"
          @click="showResetPhoneNumber = true"
        />

        <CButton
          class="h-9 flex-center text-xs"
          variant="info"
          icon="icon-key-converted"
          :text="$t('student_profile.edit_parole')"
          icon-position="left"
          @click="showResetPassword = true"
        />
        <CButton
          v-if="user?.is_active"
          class="h-9 flex-center text-xs"
          variant="warning"
          icon="icon-lock"
          :text="$t('student_profile.block')"
          icon-position="left"
          @click="showIsBlock = true"
        />
        <CButton
          v-else
          class="h-9 flex-center text-xs"
          variant="warning-yellow"
          icon="icon-unlock"
          :text="$t('student_profile.unblock')"
          icon-position="left"
          @click="showIsBlock = true"
        />
      </template>
    </CCommonHeader>
    <div class="mt-5 px-5 pt-5 bg-white rounded-2xl">
      <div class="w-full py-2">
        <div class="flex justify-between items-center">
          <CTabFull
            :list="listTab"
            v-model="tab"
            active-items-class="font-medium"
            item-class="min-w-[162px]"
          />
        </div>
      </div>
      <RouterView />
    </div>
  </div>
  <CBlockModal
    :show="showIsBlock"
    :is-blocked="!user?.is_active"
    @close="showIsBlock = false"
    @submit="blockAndUnlockStudent"
  />
  <CResetPasswordModal
    v-bind="{ form }"
    :show="showResetPassword"
    @close="closeResetPasswordModal"
    @submit="resetPassword"
    :loading="resettingPassword"
  />

  <CResetPhoneNumberModal
    v-bind="{ formPhone }"
    :show="showResetPhoneNumber"
    @close="closeResetPhoneNumberModal"
    @submit="resetPhoneNumber"
    :loading="resettingPhoneNumber"
  />
  <CResetUserNameModal
    :show="showResetUserName"
    v-bind="{ formUser }"
    :loading="resettingUsername"
    @close="handleCloseResetUsername"
    @submit="handleSubmitResetUsername"
  />
</template>

<script setup lang="ts">
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import { computed, ref, watch } from "vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import CProfileStatus from "@/modules/Students/components/CProfileStatus.vue";
import CButton from "@/components/Common/CButton.vue";
import CBlockModal from "@/modules/Students/components/CBlockModal.vue";
import { useStudentsStore } from "@/modules/Students/store";
import { useRoute, useRouter } from "vue-router";
import { useCustomToast } from "@/composables/useCustomToast";
import CResetPasswordModal from "@/modules/Students/components/CResetPasswordModal.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { useHandleError } from "@/composables/useHandleError";
import { useAuthStore } from "@/modules/Auth/stores";
import CResetPhoneNumberModal from "@/modules/Students/components/CResetPhoneNumberModal.vue";
import CTabFull from "@/components/Tab/CTabFull.vue";
import CResetUserNameModal from "@/modules/Students/components/CResetUserNameModal.vue";

const { handleError } = useHandleError();

const { t } = useI18n();
const store = useStudentsStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const { showToast } = useCustomToast();

const tab = ref(route?.name);

const user = computed(() => store.student);
const resettingPassword = ref(false);
const resettingUsername = ref(false);
const resettingPhoneNumber = ref(false);

const fullName = computed(() => user.value?.full_name ?? "");
const showIsBlock = ref(false);
const showResetPassword = ref(false);
const showResetPhoneNumber = ref(false);
const showResetUserName = ref(false);

const loading = computed(() => authStore.profileLoading);
const dataDetails = computed(() => [
  {
    title: user.value?.phone_number,
    description: t("student_profile.phone_number"),
  },
  {
    title: user.value?.email,
    description: t("student_profile.email"),
  },
  {
    title: user.value?.gender ? t(user.value?.gender) : user.value?.gender,
    description: t("student_profile.gender"),
  },
  {
    title: user.value?.region,
    description: t("student_profile.region"),
  },
  {
    title: dayjs(user.value?.date_joined).locale("ru").format("DD MMMM YYYY"),
    description: t("student_profile.registration_date"),
  },
]);

const blockAndUnlockStudent = () => {
  showIsBlock.value = false;
  store
    .updateStudent(user.value)
    .then(() => {
      showToast(t("student_updated_successfully"), "success");
      store.fetchStudent(route?.path?.split("/")[2]);
    })
    .catch(() => {
      showToast(t("student_update_error"), "error");
    });
};

const form = useForm(
  {
    new_password: null,
  },
  {
    new_password: { required },
  }
);

const formPhone = useForm(
  {
    new_phone: null,
  },
  {
    new_phone: {
      required,
      // isValidPhone,
    },
  }
);
const formUser = useForm(
  {
    username: null,
  },
  {
    username: {
      required,
      // isValidPhone,
    },
  }
);

const closeResetPasswordModal = () => {
  form.values.new_password = "";
  formPhone.values.new_phone = "";
  form.$v.value.$reset();
  showResetPassword.value = false;
};

const closeResetPhoneNumberModal = () => {
  form.values.new_phoneNumber = "";
  formPhone.values.new_phone = "";
  form.$v.value.$reset();
  showResetPhoneNumber.value = false;
};
const handleCloseResetUsername = () => {
  formUser.values.username = "";
  formUser.$v.value.$reset();
  showResetUserName.value = false;
};

const handleShowResetUsername = () => {
  formUser.values.username = user.value?.full_name;
  showResetUserName.value = true;
};
const resetPassword = () => {
  if (!form.$v.value.$invalid) {
    resettingPassword.value = true;
    resettingPhoneNumber.value = true;
    store
      .resetStudentPassword(user.value?.id, form.values)
      .then(() => {
        showToast(t("student_updated_successfully"), "success");
        store.fetchStudent(route?.path?.split("/")[2]);
        closeResetPasswordModal();
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => {
        resettingPassword.value = false;
        resettingPhoneNumber.value = false;
      });
  }
};

const handleSubmitResetUsername = () => {
  if (!formUser.$v.value.$invalid) {
    resettingUsername.value = true;
    store
      .updateStudentUsername(
        user.value?.id,
        formUser.values.username,
        user.value?.phone_number
      )
      .then(() => {
        showToast(t("student_updated_successfully"), "success");
        store.fetchStudent(route?.path?.split("/")[2]);
        handleCloseResetUsername();
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => (resettingUsername.value = false));
  }
};
const resetPhoneNumber = () => {
  if (!formPhone.$v.value.$invalid) {
    resettingPhoneNumber.value = true;
    store
      .resetStudentPhoneNumber(user.value?.id, formPhone.values)
      .then(() => {
        showToast(t("student_updated_successfully"), "success");
        store.fetchStudent(route?.path?.split("/")[2]);
        closeResetPhoneNumberModal();
        formPhone.values.new_phone = "";
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => (resettingPhoneNumber.value = false));
  }
};
// +

const listTab = [
  {
    label: t("courses"),
    value: "StudentsSingleCourses",
  },
  {
    label: t("attendance"),
    value: "StudentSingleAttendance",
  },
];

watch(
  () => tab.value,
  () => {
    router.push({ name: tab.value });
  }
);

// Fetch Single Student data
store.fetchStudent(route?.path?.split("/")[2]);
</script>
