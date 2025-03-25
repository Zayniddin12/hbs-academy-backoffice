<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <CCommonHeader no-hr title="Title" no-image no-Tabs class="relative">
    <template #title>
      <div class="flex items-center gap-2">
        <h3 class="text-dark-100 font-semibold leading-130">
          {{ assignmentFlowsId?.group?.title }}
        </h3>
        <RouterLink
          :to="`/courses/${assignmentFlowsId.group?.course_id}/flows`"
          class="text-[#16CC53] bg-green-100 text-[13px] py-0.5 px-2.5 rounded-md font-semibold flex items-center gap-1"
        >
          {{ $t("go_to_group") }}
          <i class="icon-export text-[#16CC53]"></i>
        </RouterLink>
      </div>
    </template>
    <template #details>
      <div></div>
    </template>
    <template #content>
      <div class="w-full p-5 pt-0 -mt-1">
        <!--                <CTabFull-->
        <!--                  :list="listTab"-->
        <!--                  class="mb-4"-->
        <!--                  v-model="tab"-->
        <!--                  active-items-class="font-medium"-->
        <!--                  item-class="min-w-[162px]"-->
        <!--                />-->
        <RouterView />
      </div>
    </template>
  </CCommonHeader>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CTabFull from "@/components/Tab/CTabFull.vue";
import { useAssignmentStore } from "@/modules/Assignments/store";

const router = useRouter();

const store2 = useAssignmentStore();
const route = useRoute();
const { t } = useI18n();
const { mounted } = useMounted();
const tab = ref(route.name || "AssignmentMentorMentorsSingle");

const assignmentFlowsId = computed(() => store2.studentAssignmentMentorList);
store2.fetchCourseAssignmentMentorSingle(String(route.params?.id));

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
    name: t("lessons"),
    route: "/",
  },
]);

const listTab = [
  {
    label: t("lessons"),
    value: "AssignmentMentorMentorsSingle",
  },
  {
    label: t("assignments"),
    value: "AssignmentMentorMentorsSingleAssignments",
  },
];

watch(
  () => tab.value,
  () => {
    router.push({ name: tab.value });
  }
);
</script>
