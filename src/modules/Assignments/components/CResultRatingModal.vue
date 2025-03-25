<template>
  <CDialog
    v-bind="{ show }"
    body-class="!max-w-[532px] min-h-[373px]"
    :title="t('reason_for_the_rejection')"
    title-style="!text-xl !leading-normal font-semibold"
    @close="$emit('close')"
  >
    <div class="p-5">
      <div
        class="mb-2"
        v-for="item in assignmentRejectList?.results"
        :key="item.id"
      >
        <FRadio
          v-model="radio"
          :value="item?.id"
          :label="item.name"
          name="reason"
        />
      </div>
      <FRadio v-model="radio" :value="4" :label="$t('other')" name="reason" />
      <textarea
        v-if="radio == 4"
        v-model="textarea"
        style="resize: none !important"
        class="w-full h-32 mt-5 p-3 border border-gray-300 rounded-lg outline-none bg-[#F7F9FA]"
        :placeholder="$t('write_comment')"
      />
    </div>
    <div class="flex items-center justify-between p-5 gap-5">
      <CButton
        variant="secondary"
        :text="$t('cancel')"
        @click="$emit('close')"
        class="w-full"
      />
      <CButton
        variant="primary"
        :text="$t('confirm')"
        class="w-full"
        @click="sendFlowsAssignment"
      />
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { computed, reactive, ref } from "vue";
import CButton from "@/components/Common/CButton.vue";
import { useI18n } from "vue-i18n";
import FRadio from "@/components/Form/Radio/FRadio.vue";
import { useAssignmentStore } from "@/modules/Assignments/store";
import ApiService from "@/services/ApiService";
import { useRoute } from "vue-router";
import { useCustomToast } from "@/composables/useCustomToast";
const { t } = useI18n();
const $emit = defineEmits(["close"]);
const store = useAssignmentStore();
const { showToast } = useCustomToast();

const radio = ref();
const textarea = ref("");
const assignmentRejectList = computed(() => store.studentAssignmentRejectList);
store.fetchCourseAssignmentRejectList();
const route = useRoute();

function sendFlowsAssignment() {
  const data = {
    reject_reason: radio.value == 4 ? "" : radio.value,
    reject_reason_text: textarea.value,
  };
  ApiService.put(
    `backoffice/assignment/RejectStudentAssignment/${route.params.id}/`,
    data
  )
    .then((res: any) => {
      showToast("success", "success");
      store.fetchStudentAssignmentDetails(String(route.params?.id));
      $emit("close");
    })
    .catch((err) => {
      showToast("assignment_not_submitted", "error");
    });
}
</script>

// admin manager
