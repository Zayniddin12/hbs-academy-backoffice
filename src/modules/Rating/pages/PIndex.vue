<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div></div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";

const { t } = useI18n();
const { mounted } = useMounted();

const routes = computed(() => [
  {
    name: t("dashboard"),
    route: "/",
  },
  {
    name: t("students"),
    route: "/",
  },
]);
</script>
