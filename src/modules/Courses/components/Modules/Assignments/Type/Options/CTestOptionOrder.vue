<template>
  <div class="grid grid-cols-2 gap-4">
    <TransitionGroup name="fade">
      <div v-for="(question, index) in state.answers" :key="question?.id">
        <FInput
          :placeholder="$t('enter_answer')"
          v-model="state.answers[index].answer"
          :error="$v.answers.$each.$response?.$errors[index].answer.length"
        >
          <template #prefix>
            <p class="text-sm leading-130 font-normal text-gray mr-2">
              {{ index + 1 }}.
            </p>
          </template>
        </FInput>
      </div>
    </TransitionGroup>
    <CButton
      variant="secondary-primary"
      class="w-full"
      :text="$t('add_variant')"
      icon="icon-add"
      icon-position="left"
      @click="add"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import FInput from "@/components/Form/Input/FInput.vue";
import CButton from "@/components/Common/CButton.vue";
import { getElementAtIndex } from "@/utils";
import { helpers, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

interface Props {
  oldAnswers?: any[];
}

const props = defineProps<Props>();
const emit = defineEmits(["change"]);

const state = reactive({
  answers: [
    {
      id: 1,
      answer: "",
      isTrue: true,
    },
    {
      id: 2,
      answer: "",
      isTrue: true,
    },
    {
      id: 3,
      answer: "",
      isTrue: true,
    },
    {
      id: 4,
      answer: "",
      isTrue: true,
    },
  ],
});

function add() {
  state.answers.push({
    id: Math.floor(Math.random() * 100000),
    answer: "",
    isTrue: true,
  });
}

const rules = {
  answers: {
    $each: helpers.forEach({
      answer: {
        required,
      },
    }),
  },
};
const $v = useVuelidate(rules, state, { $lazy: true });

watch(
  state.answers,
  (value) => {
    emit("change", value);
  },
  {
    deep: true,
  }
);

watch(
  () => props?.oldAnswers,
  (val) => {
    let temp = state.answers.map((ans, idx) => {
      return {
        id: getElementAtIndex(val, idx)?.id,
        answer: getElementAtIndex(val, idx)?.answer,
        isTrue: getElementAtIndex(val, idx)?.isTrue,
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
