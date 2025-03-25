<template>
  <div>
    <Teleport v-if="mounted" to="#header-breadcrumbs">
      <CBreadcrumb v-bind="{ routes }" />
    </Teleport>
    <CPageHeader
      :title="ETitle[$route.query?.type]"
      @on-create="
        $route.query.type === 'test' ? createTest() : createQuestion()
      "
      :accept-btn="{
        text: t('create'),
        loading,
      }"
      @on-cancel="$router.push({ name: 'CourseModulesSingleAssignments' })"
    />

    <div class="grid grid-cols-12 mt-6">
      <div class="col-span-9 flex flex-col gap-6">
        <CAssignmentInfo
          :is-test="$route.query.type === 'test'"
          :form="infoForm"
        />

        <CAssignmentTest
          v-if="$route.query.type === 'test'"
          :form="questionsForm"
        />

        <CAssignmentText
          v-if="$route.query.type === 'writing'"
          :form="writingForm"
        />

        <CAssignmentFile
          v-if="$route.query.type === 'file'"
          :clear="clearFiles"
          :form="multipleFileForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CPageHeader from "@/components/CPageHeader.vue";
import CAssignmentInfo from "@/modules/Courses/components/Modules/Assignments/Type/CAssignmentInfo.vue";
import CAssignmentTest from "@/modules/Courses/components/Modules/Assignments/Type/CAssignmentTest.vue";
import { useForm } from "@/composables/useForm";
import { required, requiredIf } from "@vuelidate/validators";
import { useRoute, useRouter } from "vue-router";
import CAssignmentText from "@/modules/Courses/components/Modules/Assignments/Type/CAssignmentText.vue";
import CAssignmentFile from "@/modules/Courses/components/Modules/Assignments/Type/CAssignmentFile.vue";
import ApiService from "@/services/ApiService";
import { computed, ref } from "vue";
import { handleError } from "@/utils";
import { useI18n } from "vue-i18n";
import { useCustomToast } from "@/composables/useCustomToast";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import { useCoursesStore } from "@/modules/Courses/store";

const { showToast } = useCustomToast();

const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const clearFiles = ref(false);

const infoForm = useForm(
  {
    title: "",
    description: "",
    ball: "",
    allocated_time: "",
    duration_days: "",
  },
  {
    title: {
      required,
    },
    description: {
      required,
    },
    ball: {
      required,
    },
    duration_days: {
      required,
    },
    allocated_time: {
      requiredIf: requiredIf(() => route.query.type === "test"),
    },
  }
);

const multipleFileForm = useForm(
  {
    files: [],
  },
  {
    // files: {
    //   required,
    // },
  }
);

const writingForm = useForm(
  {
    files: [],
    canStudentSubmitFile: false,
  },
  {}
);

const questionsForm = useForm(
  {
    questions: [],
  },
  {
    questions: {
      required,
    },
  }
);

function createQuestion() {
  infoForm.$v.value.$touch();
  multipleFileForm.$v.value.$touch();
  writingForm.$v.value.$touch();
  if (
    (!infoForm.$v.value.$invalid &&
      !multipleFileForm.$v.value.$invalid &&
      route.query.type === "file") ||
    (!infoForm.$v.value.$invalid &&
      !writingForm.$v.value.$invalid &&
      route.query.type === "writing")
  ) {
    loading.value = true;
    ApiService.post("/backoffice/assignment/CreateAssignment/", {
      ...infoForm.values,
      type: writingForm.values.canStudentSubmitFile
        ? "writing_and_file"
        : route.query.type,
      files:
        route.query.type === "writing"
          ? writingForm.values?.files.map((item) => item.id)
          : multipleFileForm.values?.files.map((item) => item.id),
      module: +route.params?.moduleId,
    })
      .then(() => {
        loading.value = false;
        showToast(t("successfully"), "success");
        infoForm.values.ball = "0";
        infoForm.values.duration_days = "0";
        infoForm.values.description = "";
        infoForm.values.title = "";
        infoForm.values.allocated_time = "";
        multipleFileForm.values.files = [];
        writingForm.values.canStudentSubmitFile = false;
        writingForm.values.files = [];
        clearFiles.value = true;
        infoForm.$v.value.$reset();
        multipleFileForm.$v.value.$reset();
        writingForm.$v.value.$reset();
        router.push({ name: "CourseModulesSingleAssignments" });
      })
      .catch(({ response }) => {
        handleError(response);
        showToast(t("assignment_error"), "error");
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

function createTest() {
  infoForm.$v.value.$touch();
  questionsForm.$v.value.$touch();
  if (!infoForm.$v.value.$invalid && !questionsForm.$v.value.$invalid) {
    loading.value = true;
    ApiService.post("/backoffice/assignment/CreateTest/", {
      ...infoForm.values,
      type: route.query.type,
      module: +route.params?.moduleId,
      questions: questionsForm.values?.questions?.map((question) => {
        return {
          ...question,
          photo: question?.photo?.id,
          answers: question?.answers?.map((answer) => {
            return {
              text: answer?.answer,
              photo: answer?.file?.id,
              is_correct: answer?.isTrue,
            };
          }),
        };
      }),
    })
      .then(() => {
        loading.value = false;
        showToast(t("successfully"), "success");
        infoForm.values.ball = "";
        infoForm.values.description = "";
        infoForm.values.title = "";
        infoForm.values.allocated_time = "";
        questionsForm.values.questions = [];
        infoForm.$v.value.$reset();
        questionsForm.$v.value.$reset();
        router.push({ name: "CourseModulesSingleAssignments" });
      })
      .catch(({ response }) => {
        showToast(t("assignment_error"), "error");
        handleError(response);
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

enum ETitle {
  test = "new_test_assignment",
  writing = "new_writing_assignment",
  file = "new_file_assignment",
  writing_and_file = "new_writing_assignment",
}

const courseTitle = ref();

function getCourseSingle() {
  ApiService.get(`backoffice/Courses/${route.params.courseId}`).then((res) => {
    courseTitle.value = res?.data?.title;
  });
}

getCourseSingle();

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
    name: courseTitle?.value ?? sessionStorage.getItem("courseTitle"),
    route: `/courses/${route.params.courseId}/module`,
  },
  {
    name: t(ETitle[route.query?.type]),
    route: "/",
  },
]);
</script>
