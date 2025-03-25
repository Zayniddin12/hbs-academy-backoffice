<template>
  <div>
    <CQuestionHeader v-bind="{ question }" class="mb-5" />
    <CTestRadio
      v-if="
        question?.details?.answer_type === 'single_answer' &&
        question?.details?.answer_content === 'text'
      "
      :answers="question?.answers"
      v-bind="{ form, index, answered }"
    />
    <CTestCheckbox
      v-if="
        question?.details?.answer_type === 'multiple_answer' &&
        question?.details?.answer_content === 'text'
      "
      :answers="question?.answers"
      v-bind="{ form, index, answered }"
    />
    <CTestRadioImage
      v-if="
        question?.details?.answer_type === 'single_answer' &&
        question?.details?.answer_content === 'photo'
      "
      :answers="question?.answers"
      v-bind="{ form, index, answered }"
    />
    <CTestCheckboxImage
      v-if="
        question?.details?.answer_type === 'multiple_answer' &&
        question?.details?.answer_content === 'photo'
      "
      :answers="question?.answers"
      v-bind="{ form, index, answered }"
    />
    <CTestOrdering
      v-if="question?.details?.answer_type === 'reorder'"
      :answers="question?.answers"
      v-bind="{ form, index, answered }"
    />
  </div>
</template>

<script setup lang="ts">
import CQuestionHeader from "@/modules/Assignments/components/Test/CQuestionHeader.vue";
import CTestRadio from "@/modules/Assignments/components/Test/CTestRadio.vue";
import { unref } from "vue";
import CTestCheckbox from "@/modules/Assignments/components/Test/CTestCheckbox.vue";
import CTestRadioImage from "@/modules/Assignments/components/Test/CTestRadioImage.vue";
import CTestCheckboxImage from "@/modules/Assignments/components/Test/CTestCheckboxImage.vue";
import CTestOrdering from "@/modules/Assignments/components/Test/CTestOrdering.vue";

interface Props {
  question: {
    id: number;
    title: string;
    type: string;
    answers: {
      id: number;
      title: string;
      is_right: boolean;
    }[];
  };
  form: any;
  index: number;
  answered?: boolean;
}

const props = defineProps<Props>();

const { form } = unref(props);
</script>
