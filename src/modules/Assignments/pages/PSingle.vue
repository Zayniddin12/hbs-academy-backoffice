<template>
  <div>
    <Teleport v-if="mounted" to="#header-breadcrumbs">
      <CBreadcrumb v-bind="{ routes }" />
    </Teleport>

    <CCard class="p-6 flex gap-16 mb-5 !bg-white">
      <div class="w-full">
        <div class="flex justify-between w-full gap-4">
          <p class="text-xl leading-130 font-semibold text-dark-100">
            {{ assignment?.details?.title }}
          </p>
          <CButton
            variant="success-light"
            :text="t('extend_the_period')"
            icon-position="left"
            icon="icon-calendar"
            @click="show = true"
          />
        </div>

        <div class="flex gap-5 mt-4">
          <p
            class="max-w-[530px] overflow-auto text-wrap text-sm leading-130 font-normal text-dark-100"
          >
            {{ assignment?.details?.description }}
          </p>
          <div class="w-px h-auto bg-gray-800" />
          <div class="flex flex-col gap-4">
            <CProfileDashDetail
              :title="t('point_count', { point: assignment?.details?.ball })"
              :description="t('max_point')"
            />
            <div class="space-y-2">
              <p class="text-2xs leading-130 text-gray">
                {{ t("additional_file_for_task") }}
              </p>
              <CFile
                v-for="(file, index) in assignment?.details?.files"
                :key="index"
                :file="{
                  ...file,
                  name: file?.file_name,
                }"
                class="!p-0 mt-2"
              />
            </div>
          </div>
        </div>
        <hr class="my-5" />
        <CCommonHeader
          class="mb-6"
          :title="$t('extra_information')"
          no-tabs
          no-image
          no-hr
        >
          <template #details>
            <div class="flex justify-between w-full">
              <div class="contents justify-between items-center w-full">
                <div class="flex items-center gap-4">
                  <CProfileDashDetail
                    :title="
                      dayjs(assignment?.end_date).format('D MMMM, YYYY, HH:mm')
                    "
                    :description="$t('assignment_deadline') + ':'"
                  />
                  <CProfileDashDetail
                    :title="formatMoneyDecimal(eventData?.visitors_max)"
                    :description="$t('prediction_visitors')"
                  />
                  <CProfileDashDetail
                    :title="formatMoneyDecimal(eventData?.visitors)"
                    :description="$t('come_visitors')"
                  />

                  <CProfileDashDetail
                    v-if="assignment?.is_rejected"
                    :title="assignment?.appraiser_name"
                    :description="$t('person_who_rejected')"
                  />
                </div>
              </div>
            </div>
          </template>
        </CCommonHeader>
        <div v-if="assignment?.is_rejected" class="my-4">
          <p class="text-sm font-bold text-dark-100 leading-130">
            {{ $t("reason_for_the_rejection") }}
          </p>
          <p class="text-gray text-2xs leading-130 mt-1">
            {{ assignment?.rejection_reason }}
          </p>
        </div>
      </div>
    </CCard>

    <CUpdatePeriodModal
      :form="form"
      :show="show"
      :loading="buttonLoading"
      @submit="updatePeriod(Number(assignment?.id ?? 0))"
      @close="show = false"
    />
    <CResultFile
      v-if="assignment?.submitted && assignment?.details?.type === 'test'"
      :assignment="assignment"
    />
    <CResultFile
      v-if="assignment?.details?.type !== 'test'"
      :assignment="assignment"
    />
  </div>
</template>

<script setup lang="ts">
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import dayjs from "dayjs";
import { useAssignmentStore } from "@/modules/Assignments/store";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import CCard from "@/components/Card/CCard.vue";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import CButton from "@/components/Common/CButton.vue";
import ApiService from "@/services/ApiService";
import { useForm } from "@/composables/useForm";
import { useCustomToast } from "@/composables/useCustomToast";
import { useHandleError } from "@/composables/useHandleError";
import { required } from "@vuelidate/validators";
import CUpdatePeriodModal from "@/modules/Assignments/components/CUpdatePeriodModal.vue";
import { eventData } from "@/modules/Events/data";
import { formatMoneyDecimal } from "@/utils";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CResultFile from "@/modules/Assignments/components/result/CResultFile.vue";

const { mounted } = useMounted();
const { t } = useI18n();
const store = useAssignmentStore();
const route = useRoute();
const { showToast } = useCustomToast();
const { handleError } = useHandleError();

const assignment = computed(() => store.studentAssignment);

// Fetch data
store.fetchStudentAssignmentDetails(String(route.params?.id));

const show = ref(false);
const buttonLoading = ref(false);

const form = useForm(
  {
    extended_end_date: "",
    extended_deadline_reason: "",
  },
  {
    extended_end_date: { required },
  }
);

function updatePeriod(id: number) {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    buttonLoading.value = true;
    const [day, month, year] = form.values.extended_end_date.split(".");
    const data = {
      extended_end_date: `${year}-${month}-${day}`,
      extended_deadline_reason: form.values.extended_deadline_reason,
    };
    ApiService.put(
      "backoffice/assignment/ExtendStudentAssignmentDeadline/" + id + "/",
      data
    )
      .then(() => {
        form.values.extended_end_date = "";
        form.values.extended_deadline_reason = "";
        form.$v.value.$reset();
        showToast(t("successfully"), "success");
        store.fetchStudentAssignmentDetails(String(id));
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => ((buttonLoading.value = false), (show.value = false)));
  }
}

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: assignment.value?.details?.title,
    route: "/",
  },
]);
</script>
