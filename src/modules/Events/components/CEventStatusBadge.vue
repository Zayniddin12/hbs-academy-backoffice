<template>
  <p
    class="text-xs leading-normal font-medium flex-y-center gap-1"
    :class="statusClass?.class"
  >
    <span class="text-base !leading-[16px]" :class="statusClass?.icon" />
    <span class="!leading-[16px]">{{ $t(status) }}</span>
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  status:
    | "conducted"
    | "canceled"
    | "completed"
    | "pending"
    | "held"
    | "not_set"
    | "on_going"
    | "present"
    | "absent";
}

const props = defineProps<Props>();

const statusClass = computed(() => {
  if (
    props.status === "conducted" ||
    props.status === "present" ||
    props.status === "completed"
  ) {
    return {
      class: "text-green",
      icon: "icon-tick-circle",
    };
  } else if (props.status === "pending") {
    return {
      class: "text-blue-100",
      icon: "icon-calendar",
    };
  } else if (props.status === "held" || props.status === "on_going") {
    return {
      class: "text-[#FF4DE1]",
      icon: "icon-internet",
    };
  } else if (props.status === "not_set") {
    return {
      class: "text-gray",
      icon: "icon-info-circle",
    };
  } else {
    return {
      class: "text-red",
      icon: "icon-forbidden",
    };
  }
});
</script>

<style scoped></style>
