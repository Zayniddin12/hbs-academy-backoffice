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
        class="flex-center"
      >
        <template #suffix>
          <FCheckbox
            class="translate-y-0.5"
            value="value"
            @change="onChange($event, +question?.id)"
            :checked="answer.includes(question?.id) || question.isTrue"
          />
        </template>
      </FInput>
    </div>
    <div v-else class="grid grid-cols-2 gap-4">
      <FQuestionUploader
        class="pr-3"
        v-for="(question, index) in state.answers"
        :key="index"
        @change="state.answers[index].file = $event"
        :error="$v.answers.$each.$response?.$errors[index].file.length"
        :default-image="question?.file?.url"
      >
        <template #value>
          <FCheckbox
            value="value"
            @change="onChange($event, +question?.id)"
            :checked="answer.includes(question?.id)"
          />
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
import FCheckbox from "@/components/Form/FCheckbox.vue";
import { getElementAtIndex } from "@/utils";
import { helpers, requiredIf } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

const { t } = useI18n();
const emit = defineEmits(["change", "withImages"]);

interface Props {
  oldAnswers?: any[];
  answer_content?: string;
}

const props = defineProps<Props>();

const answer = ref([]);
const withImages = ref(
  props.answer_content && props.answer_content === "photo"
);

function onChange(newValue: boolean, itemValue: number) {
  if (newValue) {
    answer.value.push(itemValue);
  } else {
    answer.value = answer.value.filter((item) => item !== itemValue);
  }
}

const state = reactive({
  answers: [
    {
      id: 1,
      answer: "",
      file: "",
      isTrue: false,
      value: "A",
      placeholder: t("answer_question", { value: "A" }),
    },
    {
      id: 2,
      answer: "",
      file: "",
      isTrue: false,
      value: "B",
      placeholder: t("answer_question", { value: "B" }),
    },
    {
      id: 3,
      answer: "",
      file: "",
      isTrue: false,
      value: "C",
      placeholder: t("answer_question", { value: "C" }),
    },
    {
      id: 4,
      answer: "",
      file: "",
      isTrue: false,
      value: "D",
      placeholder: t("answer_question", { value: "D" }),
    },
  ],
});

const rules = {
  answers: {
    $each: helpers.forEach({
      answer: {
        requiredIf: requiredIf(() => !withImages.value),
      },
      file: {
        requiredIf: requiredIf(() => withImages.value),
      },
    }),
  },
};
const $v = useVuelidate(rules, state, { $lazy: true });

watch(
  () => [state.answers, answer.value],
  () => {
    const innerAnswers = state.answers.map((el: any) => {
      if (answer.value.includes(el?.id)) {
        return { ...el, isTrue: true };
      } else {
        return { ...el, isTrue: false };
      }
    });
    emit("change", innerAnswers);
  },
  {
    deep: true,
  }
);

watch(
  () => props?.oldAnswers,
  (val) => {
    setTimeout(() => {
      state.answers.map((ans) => {
        if (ans.isTrue) {
          answer.value.push(ans.id);
        }
      });
    }, 300);

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
watch(
  () => withImages.value,
  () => {
    emit("withImages", withImages.value);
  }
);

defineExpose({ $v });
</script>
