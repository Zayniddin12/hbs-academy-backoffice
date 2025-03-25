<template>
  <div class="relative p-1 bg-[#F5F6F7] rounded-lg flex overflow-hidden w-max">
    <div
      :class="activeClass"
      class="absolute h-[calc(100%_-_8px)] rounded bg-white tab-shadow -translate-y-1/2 top-1/2 transition-all duration-300"
      :style="{ width: `${active.width}px`, left: `${active.left}px` }"
    ></div>
    <button
      v-for="(tab, idx) in list"
      :id="`item_${tab.value}`"
      :key="idx"
      class="p-2 rounded-sm transition-300 text-sm z-10 text-dark-100 px-9 flex-center gap-2"
      :class="[itemClass, modelValue === tab.value ? activeItemsClass : '']"
      @click="pick(tab.value, $event)"
    >
      <i v-if="tab.icon?.length" :class="tab.icon" class="text-xl" />
      {{ tab.label }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";

interface Tab {
  label: string;
  value: string | number;
  icon?: string;
}
interface Props {
  modelValue?: string | number;
  list: Tab[];
  itemClass?: string;
  activeClass?: string;
  activeItemsClass?: string;
}
const props = defineProps<Props>();

interface Emits {
  (e: "update:modelValue", value: string | number): void;
}
const $emit = defineEmits<Emits>();

// const active = ref({ left: 0, width: 0 });
const active = ref({ left: 0, width: 0 });
const pick = (tab: string | number, e?: { target: HTMLButtonElement }) => {
  const target = e.target as HTMLButtonElement;
  active.value = {
    left: target?.offsetLeft,
    width: target?.offsetWidth,
  };
  $emit("update:modelValue", tab);
};

watch(
  () => props.modelValue,
  () => {
    setTimeout(() => {
      const item = document.getElementById(
        `item_${props.modelValue}`
      ) as HTMLButtonElement;
      pick(props.modelValue, { target: item });
    }, 300);
  }
);

onMounted(() => {
  setTimeout(() => {
    const item = document.getElementById(
      `item_${props.modelValue}`
    ) as HTMLButtonElement;
    pick(props.modelValue, { target: item });
  }, 300);
});
</script>

<style scoped>
.tab-shadow {
  box-shadow: 0px 4px 8px 0px rgba(18, 28, 37, 0.1);
}
</style>
