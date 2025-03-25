<template>
  <div class="flex flex-col gap-3">
    <FRadioGroup
      v-model="form.values[index].answer"
      :items="answers"
      label-key="text"
      value-key="id"
      v-bind="{ answered }"
      :disabled="answered"
    />
  </div>
</template>

<script setup lang="ts">
import FRadioGroup from "@/components/Form/Radio/FRadioGroup.vue";
import { unref } from "vue";
import { TForm } from "@/composables/useForm";

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
