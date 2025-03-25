<template>
  <CDialog
    v-bind="{ show }"
    body-class="!max-w-[420px]"
    no-header
    @close="$emit('close')"
  >
    <div class="p-5 text-center">
      <CRoundedIcon
        :color="!isBlocked ? 'bg-red-100' : 'bg-[#FEF5E6]'"
        :icon="!isBlocked ? 'icon-lock !text-red' : 'icon-unlock !text-yellow'"
      />

      <p class="text-xl leading-130 text-dark-100 font-semibold mt-5">
        {{ blockText?.title }}
      </p>
      <p class="text-base leading-130 text-gray-700 mt-2">
        {{ blockText?.text }}
      </p>

      <div class="flex-y-center gap-4 mt-7">
        <CButton
          class="w-full"
          variant="info"
          :text="$t('cancel')"
          @click="$emit('close')"
        />
        <CButton
          class="w-full"
          :variant="isBlocked ? 'warning-yellow' : 'warning'"
          :text="
            isBlocked
              ? $t('student_profile.unblock')
              : $t('student_profile.block')
          "
          @click="$emit('submit')"
        />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import CRoundedIcon from "@/components/Common/CRoundedIcon.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import CButton from "@/components/Common/CButton.vue";

interface Props {
  show: boolean;
  isBlocked: boolean;
}

const props = defineProps<Props>();
const { t } = useI18n();

const blockText = computed(() => {
  if (!props.isBlocked) {
    return {
      title: t("student_profile.modal_block_header"),
      text: t("student_profile.modal_block_description"),
      button: t("student_profile.block"),
    };
  } else {
    return {
      title: t("student_profile.unblock_user"),
      text: t("student_profile.unblock_user_description"),
      button: t("student_profile.unblock"),
    };
  }
});
</script>
