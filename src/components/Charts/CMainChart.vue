<template>
  <div class="relative rounded-2xl bg-white">
    <div
      v-if="checkChartData"
      class="flex justify-center w-full !max-h-max mb-4"
    >
      <div class="relative">
        <div class="relative max-w-[500px] mx-auto gender-chart mb-5">
          <ApexCharts
            v-if="series.length > 0"
            :options="options"
            :series="series"
            type="donut"
          />
        </div>
        <div
          class="absolute z-100 bottom-1 left-1/2 -translate-x-1/2 text-center top-[31%]"
        >
          <h3 class="mb-1 text-sm text-gray !leading-normal">
            {{ $t("total") }}
          </h3>
          <p
            class="font-medium text-base text-dark-100 text-center leading-130"
          >
            {{ changeNumberFormat(data.students_count) }}
          </p>
        </div>
      </div>
    </div>
    <CNodata
      v-if="false"
      :subtitle="$t('chart_courses_statistics_subtitle')"
      :title="$t('no_courses')"
      class="mt-8 px-6 !py-10"
      image="/images/svg/no-data/2.svg"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import ApexCharts from "vue3-apexcharts";
import CCard from "@/components/Card/CCard.vue";
import { changeNumberFormat } from "@/utils/changeNumberFormat";
import { useDashboardStore } from "@/modules/Dashboard/store";
import CNodata from "@/components/Common/CNodata.vue";

const { t } = useI18n();
const store = useDashboardStore();

const data = computed(() => store.data);
const checkChartData = computed(() => data.value?.students_count > 0);

const options = reactive({
  chart: {
    animations: {
      enabled: true,
    },
    background: "#fff",
    foreColor: "#373D3F",
    fontFamily: "Roboto",
    height: 230,
    id: "n2gj4",
    toolbar: {
      show: false,
    },
    type: "donut",
    width: 296,
  },
  labels: [t("male"), t("female")],
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 270,
      borderRadius: 12,
      donut: {
        size: "80%",
        labels: {
          show: false,
          name: {
            show: true,
            fontSize: "16px",
            fontFamily: "Roboto",
            color: undefined,
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: "22px",
            fontFamily: "Roboto",
            color: undefined,
            offsetY: 16,
            formatter: function (val) {
              return val;
            },
          },
        },
      },
    },
  },
  colors: ["#38CFFF", "#FF4560"],
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val + "%";
    },
  },
  legend: {
    show: true,
    position: "bottom",
    labels: {
      colors: "#373D3F",
      useSeriesColors: false,
    },
  },
  tooltip: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 1,
  },
  xaxis: {
    labels: {
      trim: true,
    },
    crosshairs: {
      show: false,
    },
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
  },
});

const series = computed(() => [78, 22]); // Example data, replace with actual data
</script>

<style>
.gender-chart > * {
  width: 500px !important;
}
</style>
