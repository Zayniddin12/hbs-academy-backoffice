<template>
  <CDialog
    v-bind="{ show }"
    @close="$emit('close')"
    body-class="!max-w-[865px]"
    :title="edit ? t('edit_question') : t('add_question')"
  >
    <div class="p-5">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2">
          <FGroup :label="t('test_type')" wrapper-class="!justify-start gap-1">
            <FSelect
              :options="questionOptions"
              v-model="questionType"
              label-key="name"
              selected-styles="!text-dark-100 font-normal"
              value-key="value"
            />
          </FGroup>
        </div>
        <FGroup :label="t('attach_file')" wrapper-class="!justify-start gap-1">
          <FQuestionInfoUploader
            :defaultImage="oldForm?.photo?.file"
            @change="form.values.file = $event"
          />
          <template #labelOpposite>
            <p class="text-xs leading-normal font-normal text-gray">
              {{ t("max_limit", { limit: 15 }) }}
            </p>
          </template>
        </FGroup>
        <FGroup :label="t('question')">
          <FTextarea
            v-model="form.values.body"
            :error="form.$v.value.body.$error"
            maxlength="500"
            :placeholder="t('enter_question')"
          />
        </FGroup>

        <Transition name="fade" mode="out-in">
          <CTestOptionSingle
            v-if="questionType === 'single_answer'"
            @change="equalAnswer"
            ref="single_answer"
            @withImages="answerContent"
            :old-answers="oldForm?.answers"
            :answer_content="oldForm?.answer_content"
            :edit="edit"
            :form="form"
          />
          <CTestOptionMulti
            v-else-if="questionType === 'multiple_answer'"
            @change="equalAnswer"
            ref="multiple_answer"
            @withImages="answerContent"
            :old-answers="oldForm?.answers"
            :answer_content="oldForm?.answer_content"
          />
          <CTestOptionOrder
            v-else
            @change="equalAnswer"
            ref="answerInput"
            @withImages="answerContent"
            :old-answers="oldForm?.answers"
          />
        </Transition>
      </div>

      <div class="mt-5 flex-y-center justify-end gap-4">
        <CButton
          class="min-w-[185px]"
          @click="$emit('close')"
          :text="t('cancel')"
          variant="info"
        />
        <CButton
          class="min-w-[185px]"
          v-if="edit"
          :text="t('edit')"
          @click="submit"
          :disabled="!hasCorrectAnswer"
        />
        <CButton
          class="min-w-[185px]"
          v-else
          :text="t('add')"
          @click="submit"
          :disabled="!hasCorrectAnswer"
        />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
import FGroup from "@/components/Form/FGroup.vue";
import FTextarea from "@/components/Form/FTextarea.vue";
import CTestOptionSingle from "@/modules/Courses/components/Modules/Assignments/Type/Options/CTestOptionSingle.vue";
import CTestOptionMulti from "@/modules/Courses/components/Modules/Assignments/Type/Options/CTestOptionMulti.vue";
import CTestOptionOrder from "@/modules/Courses/components/Modules/Assignments/Type/Options/CTestOptionOrder.vue";
import CButton from "@/components/Common/CButton.vue";
import FQuestionInfoUploader from "@/components/Form/Uploader/FQuestionInfoUploader.vue";
import { useForm } from "@/composables/useForm";
import { ITestQuestion } from "@/modules/Assignments/types";
import { requiredIf } from "@vuelidate/validators";

interface Props {
  show?: boolean;
  edit?: boolean;
  oldForm?: ITestQuestion;
}

const props = defineProps<Props>();
const emit = defineEmits(["add", "close"]);

const questionType = ref("single_answer");

const form = useForm(
  {
    body: "",
    file: "",
  },
  {
    body: {
      requiredIf: requiredIf(() => props.show),
    },
  }
);
const single_answer = ref(null);
const multiple_answer = ref(null);
const answerInput = ref(null);
const answers = ref<any>({});
const answer_content = ref("text");
const hasCorrectAnswer = ref(false);

function answerContent(withImages: boolean) {
  if (withImages) {
    answer_content.value = "photo";
  } else {
    answer_content.value = "text";
  }
}

function equalAnswer(data: any) {
  let trueCount = 0;
  answers.value = data;
  answers.value = answers.value?.filter((item) => item.answer || item.file);
  answers.value?.map((item) => {
    if (item?.isTrue && questionType.value !== "reorder") {
      trueCount++;
      hasCorrectAnswer.value = true;
    }
  });
  if (trueCount === 0) {
    hasCorrectAnswer.value = false;
  }
  if (questionType.value === "reorder") {
    hasCorrectAnswer.value = true;
  }
}

const { t } = useI18n();

function submit() {
  if (questionType.value === "single_answer") single_answer.value?.$v.$touch();
  else if (questionType.value === "multiple_answer")
    multiple_answer.value?.$v.$touch();
  else answerInput.value?.$v.$touch();

  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    const data = {
      id: props.oldForm?.id,
      answer_type: questionType.value,
      body: form.values.body,
      photo: form.values.file?.type === "image" ? form.values.file : "",
      video: form.values.file?.type !== "image" ? form.values.file : null,
      answer_content: answer_content.value,
      answers: answers.value,
    };
    emit("add", data);
  }
}

watch(
  () => questionType.value,
  (val) => {
    hasCorrectAnswer.value = val === "reorder";
  }
);

const questionOptions = [
  {
    id: 1,
    name: t("single_answer"),
    value: "single_answer",
  },
  {
    id: 2,
    name: t("multiple_answer"),
    value: "multiple_answer",
  },
  {
    id: 3,
    name: t("reorder"),
    value: "reorder",
  },
];

watch(
  () => props.show,
  (value) => {
    if (!value) {
      form.values.body = "";
      form.values.file = "";
      form.$v.value.$reset();
      questionType.value = "single_answer";
    } else {
      questionType.value = props.oldForm?.answer_type ?? "single_answer";
    }
  }
);

watch(
  () => props?.oldForm?.answer_content,
  () => {
    answer_content.value = props.oldForm?.answer_content ?? "text";
  }
);

watch(
  () => props.oldForm,
  (value) => {
    if (value) {
      form.values.body = props.oldForm?.body;
      form.values.file = props.oldForm?.photo?.file ?? props.oldForm?.video;
      questionType.value = props.oldForm?.answer_type ?? "";
    }
  },
  {
    deep: true,
  }
);
</script>
