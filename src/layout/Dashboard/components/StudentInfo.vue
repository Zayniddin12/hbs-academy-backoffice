<template>
  <Transition name="fade" mode="out-in">
    <div
      v-if="route.query.studentId"
      class="flex items-center justify-between gap-6 px-3 py-4 rounded-xl bg-white shadow-md fixed right-4 bottom-4 z-50"
    >
      <div class="flex-y-center gap-2">
        <CAvatar
          :image="studentDetail.avatar"
          class="!w-[30px] !h-[30px] rounded-lg"
        />
        <p class="text-xs leading-normal font-normal text-dark-100">
          {{ studentDetail.full_name }}
        </p>
      </div>
      <button
        class="text-xl w-7 h-7 text-dark shrink-0 flex-center transition-300 hover:text-red hover:bg-transparent active:scale-95 z-40"
        @click="close"
      >
        <span class="icon-close" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useStudentsStore } from "@/modules/Students/store";
import { computed, watch } from "vue";
import CAvatar from "@/components/CAvatar.vue";

const route = useRoute();
const router = useRouter();

const store = useStudentsStore();
const studentDetail = computed(() => store.student);

watch(
  () => route.query.studentId,
  () => {
    if (route.query.studentId) {
      store.fetchStudent(route.query.studentId);
    }
  },
  { deep: true, immediate: true }
);
const close = () => {
  router.push({ path: route.path, query: {} });
};
</script>

<style scoped></style>
