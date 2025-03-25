<template>
  <div class="relative">
    <CBackButton
      :link="`/courses/${$route.params?.courseId}/flows/${$route.params?.flowId}`"
    />
    <CCommonHeader no-hr title="Title" no-image no-tabs class="relative">
      <template #title>
        <div></div>
      </template>

      <template #subTitle>
        <div
          class="text-xl leading-130 font-semibold text-dark-100 flex items-center gap-1"
        >
          {{ single?.title }}
          <div class="inline-block" @click="openModal">
            <i class="icon-edit text-gray cursor-pointer"></i>
          </div>
        </div>
      </template>
      <template #details>
        <CProfileDashDetail description="ID" :title="single?.id" />
        <CProfileDashDetail
          :description="$t('students')"
          :title="single?.students_count"
        />
        <CProfileDashDetail
          :description="$t('personal')"
          :title="single?.leads_count"
        />
      </template>
      <template #content>
        <div class="w-full p-5 pt-0 -mt-1">
          <div class="flex-center-between gap-4 items-center mb-4">
            <CTabFull
              :list="tabData"
              class=""
              v-model="tab"
              active-items-class="font-medium"
              item-class="min-w-[162px]"
            />
            <div class="flex-y-center gap-5" id="group-actions" />
          </div>

          <Transition name="fade" mode="out-in">
            <div :key="$route.name">
              <RouterView />
            </div>
          </Transition>
        </div>
      </template>
    </CCommonHeader>
  </div>
  <CDialog :show="editModal" :title="$t('edit_group')" @close="closeDialog">
    <div class="p-6">
      <FInput
        :placeholder="$t('title')"
        class="min-w-[240px]"
        v-model="title"
        :error="v$.title.$error"
        @change="v$.$touch"
        @enter="groupTitleUpdate"
      />
      <div class="flex items-center gap-4 mt-6">
        <CButton
          class="w-full"
          :text="$t('cancel')"
          @click="closeDialog"
          variant="secondary"
        />
        <CButton class="w-full" :text="$t('save')" @click="groupTitleUpdate" />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CBackButton from "@/modules/Students/components/CBackButton.vue";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CTabFull from "@/components/Tab/CTabFull.vue";
import ApiService from "@/services/ApiService";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import CButton from "@/components/Common/CButton.vue";

import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useCoursesStore } from "@/modules/Courses/store";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const tab = ref(route?.name);
const single = ref();
const editModal = ref(false);
const title = ref("");
const rules = {
  title: {
    required,
  },
};
const v$ = useVuelidate(rules, { title });

function getSingle() {
  ApiService.get(`backoffice/Groups/${route.params?.groupId}`).then((res) => {
    single.value = res?.data;
    title.value = res?.data?.title;
  });
}

function closeDialog() {
  editModal.value = false;
  title.value = "";
}

function openModal() {
  editModal.value = true;
  title.value = single.value?.title;
}

getSingle();

function groupTitleUpdate() {
  v$.value.$touch();
  if (v$.value.$error) {
    return;
  }
  ApiService.patch(`backoffice/UpdateGroup/${route.params?.groupId}/`, {
    title: title.value,
  }).then(() => {
    editModal.value = false;
    getSingle();
  });
}

const store = useCoursesStore();
const courseSingle = computed(() => store.courseSingle);

const listTab = [
  {
    label: t("students"),
    value: "CourseFlowsSingleGroup",
  },
  {
    label: t("personal"),
    value: "CourseFlowsSingleGroupPersonal",
  },
];
const attendanceListTab = [
  {
    label: t("students"),
    value: "CourseFlowsSingleGroup",
  },
  {
    label: t("personal"),
    value: "CourseFlowsSingleGroupPersonal",
  },
  {
    label: t("attendance"),
    value: "CourseFlowsSingleGroupAttendance",
  },
];
const tabData = computed(() => {
  if (courseSingle.value?.course_type === "offline") {
    return attendanceListTab;
  } else {
    return listTab;
  }
});

watch(
  () => tab.value,
  () => {
    router.push({ name: tab.value, query: { ...route.query } });
  }
);
</script>
