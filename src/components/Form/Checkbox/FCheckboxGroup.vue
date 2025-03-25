<template>
  <slot>
    <div v-if="items && Object.keys(items).length > 0" :class="wrapperClass">
      <FCheckbox
        class="w-full flex-row-reverse justify-between bg-gray-100 p-2 pr-3 rounded-xl h-12"
        v-for="(item, index) in items"
        :checked="item?.is_correct"
        :key="index"
        :label="item[labelKey]"
        :value="item[valueKey]"
        :disabled="answered"
        :name="name"
        :class="[
          { 'pointer-events-none': answered },
          {
            '!bg-white !border-green border':
              modelValue?.answers?.includes(item[valueKey]) && !answered,
          },
          {
            '!bg-white !border-green border':
              modelValue?.answers?.includes(item[valueKey]) &&
              answered &&
              item?.is_correct,
          },
          {
            '!bg-white !border-red border':
              modelValue?.answers?.includes(item[valueKey]) &&
              answered &&
              !item?.is_correct,
          },
          {
            'pointer-events-none': answered,
          },
        ]"
        @change="onChange($event, item[valueKey])"
      >
        <template #label>
          <div class="flex-y-center gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-gray-800 flex-center"
              :class="[
                {
                  '!bg-green':
                    modelValue?.answers?.includes(item[valueKey]) && !answered,
                },
                {
                  '!bg-green/[12%]':
                    modelValue?.answers?.includes(item[valueKey]) &&
                    answered &&
                    item?.is_correct,
                },
                {
                  '!bg-red/[12%]':
                    modelValue?.answers?.includes(item[valueKey]) &&
                    answered &&
                    !item?.is_correct,
                },
              ]"
            >
              <p
                class="text-base leading-130 font-semibold text-gray-700 uppercase"
                :class="[
                  {
                    '!text-white':
                      modelValue?.answers?.includes(item[valueKey]) &&
                      !answered,
                  },
                  {
                    '!text-green':
                      modelValue?.answers?.includes(item[valueKey]) &&
                      answered &&
                      item?.is_correct,
                  },
                  {
                    '!text-red':
                      modelValue?.answers?.includes(item[valueKey]) &&
                      answered &&
                      !item?.is_correct,
                  },
                ]"
              >
                {{ answerValues[index] }}
              </p>
            </div>
            <p
              v-if="labelKey === 'text'"
              class="text-base leading-130 font-medium text-dark"
            >
              {{ item[labelKey] }}
            </p>
            <div v-if="item?.photo" class="w-10 h-auto">
              <img :src="item?.photo" alt="image" />
            </div>
          </div>
        </template>
        <template v-if="answered" #value>
          <img
            v-if="item?.is_correct"
            src="/images/svg/tick-circle.svg"
            alt="incorrect"
          />
          <img v-else src="/images/svg/close-circle.svg" alt="incorrect" />
        </template>
      </FCheckbox>
    </div>
  </slot>
</template>

<script setup lang="ts">
import FCheckbox from "@/components/Form/Checkbox/FCheckbox.vue";
import { ref } from "vue";

interface Props {
  modelValue: string | number | object;
  items: object;
  labelKey?: string;
  valueKey?: string;
  wrapperClass?: string;
  name?: string;
  disabled?: boolean;
  answered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  wrapperClass: "flex flex-wrap gap-4",
  labelKey: "text",
  valueKey: "id",
  name: `k-checkbox-${Math.floor(Math.random() * 1000)}`,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | object): void;
}>();

const values = ref<any>(props.modelValue?.answers);
const answerValues = ref(["A", "B", "C", "D", "E", "F", "G"]);

function onChange(newValue: boolean, itemValue: number) {
  console.log(newValue);
  console.log(itemValue);
  // if (newValue) {
  //   values.value?.answers?.push(itemValue);
  // } else {
  //   values.value = values.value?.answers?.filter((item) => item !== itemValue);
  // }
  // emit("update:modelValue", values.value);
}
</script>
