<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <CCommonHeader
    no-actions
    no-tabs
    no-hr
    head-class="h-full justify-between"
    :title="single?.title"
  >
    <template #image>
      <div class="flex-y-center flex-col">
        <div
          class="w-[122px] h-[122px] rounded-lg border-2 border-gray-800 shrink-0 relative overflow-hidden"
        >
          <img
            :src="single?.preview"
            alt="lesson-single"
            class="w-full h-full object-cover"
          />
          <div
            class="flex-center absolute inset-0 bg-dark-100/60 w-full h-full"
          >
            <button
              class="w-8 h-8 rounded-full flex-center bg-white/[24%] group"
              @click="getVideoInfo"
            >
              <i
                class="icon-player text-xl text-white group-hover:scale-110 transition-300"
              />
            </button>
          </div>
        </div>
        <p
          v-if="single?.percent !== 100 || single?.status !== 'ready'"
          class="bg-yellow/20 text-xs text-yellow rounded-xl font-medium p-2 px-3 w-full mt-3 flex-y-center flex-x-center"
        >
          {{ $t("video_is_getting_ready_to_processing") }}
        </p>
      </div>
    </template>
    <template #actions>
      <CButton
        variant="info"
        icon="icon-edit"
        icon-position="left"
        :text="$t('edit_lesson')"
        @click="openEdit"
      />
    </template>
    <template #subTitle>
      <div>
        <p class="text-2xs leading-130 font-normal text-gray">
          {{ $t("lesson_description") }}:
        </p>
        <p class="text-sm font-medium leading-130 text-dark-100 mt-2">
          {{ single?.description }}
        </p>
      </div>
    </template>
    <template #details>
      <div></div>
    </template>
    <template #content>
      <div class="p-6 pt-0 mt-4">
        <div class="flex-y-center gap-4">
          <CProfileDashDetail
            :description="$t('module')"
            :loading="loading"
            :title="single?.module?.title"
          />
          <CProfileDashDetail
            :loading="loading"
            :title="secondsToTime(single?.video_duration, true)"
            :description="$t('duration')"
          />
          <CProfileDashDetail
            :loading="loading"
            :description="$t('attendance')"
            :title="
              single?.is_attended
                ? $t('has_attendance')
                : $t('has_not_attendance')
            "
          />
        </div>
        <div v-if="single?.lesson_files?.length" class="mt-6">
          <p class="text-sm leading-130 font-normal text-dark-100">
            {{ $t("additional_files") }}:
          </p>
          <div class="mt-2 flex-y-center flex-wrap gap-4">
            <CFile
              v-for="(file, index) in single?.lesson_files"
              :key="index"
              has-download
              class="!border !border-green-100 rounded-lg"
              :file="{
                name: file?.file_name,
                size: file?.file_size,
                ...file,
              }"
            />
          </div>
        </div>
      </div>
    </template>
  </CCommonHeader>
  <CCard class="p-5 mt-6">
    <CLessonAttendance
      v-if="doStudentAttendance"
      @end-attendance="handleEndAttendance"
    />
    <CTableWrapper
      v-else
      :head="tableHeadData"
      :data="tableData"
      :loading="loading"
      :items-per-page="paginationData?.defaultLimit"
      :limit="paginationData?.defaultLimit"
      :total="paginationData?.total"
      :current-page="paginationData?.currentPage"
      :title="$t('students')"
      :subtitle="$t('student_plural', { count: paginationData?.total })"
      @search="onSearch"
      @itemsPerPage="onChangeLimit"
      @pageChange="onPageChange"
    >
      <template #_index="{ row: data }">
        <p class="font-semibold">{{ data?._index }}.</p>
      </template>
      <template #name="{ row: data }">
        <RouterLink
          :to="{ name: 'StudentsSingleCourses', params: { id: data?.id } }"
        >
          <CUserCard :card="data" />
        </RouterLink>
      </template>
      <template #flow="{ row: data }">
        <div>
          <p class="text-sm leading-normal font-medium text-dark-100">
            {{ data?.flow_name }}
          </p>
          <p class="text-xs leading-normal font-normal text-gray-700 mt-0.5">
            {{ data?.group_name }}
          </p>
        </div>
      </template>
      <template #process="{ row: data }">
        <CCourseProcessCard
          :value="data?.viewed_time"
          :max="data?.lesson_duration"
        >
          <template #title>
            <p class="text-xs leading-130 font-medium text-gray">
              <span class="text-dark-100">{{
                secondsToTime(data?.viewed_time, true)
              }}</span>
              /
              {{ secondsToTime(data?.lesson_duration, true) }}
            </p>
          </template>
        </CCourseProcessCard>
      </template>
      <template #date="{ row: data }">
        <p class="mt-1 text-xs leading-normal font-normal text-dark-100">
          {{
            data?.started_at
              ? dayjs(data?.started_at).format("DD.MM.YYYY, HH:mm")
              : "-"
          }}
          <span class="text-gray">/</span>
          {{
            data?.finished_at
              ? dayjs(data?.finished_at).format("DD.MM.YYYY, HH:mm")
              : "-"
          }}
        </p>
      </template>
      <template #attendance_status="{ row: data }">
        <CEventStatusBadge :status="data?.attendance_status" />
      </template>
      <template #point="{ row: data }">
        <p class="text-xs leading-130 font-normal text-gray text-right">
          <span class="text-dark-100">{{ data?.ball }}</span> /
          {{ data?.max_ball }}
        </p>
      </template>
      <!--    Actions    -->
      <template #beforeSearch>
        <div class="flex-y-center gap-5">
          <FSelect
            :key="flows?.length"
            v-bind="{ options: flows }"
            v-model="filter.flow"
            selected-option-styles="bg-white !border-gray-800 rounded-md "
            value-key="id"
            label-key="name"
            class="min-w-[160px]"
          />
          <FSelect
            :key="group?.length"
            v-bind="{ options: group }"
            selected-option-styles="bg-white !border-gray-800 rounded-md"
            v-model="filter.group"
            value-key="id"
            label-key="title"
            class="min-w-[160px]"
          />
          <FDatePicker class="min-w-[250px]" v-model="filter.date" range />
        </div>
      </template>
      <template
        #afterSearch
        v-if="
          tableData?.length &&
          !loading &&
          single &&
          courseSingle?.course_type === 'offline'
        "
      >
        <CButton
          v-if="!single?.is_attended"
          variant="primary"
          :text="$t('attendance')"
          @click="handleCreateStudentAttendance"
        />
      </template>

      <template #no-data>
        <div class="py-[128px] flex-center">
          <div class="text-center">
            <img
              src="/images/svg/no-data/no-events.svg"
              alt="no-events"
              class="mx-auto"
            />
            <p class="text-base leading-130 font-semibold text-dark-100 mt-6">
              {{ $t("no_events_yet") }}
            </p>
            <p class="mt-1.5 text-sm leading-130 font-normal text-gray">
              {{ $t("no_events_yet_text") }}
            </p>
          </div>
        </div>
      </template>
    </CTableWrapper>
  </CCard>
  <CDialog
    no-header
    has-close-icon
    :show="showVideo"
    body-class="!max-w-[1000px]"
    @close="showVideo = false"
  >
    <div class="aspect-video">
      <iframe
        :src="`https://player.vdocipher.com/v2/?otp=${videoInfo?.otp}&playbackInfo=${videoInfo?.playback_info}`"
        style="border: 0; width: 100%; height: 100%"
        allow="encrypted-media"
        allowfullscreen
      ></iframe>
    </div>
  </CDialog>
  <CLessonAddModal
    :show="showLessonEditModal"
    :form="form"
    @close="showLessonEditModal = false"
    :loading="buttonLoading"
    @submit="editLesson"
    edit
  />
</template>

<script setup lang="ts">
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import { computed, onMounted, reactive, ref, watch } from "vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CCard from "@/components/Card/CCard.vue";
import CUserCard from "@/components/Card/CUserCard.vue";
import dayjs from "dayjs";
import FSelect from "@/components/Form/Select/FSelect.vue";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";
import CCourseProcessCard from "@/modules/Students/components/CCourseProcessCard.vue";
import {
  formatDateRightOrder,
  secondsToTime,
  updateQueryParams,
} from "@/utils";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CButton from "@/components/Common/CButton.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CFile from "@/components/Common/CFile.vue";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import ApiService from "@/services/ApiService";
import { useRoute } from "vue-router";
import { ILessonSingle } from "@/modules/Courses/types";
import { useTableFetch } from "@/composables/useTableFetch";
import CLessonAddModal from "@/modules/Courses/components/Modules/CLessonAddModal.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { useHandleError } from "@/composables/useHandleError";
import { useCustomToast } from "@/composables/useCustomToast";
import apiService from "@/services/ApiService";
import CLessonAttendance from "@/modules/Courses/components/Modules/CLessonAttendance.vue";
import CEventStatusBadge from "@/modules/Events/components/CEventStatusBadge.vue";
import { useCoursesStore } from "@/modules/Courses/store";

const { handleError } = useHandleError();
const { t } = useI18n();
const { showToast } = useCustomToast();
const { mounted } = useMounted();
const route = useRoute();

const buttonLoading = ref(false);
const showLessonEditModal = ref(false);
const doStudentAttendance = ref(route.query.attendance || false);

const single = ref<ILessonSingle>();
const showVideo = ref(false);
const videoInfo = ref({});
const flows = ref([
  {
    id: 0,
    name: t("all_flows"),
  },
]);
const group = ref([
  {
    id: 0,
    title: t("all_groups"),
  },
]);

const form = useForm(
  {
    video: null,
    title: "",
    description: "",
    extraFiles: false,
    files: [],
    ball: "",
    url: "",
    time: "",
  },
  {
    // video: { required },
    title: { required },
    description: { required },
    ball: { required },
  }
);

const filter = reactive({
  flow: route.query?.flow ? +route.query?.flow : 0,
  group: route.query?.group_member__group
    ? +route.query?.group_member__group
    : 0,
  date: route.query?.started_at
    ? `${dayjs(route.query?.started_at).format("DD.MM.YYYY")} - ${dayjs(
        route.query?.finished_at
      ).format("DD.MM.YYYY")}`
    : "",
});

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
  loading,
} = useTableFetch(`backoffice/LessonStudents/${route?.params?.lessonId}/`);

function getSingle() {
  ApiService.get(`backoffice/Lessons/${route.params?.lessonId}`).then((res) => {
    single.value = res?.data;
  });
}

function getFlows() {
  ApiService.get(`backoffice/FlowsList/${route.params?.courseId}`).then(
    (res) => {
      res?.data?.forEach((el: any) => {
        flows.value.push(el);
      });
    }
  );
}

function getGroups() {
  ApiService.get(`backoffice/GroupsList/${route.params?.courseId}`).then(
    (res) => {
      res?.data?.forEach((el: any) => {
        group.value.push(el);
      });
    }
  );
}
const handleCreateStudentAttendance = () => {
  updateQueryParams("attendance", true);
  doStudentAttendance.value = true;
};
const handleEndAttendance = () => {
  single.value = {};
  getSingle();
  fetchTableData();
  doStudentAttendance.value = false;
};
onMounted(() => {
  getSingle();
  getGroups();
  getFlows();
});

function sortDate() {
  return {
    start_date: filter.date?.split("-")[0]?.replaceAll(" ", ""),
    end_date: filter.date?.split("-")?.[1]?.replaceAll(" ", ""),
  };
}

function editLesson() {
  //
  buttonLoading.value = true;
  let data = {
    title: form.values.title,
    description: form.values.description,
    video: form.values.video,
    module: +route.params?.moduleId,
    ball: +form.values.ball,
  };
  if (form.values.extraFiles) {
    data.files = form.values.files.map((item) => item.id);
  }

  ApiService.patch(`backoffice/UpdateLessons/${route.params.lessonId}/`, data)
    .then(async () => {
      showLessonEditModal.value = false;
      showToast(t("lesson_edited_successfully"), "success");
      await fetchTableData();
      await getSingle();
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}

function openEdit() {
  form.values.title = single.value?.title;
  form.values.description = single.value?.description;
  form.values.video = single.value?.video;
  form.values.files = single.value?.lesson_files;
  form.values.ball = single.value?.ball;
  form.values.extraFiles = single.value?.lesson_files.length > 0;
  showLessonEditModal.value = true;
}

watch(
  () => filter,
  async () => {
    if (typeof filter.group === "number" && filter.group !== 0) {
      await updateQueryParams("group_member__group", filter?.group);
    } else {
      await updateQueryParams("group_member__group", undefined);
    }
    if (typeof filter.flow === "number" && filter.flow !== 0) {
      await updateQueryParams("flow", filter?.flow);
    } else {
      await updateQueryParams("flow", undefined);
    }

    if (filter.date) {
      await updateQueryParams(
        "started_at",
        dayjs(formatDateRightOrder(sortDate()?.start_date)).format("YYYY-MM-DD")
      );
      await updateQueryParams(
        "finished_at",
        dayjs(formatDateRightOrder(sortDate()?.end_date)).format("YYYY-MM-DD")
      );
    } else {
      await updateQueryParams("started_at", undefined);
      await updateQueryParams("finished_at", undefined);
    }

    await fetchTableData();
  },
  {
    deep: true,
  }
);

const routes = computed(() => [
  {
    name: t("courses"),
    route: "/courses",
  },
  {
    name: single.value?.module?.title,
    route: `/courses/${route.params?.courseId}/module/${single.value?.module?.id}/lessons`,
  },
  {
    name: single.value?.title,
    route: "/",
  },
]);

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "student",
    key: "name",
  },
  {
    title: "flow_group",
    key: "flow",
  },
  {
    title: "status_lesson",
    key: "process",
  },
  {
    title: "start_end",
    key: "date",
  },
  {
    title: "point",
    key: "point",
  },
];
const attendanceHeadData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "student",
    key: "name",
  },
  {
    title: "flow_group",
    key: "flow",
  },
  {
    title: "status_lesson",
    key: "process",
  },
  {
    title: "start_end",
    key: "date",
  },
  {
    title: "attendance",
    key: "attendance_status",
  },
  {
    title: "point",
    key: "point",
  },
];

const tableHeadData = computed(() => {
  if (courseSingle.value?.course_type === "offline") {
    return attendanceHeadData;
  } else {
    return headData;
  }
});

const store = useCoursesStore();
const courseSingle = computed(() => store.courseSingle);

store?.fetchSingleCourse(route.params.courseId as string);

function getVideoInfo() {
  return new Promise((resolve, reject) => {
    apiService
      .post("/study/vdocipher/ObtainOTP/", {
        video_id: single.value?.video,
      })
      .then((res) => {
        videoInfo.value = res?.data;
        showVideo.value = true;
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
</script>
