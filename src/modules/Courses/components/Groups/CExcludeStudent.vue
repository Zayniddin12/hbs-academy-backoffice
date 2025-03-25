<template>
  <div class="w-full">
    <CTableWrapper
      no-header
      :head="StudentsHeadData"
      :data="tableData"
      :items-per-page="paginationData?.defaultLimit"
      :limit="paginationData?.defaultLimit"
      :total="paginationData?.total"
      :current-page="paginationData?.currentPage"
      @itemsPerPage="onChangeLimit"
      @pageChange="onPageChange"
      v-bind="{ loading }"
      footer-class="hidden"
      td-class="last:text-right"
    >
      <template #_index="{ row: data }">
        <p class="font-semibold">{{ data?._index }}.</p>
      </template>
      <template #student="{ row: data }">
        <CUserCardCopy
          :card="{
            name: data?.full_name,
            image: data?.avatar,
            isBlocked: !data?.is_active,
            isOnline: data?.is_online,
            id: data?.student_id,
          }"
        />
      </template>
      <template #total_point="{ row: data }">
        <p class="text-xs leading-130 font-normal text-gray">
          <span class="text-dark-100 font-medium">{{
            data?.overall_ball
          }}</span>
          / {{ data?.max_ball }}
        </p>
      </template>
      <template #payment="{ row: data }">
        <CCoursePaymentStatus :is-paid="data?.paid" />
      </template>
      <template #actions="{ row: data }">
        <FCheckbox
          class="ml-auto"
          value="value"
          @change="onChange(data?.id)"
          :checked="studentList.includes(data?.id)"
        />
      </template>

      <!--   Actions   -->
      <template #no-data>
        <div class="py-[128px] flex-center">
          <div class="text-center">
            <img
              src="/images/svg/no-data/no-groups.svg"
              alt="no-events"
              class="mx-auto"
            />
            <p class="text-base leading-130 font-semibold text-dark-100 mt-6">
              {{ $t("no_groups_yet") }}
            </p>
            <p class="mt-1.5 text-sm leading-130 font-normal text-gray">
              {{ $t("no_groups_yet_text") }}
            </p>
          </div>
        </div>
      </template>
    </CTableWrapper>
    <div class="flex justify-end">
      <CButton
        class="mt-4 min-w-[220px]"
        icon-position="left"
        icon="icon-add"
        :disabled="!studentList?.length"
        :text="$t('table.dropdown.delete')"
        @click="handleExcludeStudents"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CCoursePaymentStatus from "@/modules/Students/components/CCoursePaymentStatus.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CUserCardCopy from "@/components/Card/CUserCardCopy.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import { ref } from "vue";
import { StudentsHeadData } from "@/modules/Courses/data";
import CButton from "@/components/Common/CButton.vue";

const emit = defineEmits<{
  (e: "excludeStudents", value: number[]): void;
}>();

const route = useRoute();
const studentList = ref([]);

const { tableData, paginationData, onPageChange, onChangeLimit, loading } =
  useTableFetch(`backoffice/GroupStudents/${route.params.groupId}/`, {
    page_size: 100,
  });

function onChange(studentID: number) {
  const existingIndex = studentList.value.findIndex((el) => el === studentID);

  if (existingIndex !== -1) {
    // Replace the existing value
    studentList.value.splice(existingIndex, 1);
  } else {
    // Add a new value if not found
    studentList.value.push(studentID);
  }
}
function handleExcludeStudents() {
  emit("excludeStudents", studentList.value);
}
</script>

<style scoped></style>
