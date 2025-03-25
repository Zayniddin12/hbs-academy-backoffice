<template>
  <div class="relative h-[114px] p-6 rounded-xl bg-white">
    <div class="flex mb-3 gap-3">
      <div>
        <img
          :src="card.icon"
          alt="stats icon"
          class="absolute left-1 top-[7px]"
        />
      </div>
      <h4
        class="text-2xl mt-1 leading-130 font-bold text-dark-100 ml-10 truncate"
      >
        {{ changeNumberFormat(card.value) }}
        <span v-if="isBall" class="font-normal text-gray-700"> / 100 </span>
      </h4>
    </div>
    <h5 class="mt-2 text-sm leading-130 text-gray-700">
      {{ t(card.title) }}
    </h5>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { changeNumberFormat } from "../../utils/changeNumberFormat";

interface Props {
  card: {
    icon: string;
    title: string;
    value: number;
  };
  isBall: boolean;
}
defineProps<Props>();

const { t } = useI18n();
</script>
>
