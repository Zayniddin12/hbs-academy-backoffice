<template>
  <p
    class="flex-y-center gap-1 text-xs leading-normal font-medium"
    :class="typeClass?.class"
  >
    <i :class="typeClass?.icon" class="text-base" />{{
      $t(`${type}_assignment`)
    }}
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  type: "test" | "writing" | "file";
}

const props = defineProps<Props>();

const typeClass = computed(() => {
  if (props.type === "test") {
    return {
      icon: "icon-task-square ",
      class: "text-yellow",
    };
  } else if (props.type === "writing") {
    return {
      icon: "icon-text-assignment",
      class: "text-[#FD7759]",
    };
  } else {
    return {
      icon: "icon-file-assignment",
      class: "text-blue-100",
    };
  }
});
</script>
