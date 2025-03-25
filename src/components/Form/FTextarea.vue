<template>
  <div
    class="bg-gray-100 border border-transparent focus-within:border-green focus-within:bg-white rounded-lg transition-300"
    :class="{ '!border-red !bg-red-100': error }"
  >
    <textarea
      v-bind="{ rows, cols, id, placeholder, maxlength }"
      :value="modelValue"
      @input="handleInput"
      class="resize-none w-full bg-transparent rounded-lg outline-none py-2.5 px-3 leading-130 text-dark placeholder:text-gray text-sm transition-300"
      :class="textareaClass"
    ></textarea>
    <p v-if="maxlength" class="text-gray-50 px-3 pb-2.5 text-right text-xs">
      {{ (modelValue?.length ?? 0) + "/" + maxlength }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  placeholder?: string;
  cols?: number | string;
  rows?: number | string;
  id?: string;
  error?: boolean;
  maxlength?: number | string;
  textareaClass?: string;
}
defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const handleInput = (e: { target: HTMLInputElement }) => {
  emit("update:modelValue", e.target.value);
};
</script>
