<template>
  <div class="rounded-xl bg-white py-4 px-5 flex-center-between">
    <h2 class="text-dark-100 text-xl font-semibold">{{ $t(title ?? "") }}</h2>
    <div class="flex items-center gap-4">
      <CButton
        variant="info"
        :disabled="cancelBtn.disabled"
        :loading="cancelBtn.loading"
        :text="$t(cancelBtn.text)"
        :class="cancelBtn.width"
        class="w-[120px]"
        type="button"
        @click="$emit('on-cancel')"
      />
      <CButton
        variant="primary"
        :disabled="acceptBtn.disabled"
        :loading="acceptBtn.loading"
        :text="$t(acceptBtn.text)"
        :class="acceptBtn.width"
        class="w-[120px]"
        type="button"
        @click="$emit('on-create')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import CButton from "@/components/Common/CButton.vue";

interface Props {
  title: string;
  cancelBtn?: {
    text: string;
    disabled?: boolean;
    loading?: boolean;
    width?: string;
  };
  acceptBtn?: {
    text: string;
    disabled?: boolean;
    loading?: boolean;
    width?: string;
  };
}
withDefaults(defineProps<Props>(), {
  cancelBtn: () => {
    return {
      text: "cancel",
      disabled: false,
      loading: false,
      width: "w-[120px]",
    };
  },
  acceptBtn: () => {
    return {
      text: "create",
      disabled: false,
      loading: false,
      width: "w-[120px]",
    };
  },
});

defineEmits<{
  (e: "on-cancel"): void;
  (e: "on-create"): void;
}>();
</script>
