<template>
  <CCard class="p-6 flex flex-col gap-4">
    <p class="text-xl leading-normal font-semibold text-dark-100">
      {{ t("test_assignment_task") }}
    </p>

    <TransitionGroup name="fade">
      <CQuestionInfo
        v-for="(question, index) in form.values.questions"
        :key="question?.id"
        v-bind="{ question, index }"
        @remove="removeQuestion(+index)"
        @edit="editQuestion(question)"
      />
    </TransitionGroup>
    <CButton
      class="w-full"
      :text="t('add_question')"
      icon="icon-add"
      icon-position="left"
      variant="info"
      @click="showAddQuestion"
    />
  </CCard>

  <CAssignmentTestCreateModal
    :show="showAdd"
    :edit="editMode"
    :old-form="selectedQuestion"
    @close="showAdd = false"
    @add="addQuestion"
  />
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import CButton from "@/components/Common/CButton.vue";
import CAssignmentTestCreateModal from "@/modules/Courses/components/Modules/Assignments/Type/CAssignmentTestCreateModal.vue";
import { ref, unref } from "vue";
import CQuestionInfo from "@/modules/Courses/components/Modules/Assignments/CQuestionInfo.vue";
import { useI18n } from "vue-i18n";
import { TForm } from "@/composables/useForm";
import { ITestQuestion } from "@/modules/Assignments/types";

interface Props {
  form: TForm<any>;
}

const props = defineProps<Props>();
const { form } = unref(props);
const { values } = form;
const showAdd = ref(false);
const editMode = ref(false);
const selectedQuestion = ref<ITestQuestion>();

function addQuestion(data: ITestQuestion) {
  if (editMode.value) {
    form.values.questions = form.values.questions.map((question) => {
      let innerData = {};
      if (data.answer_content === "text") {
        innerData = {
          ...data,
          answers: data.answers.map((answer) => ({ ...answer, file: "" })),
        };
      } else {
        innerData = {
          ...data,
          answers: data.answers.map((answer) => ({ ...answer, answer: "" })),
        };
      }

      return data?.id === question?.id ? innerData : question;
    });
  } else {
    form.values.questions.push(data);
  }
  showAdd.value = false;
}

function editQuestion(question: ITestQuestion) {
  showAdd.value = true;
  selectedQuestion.value = question;
  editMode.value = true;
}

function showAddQuestion() {
  showAdd.value = true;
  selectedQuestion.value = null;
  editMode.value = false;
}

function removeQuestion(index: number) {
  form.values.questions.splice(index, 1);
}

const { t } = useI18n();
</script>
