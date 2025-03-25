<template>
  <CDialog
    v-bind="{ show }"
    body-class="!max-w-[420px] !overflow-visible"
    :title="edit ? $t('edit_event') : $t('new_event')"
    @close="close"
  >
    <div class="p-5">
      <div class="flex flex-col gap-4">
        <FGroup :label="$t('event_name')">
          <FInput
            :placeholder="$t('enter_name')"
            v-model="form.values.title"
            :error="form.$v.value.title.$error"
          />
        </FGroup>
        <FGroup :label="$t('event_description')">
          <FTextarea
            textarea-class="min-h-[120px]"
            :placeholder="$t('enter_description')"
            v-model="form.values.description"
            :error="form.$v.value.description.$error"
            maxlength="250"
          />
        </FGroup>
        <FGroup :label="$t('date_conducted')">
          <FDateTimePicker
            v-model="form.values.date"
            :minDate="new Date()"
            :error="form.$v.value.date.$error"
          />
        </FGroup>
        <FGroup :label="$t('choose_course_label')">
          <CChooseCourse v-bind="{ courses }" v-model="form.values.course" />
        </FGroup>
        <FGroup :label="$t('participating_threads')">
          <CDropdown :key="selectedFlows">
            <template #head>
              <FInput
                :placeholder="$t('choose_group')"
                input-class="!font-medium"
              >
                <template #prefix>
                  <span
                    class="icon-search-normal text-gray text-xl mr-2"
                  ></span>
                </template>
              </FInput>
            </template>
            <div
              class="flex-center-between gap-3 py-2 px-3 border-b border-gray-800 hover:bg-green-100 transition-300"
              v-for="(option, index) in flows"
              :key="index"
            >
              <p class="text-sm leading-130 font-medium text-dark-100">
                {{ option?.name }}
              </p>
              <template
                v-if="selectedFlows?.find((el) => el?.id === option?.id)"
              >
                <CButton
                  variant="secondary"
                  :text="$t('put_away')"
                  @click="handleSelectFlow(option, true)"
                />
              </template>
              <template v-else>
                <CButton
                  :text="$t('add')"
                  @click="handleSelectFlow(option, false)"
                />
              </template>
            </div>
          </CDropdown>
        </FGroup>
      </div>
      <div class="flex flex-col gap-1 mt-2">
        <div
          class="flex-center-between gap-3 p-2 pl-3 rounded-lg bg-gray-100 hover:bg-green-100 transition-300"
          v-for="option in selectedFlows"
          :key="option.id"
        >
          <p class="text-xs leading-130 font-medium text-dark-100">
            {{ option?.name }}
          </p>
          <button
            @click="handleRemoveFlow(option)"
            class="w-4 h-4 rounded-full bg-gray-700/20 flex-center group hover:bg-green/20 transition-300"
          >
            <i
              class="icon-close text-[10px] font-semibold text-gray-700 group-hover:text-green transition-300"
            />
          </button>
        </div>
      </div>

      <div class="flex-y-center gap-3 mt-5">
        <CButton
          class="w-full"
          variant="info"
          :disabled="loading"
          :text="$t('cancel')"
          @click="close"
        />
        <CButton
          :loading="loading"
          :disabled="
            loading || form.$v.value.$invalid || !selectedFlows?.length
          "
          class="w-full"
          :text="edit ? $t('edit') : $t('add')"
          @click="handleSubmitEvent"
        />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { ref, watch } from "vue";
import CChooseCourse from "@/modules/Events/components/CChooseCourse.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import CButton from "@/components/Common/CButton.vue";
import apiService from "@/services/ApiService";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import customParseFormat from "dayjs/plugin/customParseFormat";
import FTextarea from "@/components/Form/FTextarea.vue";
import { Event } from "@/modules/Events/types";
import FDateTimePicker from "@/components/Form/Date/FDateTimePicker.vue";
import { useRoute } from "vue-router";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

interface Props {
  show?: boolean;
  edit?: boolean;
  single?: Event;
  courses: {
    id: number;
    photo: string;
    title: string;
  }[];
}

const props = withDefaults(defineProps<Props>(), {
  edit: false,
});
const emit = defineEmits<{
  (e: "close"): void;
  (e: "updateEvents"): void;
}>();

const route = useRoute();
const loading = ref(false);
const form = useForm(
  {
    course: "",
    title: "",
    description: "",
    date: "",
  },
  {
    course: {
      required,
    },
    title: {
      required,
    },
    description: {
      required,
    },
    date: {
      required,
    },
  }
);
const selectedFlows = ref([]);
const flows = ref([]);

const close = () => {
  form.values.course = "";
  form.values.title = "";
  form.values.description = "";
  form.values.date = "";
  form.$v.value.$reset();
  selectedFlows.value = [];
  emit("close");
};
const handleSelectFlow = (
  flow: { id: number; title: string },
  remove: boolean
) => {
  const flowValue = {
    id: flow.id,
    name: flow.name,
  };
  const existingIndex = selectedFlows.value.findIndex(
    (el) => el.id === flowValue.id
  );

  if (remove) {
    selectedFlows.value.splice(existingIndex, 1);
  } else {
    if (existingIndex !== -1) {
      // Replace the existing value
      selectedFlows.value[existingIndex] = flowValue;
    } else {
      // Add a new value if not found
      selectedFlows.value.push(flowValue);
    }
  }
};

const handleRemoveFlow = (flow: { id: number; title: string }) => {
  const existingIndex = selectedFlows.value.findIndex(
    (el) => el.id === flow.id
  );
  if (existingIndex !== -1) {
    selectedFlows.value.splice(existingIndex, 1);
  }
};

const fetchFlows = (courseID: string) => {
  apiService
    .query(`/backoffice/EventFlows/${courseID}`, { page_size: 100, page: 1 })
    .then((res) => {
      flows.value = res.data.results;
    })
    .catch((err) => {
      console.debug(err, "err");
    });
};

const handleSubmitEvent = () => {
  if (props?.edit) {
    editEvent();
  } else {
    createEvent();
  }
};
const createEvent = () => {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    loading.value = true;
    apiService
      .post(`/backoffice/EventCreate/`, {
        title: form.values.title,
        description: form.values.description,
        datetime: form.values.date,
        course: form.values.course,
        flow: selectedFlows.value.map((el) => el?.id),
      })
      .then(() => {
        emit("updateEvents");
        close();
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const editEvent = () => {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    loading.value = true;
    apiService
      .put(`/backoffice/EventUpdate/${route.params.id ?? props?.single?.id}/`, {
        title: form.values.title,
        description: form.values.description,
        datetime: dayjs.utc(form.values.date).format("YYYY-MM-DD HH:mm"),
        course: form.values.course,
        flow: selectedFlows.value.map((el) => el?.id),
      })
      .then(() => {
        emit("updateEvents");
        close();
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

watch(
  () => props?.show,
  () => {
    if (props?.show && props?.edit) {
      form.values.title = props?.single?.title;
      form.values.description = props?.single?.description;
      form.values.date = dayjs
        .utc(props?.single?.datetime)
        .format("MM/DD/YYYY HH:mm");
      form.values.course = props?.single?.course?.id;
      selectedFlows.value = props?.single?.flow;
    }
  },
  { deep: true, immediate: true }
);
watch(
  () => form.values.course,
  () => {
    if (form.values.course) {
      fetchFlows(form.values.course);
    }
  }
);
</script>
