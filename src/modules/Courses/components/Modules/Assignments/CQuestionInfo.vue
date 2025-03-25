<template>
  <div
    class="p-2.5 rounded-lg bg-gray-100 flex justify-between items-start gap-3"
  >
    <div class="flex gap-3">
      <div class="w-7 h-7 rounded bg-gray-800 flex-center shrink-0">
        <p class="text-xs leading-140 font-medium text-dark-100">
          {{ index + 1 }}
        </p>
      </div>
      <div
        v-if="question?.image?.url"
        class="w-[75px] h-[60px] rounded-md relative overflow-hidden"
      >
        <img
          :src="question?.image?.url"
          alt="image-question"
          class="w-full h-full object-cover"
        />
      </div>

      <div>
        <p class="text-sm leading-130 font-medium text-dark-100">
          {{ question?.body }}
        </p>

        <div class="flex gap-1 mt-1">
          <p class="text-xs leading-140 font-normal text-gray">
            {{ answers?.length === 1 ? $t("answer") : $t("answers") }}:
          </p>
          <div v-for="(answer, idx) in answers" :key="idx" class="flex gap-1">
            <p class="text-xs leading-140 text-gray-700">
              <span v-if="answer?.value" class="text-dark-100 font-medium"
                >{{ answer?.value }})</span
              >
              {{ answer?.file?.name ?? answer?.answer }}
              <span v-if="!answer?.value && idx !== answers?.length - 1"
                >,</span
              >
            </p>
            <div
              v-if="answer?.file?.url"
              class="rounded-md w-[75px] h-[60px] border border-gray-800 relative overflow-hidden"
            >
              <img
                :src="answer?.file?.url"
                class="w-full h-full object-cover"
                alt="image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-y-center gap-3">
      <button
        class="icon-edit text-xl text-gray hover:text-green transition-300"
        @click="$emit('edit')"
      />
      <button
        class="icon-trash text-xl text-gray hover:text-red transition-300 -mt-0.5"
        @click="$emit('remove')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  question: any;
  index: number;
}

const props = defineProps<Props>();

const answers = computed(() =>
  props.question.answers.filter((answer: any) => answer.isTrue)
);
</script>
