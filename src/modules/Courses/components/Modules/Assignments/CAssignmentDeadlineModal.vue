<template>
  <CDialog
    v-bind="{ show }"
    body-class="!max-w-[532px] min-h-[373px]"
    :title="t('extend_deadline')"
    title-style="!text-xl !leading-normal font-semibold"
    @close="$emit('close')"
  >
    <div class="p-5">
      <div>
        <p class="font-bold text-base text-dark-100 font-roboto mb-2">
          {{ $t("for_which_streams") }}
        </p>
        <FSelect
          labelKey="name"
          valueKey="id"
          :options="assignmentFlowsId?.results"
          v-model="course"
          @on-toggle="isOpen = $event"
        >
          <template #selectedOption>
            <div class="flex-center-between w-full">
              <div class="flex items-center w-full">
                <div class="flex-y-center gap-2.5 border border-transparent">
                  <div class="w-9 h-9 rounded-md flex-center">
                    <i class="icon-search-normal text-xl" />
                  </div>
                </div>
                <input
                  type="text"
                  class="w-full bg-gray-100 outline-none text-[13px] font-medium"
                  :placeholder="$t('choose_group')"
                />
              </div>
              <i
                class="icon-chevron-down text-xl text-gray-700 transition-300"
                :class="{ 'rotate-180': isOpen }"
              />
            </div>
          </template>
          <template #option="option">
            <div
              class="flex items-center justify-between gap-2.5 p-2 pb-3 hover:bg-green-100 transition-300"
            >
              <div>
                <h3
                  class="text-dark-100 text-sm text-start leading-130 font-medium"
                >
                  {{ option?.option?.name }}
                </h3>
                <p class="text-gray text-sm leading-130 font-medium mt-1">
                  {{ option?.option?.students_count }}
                  {{ $t("course_students") }}
                </p>
              </div>
              <CButton
                @click="addSelectedOption(option?.option)"
                :text="$t('add')"
              />
            </div>
          </template>
        </FSelect>
        <div class="flex items-center mt-2 gap-2 flex-wrap">
          <div
            class="bg-[#EDF1F5] flex items-center text-dark-100 font-medium leading-130 py-1.5 px-4 rounded-lg gap-1"
            v-for="(item, index) in selectedOption"
            :key="index"
          >
            <h3>{{ item.name }}</h3>
            <button @click="selectedOptionSlice(index)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  opacity="0.4"
                  d="M10.0003 18.3337C14.6027 18.3337 18.3337 14.6027 18.3337 10.0003C18.3337 5.39795 14.6027 1.66699 10.0003 1.66699C5.39795 1.66699 1.66699 5.39795 1.66699 10.0003C1.66699 14.6027 5.39795 18.3337 10.0003 18.3337Z"
                  fill="#8898AA"
                />
                <path
                  d="M10.8831 9.9998L12.7998 8.08314C13.0415 7.84147 13.0415 7.44147 12.7998 7.1998C12.5581 6.95814 12.1581 6.95814 11.9165 7.1998L9.9998 9.11647L8.08314 7.1998C7.84147 6.95814 7.44147 6.95814 7.1998 7.1998C6.95814 7.44147 6.95814 7.84147 7.1998 8.08314L9.11647 9.9998L7.1998 11.9165C6.95814 12.1581 6.95814 12.5581 7.1998 12.7998C7.3248 12.9248 7.48314 12.9831 7.64147 12.9831C7.7998 12.9831 7.95814 12.9248 8.08314 12.7998L9.9998 10.8831L11.9165 12.7998C12.0415 12.9248 12.1998 12.9831 12.3581 12.9831C12.5165 12.9831 12.6748 12.9248 12.7998 12.7998C13.0415 12.5581 13.0415 12.1581 12.7998 11.9165L10.8831 9.9998Z"
                  fill="#8898AA"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <hr class="my-5" />
      <div>
        <p class="font-bold text-base text-dark-100 font-roboto mb-2">
          {{ $t("long_to_extend") }}
        </p>
        <div class="flex-center-between gap-5">
          <div>
            <label class="text-gray-700 text-xs font-roboto" for="day">
              {{ $t("day") }}
            </label>
            <FInput
              type="number"
              id="day"
              class="w-full"
              v-model="form.day"
              placeholder="1"
              maxlength="2"
            />
          </div>
          <div>
            <label class="text-gray-700 text-xs font-roboto" for="hours">
              {{ $t("hours") }}
            </label>
            <FInput
              type="number"
              id="hours"
              class="w-full"
              v-model="form.hours"
              placeholder="1"
              maxlength="2"
            />
          </div>
          <div>
            <label class="text-gray-700 text-xs font-roboto" for="minute">
              {{ $t("minut") }}
            </label>
            <FInput
              type="number"
              id="minute"
              class="w-full"
              v-model="form.minute"
              placeholder="1"
              maxlength="2"
            />
          </div>
        </div>
      </div>
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
        :text="$t('add_day')"
        @click="sendFlowsAssignment"
        class="w-full"
      />
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { useI18n } from "vue-i18n";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { computed, ref } from "vue";
import { useAssignmentStore } from "@/modules/Assignments/store";
import { useRoute } from "vue-router";
import CButton from "@/components/Common/CButton.vue";
import { useCustomToast } from "@/composables/useCustomToast";
import FInput from "@/components/Form/Input/FInput.vue";
import ApiService from "@/services/ApiService";
const store = useAssignmentStore();
const selectedOption = ref([]);
const { showToast } = useCustomToast();

const form = ref({
  day: "",
  hours: "",
  minute: "",
});

interface Props {
  show: boolean;
  isBlocked?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

const course = ref(null);
const isOpen = ref(false);
const { t } = useI18n();
const route = useRoute();
const selectedOptionId = ref([]);

const addSelectedOption = (option: string) => {
  if (!selectedOption.value.includes(option)) {
    selectedOption.value.push(option);
    selectedOptionId.value.push(option?.id);
  } else {
    showToast(t("Information has already been added"), "warning");
  }
};

const selectedOptionSlice = (index: number) => {
  selectedOption.value.splice(index, 1);
};

const assignmentFlowsId = computed(() => store.studentAssignmentFlowsList);
store.fetchCourseAssignmentFlowsLIst(String(route.params?.taskId));

function sendFlowsAssignment() {
  const data = {
    flows: selectedOptionId.value,
    duration_to_extend: `${form.value.day} ${form.value.hours} ${form.value.minute}`,
  };
  ApiService.post(
    `backoffice/assignment/ExtendFlowsAssignmentDeadline/${route.params.taskId}/`,
    data
  )
    .then(() => {
      emit("closeModal");
    })
}
</script>
