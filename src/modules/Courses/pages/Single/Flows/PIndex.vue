<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <RouterView />
  </div>
</template>
<script setup lang="ts">
import { useMounted } from "@/composables/useMounted";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useCoursesStore } from "@/modules/Courses/store";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { mounted } = useMounted();
const { t } = useI18n();
const store = useCoursesStore();
const single = computed(() => store.courseSingle);

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("courses"),
    route: "/courses",
  },
  {
    name: single.value?.title,
    route: "/",
  },
]);
</script>
