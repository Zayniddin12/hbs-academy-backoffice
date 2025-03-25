<template>
  <div class="flex-y-center gap-3">
    <CAvatar
      :image="card?.photo"
      class="!rounded-lg bg-green-100 before:!rounded-lg"
    />
    <RouterLink
      :to="{ name: routeName, params, query: { ...$route.query } }"
      class="text-sm leading-130 font-medium text-dark-100 transition-300 hover:!text-green"
    >
      <Highlighter
        class="text-sm leading-130 text-dark transition-300 hover:!text-green"
        highlight-class-name="bg-[#FFCD55] rounded p-0.5"
        :search-words="[$route.query?.search ?? '']"
        :text-to-highlight="card?.title"
      />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import CAvatar from "@/components/CAvatar.vue";
import Highlighter from "vue-highlight-words";
interface Props {
  card: {
    title: string;
    description: string;
    photo: string;
  };
  routeName: string;
  params: {
    [key: string]: string | number;
  };
}

withDefaults(defineProps<Props>(), {
  routeName: "StudentsCourseSingle",
  params: () => {
    return {
      courseId: 1,
    };
  },
});
</script>
