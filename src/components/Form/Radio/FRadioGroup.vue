<template>
  <slot>
    <div v-if="items?.length" :class="wrapperClass">
      <Radio
        v-for="(item, index) in items"
        :key="index"
        v-bind="{ disabled }"
        v-model="activeRadio"
        :label="item[labelKey]"
        :value="item[valueKey]"
        :name="radioName"
        class="h-12"
        :class="[
          itemClass,
          {
            '!bg-white !border-green':
              activeRadio === item[valueKey] && !answered,
          },
          {
            '!bg-white !border-green':
              answered && activeRadio === item[valueKey] && item?.is_correct,
          },
          {
            '!bg-white !border-red':
              answered && activeRadio === item[valueKey] && !item?.is_correct,
          },
          {
            'pointer-events-none': answered,
          },
        ]"
        @click="activeRadio = !disabled ? item[valueKey] : modelValue"
      >
        <template #label>
          <div class="flex-y-center gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-gray-800 flex-center transition-300"
              :class="[
                {
                  '!bg-green': activeRadio === item[valueKey] && !answered,
                },
                {
                  '!bg-green/[12%]':
                    activeRadio === item[valueKey] &&
                    answered &&
                    item?.is_correct,
                },
                {
                  '!bg-red/[12%]':
                    activeRadio === item[valueKey] &&
                    answered &&
                    !item?.is_correct,
                },
              ]"
            >
              <p
                class="text-base leading-130 font-semibold text-gray-700 uppercase transition-300"
                :class="[
                  {
                    '!text-white': activeRadio === item[valueKey] && !answered,
                  },
                  {
                    '!text-green':
                      activeRadio === item[valueKey] &&
                      answered &&
                      item?.is_right,
                  },
                  {
                    '!text-red':
                      activeRadio === item[valueKey] &&
                      answered &&
                      !item?.is_right,
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
      </Radio>
    </div>
  </slot>
</template>

<script setup lang="ts">
import Radio from "@/components/Form/Radio/FRadio.vue";
import { ref, watch } from "vue";
interface Props {
  modelValue: string | number | object;
  items: Array<object>;
  labelKey?: string;
  valueKey?: string;
  wrapperClass?: string;
  disabled?: boolean;
  itemClass?: string;
  answered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  wrapperClass: "flex flex-wrap gap-4",
  labelKey: "name",
  valueKey: "id",
  disabled: false,
});

const activeRadio = ref(props.modelValue);
const answerValues = ref(["A", "B", "C", "D", "E", "F", "G"]);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | object): void;
}>();

const radioName = `k-radio-${Math.floor(Math.random() * 1000)}`;

const value = ref<string | number | object>([]);

watch(
  () => activeRadio.value,
  (newValue) => {
    if (newValue !== value.value) {
      value.value = newValue;
    }
    if (!props.disabled) {
      emit("update:modelValue", value.value);
    }
  }
);
</script>
