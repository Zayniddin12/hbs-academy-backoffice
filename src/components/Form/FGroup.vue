<template>
  <div class="flex flex-col gap-2 w-full">
    <div class="flex-center-between w-full" :class="wrapperClass">
      <Label v-bind="{ forText, label }" />
      <slot name="labelOpposite" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import Label from "@/components/Form/FLabel.vue";

interface Props {
  label: string;
  isRightLabel?: boolean;
  rightLabel?: boolean;
  tooltip?: boolean;
  tooltipText?: string;
  forText?: string;
  wrapperClass?: string;
}

withDefaults(defineProps<Props>(), {
  label: "",
  rightLabel: false,
});
</script>
