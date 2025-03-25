<template>
  <div class="relative" ref="select">
    <!--  SELECTED OPTION  -->
    <div
      class="transition-200 px-3 h-10 py-[9px] bg-gray-100 transition-all duration-300 border border-transparent cursor-pointer flex items-center justify-between rounded-lg w-full"
      tabindex="1"
      :class="[
        selectedOptionStyles,
        error ? '!border-red bg-red-100' : '',
        { 'focus-within:border-gray-100': disabled },
        headStyles,
      ]"
      @click="toggleSelect(!showOptions)"
    >
      <slot name="selectedOption" :value="value">
        <p
          tabindex="1"
          class="text-dark-100 select-none text-sm leading-140 mr-4"
          :class="{ '!text-gray': disabled }"
        >
          {{ placeholder ?? $t("select") }}
        </p>
        <slot name="chevron">
          <div class="flex-y-center gap-1.5">
            <p
              v-if="value"
              class="font-normal select-none text-sm text-gray leading-140"
              tabindex="1"
              :class="[{ '!text-gray': disabled }, selectedStyles]"
            >
              {{ value[labelKey] || value }}
            </p>
            <span
              class="icon-chevron-down flex-center h-4 transition-200 text-base text-gray-700 inline-block shrink-0"
              :class="{ '!rotate-180': showOptions }"
            >
            </span>
          </div>
        </slot>
      </slot>
    </div>
    <!--  OPTIONS  -->
    <Transition name="fade">
      <ul
        v-if="showOptions && !disabled"
        :key="showOptions"
        :class="fromTop ? 'bottom-[65px]' : 'top-full'"
        class="absolute w-full bg-white border border-white-100 z-10 translate-y-3 overflow-hidden max-h-[300px] overflow-y-scroll text-white rounded-md shadow-select"
      >
        <slot name="options">
          <li
            v-for="(option, idx) in options"
            :key="idx"
            class="transition-300 cursor-pointer hover:bg-green-100"
            @click="onSelect(option)"
          >
            <slot name="option" :option="option" :index="idx">
              <p
                class="flex-y-center space-x-1.5 p-3"
                :class="{
                  'border-b border-white-100': idx !== options.length - 1,
                }"
              >
                <span
                  class="text-dark text-[13px]"
                  :class="{ 'font-medium': isActive(option) }"
                >
                  {{ option[labelKey] }}
                </span>
                <i
                  v-if="isActive(option)"
                  class="icon-tick text-base text-blue-100"
                ></i>
              </p>
            </slot>
          </li>
        </slot>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { nextTick, onMounted, ref, watch } from "vue";
import { TClassName } from "@/types/common";
type TOption = string | number | { [key: string]: string | number };

export interface Props {
  modelValue?: TOption;
  options: TOption[];
  labelKey: string;
  valueKey: string;
  placeholder?: string;
  selectedOptionStyles?: TClassName;
  selectedStyles?: TClassName;
  headStyles?: TClassName;
  dark?: boolean;
  error?: boolean;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  labelKey: "name",
  valueKey: "id",
});

const emit = defineEmits<{
  (e: "on-toggle", value: boolean): void;
  (e: "update:modelValue", value: boolean): void;
  (e: "load"): void;
  (e: "on-select", value: TOption): void;
}>();

const showOptions = ref(false);
const fromTop = ref(false);
function toggleSelect(newValue = showOptions.value) {
  showOptions.value = newValue;
  emit("on-toggle", showOptions.value);
}

function findOption(option: TOption) {
  return props.options.find(
    (o) => o === option || o[props.valueKey] === option
  );
}

const value = ref(findOption(props.modelValue));
function onSelect(option: TOption) {
  value.value = option;
  toggleSelect(false);
  emit("update:modelValue", option[props.valueKey] || option);
  emit("on-select", option);
}

const select = ref();
onClickOutside(select, () => toggleSelect(false));

function isActive(option: TOption) {
  return (
    option === value.value ||
    option[props.valueKey as keyof typeof option] === value.value ||
    (typeof value.value === "object" &&
      option[props.valueKey as keyof typeof option] ===
        value.value[props.valueKey])
  );
}

watch(
  () => props.modelValue,
  (newValue) => {
    value.value = findOption(newValue);
  },
  { immediate: true }
);
function checkTop() {
  const bounds = select.value.getBoundingClientRect();
  const distanceToBottom = window.innerHeight - bounds.bottom;
  const threshold = 300;
  fromTop.value = distanceToBottom < threshold;
}
onMounted(() => {
  nextTick(() => {
    checkTop();
  });
});
</script>
