<template>
  <div>
    <FCheckboxGroup
      v-model="form.values"
      :items="answers"
      label-key="text"
      value-key="id"
      v-bind="{ answered }"
      :disabled="form.values[index].answer?.length >= 2 || answered"
    />
  </div>
</template>

<script setup lang="ts">
import { unref } from "vue";
import { TForm } from "@/composables/useForm";
import FCheckboxGroup from "@/components/Form/Checkbox/FCheckboxGroup.vue";

interface Props {
  answers: {
    id: number;
    title: string;
    is_correct: boolean;
  }[];
  form: TForm<any>;
  index: number;
  answered?: boolean;
}

const props = defineProps<Props>();
const { form } = unref(props);
</script>
