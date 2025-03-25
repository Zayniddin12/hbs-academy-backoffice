<template>
  <slot>
    <div
      v-if="items && Object.keys(items).length > 0"
      :class="wrapperClass"
      class="grid grid-cols-2 gap-x-4 gap-y-5"
    >
      <FCheckbox
        class="relative aspect-video overflow-hidden rounded-xl"
        :checked="item?.is_correct"
        v-for="(item, index) in items"
        :key="index"
        :label="item[labelKey]"
        :value="item[valueKey]"
        :disabled="answered"
        :name="name"
        @change="onChange($event, item[valueKey])"
        :class="[
          { 'pointer-events-none': answered },
          {
            '!bg-white !border-green border':
              modelValue?.answers?.includes(item[valueKey]) && !answered,
          },
          {
            '!bg-white !border-green border':
              answered &&
              modelValue?.answers?.includes(item[valueKey]) &&
              item?.is_correct,
          },
          {
            '!bg-white !border-red border':
              answered &&
              modelValue?.answers?.includes(item[valueKey]) &&
              !item?.is_correct,
          },
          {
            'pointer-events-none': answered,
          },
        ]"
      >
        <template #label>
          <div
            class="w-8 h-8 rounded-br-lg bg-dark/50 border border-white/[36%] flex-center transition-300 absolute -top-px -left-px z-10"
            :class="[
              {
                '!bg-green':
                  modelValue?.answers?.includes(item[valueKey]) && !answered,
              },
              {
                '!bg-green':
                  modelValue?.answers?.includes(item[valueKey]) &&
                  answered &&
                  item?.is_correct,
              },
              {
                '!bg-red':
                  modelValue?.answers?.includes(item[valueKey]) &&
                  answered &&
                  !item?.is_correct,
              },
            ]"
          >
            <p
              class="text-base leading-130 font-semibold text-white uppercase transition-300"
              :class="[
                {
                  '!text-white':
                    modelValue?.answers?.includes(item[valueKey]) && !answered,
                },
                {
                  '!text-white':
                    modelValue?.answers?.includes(item[valueKey]) &&
                    answered &&
                    item?.is_correct,
                },
                {
                  '!text-white':
                    modelValue?.answers?.includes(item[valueKey]) &&
                    answered &&
                    !item?.is_correct,
                },
              ]"
            >
              {{ answerValues[index] }}
            </p>
          </div>

          <img
            :src="item?.photo"
            class="absolute w-full h-full inset-0 user-select-none pointer-events-none"
            alt="test"
          />
        </template>
        <template v-if="answered" #value>
          <svg
            v-if="!item?.is_correct"
            class="!absolute top-2 right-2 mr-0 z-10"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.9993 2.6665C8.65268 2.6665 2.66602 8.65317 2.66602 15.9998C2.66602 23.3465 8.65268 29.3332 15.9993 29.3332C23.346 29.3332 29.3327 23.3465 29.3327 15.9998C29.3327 8.65317 23.346 2.6665 15.9993 2.6665Z"
              fill="white"
            />
            <path
              d="M15.9993 2.6665C8.65268 2.6665 2.66602 8.65317 2.66602 15.9998C2.66602 23.3465 8.65268 29.3332 15.9993 29.3332C23.346 29.3332 29.3327 23.3465 29.3327 15.9998C29.3327 8.65317 23.346 2.6665 15.9993 2.6665ZM20.4793 19.0665C20.866 19.4532 20.866 20.0932 20.4793 20.4798C20.2793 20.6798 20.026 20.7732 19.7727 20.7732C19.5194 20.7732 19.266 20.6798 19.066 20.4798L15.9993 17.4132L12.9327 20.4798C12.7327 20.6798 12.4793 20.7732 12.226 20.7732C11.9727 20.7732 11.7193 20.6798 11.5194 20.4798C11.1327 20.0932 11.1327 19.4532 11.5194 19.0665L14.586 15.9998L11.5194 12.9332C11.1327 12.5465 11.1327 11.9065 11.5194 11.5198C11.906 11.1332 12.546 11.1332 12.9327 11.5198L15.9993 14.5865L19.066 11.5198C19.4527 11.1332 20.0927 11.1332 20.4793 11.5198C20.866 11.9065 20.866 12.5465 20.4793 12.9332L17.4127 15.9998L20.4793 19.0665Z"
              fill="#E62E30"
            />
          </svg>
          <svg
            v-if="item?.is_correct"
            class="!absolute top-2 right-2 mr-0 z-10"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.9993 2.6665C8.65268 2.6665 2.66602 8.65317 2.66602 15.9998C2.66602 23.3465 8.65268 29.3332 15.9993 29.3332C23.346 29.3332 29.3327 23.3465 29.3327 15.9998C29.3327 8.65317 23.346 2.6665 15.9993 2.6665Z"
              fill="white"
            />
            <path
              d="M15.9993 2.6665C8.65268 2.6665 2.66602 8.65317 2.66602 15.9998C2.66602 23.3465 8.65268 29.3332 15.9993 29.3332C23.346 29.3332 29.3327 23.3465 29.3327 15.9998C29.3327 8.65317 23.346 2.6665 15.9993 2.6665ZM22.3727 12.9332L14.8127 20.4932C14.626 20.6798 14.3727 20.7865 14.106 20.7865C13.8393 20.7865 13.586 20.6798 13.3993 20.4932L9.62602 16.7198C9.23935 16.3332 9.23935 15.6932 9.62602 15.3065C10.0127 14.9198 10.6527 14.9198 11.0393 15.3065L14.106 18.3732L20.9594 11.5198C21.346 11.1332 21.986 11.1332 22.3727 11.5198C22.7593 11.9065 22.7593 12.5332 22.3727 12.9332Z"
              fill="#16CC53"
            />
          </svg>
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
  labelKey: "name",
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
  //   values.value.push(itemValue);
  // } else {
  //   values.value = values.value.filter((item) => item !== itemValue);
  // }
  // emit("update:modelValue", values.value);
}
</script>
