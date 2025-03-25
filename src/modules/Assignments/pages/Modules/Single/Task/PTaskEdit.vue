<template>
  <div>
    <Teleport v-if="mounted" to="#header-breadcrumbs">
      <CBreadcrumb v-bind="{ routes }" />
    </Teleport>
    <CPageHeader
      :title="ETitle[$route.query?.type]"
      @on-create="$route.query.type === 'test' ? editTest() : editQuestion()"
      :accept-btn="{
        text: t('edit'),
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
          edit-mode
          :form="questionsForm"
        />
        <CAssignmentText
          v-if="$route.query.type === 'writing'"
          mode="edit"
          :old-files="single?.files"
          :form="writingForm"
        />
        <CAssignmentText
          v-if="$route.query.type === 'writing_and_file'"
          mode="edit"
          :old-files="single?.files"
          :form="writingForm"
        />
        <CAssignmentFile
          v-if="$route.query.type === 'file'"
          mode="edit"
          :old-files="single?.files"
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
import { useRoute } from "vue-router";
import CAssignmentText from "@/modules/Courses/components/Modules/Assignments/Type/CAssignmentText.vue";
import CAssignmentFile from "@/modules/Courses/components/Modules/Assignments/Type/CAssignmentFile.vue";
import ApiService from "@/services/ApiService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useCustomToast } from "@/composables/useCustomToast";
import { IAssignmentSingle } from "@/modules/Courses/types";
import router from "@/router";
import { useHandleError } from "@/composables/useHandleError";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { computed } from "vue";
import { useCoursesStore } from "@/modules/Courses/store";
import { useMounted } from "@/composables/useMounted";

const { mounted } = useMounted();
const { showToast } = useCustomToast();
const { handleError } = useHandleError();

const { t } = useI18n();
const route = useRoute();
const loading = ref(false);
const single = ref<IAssignmentSingle>();

const infoForm = useForm(
  {
    title: "",
    description: "",
    ball: "",
    allocated_time: "",
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
    files: {
      required,
    },
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

function editQuestion() {
  infoForm.$v.value.$touch();
  multipleFileForm.$v.value.$touch();
  writingForm.$v.value.$touch();
  if (
    (!infoForm.$v.value.$invalid &&
      !multipleFileForm.$v.value.$invalid &&
      route.query.type === "file") ||
    (!infoForm.$v.value.$invalid &&
      !writingForm.$v.value.$invalid &&
      route.query.type === "writing") ||
    (!infoForm.$v.value.$invalid &&
      !writingForm.$v.value.$invalid &&
      route.query.type === "writing_and_file")
  ) {
    loading.value = true;
    ApiService.put(
      "/backoffice/assignment/EditAssignment/" + single.value?.id + "/",
      {
        ...infoForm.values,
        type: writingForm.values.canStudentSubmitFile
          ? "writing_and_file"
          : route.query.type,
        files:
          route.query.type === "writing" ||
          route.query.type === "writing_and_file"
            ? [
                ...(writingForm.values.files.map((item) => item.id) ?? []),
                // ...(single.value.files.map((item) => item.id) ?? []),
              ]
            : [
                ...(multipleFileForm.values.files.map((item) => item.id) ?? []),
                ...(single.value.files.map((item) => item.id) ?? []),
              ],
        module: +route.params?.moduleId,
      }
    )
      .then(() => {
        loading.value = false;
        router.push(
          `/courses/${route.params.courseId}/module/${route.params.moduleId}/assignments`
        );
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

function editTest() {
  infoForm.$v.value.$touch();
  questionsForm.$v.value.$touch();
  if (!infoForm.$v.value.$invalid && !questionsForm.$v.value.$invalid) {
    loading.value = true;
    ApiService.put("/backoffice/assignment/EditTest/" + single.value?.id, {
      ...infoForm.values,
      type: route.query.type,
      module: +route.params?.moduleId,
      questions: questionsForm.values?.questions?.map((question, idx) => {
        return {
          ...question,
          id: idx + 1,
          photo: question?.photo?.id,
          answer_content: question?.answer_content,
          answers: question?.answers?.map((answer) => {
            return {
              text: answer?.answer || undefined,
              photo: answer?.file?.id || undefined,
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
        router.push(
          `/courses/${route.params.courseId}/module/${route.params.moduleId}/assignments`
        );
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

enum ETitle {
  test = "edit_test_assignment",
  writing = "edit_text_assignment",
  writing_and_file = "edit_text_assignment",
  file = "edit_file_assignment",
}

const testVariants = ["A", "B", "C", "D"];

function getSingle() {
  ApiService.get(
    `backoffice/assignment/AssignmentDetail/${route.params?.taskId}`
  ).then((res) => {
    single.value = res?.data;

    infoForm.values.ball = single.value?.ball + "" ?? "";
    infoForm.values.description = single.value?.description ?? "";
    infoForm.values.title = single.value?.title ?? "";
    infoForm.values.allocated_time = single.value?.allocated_time ?? "";
    multipleFileForm.values.files = single.value?.files;
    writingForm.values.canStudentSubmitFile =
      single.value?.type === "file_writing";
    writingForm.values.files = single.value?.files;
    writingForm.values.canStudentSubmitFile =
      single?.value?.type === "writing_and_file";
    questionsForm.values.questions = single.value?.test_questions?.map(
      (question, idx) => {
        return {
          ...question,
          id: idx + 1,
          answers: question?.answers?.map((answer, idx) => {
            return {
              id: idx,
              value: testVariants[idx],
              answer: answer?.text,
              file: {
                url: answer?.photo?.file,
                id: answer?.photo?.id,
              },
              isTrue: answer?.is_correct,
            };
          }),
        };
      }
    );
  });
}

// Fetch data
getSingle();

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
    name: t("assignments"),
    route: `/courses/${route.params.courseId}/module/${route.params.moduleId}/assignments`,
  },
  {
    name: single.value?.title,
    route: "/",
  },
]);
</script>
