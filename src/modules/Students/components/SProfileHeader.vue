<template>
  <CCommonHeader>
    <template #subTitle>
      <span
        class="h-[26px] flex items-center justify-center mt-2 bg-green-100 text-green font-normal text-xs px-5 rounded-md"
        v-text="$t('online')"
      />
    </template>

    <template #actions>
      <div class="space-x-3">
        <CButton
          variant="info"
          size="md"
          :text="$t('student_profile.edit_parole')"
          icon="icon-key"
          icon-position="left"
          class="profile-button !h-9 inline-flex items-center justify-center"
          main-class="profile-button"
        />
        <CButton
          variant="warning"
          size="md"
          :text="$t('student_profile.block')"
          icon="icon-lock"
          icon-position="left"
          class="profile-button !h-9 inline-flex items-center justify-center"
          main-class="profile-button"
        />
        <CButton
          variant="info"
          size="md"
          :text="$t('student_profile.edit')"
          icon="icon-edit"
          icon-position="left"
          class="profile-button !h-9 inline-flex items-center justify-center"
          main-class="profile-button"
        />
      </div>
    </template>

    <template #details>
      <CProfileDashDetail
        :title="formatPhoneNumber('+998712007007')"
        description="student_profile.phone_number"
      />
      <CProfileDashDetail description="student_profile.email" />

      <CProfileDashDetail description="student_profile.gender" />

      <CProfileDashDetail description="student_profile.region" />

      <CProfileDashDetail
        title="16.09.2022 / 09:41"
        description="student_profile.registration_date"
      />
    </template>
  </CCommonHeader>
</template>

<script setup lang="ts">
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";

import { formatPhoneNumber } from "@/utils";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CButton from "@/components/Common/CButton.vue";
</script>

<style scoped>
.profile-button span {
  font-size: 20px !important;
}
</style>
