<template>
  <CCard class="px-0 flex-shrink-0">
    <h4 class="text-xl text-dark font-semibold px-6 pt-6">
      {{ $t("dashboard.charts.course_title") }}
    </h4>

    <div
      v-if="checkChartData"
      class="flex justify-center overflow-hidden w-full !max-h-[120px] epx-6 mb-4"
    >
      <div class="relative">
        <div class="relative max-w-[300px] mx-auto gender-chart mb-5">
          <!--          <ApexCharts-->
          <!--            v-if="series.length > 0"-->
          <!--            :options="options"-->
          <!--            :series="series"-->
          <!--            type="donut"-->
          <!--          />-->
          <Doughnut
            :data="chart_data"
            :options="chart_options"
            class="!h-[100px]"
          />
        </div>
        <div
          class="absolute z-100 bottom-1 left-1/2 -translate-x-1/2 text-center"
        >
          <h3 class="mb-1 text-sm text-gray !leading-normal">
            {{ $t("dashboard.charts.students") }}
          </h3>
          <p
            class="font-medium text-base text-dark-100 text-center leading-130"
          >
            {{ changeNumberFormat(data.students_count) }}
          </p>
        </div>
      </div>
    </div>

    <hr class="w-full h-[1px] bg-gray-300 mb-2" />

    <div v-if="checkChartData" class="px-6">
      <div
        v-for="(el, i) of courseContent"
        :key="i"
        class="custom-border flex items-center space-x-3 py-2 last:border-none border-b-[1px] border-gray-300"
      >
        <div class="w-3 h-3 rounded" :class="el?.color" />
        <div>
          <p class="mb-1 text-gray text-sm font-normal leading-normal">
            {{ $t(el?.name) }}
          </p>
          <p class="text-base text-dark-100 font-medium leading-130">
            <span>{{ formatMoneyDecimal(el?.count) + " " }}</span>
            <span>({{ Math.floor(el?.percentage) }}% )</span>
          </p>
        </div>
      </div>
    </div>
    <CNodata
      v-else
      :subtitle="$t('chart_courses_statistics_subtitle')"
      :title="$t('no_courses')"
      class="mt-8 px-6 !py-10"
      image="/images/svg/no-data/2.svg"
    />
  </CCard>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import { Doughnut } from "vue-chartjs";

import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import CCard from "@/components/Card/CCard.vue";
import { formatMoneyDecimal } from "@/utils";
import { ICourseStatistics } from "@/types/components/chart";
import { changeNumberFormat } from "../../utils/changeNumberFormat";
import { useDashboardStore } from "@/modules/Dashboard/store";
import CNodata from "@/components/Common/CNodata.vue";

interface Props {
  disabled?: boolean;
  data: ICourseStatistics[];
}

const props = defineProps<Props>();

const { t } = useI18n();
const store = useDashboardStore();
const series = computed(() =>
  data.value?.popular_courses?.map((el) => el?.percentage)
);

const data = computed(() => store.data);

const chart_data = ref({
  type: "doughnut",
  line: {
    backgroundColor: "red",
  },
  backgroundColor: "#F55152",
  datasets: [
    {
      backgroundColor: ["#38CFFF", "#3888FF", "#CBCBCB"],
      data: series.value,
      cutout: "80%",
      circumference: 180,
      rotation: 270,
      borderColor: "transparent",
      borderRadius: 30,
      spacing: 0,
      offset: 0,
    },
  ],
});

const chart_options = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
  };
});
const colors = ["bg-[#38CFFF]", "bg-[#3888FF]", "bg-[#CBCBCB]"];
const courseContent = computed(() => {
  return data.value?.popular_courses?.map((el, index) => {
    return {
      name: el?.course_title,
      count: el?.students_count,
      percentage: el?.percentage,
      color: colors[index],
    };
  });
});

const checkChartData = computed(() => {
  return props.data[0]?.count > 0 || props.data[1]?.count > 0;
});
</script>
<style>
.gender-chart > * {
  width: 300px !important;
}
</style>
