<template>
  <div>
    <div class="flex-y-center gap-2 mb-2">
      <p
        class="text-sm leading-normal font-normal text-dark-100 cursor-pointer"
        @click="withImages = !withImages"
      >
        {{ $t("answer_with_photos") }}
      </p>
      <FToggle v-model="withImages" />
    </div>
    <div v-if="!withImages" class="grid grid-cols-2 gap-4">
      <FInput
        v-for="(question, index) in state.answers"
        :key="index"
        :placeholder="question?.placeholder"
        :error="$v.answers.$each.$response?.$errors[index].answer.length"
        v-model="state.answers[index].answer"
      >
        <template #prefix>
          <p class="pr-1">{{ variants?.at(index) }})</p>
        </template>
        <template #suffix>
          <button
            class="w-6 h-6 rounded-full bg-white border-2 border-gray-50 flex-center transition-300 hover:border-green"
            :class="{
              '!bg-green !border-green':
                answer === question?.id || question?.isTrue,
            }"
            @click="answer = question?.id"
          >
            <span class="w-2.5 h-2.5 bg-white rounded-full" />
          </button>
        </template>
      </FInput>
    </div>
    <div v-else class="grid grid-cols-2 gap-4">
      <FQuestionUploader
        v-for="(question, index) in state.answers"
        :key="index"
        :error="$v.answers.$each.$response?.$errors[index].file.length"
        @change="state.answers[index].file = $event"
        :default-image="question?.file?.url"
      >
        <template #value>
          <button
            class="w-6 h-6 rounded-full bg-white border-2 border-gray-50 flex-center transition-300 hover:border-green shrink-0"
            :class="{
              '!bg-green !border-green':
                answer === question?.id || question?.isTrue,
            }"
            @click="answer = question?.id"
          >
            <span class="w-2.5 h-2.5 bg-white rounded-full" />
          </button>
        </template>
      </FQuestionUploader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import FInput from "@/components/Form/Input/FInput.vue";
import FToggle from "@/components/Form/FToggle.vue";
import FQuestionUploader from "@/components/Form/Uploader/FQuestionUploader.vue";
import { getElementAtIndex } from "@/utils";
import { helpers, requiredIf } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

interface Props {
  oldAnswers?: any[];
  answer_content?: string;
  edit?: boolean;
}

const props = defineProps<Props>();
const { t } = useI18n();
const emit = defineEmits(["change", "withImages"]);

const answer = ref();
const withImages = ref(
  props.answer_content && props.answer_content === "photo"
);
const state = reactive({
  answers: [
    {
      id: 1,
      value: "A",
      answer: "",
      file: "",
      isTrue: false,
      placeholder: t("answer_question", { value: "A" }),
    },
    {
      id: 2,
      value: "B",
      answer: "",
      file: "",
      isTrue: false,
      placeholder: t("answer_question", { value: "B" }),
    },
    {
      id: 3,
      value: "C",
      answer: "",
      file: "",
      isTrue: false,
      placeholder: t("answer_question", { value: "C" }),
    },
    {
      id: 4,
      value: "D",
      answer: "",
      file: "",
      isTrue: false,
      placeholder: t("answer_question", { value: "D" }),
    },
    {
      id: 5,
      value: "E",
      answer: "",
      file: "",
      isTrue: false,
      placeholder: t("answer_question", { value: "E" }),
    },
  ],
});

const variants = ref(["A", "B", "C", "D", "E"]);

const rules = {
  answers: {
    $each: helpers.forEach({
      answer: {
        requiredIf: requiredIf((a, ans) => {
          return ans?.id !== 5 && !withImages.value;
        }),
      },
      file: {
        requiredIf: requiredIf((a, ans) => {
          return ans?.id !== 5 && withImages.value;
        }),
      },
    }),
  },
};
const $v = useVuelidate(rules, state, { $lazy: true });

watch(
  () => [state.answers, answer.value],
  () => {
    const answerIndex = state.answers.findIndex(
      (item) => item.id === answer.value
    );
    if (answer.value) {
      state.answers[answerIndex].isTrue = true;
      state.answers.forEach((item, idx) => {
        if (idx !== answerIndex) {
          state.answers[idx].isTrue = false;
        }
      });
    }
    emit("change", state.answers);
  },
  {
    deep: true,
  }
);

watch(
  () => withImages.value,
  () => {
    if (!withImages.value && !props.edit) {
      state.answers.map((item) => {
        item.file = "";
      });
    }
    emit("withImages", withImages.value);
  }
);

watch(
  () => props?.oldAnswers,
  (val) => {
    let temp = state.answers.map((ans, idx) => {
      return {
        id: idx + 1,
        value: getElementAtIndex(val, idx)?.value,
        answer: getElementAtIndex(val, idx)?.answer,
        file: getElementAtIndex(val, idx)?.file,
        isTrue: getElementAtIndex(val, idx)?.isTrue,
        placeholder: t("answer_question", {
          value: getElementAtIndex(val, idx)?.value,
        }),
      };
    });
    state.answers.length = 0;
    state.answers.push(...temp);
  },
  {
    immediate: true,
    deep: true,
  }
);
defineExpose({ $v });
</script>
