<template>
  <CDialog
    :show="show"
    body-class="!max-w-[376px]"
    no-header
    @close="$emit('close')"
  >
    <Transition name="fade" mode="out-in">
      <div class="p-5">
        <CRoundedIcon color="!text-red bg-red-100" icon="icon-trash" />
        <p
          class="text-center mt-5 text-xl leading-130 font-semibold text-dark-100"
        >
          {{ $t("clear_user_assignment_result") }}
        </p>
        <p
          class="text-base leading-130 font-normal text-gray-700 text-center mt-2 mx-auto"
        >
          {{ $t("do_you_really_want_to_clear_user_assignment_result") }}
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
            :text="$t('clear')"
            @click="$emit('submit')"
            v-bind="{ loading }"
          />
        </div>
      </div>
    </Transition>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { ref, watch } from "vue";
import CDeleteCourseWarning from "@/modules/Courses/components/Delete/CDeleteCourseWarning.vue";
import CDeleteCourseOtp from "@/modules/Courses/components/Delete/CDeleteCourseOtp.vue";
import { useClientSecret } from "@/composables/useClientSecretToken";
import ApiService from "@/services/ApiService";
import CDeleteError from "@/modules/Courses/components/Delete/CDeleteError.vue";
import { useHandleError } from "@/composables/useHandleError";
import CRoundedIcon from "@/components/Common/CRoundedIcon.vue";
import CButton from "@/components/Common/CButton.vue";

interface Props {
  show: boolean;
  loading?: boolean;
}

const props = defineProps<Props>();
</script>
