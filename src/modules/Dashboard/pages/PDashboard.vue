<template>
  <div>
    <Teleport v-if="mounted" to="#header-breadcrumbs">
      <SBreadcrumb v-bind="{ routes }" />
    </Teleport>
    <main class="grid gap-5 grid-cols-4" v-if="!loading">
      <div>
        <div class="grid grid-cols-1 gap-5 col-span-2">
          <CardStatistic
            v-for="(card, idx) in cards"
            :card="card"
            :key="idx"
            :is-ball="isExistBall(idx)"
          />
        </div>
      </div>

      <div class="grid gap-5">
        <CMainChart class="relative overflow-hidden" />
        <CMainChartStat :data="maleData" class="relative overflow-hidden" />
      </div>
      <CCourseChart :data="genderData" />
      <CAgeChart :data="chartData" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useMounted } from "@/composables/useMounted";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import CardStatistic from "@/components/Card/CardStatistic.vue";
import CMainChart from "@/components/Charts/CMainChart.vue";
import CMainChartStat from "@/components/Charts/CMainChartStat.vue";
import CAgeChart from "@/components/Charts/CAgeChart.vue";
import CCourseChart from "@/components/Charts/CCourseChart.vue";
import { useDashboardStore } from "@/modules/Dashboard/store";

const { mounted } = useMounted();
const { t } = useI18n();
const store = useDashboardStore();
const data = computed(() => store.data);
const loading = computed(() => store.loading);
const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
]);
const isExistBall = (id: number) => id === 4;

const cards = computed(() => {
  return [
    {
      icon: "/images/svg/user.svg",
      value: data.value.groups_count,
      title: "dashboard.card.title3",
    },
    {
      icon: "/images/svg/users-course.svg",
      value: data.value.courses_count,
      title: "dashboard.card.title4",
    },
    {
      icon: "/images/svg/users-ball.svg",
      value: data.value.average_student_mark,
      title: "dashboard.card.title5",
    },
    {
      icon: "/images/svg/users-staticts.svg",
      value: data.value.students_academic_performance,
      title: "dashboard.card.title6",
    },
  ];
});

const chartData = computed(() => {
  return [
    {
      label: "dashboard.charts.manager",
      color: "#59B8FD",
      amount: data.value.managers_count,
      image: "/images/svg/manager-chart.svg",
    },
    {
      label: "dashboard.charts.teacher",
      color: "#08D572",
      amount: data.value.teachers_count,
      image: "/images/svg/teacher-chart.svg",
    },
    {
      label: "dashboard.charts.leader",
      color: "#FD7659",
      amount: data.value.mentors_count,
      image: "/images/svg/leader-chart.svg",
    },
  ];
});

store.fetchMainData();

const genderData = computed(() => {
  return [
    { gender: "male", percentage: 30, count: 100 },
    { gender: "female", percentage: 50, count: 11230 },
    { gender: "mixed", percentage: 20, count: 100 },
  ];
});

const maleData = computed(() => {
  return [
    { gender: "male", percentage: 30, count: 100 },
    { gender: "female", percentage: 50, count: 11230 },
    { gender: "mixed", percentage: 20, count: 100 },
  ];
});

const mainData = computed(() => store.data);
</script>
