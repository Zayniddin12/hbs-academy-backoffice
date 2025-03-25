<template>
  <div>
    <div class="flex-center-between gap-3">
      <p
        v-if="!assignment?.is_rejected"
        class="text-xl leading-normal font-semibold text-dark-100"
      >
        {{ $t("rating_assignment") }}
      </p>
      <p
        v-if="assignment?.is_rejected"
        class="text-xl leading-normal font-semibold text-dark-100"
      >
        {{ $t("rejected_assignment") }}
      </p>
      <CButton
        v-if="assignment?.ball && assignment?.details?.type !== 'test'"
        variant="info"
        class="!h-9 flex-center"
        icon="icon-edit"
        icon-position="left"
        :text="$t('edit')"
        @click="editBall"
      />
    </div>

    <Transition name="fade" mode="out-in">
      <div v-if="!assignment?.ball || showEditBall" class="mt-4">
        <FInput
          placeholder="0"
          v-model="form.values.ball"
          :error="form.$v.value.ball.$error"
        />
        <p class="text-xs leading-130 mt-1 text-gray-700">
          {{ t("from_to", { from: 0, to: assignment?.details?.ball ?? 0 }) }}
        </p>

        <div class="flex items-center space-x-5">
          <CButton
            class="min-w-[262px] mt-7 w-full"
            :text="$t('save')"
            :loading="loading"
            @click="submit"
          />
          <CButton
            class="min-w-[262px] w-full mt-7 !bg-[#FEF5F5] !text-[#E52E30] hover:bg-[#FEF5F5]/50"
            :text="$t('reject')"
            :loading="loading"
            :disabled="assignment?.is_rejected"
            @click="show = true"
          />
        </div>
      </div>
      <div v-else class="mt-1">
        <p
          v-if="!assignment?.is_rejected"
          class="text-xl leading-130 font-semibold text-green p-2 rounded-lg bg-green-100 w-max"
        >
          {{ t("point_count", { point: assignment?.ball }) }}
        </p>
        <div v-if="!assignment?.is_rejected" class="flex-y-center gap-4 mt-4">
          <CProfileDashDetail
            :title="assignment?.appraiser_name"
            :description="$t('rated')"
          />
          <CProfileDashDetail
            :title="
              assignment?.assessment_at
                ? dayjs(assignment?.assessment_at).format('DD.MM.YYYY, HH:mm')
                : '-'
            "
            :description="$t('date_of_assessment')"
          />
        </div>
      </div>
    </Transition>

    <div>
      <CButton
        v-if="userRole === 'admin' && assignment?.submitted"
        class="min-w-[262px] w-full mt-7 bg-red-500 text-white hover:bg-red-600"
        :text="$t('clear')"
        @click="clearHistoryModal = true"
      />
    </div>
    <CResultRatingModal :show="show" @close="show = false" />

    <CClearHistoryWarning
      :show="clearHistoryModal"
      @submit="clearUserHistory()"
      @close="clearHistoryModal = false"
      :loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
import FInput from "@/components/Form/Input/FInput.vue";
import CButton from "@/components/Common/CButton.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useForm } from "@/composables/useForm";
import ApiService from "@/services/ApiService";
import { handleError } from "@/utils";
import { useCustomToast } from "@/composables/useCustomToast";
import { useAssignmentStore } from "@/modules/Assignments/store";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import CResultRatingModal from "@/modules/Assignments/components/CResultRatingModal.vue";
import CClearHistoryWarning from "@/modules/Assignments/components/result/CClearHistoryWarning.vue";
import { useAuthStore } from "@/modules/Auth/stores";
import router from "@/router";

interface Props {
  assignment: any;
}

const props = defineProps<Props>();
const { t } = useI18n();
const { showToast } = useCustomToast();
const route = useRoute();

const showEditBall = ref(false);
const show = ref(false);
const clearHistoryModal = ref(false);
const authStore = useAuthStore();
const userRole = computed(() => authStore?.user?.role);

const editBall = () => {
  showEditBall.value = true;
  form.values.ball = props.assignment.ball;
};

const form = useForm(
  {
    ball: 0,
  },
  {
    ball: {
      required: (val: number) =>
        val >= 0 && val <= props.assignment.details.ball,
    },
  }
);
const store = useAssignmentStore();
const loading = ref(false);

async function clearUserHistory() {
  await ApiService.post(`backoffice/assignment/CleanStudentAssigmentResults/`, {
    student_assignments: [route.params?.id],
  })
    .then(() => {
      showToast(t("successfully"), "success");
      clearHistoryModal.value = false;
      router.back();
    })
    .catch(({ response }) => {
      handleError(response);
    });
}

function submit() {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    loading.value = true;
    ApiService.put(
      `/backoffice/assignment/GradeStudentAssignment/${route.params?.id}/`,
      {
        ball: form.values.ball,
      }
    )
      .then(() => {
        loading.value = false;
        showToast(t("successfully"), "success");
        form.values.ball = 0;
        form.$v.value.$reset();
        showEditBall.value = false;
        store.fetchStudentAssignmentDetails(String(route.params?.id));
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => {
        loading.value = false;
      });
  }
}
</script>
