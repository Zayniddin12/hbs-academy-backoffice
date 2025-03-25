<template>
  <div class="bg-white rounded-xl p-4">
    <CTestSpentTime :time="time ?? 0" />
    <CTestMap
      v-bind="{ questions, current, values, answered }"
      class="mt-4"
      @map-change="$emit('map-change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import CTestMap from "@/modules/Assignments/components/Test/CTestMap.vue";
import CTestSpentTime from "@/modules/Assignments/components/Test/CTestSpentTime.vue";

interface Props {
  questions: any[];
  values: any;
  current?: number;
  count?: number;
  answered?: boolean;
  time?: number;
}

defineProps<Props>();
</script>
