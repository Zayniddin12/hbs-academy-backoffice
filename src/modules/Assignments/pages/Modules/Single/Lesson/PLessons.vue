<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <Teleport v-if="mounted" to="#action-lesson-single">
    <CButton
      :text="$t('lessons_add')"
      icon-position="left"
      icon="icon-add"
      class="shrink-0"
      :disabled="!grandAccess(userRole ?? '')"
      @click="showLessonAddModal = true"
    />
  </Teleport>
  <Transition mode="out-in">
    <section :key="draggable">
      <CTableWrapper
        v-if="!draggable"
        :head="moduleLessonsHeadData"
        :data="tableData"
        no-search
        :items-per-page="paginationData?.defaultLimit"
        :limit="paginationData?.defaultLimit"
        :total="paginationData?.total"
        :current-page="paginationData?.currentPage"
        no-header
        @search="onSearch"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
        :title="$t('course_module')"
        :subtitle="t('course_module_count', { count: tableData?.length })"
      >
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data?._index + '.'"
          />
        </template>
        <template #afterSearch>
          <CButton
            v-if="grandAccess(userRole ?? '')"
            icon="icon-add"
            icon-position="left"
            :text="$t('create_course_module')"
            @click="$router.push({ name: 'CourseCreate' })"
          />
          <div v-else></div>
        </template>
        <template #name="{ row: data }">
          <RouterLink
            v-if="grandAccess(userRole ?? '')"
            :to="{
              name: 'CourseModuleLessonSingle',
              params: { lessonId: data?.id },
            }"
            class="text-dark-100 text-sm font-medium"
          >
            {{ data?.title }}
          </RouterLink>
          <p
            v-else
            class="text-dark-100 text-sm font-medium cursor-not-allowed"
          >
            {{ data?.title }}
          </p>
        </template>
        <template #mark_for_lessons="{ row: data }">
          <p>{{ data?.ball }}</p>
        </template>
        <template #duration="{ row: data }">
          <p>{{ secondsToTime(data?.video_duration, true) }}</p>
        </template>
        <template #action="{ row: data }">
          <CDropdown>
            <template #head>
              <div
                class="h-7 w-7 ml-auto nr-5 flex items-center justify-center gap-2.5 rounded-md bg-gray-100 group hover:bg-green-100 focus:bg-green-100 cursor-pointer transition-300"
              >
                <i
                  class="icon icon-more text-dark-100 group-hover:text-green"
                ></i>
              </div>
            </template>

            <template #default>
              <div class="flex flex-col bg-white rounded-lg shadow-dropdown">
                <div
                  class="w-full h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
                  @click="draggable = true"
                >
                  <i class="icon-repeate-music text-blue text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("replace") }}</span
                  >
                </div>
                <hr
                  v-if="grandAccess(userRole ?? '')"
                  class="w-full h-[1px] bg-gray-300"
                />
                <div
                  v-if="grandAccess(userRole ?? '')"
                  class="w-full h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
                  @click="openEdit(data)"
                >
                  <i class="icon-edit text-gray text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("edit") }}</span
                  >
                </div>
                <hr
                  v-if="grandAccess(userRole ?? '')"
                  class="w-full h-[1px] bg-gray-300"
                />
                <div
                  v-if="grandAccess(userRole ?? '')"
                  class="w-full h-11 flex items-center p-3 gap-2 hover:bg-red-100 transition-300"
                  @click="
                    showDelete = true;
                    selectedLesson = data;
                  "
                >
                  <i class="icon-trash text-red text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("table.dropdown.remove") }}</span
                  >
                </div>
              </div>
            </template>
          </CDropdown>
        </template>
        <template #no-data>
          <CNodata
            :title="$t('no_lessons')"
            :subtitle="$t('no_lessons_text')"
          />
        </template>
      </CTableWrapper>
      <CLessonDraggable
        v-else
        @on-save="onSave"
        :table-data="tableData"
        v-model="tableData"
        :loading="buttonLoading"
      />
    </section>
  </Transition>
  <CDeleteDialog
    :title="$t('delete_lesson')"
    :subtitle="$t('delete_lesson_text')"
    @close="showDelete = false"
    @submit="deleteLesson"
    :show="showDelete"
    :loading="buttonLoading"
  />
  <CLessonAddModal
    :video="videoStatusData"
    :show="showLessonAddModal"
    :form="form"
    @close="showLessonAddModal = false"
    :loading="buttonLoading"
    @submit="addLesson"
  />
  <CLessonAddModal
    :video="videoStatusData"
    :show="showLessonEditModal"
    :form="form"
    @close="showLessonEditModal = false"
    :loading="buttonLoading"
    @submit="editLesson"
    edit
  />
</template>
<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { moduleLessonsHeadData } from "@/modules/Courses/data";
import CButton from "@/components/Common/CButton.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import CLessonDraggable from "@/modules/Courses/components/Modules/CLessonDraggable.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import { secondsToTime } from "@/utils";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import { useForm } from "@/composables/useForm";
import { useI18n } from "vue-i18n";
import { useCustomToast } from "@/composables/useCustomToast";
import CLessonAddModal from "@/modules/Courses/components/Modules/CLessonAddModal.vue";
import { requiredIf } from "@vuelidate/validators";
import { ILessonSingle } from "@/modules/Courses/types";
import { useMounted } from "@/composables/useMounted";
import CNodata from "@/components/Common/CNodata.vue";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useCoursesStore } from "@/modules/Courses/store";
import { useAuthStore } from "@/modules/Auth/stores";

const store = useCoursesStore();
const route = useRoute();
const { handleError } = useHandleError();
const { t } = useI18n();
const { showToast } = useCustomToast();
const { mounted } = useMounted();
const credentials = computed(() => store.vdoCipherData);
const showDelete = ref(false);
const buttonLoading = ref(false);
const showLessonEditModal = ref(false);
const showLessonAddModal = ref(false);
const selectedLesson = ref<ILessonSingle | null>(null);

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
    // video: {
    //   requiredIf: requiredIf(
    //     () => showLessonAddModal.value || showLessonEditModal.value
    //   ),
    // },
    title: {
      requiredIf: requiredIf(
        () => showLessonAddModal.value || showLessonEditModal.value
      ),
    },
    description: {
      requiredIf: requiredIf(
        () => showLessonAddModal.value || showLessonEditModal.value
      ),
    },
    ball: {
      requiredIf: requiredIf(
        () => showLessonAddModal.value || showLessonEditModal.value
      ),
    },
  }
);

const videoStatusData = reactive({
  status: "",
  percent: 0,
});

function addLesson() {
  buttonLoading.value = true;
  let data = {
    title: form.values.title,
    description: form.values.description,
    video: credentials.value.video_id,
    module: +route.params?.moduleId,
    ball: +form.values.ball,
  };
  if (form.values.extraFiles) {
    data.files = form.values.files.map((item) => item.id);
  }

  ApiService.post("backoffice/CreateLessons/", data)
    .then(() => {
      showLessonAddModal.value = false;
      showToast(t("lesson_added", { module: "title" }), "success");
      fetchTableData();
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}

function editLesson() {
  //
  buttonLoading.value = true;
  let data = {
    title: form.values.title,
    description: form.values.description,
    video: credentials.value.video_id,
    module: +route.params?.moduleId,
    ball: +form.values.ball,
  };
  if (form.values.extraFiles) {
    data.files = form.values.files.map((item) => item.id);
  }

  ApiService.patch(
    `backoffice/UpdateLessons/${selectedLesson.value?.id}/`,
    data
  )
    .then(() => {
      showLessonEditModal.value = false;
      showToast(t("lesson_edited_successfully"), "success");
      fetchTableData();
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}

function deleteLesson() {
  buttonLoading.value = true;
  ApiService.delete(`backoffice/DeleteLessons/${selectedLesson.value?.id}/`)
    .then(() => {
      showDelete.value = false;
      fetchTableData();
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(
  `backoffice/Modules/${route?.params?.moduleId}/Lessons/`,
  {},
  true
);

// Edit

function openEdit(data: any) {
  selectedLesson.value = data;
  ApiService.get(`backoffice/Lessons/${data?.id}`).then(
    (res: { data: ILessonSingle }) => {
      videoStatusData.status = res?.data?.status;
      videoStatusData.percent = res?.data?.percent;
      form.values.title = res.data.title;
      form.values.description = res.data.description;
      form.values.video = res.data.video;
      form.values.files = res.data.lesson_files;
      form.values.ball = res.data.ball;
      form.values.extraFiles = res.data.lesson_files.length > 0;
      showLessonEditModal.value = true;
    }
  );
}

// Draggable
const draggable = ref(false);

function onSave() {
  buttonLoading.value = true;
  const data = {
    lessons: tableData.value.map((el, index) => {
      return {
        lesson_id: el?.id,
        order: index + 1,
      };
    }),
  };
  ApiService.post(`backoffice/UpdateLessonOrder/`, data)
    .then(() => {
      draggable.value = false;
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}

watch(
  () => showLessonAddModal.value,
  () => {
    form.values.title = "";
    form.values.description = "";
    form.values.video = null;
    form.values.extraFiles = false;
    form.values.files = [];
    form.values.ball = "";
    form.$v.value.$reset();
  }
);

watch(
  () => route.query.search,
  () => fetchTableData()
);

const authStore = useAuthStore();

const userRole = computed(() => authStore?.user?.role);

function grandAccess(role: string) {
  return ["admin", "manager", "mentor", "teacher"]?.includes(role);
}

const single = computed(() => store.courseSingle);

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("courses"),
    route: "/courses",
  },
  {
    name: single.value?.title ?? sessionStorage.getItem("courseTitle"),
    route: `/courses/${route.params.courseId}/module`,
  },
  {
    name: t("lessons"),
    route: "/",
  },
]);
</script>
