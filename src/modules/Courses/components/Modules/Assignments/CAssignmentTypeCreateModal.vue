<template>
  <CDialog
    v-bind="{ show }"
    @close="$emit('close')"
    body-class="!max-w-[420px]"
    :title="$t('choose_assigment_type')"
  >
    <div class="p-5">
      <div class="w-full flex items-stretch gap-3">
        <CAssignmentType
          v-for="(card, index) in list"
          :key="index"
          v-bind="{ card }"
          :active="activeCard === card?.type"
          @click="activeCard = card?.type ?? ''"
        />
      </div>

      <div class="flex-y-center gap-3 mt-5">
        <CButton
          variant="info"
          :text="$t('cancel')"
          @click="$emit('close')"
          class="w-full"
        />
        <CButton
          :text="$t('next_continue')"
          class="w-full"
          :disabled="!activeCard"
          @click="$emit('submit', activeCard)"
        />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { useI18n } from "vue-i18n";
import CAssignmentType from "@/modules/Courses/components/Modules/Assignments/CAssignmentType.vue";
import { ref } from "vue";
import CButton from "@/components/Common/CButton.vue";

interface Props {
  show?: boolean;
}

defineProps<Props>();
const { t } = useI18n();

const activeCard = ref<null | string>(null);

const list = [
  {
    id: 1,
    title: t("test_assignment"),
    image: "/images/svg/vector/vector-docs.svg",
    type: "test",
  },
  {
    id: 2,
    title: t("writing_assignment"),
    image: "/images/svg/vector/vector-list.svg",
    type: "writing",
  },
  {
    id: 3,
    title: t("file_assignment"),
    image: "/images/svg/vector/vector-file.svg",
    type: "file",
  },
];
</script>
