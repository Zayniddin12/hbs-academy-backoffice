<template>
  <span
    class="p-1 rounded-md text-sm text-center inline-flex items-center gap-1"
    :class="badgeStyle"
  >
    <i v-if="iconName" :class="`${iconName} text-base leading-4`" />
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import { IColors } from "@/types/components/badge";
import { computed } from "vue";

interface Props {
  status: string;
  color: IColors;
  size: "sm" | "md";
  iconName?: string;
}
const props = withDefaults(defineProps<Props>(), {
  color: "green",
  status: "Badge",
  size: "md",
});

const badgeColor = computed(() => {
  switch (props.color) {
    case "green":
      return "bg-green-400 text-green-100";
    case "red":
      return "bg-red-300 text-red";
    case "yellow":
      return "bg-yellow-100/12 text-yellow-100";
    case "blue":
      return "bg-blue-50 text-blue";
    case "gray":
      return "bg-blue-800/8 text-blue-800";
    default:
      return "default";
  }
});

const badgeStyle = computed(() => {
  return `${props.size === "md" ? "p-2" : "p-1"} ${badgeColor.value}`;
});
</script>
