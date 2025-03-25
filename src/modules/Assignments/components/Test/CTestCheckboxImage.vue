<template>
  <div class="flex flex-col gap-3">
    <FCheckboxGroupImages
      v-model="form.values[index].answer"
      :items="answers"
      label-key="title"
      value-key="id"
      v-bind="{ answered }"
      :disabled="form.values[index].answer?.length >= 2 || answered"
    />
  </div>
</template>

<script setup lang="ts">
import { unref } from "vue";
import { TForm } from "@/composables/useForm";
import FCheckboxGroupImages from "@/components/Form/Checkbox/FCheckboxGroupImages.vue";

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
