<template>
  <div class="p-6 bg-white rounded-xl">
    <p class="text-base leading-normal font-medium text-gray mb-4">
      {{ $t("question") }} {{ current }}/{{ count }}
    </p>
    <Transition name="fade" mode="out-in">
      <div :key="current">
        <slot />
      </div>
    </Transition>

    <div class="flex-center-between gap-10 mt-8">
      <CButton
        class="min-w-[240px] h-11 flex-center"
        variant="secondary"
        :text="$t('back')"
        icon="icon-arrow-right text-xl rotate-180"
        icon-position="left"
        @click="$emit('back')"
        :disabled="current === 1"
        v-if="count !== 1"
      />
      <CButton
        class="min-w-[240px] h-11 flex-center"
        :text="$t('next')"
        icon="icon-arrow-right text-xl "
        @click="$emit('next')"
        v-bind="{ loading }"
        v-if="current !== count"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from "@/components/Common/CButton.vue";

interface Props {
  count?: number;
  current?: number;
  loading?: boolean;
}

defineProps<Props>();
</script>
