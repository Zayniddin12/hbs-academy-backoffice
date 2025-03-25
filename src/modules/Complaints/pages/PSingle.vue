<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div class="relative">
    <CBackButton link="/complaints" />
    <CCommonHeader
      no-image
      no-hr
      no-tabs
      :title="user?.first_name + ' ' + user?.last_name"
      sub-title=""
      title-class="!text-xl"
    >
      <template #details>
        <div class="-mt-2 flex-y-center gap-4">
          <CProfileDashDetail
            :title="dayjs(user?.register_date).format('DD.MM.YYYY, HH:mm')"
            :description="$t('complain.table.registration_date')"
          />
          <CProfileDashDetail
            :title="3"
            :description="$t('courses_count_short')"
          />
          <CProfileDashDetail
            :title="user?.email"
            :description="$t('student_profile.email')"
          />
          <CProfileDashDetail
            :title="formatPhoneNumber(user?.phone)"
            :description="$t('workers.form.phone')"
          />
          <CProfileDashDetail
            :title="user?.region"
            :description="$t('region')"
          />
        </div>
      </template>
    </CCommonHeader>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import { computed } from "vue";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CBackButton from "@/modules/Students/components/CBackButton.vue";
import { user } from "@/modules/Students/data";
import dayjs from "dayjs";
import { formatPhoneNumber } from "@/utils";

const { t } = useI18n();
const { mounted } = useMounted();

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("complaints"),
    route: "/complaints",
  },
  {
    name: "Single",
    route: "/complaints",
  },
]);
</script>
