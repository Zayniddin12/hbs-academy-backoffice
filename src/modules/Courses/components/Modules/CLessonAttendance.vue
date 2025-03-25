<template>
  <CTableWrapper
    :head="headData"
    :data="tableValues"
    no-search
    :loading="loading"
    :items-per-page="10"
    :limit="10"
    :total="tableValues?.length"
    :current-page="1"
    :title="$t('students')"
    :subtitle="$t('student_plural', { count: tableValues?.length })"
  >
    <template #_index="{ row: data }">
      <p class="font-semibold">{{ data?._index }}.</p>
    </template>
    <template #name="{ row: data }">
      <CUserCard :card="data" />
    </template>
    <template #flow="{ row: data }">
      <div>
        <p class="text-sm leading-normal font-medium text-dark-100">
          {{ data?.flow_name }}
        </p>
        <p class="text-xs leading-normal font-normal text-gray-700 mt-0.5">
          {{ data?.group_name }}
        </p>
      </div>
    </template>
    <template #attendance="{ row: data }">
      <div class="flex-y-center justify-end gap-4" v-if="data">
        <FCheckbox
          class="translate-y-0.5"
          value="value"
          :checked="data?.attendance_status === 'present'"
          @change="handleSetAttendance(data?.id)"
        />
      </div>
    </template>
    <!--    Actions    -->
    <template #afterSearch v-if="!loading && tableValues?.length">
      <CButton
        variant="primary"
        :text="$t('end_attendance')"
        :disabled="!attendanceValues?.length"
        @click="handleEndAttendance"
      />
    </template>
  </CTableWrapper>
</template>

<script setup lang="ts">
import CButton from "@/components/Common/CButton.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CUserCard from "@/components/Card/CUserCard.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import apiService from "@/services/ApiService";
import { IResponse } from "@/types/common";
import { IWorker } from "@/modules/Courses/types";
import FCheckbox from "@/components/Form/FCheckbox.vue";
const route = useRoute();
const router = useRouter();

const emit = defineEmits<{
  (e: "endAttendance"): void;
}>();

const tableValues = ref(null);
const loading = ref(false);

const attendanceValues = ref([]);

const handleEndAttendance = async () => {
  const data = {
    lesson: route?.params?.lessonId,
    presented_ids: attendanceValues.value,
    absented_ids: tableValues.value
      ?.filter((el) => !attendanceValues.value.includes(el?.id))
      ?.map((el) => el?.id),
  };
  await postStudentAttendance(data);
};

const handleSetAttendance = (studentID: string) => {
  attendanceValues.value.push(studentID);
};

// const handleUpdateValue = (value: string, id: string) => {
//   const studentAttendance = {
//     status: value,
//     student: id,
//   };
//   postStudentAttendance(
//     route?.params?.lessonId,
//     studentAttendance.student,
//     studentAttendance.status
//   );
//   const existingIndex = attendanceValues.value.findIndex(
//     (el) => el.student === studentAttendance.student
//   );
//
//   if (existingIndex !== -1) {
//     // Replace the existing value
//     attendanceValues.value[existingIndex] = studentAttendance;
//   } else {
//     // Add a new value if not found
//     attendanceValues.value.push(studentAttendance);
//   }
// };
function fetchLessonStudents() {
  return new Promise((resolve, reject) => {
    loading.value = true;
    apiService
      .query<IResponse<IWorker>>(
        `backoffice/LessonStudents/${route?.params?.lessonId}/`,
        {
          params: {
            page_size: 100,
          },
        }
      )
      .then((response) => {
        tableValues.value = response.data.results?.map((row) => ({
          ...row,
          selected_value: "",
        }));
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
      .finally(() => {
        loading.value = false;
      });
  });
}

function postStudentAttendance(attendances: {
  lesson: string;
  presented_ids: string[];
  absented_ids: string[];
}) {
  return new Promise((resolve, reject) => {
    apiService
      .post(`backoffice/ListStudentAttendanceCreate/`, attendances)
      .then(async (response) => {
        await router.push({
          path: route.path,
          query: {},
        });
        await emit("endAttendance");
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

onMounted(() => {
  fetchLessonStudents();
});

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "student",
    key: "name",
  },
  {
    title: "flow_group",
    key: "flow",
  },
  {
    title: "attendance",
    key: "attendance",
  },
];
</script>

<style scoped></style>
