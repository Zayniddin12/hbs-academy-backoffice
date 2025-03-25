<template>
  <CCoursesHeader
    :title="single?.title"
    :tab-list="tabList"
    :loading="loading"
    :image="single?.photo"
    :current-tab="route.matched?.[1]?.name ?? 'CourseModules'"
  >
    <template #subTitle>
      <div class="mt-auto">
        <p class="text-gray text-2xs mb-2 mt-3">
          {{ $t("course_description") }}
        </p>
        <CPreloader v-bind="{ loading }" width="150px" height="18px">
          <p class="text-sm text-dark-100 font-medium leading-130">
            {{ single?.description }}
          </p>
        </CPreloader>
      </div>
    </template>
    <template #details>
      <CProfileDashDetail
        v-for="(detail, index) in dataDetails"
        :key="index"
        v-bind="{ ...detail }"
        :loading="loading"
        course
        class="last:border-green last:!text-green last:bg-green-100"
      />
    </template>
    <template #actions>
      <div class="flex gap-4">
        <CButton
          variant="info"
          :text="t('download_stat')"
          icon-position="right"
          :loading="buttonLoading"
          icon="icon-file-assignment"
          @click="downloadSelectedData()"
        />
        <CButton
          variant="info"
          :text="t('download_rating')"
          icon-position="right"
          :loading="buttonLoadingRating"
          icon="icon-file-assignment"
          @click="downloadSelectedDataResult()"
        />
        <div v-if="grandAccess(userRole ?? '')">
          <RouterLink
            :to="{
              name: 'CourseEdit',
              params: { id: $route.params.courseId ?? 1 },
            }"
          >
            <CButton
              class="h-9 flex-center text-xs"
              variant="info"
              icon="icon-edit"
              :text="$t('student_profile.edit')"
              icon-position="left"
            />
          </RouterLink>
        </div>
        <div v-else></div>
      </div>
    </template>
  </CCoursesHeader>
  <CCard class="mt-5">
    <RouterView />
  </CCard>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import CCoursesHeader from "@/components/Profile/CCoursesHeader.vue";
import CButton from "@/components/Common/CButton.vue";
import { formatMoneyDecimal } from "@/utils";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import dayjs from "dayjs";
import CCard from "@/components/Card/CCard.vue";
import { useCoursesStore } from "@/modules/Courses/store";
import CPreloader from "@/components/CPreloader.vue";
import { useAuthStore } from "@/modules/Auth/stores";
import ApiService from "@/services/ApiService";

const { t } = useI18n();
const route = useRoute();
const store = useCoursesStore();
const loading = computed(() => store.loading);
const single = computed(() => store.courseSingle);
const buttonLoadingRating = ref(false);
const buttonLoading = ref(false);
store?.fetchSingleCourse(route.params.courseId as string);

const authStore = useAuthStore();

const userRole = computed(() => authStore?.user?.role);

function grandAccess(role: string) {
  return ["admin", "manager"]?.includes(role);
}

const dataDetails = computed(() => [
  {
    title: t(single.value?.course_type ?? ""),
    description: t("course_type"),
  },
  {
    title: formatMoneyDecimal(single.value?.modules_count),
    description: t("modules"),
  },
  {
    title: formatMoneyDecimal(single.value?.lessons_count),
    description: t("lessons"),
  },
  {
    title: formatMoneyDecimal(single.value?.assignments_count),
    description: t("home_task"),
  },
  {
    title: dayjs(single.value?.created_at).locale("ru").format("DD MMMM YYYY"),
    description: t("created_at"),
  },
  {
    title: t("days", {
      day: formatMoneyDecimal(single.value?.total_duration ?? 0),
    }),
    description: t("total_duration"),
  },
  {
    title: formatMoneyDecimal(single.value?.students_count),
    description: t("course_students"),
  },
]);

// TODO: optimise code for activeTabName
const tabList = computed(() => [
  {
    label: t("course_module"),
    value: route.matched.find(
      (element) => element.name === "CourseModulesSingle"
    )
      ? "CourseModulesSingle"
      : "CourseModules",
  },
  {
    label: t("course_groups"),
    value: "CourseFlows",
  },
]);
//
// const downloadSelectedData = async () => {
//   // downloadExcelFile(
//   //   import.meta.env.VITE_APP_BASE_URL +
//   //     `/backoffice/ExportCourseResultsByGroup/${route.params.courseId}`,
//   //   "assignments.xlsx"
//   // );
//
//   ApiService.get(
//     `/backoffice/ExportCourseResultsByGroup/${route.params.courseId}`
//   ).then((res) => {
//     groupOptions.value = res.data.results;
//   });
// };

const downloadSelectedData = async () => {
  try {
    buttonLoading.value = true;
    // Fetch the API response
    const response = await ApiService.get(
      `/backoffice/ExportCourseResultsByGroup/${route.params.courseId}`
    );

    // Get the download URL from the response
    const fileUrl = response.data.url;

    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = fileUrl;

    // Append the link to the body (required for the download to work in some browsers)
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading the file:", error);
  } finally {
    buttonLoading.value = false;
  }
};

const downloadSelectedDataResult = async () => {
  try {
    buttonLoadingRating.value = true;
    // Fetch the API response
    const response = await ApiService.get(
      `/backoffice/assignment/ExportCourseResultsGeneral/${route.params.courseId}`
    );

    // Get the download URL from the response
    const fileUrl = response.data.url;

    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = fileUrl;

    // Append the link to the body (required for the download to work in some browsers)
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading the file:", error);
  } finally {
    buttonLoadingRating.value = false;
  }
};
</script>
