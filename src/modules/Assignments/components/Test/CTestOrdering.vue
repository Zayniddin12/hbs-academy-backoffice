<template>
  <div>
    <FOrdering
      v-if="form.values[index].answer?.length"
      :answers="form.values[index].answer"
      v-model="form.values[index].answer"
    />
  </div>
</template>

<script setup lang="ts">
import { unref, watch } from "vue";
import { TForm } from "@/composables/useForm";
import FOrdering from "@/components/Form/FOrdering.vue";

interface Props {
  answers: {
    id: number;
    title: string;
    is_correct: boolean;
  }[];
  form: TForm<any>;
  index: number;
}

const props = defineProps<Props>();
const { form } = unref(props);

watch(
  () => props.answers,
  () => {
    if (!form.values[props.index].answer?.length) {
      form.values[props.index].answer = props.answers;
    }
  },
  {
    immediate: true,
  }
);
</script>
