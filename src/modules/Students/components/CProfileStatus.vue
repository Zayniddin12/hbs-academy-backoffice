<template>
  <p
    v-if="status"
    class="px-5 py-1.5 rounded-md w-max text-xs leading-normal"
    :class="classStatus"
  >
    {{ status }} | {{ dayjs(dateJoined).fromNow() }}
  </p>
  <p
    v-else
    class="px-5 py-1.5 rounded-md w-max text-xs leading-normal"
    :class="getRoleStyle(role)"
  >
    {{ $t(role) }}
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { WorkersRole } from "@/modules/Colleagues/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

interface Props {
  status?: "online" | "offline" | "block";
  role?: WorkersRole;
  dateJoined?: string;
}

const props = defineProps<Props>();

dayjs.extend(relativeTime);

const classStatus = computed(() => {
  if (props.status === "online") {
    return "text-green-500 bg-green-100";
  } else if (props.status === "offline") {
    return "bg-gray-800 text-dark-100";
  } else {
    return "text-yellow-500";
  }
});

const getRoleStyle = (role: string | undefined) => {
  if (role === "manager") return "text-dark-100 bg-gray-800";
  if (role === "teacher") return "text-green bg-green-100";
  return "text-yellow bg-yellow-100";
};
</script>
