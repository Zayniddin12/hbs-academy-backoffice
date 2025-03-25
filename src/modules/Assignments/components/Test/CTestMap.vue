<template>
  <div class="flex-y-center flex-wrap gap-2">
    <button
      class="w-8 h-8 rounded-lg bg-gray-800 text-base leading-130 font-semibold hover:opacity-80 transition-300 active:scale-90 border border-transparent"
      v-for="(question, index) in questions"
      :class="classMap(question, index)?.class"
      :key="index"
      @click="$emit('map-change', index + 1)"
    >
      {{ index + 1 }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  questions: number;
  current?: number;
  count?: number;
  values?: any;
  answered?: boolean;
}

const props = defineProps<Props>();

function classMap(question: any, index: number) {
  if (!props.answered) {
    if (props.values[index]?.answer && index + 1 !== props.current) {
      return {
        class: "!bg-green-200 text-primary",
      };
    } else if (index + 1 === props.current) {
      return {
        class: "bg-white !border-primary text-dark",
      };
    }
  } else {
    if (index + 1 === props.current) {
      if (question?.ball && question?.is_answered) {
        return {
          class: "bg-white !border-green text-green",
        };
      } else if (!question?.ball && question?.is_answered) {
        return {
          class: "bg-white !border-red text-red",
        };
      } else {
        return {
          class: "bg-white !border-gray text-gray",
        };
      }
    } else {
      if (question?.ball && question?.is_answered) {
        return {
          class: "!bg-green text-white",
        };
      } else if (!question?.ball && question?.is_answered) {
        return {
          class: "!bg-red text-white",
        };
      } else {
        return {
          class: "!bg-gray text-white",
        };
      }
    }
  }
}
</script>
