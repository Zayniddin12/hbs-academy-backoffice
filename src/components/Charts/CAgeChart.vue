<template>
  <CCard class="flex-shrink-0 h-full">
    <h4 class="text-xl text-dark font-semibold px-6 pt-6 mb-5">
      {{ $t("dashboard.charts.sort_title") }}
    </h4>

    <div v-if="data?.length">
      <div class="flex px-6">
        <div
          v-for="(item, index) in data"
          :key="index"
          :class="{ 'mr-[3px]': item?.amount }"
          :style="{
            backgroundColor: item?.color,
            width: getPercent(item?.amount) + '%',
          }"
          class="h-10 rounded-sm mb-4 p-6"
        ></div>
      </div>
      <hr class="w-full h-[1px] bg-gray-300 mb-2" />
      <div
        v-for="(item, index) in data"
        :key="index"
        :class="{ 'border-b': index !== data.length - 1 }"
        class="h-[56px] grid items-center border-gray-300 relative mx-6"
      >
        <div class="flex items-center gap-2">
          <div class="absolute -top-2 -left-5">
            <img :src="item.image" :alt="item.label + ' image'" />
          </div>

          <div class="ml-12">
            <h5
              class="mb-1 text-sm !leading-normal text-dark-100 font-semibold truncate"
            >
              {{ changeNumberFormat(item.amount) }}
            </h5>
            <p class="text-gray text-xs !leading-normal font-normal">
              {{ $t(item?.label) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <CNodata
      v-else
      :subtitle="$t('no_data_stats_text')"
      :title="$t('no_data')"
      class="mt-8 px-6 !py-10"
      image="/images/svg/no-data/42.svg"
    />
  </CCard>
</template>
<script lang="ts" setup>
import { computed } from "vue";

import CCard from "@/components/Card/CCard.vue";

import { formatMoneyDecimal } from "@/utils";
import { IBarChartData } from "@/types/components/chart";
import { changeNumberFormat } from "../../utils/changeNumberFormat";
import CNodata from "@/components/Common/CNodata.vue";

interface Props {
  data: IBarChartData[];
  disabled?: boolean;
  check?: boolean;
}

const props = defineProps<Props>();

const total = computed(() => {
  return props.data.reduce((acc, item) => acc + item.amount, 0);
});

function getPercent(amount: number) {
  return ((amount / total?.value) * 100).toFixed(2);
}
</script>
<style>
.grid-cols-1-max-1 {
  grid-template-columns: 1fr max-content 1fr;
}
</style>
