<template>
  <p
    class="px-2 py-1.5 rounded-md text-xs leading-normal font-normal w-max"
    :class="classRole"
  >
    {{ $t(role) }}
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  role: "mentor" | "curator" | "manager";
}

const props = defineProps<Props>();

const classRole = computed(() => {
  switch (props.role) {
    case "mentor":
      return "bg-yellow-100 text-yellow";
    case "curator":
      return "bg-green-100 text-green";
    case "manager":
      return "bg-gray-800 text-dark-100";
    default:
      return "bg-yellow-100 text-yellow";
  }
});
</script>

<style scoped></style>
