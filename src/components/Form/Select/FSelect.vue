<template>
  <div class="relative" ref="select">
    <!-- SELECTED OPTION -->
    <div
      class="transition-200 px-3 h-10 py-[9px] bg-gray-100 transition-all duration-300 border border-transparent cursor-pointer flex items-center justify-between rounded-lg"
      tabindex="1"
      :class="[
        selectedOptionStyles,
        error ? '!border-red bg-red-100' : '',
        { 'focus-within:border-gray-100': disabled },
        headStyles,
      ]"
      @click="toggleSelect(true)"
    >
      <slot name="selectedOption" :value="value">
        <p
          tabindex="1"
          v-if="!value"
          class="text-dark-100 select-none text-sm leading-140"
          :class="{ '!text-gray': disabled }"
        >
          {{ placeholder }}
        </p>
        <p
          v-else
          class="select-none text-sm text-dark-100 leading-140 line-clamp-1"
          tabindex="1"
          :class="[{ '!text-gray': disabled }, selectedStyles]"
        >
          {{ value[labelKey] || value }}
        </p>

        <slot name="chevron">
          <span
            class="icon-chevron-down flex-center h-4 transition-200 text-base text-gray-700 inline-block shrink-0"
            :class="{ '!rotate-180': showOptions }"
          >
          </span>
        </slot>
      </slot>
    </div>
    <!-- OPTIONS -->
    <Transition name="fade">
      <ul
        v-if="showOptions && !disabled"
        :key="showOptions"
        :class="fromTop ? 'bottom-[65px]' : 'top-full'"
        class="absolute p-2 w-full bg-white border border-white-100 z-[3] translate-y-3 overflow-y-auto max-h-[300px] text-white rounded-md shadow-select"
      >
        <slot name="options">
          <li class="p-2 text-black text-center" v-if="options.length === 0">
            {{ $t("no_result") }}
          </li>
          <li
            v-for="(option, idx) in options"
            :key="idx"
            class="transition-300 cursor-pointer rounded hover:bg-green-100"
            @click="onSelect(option)"
            :class="{ 'rounded bg-gray-800': isActive(option) }"
          >
            <slot name="option" :option="option" :index="idx">
              <p class="flex-y-center justify-between py-2 px-3">
                <span class="text-dark text-[13px]">
                  {{ option[labelKey] }}
                </span>
                <i
                  v-if="isActive(option) && activeIcon"
                  class="icon-tick-square text-sm text-green"
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
import FInput from "@/components/Form/Input/FInput.vue";
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
  activeIcon?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  labelKey: "name",
  valueKey: "id",
  options: [] as TOption[], // Ensure options is always an array
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
  return props.options?.find(
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
  if (distanceToBottom < threshold) {
    fromTop.value = true;
  } else {
    fromTop.value = false;
  }
}
onMounted(() => {
  nextTick(() => {
    checkTop();
  });
});
</script>
