<template>
  <div
    class="main-tab space-x-5 relative bg-white/12 flex w-max transition-all duration-200 border-b border-solid border-gray-300 dark:border-gray-300/10"
  >
    <div
      :class="activeClass"
      :style="{ width: `${active.width}`, left: `${active.left}px` }"
      class="absolute h-[2px] bg-green w-full -bottom-px transition-all duration-200"
    ></div>
    <button
      v-for="(tab, idx) in list"
      :id="`item_${tab.value}`"
      :key="idx"
      :class="[
        itemClass,
        localeValue === tab.value
          ? activeItemsClass
          : 'text-gray-700 hover:text-gray',
      ]"
      class="py-4 transition-all duration-200 w-max text-base z-10 font-medium"
      @click="pick(tab.value, $event)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ITabItem } from "@/components/Tab/CTab.types";

interface Props {
  modelValue: string | number;
  list: ITabItem[];
  itemClass?: string;
  activeClass?: string;
  activeItemsClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "complain",
  activeItemsClass: "text-green hover:text-green-500",
  list: () => [
    {
      label: "О себе",
      value: "ProductReview",
    },
    {
      label: "Статьи",
      value: "ProductReview2",
    },
    {
      label: "Социальные сети",
      value: "ProductReview3",
    },
  ],
});

interface Emits {
  (e: "update:modelValue", value: string | number): void;
}
const emit = defineEmits<Emits>();

const localeValue = ref(props?.modelValue);

const active = ref({ left: 0, width: "0px" });
const pick = (tab: string | number, e?: { target: HTMLButtonElement }) => {
  const target = e.target as HTMLButtonElement;
  active.value = {
    left: target?.offsetLeft,
    width: target?.offsetWidth + "px",
  };
  localeValue.value = tab;
  emit("update:modelValue", tab);
};

onMounted(() => {
  const item = document.getElementById(
    `item_${props.modelValue}`
  ) as HTMLButtonElement;
  setTimeout(() => {
    pick(props.modelValue, { target: item });
  }, 10);
});
</script>
