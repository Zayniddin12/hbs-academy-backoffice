<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div class="relative">
    <CBackButton
      :link="
        '/students/' + route.params?.id + '/course/' + route.params?.courseId
      "
    />
    <CCommonHeader
      no-hr
      title="Title"
      no-image
      no-tabs
      class="relative overflow-hidden"
    >
      <template #title>
        <div></div>
      </template>

      <template #subTitle>
        <p class="text-xl leading-130 font-semibold text-dark-100">
          {{ selectedModuleData?.details?.title ?? "" }}
        </p>
      </template>
      <template #details>
        <CProfileDashDetail
          class="lowercase"
          v-for="(detail, index) in dataDetails"
          :key="index"
          v-bind="{ ...detail, loading }"
        />
      </template>
      <template #content>
        <div class="w-full p-5 pt-0 -mt-1">
          <CTabFull
            :list="listTab"
            class="mb-4"
            v-model="tab"
            active-items-class="font-medium"
            item-class="min-w-[162px]"
          />

          <RouterView />
        </div>
      </template>
    </CCommonHeader>
  </div>
</template>

<script setup lang="ts">
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CBackButton from "@/modules/Students/components/CBackButton.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CTabFull from "@/components/Tab/CTabFull.vue";
import { useMounted } from "@/composables/useMounted";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useStudentsStore } from "@/modules/Students/store";
import { formatDuration } from "@/utils";
import dayjs from "dayjs";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const store = useStudentsStore();

const user = computed(() => store.student);
const course = computed(() => store.course);
const selectedModuleData = computed(() =>
  store?.course?.modules?.find((m) => m?.id === +route.params?.moduleId)
);

const loading = ref(true);
const { mounted } = useMounted();

const routes = computed(() => [
  {
    name: t("students"),
    route: "/students",
  },
  {
    name: user.value?.full_name,
    route: "/students/" + route.params?.id + "/courses",
  },
  {
    name: course.value?.details?.title ?? "",
    route:
      "/students/" + route.params?.id + "/course/" + route.params?.courseId,
  },
  {
    name: selectedModuleData.value?.details?.title ?? "",
    route:
      "/students/" +
      route.params?.id +
      "/" +
      route.params?.courseId +
      "/" +
      route.params?.moduleId,
  },
]);

const tab = ref(route?.name);

const listTab = [
  {
    label: t("lessons"),
    value: "StudentsModuleSingleLessons",
  },
  {
    label: t("assignments"),
    value: "StudentsModuleSingleAssignments",
  },
];

watch(
  () => tab.value,
  () => {
    router.push({ name: tab.value ?? "" });
  }
);

const dataDetails = computed(() => [
  {
    title: selectedModuleData.value?.lessons_count,
    description: t("lessons"),
  },
  {
    title: selectedModuleData.value?.assignments_count,
    description: t("home_task"),
  },
  {
    title: formatDuration(selectedModuleData.value?.duration) || 0,
    description: t("duration"),
  },
  {
    title:
      dayjs(selectedModuleData.value?.start_date).format("DD.MM.YYYY") +
      " - " +
      dayjs(selectedModuleData.value?.end_date).format("DD.MM.YYYY"),
    description: t("period"),
  },
]);

// Fetch data
store.fetchStudentCourseDetail(String(route.params?.courseId), {
  page: 1,
  page_size: 1,
  search: undefined,
});
store.fetchStudentCourseDetail(String(route.params?.courseId), {
  page: 1,
  page_size: 1,
  search: undefined,
});
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 300);
});
</script>
