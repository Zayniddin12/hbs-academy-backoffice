<template>
  <div class="p-5">
    <CRoundedIcon color="!text-red bg-red-100" icon="icon-trash" />
    <p class="text-center mt-5 text-xl leading-130 font-semibold text-dark-100">
      {{ $t("delete_course") }}
    </p>
    <p
      class="text-base leading-130 font-normal text-gray-700 text-center mt-2 mx-auto"
    >
      {{ $t("delete_course_text") }}
    </p>
    <div class="mt-7 flex-y-center gap-4">
      <CButton
        variant="info"
        class="w-full"
        @click="$emit('close')"
        :text="$t('cancel')"
      />
      <CButton
        variant="error"
        class="w-full"
        :text="$t('delete')"
        @click="$emit('submit')"
        v-bind="{ loading }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from "@/components/Common/CButton.vue";
import CRoundedIcon from "@/components/Common/CRoundedIcon.vue";

interface Props {
  loading?: boolean;
}

defineProps<Props>();
</script>
