<template>
  <div class="p-5">
    <i
      @click="$emit('close')"
      class="icon-close text-xl text-gray-400 hover:text-red transition-300 absolute top-5 right-5 cursor-pointer"
    />
    <img
      src="/images/svg/no-data/error-delete.svg"
      alt="error"
      class="mx-auto"
    />

    <div class="mt-8 text-center">
      <p class="text-[28px] leading-130 font-semibold text-dark">
        {{ $t("too_many_requests") }}
      </p>
      <p class="mt-4 text-sm leading-normal font-normal text-gray">
        {{ $t("too_many_requests_subtitle", { minute: timer }) }}
      </p>
    </div>
    <div class="mt-7">
      <a
        href="tel:+998712007007"
        class="p-2 pr-3 flex-center gap-2 bg-gray-800 rounded-full mx-auto hover:bg-green-200"
      >
        <i class="icon-phone text-xl text-dark-100" />
        <p class="text-dark-100 text-base leading-130 font-medium text-center">
          {{ formatPhoneNumber("+998712007007") }}
        </p>
      </a>
      <p class="mt-2 text-xs leading-normal text-gray-700 text-center">
        {{ $t("support_phone") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPhoneNumber } from "@/utils";
import { convertSecondsToHMS } from "@/utils/changeNumberFormat";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
interface Props {
  time: number;
}
const props = defineProps<Props>();
const { t } = useI18n();
const timer = computed(() => {
  const obj = convertSecondsToHMS(props.time);
  if (obj.hours) {
    return `${obj.hours} ${t("hours")}`;
  } else if (obj.minutes) {
    return `${obj.minutes} ${t("minutes")}`;
  } else {
    return `${obj.seconds} ${t("seconds")}`;
  }
});
</script>

<style scoped></style>
