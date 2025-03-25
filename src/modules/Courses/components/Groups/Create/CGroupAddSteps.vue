<template>
  <div class="bg-white p-6 rounded-xl">
    <div class="flex flex-col gap-2">
      <template v-for="(item, index) in steps" :key="index">
        <div class="flex-y-center gap-3">
          <div
            class="w-10 h-10 flex-center bg-gray-100 rounded-lg transition-300"
            :class="[
              { '!bg-green': step === item?.id },
              { '!bg-green-100': step > item?.id },
            ]"
          >
            <p
              class="text-gray-700 leading-5 text-base font-bold transition-300"
              :class="[
                { '!text-white': step === item?.id },
                { '!text-green': step > item?.id },
              ]"
            >
              {{ item?.id }}
            </p>
          </div>
          <div>
            <p
              class="text-sm leading-130 font-semibold text-gray-700 transition-300"
              :class="{ '!text-dark-100': step >= item?.id }"
            >
              {{ item?.title }}
            </p>
            <p class="text-xs leading-130 text-gray mt-0.5">
              {{ item?.subtitle }}
            </p>
          </div>
        </div>
        <div
          v-if="index !== steps?.length - 1"
          class="w-px h-5 bg-gray-100 ml-5 transition-300"
          :class="{ '!bg-green opacity-20': step >= item?.id }"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  step: number;
  steps: {
    title: string;
    subtitle: string;
    id: number;
  }[];
}

defineProps<Props>();
</script>
