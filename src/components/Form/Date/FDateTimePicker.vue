<template>
  <div class="c-date-picker relative">
    <VueDatePicker
      v-bind="{ range, yearRange, formatLocale }"
      :min-date="minDate"
      ref="datePicker"
      :disabled="disabled"
      :readonly="disabled"
      auto-apply
      :model-value="pickerValue"
      @update:modelValue="onChangeValue"
    >
      <template #dp-input>
        <FInput
          v-bind="{ error }"
          v-maska="inputMask"
          :model-value="value"
          :disabled="disabled"
          :placeholder="inputPlaceholder"
          @update:modelValue="value = $event"
          @blur="emit('blur')"
        />
      </template>
    </VueDatePicker>
    <div class="flex-center absolute-y right-0">
      <button
        :disabled="disabled"
        v-if="pickerValue"
        class="w-5 h-5 flex-center bg-gray/[16%] rounded-full p-1 transition-200 group hover:bg-red"
        @click="clearDateFilter"
      >
        <span
          class="icon-close text-gray text-[10px] transition-200 group-hover:text-white"
        />
      </button>

      <button class="flex-center group px-3" type="button" @click="toggleMenu">
        <i
          class="icon-calendar transition-200 text-[18px] text-gray-700 group group-hover:text-blue"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";

import VueDatePicker from "@vuepic/vue-datepicker";
import { enUS, ru, uz } from "date-fns/locale";
import dayjs from "dayjs";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import FInput from "@/components/Form/Input/FInput.vue";

interface Props {
  modelValue: string;
  error?: boolean;
  range?: boolean;
  minDate?: string;
  disabled?: boolean;
}
const props = defineProps<Props>();

interface Emits {
  (event: "blur"): void;
  (event: "update:modelValue", value: string): void;
}
const emit = defineEmits<Emits>();

const { locale, t } = useI18n();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const yearRange = [
  new Date().getFullYear() - 100,
  new Date().getFullYear() + 4,
];

const formatLocale = computed(() => {
  const locales = {
    uz: uz,
    ru: ru,
    en: enUS,
  };

  return locales[locale.value as keyof typeof locales];
});

const datePicker = ref();

const showMenu = ref(false);
const toggleMenu = () => {
  showMenu.value ? datePicker.value?.closeMenu() : datePicker.value?.openMenu();
  showMenu.value = !showMenu.value;
};

const inputMask = computed(() =>
  props.range ? "##.##.#### - ##.##.####" : "##.##.#### ##:##"
);

const inputPlaceholder = computed(() =>
  props.range ? `${t("dd_mm_yyyy")} - ${t("dd_mm_yyyy")}` : t("dd_mm_yyyy")
);
const clearDateFilter = () => {
  value.value = "";
};

const onChangeValue = (val: string) => {
  value.value = dayjs(val).format("YYYY-MM-DD HH:mm");
  showMenu.value = false;
};

const pickerValue = computed(() => {
  if (!props.modelValue) return undefined;

  if (props.range) {
    const [start, end] = props.modelValue.split(" - ");
    const formattedStart = dayjs(start?.split(".").reverse().join("-")).format(
      "YYYY-MM-DD"
    );
    const formattedEnd = dayjs(end.split(".").reverse().join("-")).format(
      "YYYY-MM-DD"
    );
    return [new Date(formattedStart), new Date(formattedEnd)];
  } else {
    return props.modelValue;
  }
});
watch(
  () => props?.modelValue,
  (val) => {
    if (val) {
      onChangeValue(val);
    }
  }
);
</script>

<style>
.c-date-picker .dp__overlay_container {
  height: 288px !important;
}

.c-date-picker .dp__input {
  padding: 8px 12px !important;
}

.c-date-picker .dp__input_wrap svg {
  display: none !important;
}
</style>
