<template>
  <Transition mode="out-in">
    <section :key="draggable">
      <CTableWrapper
        class="mt-[-55px]"
        v-if="!draggable"
        :head="headData"
        :data="tableData"
        :items-per-page="paginationData?.defaultLimit"
        :limit="paginationData?.defaultLimit"
        :total="paginationData?.total"
        :current-page="paginationData?.currentPage"
        @search="onSearch"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
        :loading="loading"
      >
        <template #beforeSearch>
          <FSelect
            @on-select="toggleSelect"
            :options="options"
            :placeholder="$t('assignment_type')"
            v-model="selectType"
            label-key="label"
            value-key="value"
            class="w-[220px]"
          />
        </template>
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data?._index + '.'"
          />
        </template>
        <template #module_and_task_name="{ row: data }">
          <div class="flex items-center jusftify-between">
            <div class="flex flex-col">
              <div class="flex">
                <p class="bg-[#E8FAEE] text-[#16CC53] py-0.5 px-1.5 rounded-md">
                  {{ data.assignment.module.title }}
                </p>
              </div>
              <router-link
                :to="{
                  name: 'AssignmentCourseSingle',
                  params: { id: data?.id },
                }"
                class="line-clamp-2 max-w-[330px]"
              >{{ data.assignment.description }}</router-link
              >
            </div>
          </div>
        </template>
        <template #type="{ row: data }">
          <CShowingType :type="data.assignment.type" />
        </template>
        <!--        <template #number_of_students="{ row: data }">-->
        <!--          <CAssignmentsProcessCard-->
        <!--            assignsingle-->
        <!--            :max="data.students_count"-->
        <!--            :value="data.submitted_students_count"-->
        <!--          />-->
        <!--        </template>-->
        <template #deadline="{ row: data }">
          <p>{{ dayjs(data?.end_date).format("D MMMM, YYYY") }}</p>
          <p>{{ data?.end_date?.substring(11, 16) }}</p>
        </template>
        <template #point="{ row: data }">
          <p>{{ data.ball || 0 }}</p>
        </template>
        <template #actions="{ row: data }">
          <CDropdown>
            <template #head>
              <div
                class="h-7 w-7 ml-auto nr-5 flex items-center justify-center gap-2.5 rounded-md bg-gray-100 group hover:bg-green-100 focus:bg-green-100 cursor-pointer"
              >
                <i
                  class="icon icon-more text-dark-100 group-hover:text-green"
                />
              </div>
            </template>

            <template #default>
              <div class="flex flex-col bg-white rounded-lg shadow-dropdown">
                <div
                  v-if="data.is_active"
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300"
                  @click="
                    () => {
                      showBlock = true;
                      selectedStudent = data;
                    }
                  "
                >
                  <i class="icon-lock text-red text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                  >{{ $t("table.dropdown.lock") }}</span
                  >
                </div>
                <div
                  v-else
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300"
                  @click="
                    () => {
                      showBlock = true;
                      selectedStudent = data;
                    }
                  "
                >
                  <i class="icon-unlock text-orange-400 text-xl" />
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                  >{{ $t("table.dropdown.unlock") }}</span
                  >
                </div>
                <hr class="w-full h-[1px] bg-gray-300" />
                <div
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300"
                  @click="
                    () => {
                      showDelete = true;
                      selectedStudentId = data?.id;
                    }
                  "
                >
                  <i class="icon-trash text-gray text-xl" />
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                  >{{ $t("table.dropdown.delete") }}</span
                  >
                </div>
              </div>
            </template>
          </CDropdown>
        </template>
        <template #no-data>
          <CNodata
            :title="$t('no_lessons')"
            :subtitle="$t('no_lessons_text')"
          />
        </template>
      </CTableWrapper>
      <CLessonDraggable
        v-else
        @on-save="onSave"
        :table-data="tableData"
        v-model="tableData"
        :loading="buttonLoading"
      />
    </section>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import CLessonDraggable from "@/modules/Courses/components/Modules/CLessonDraggable.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import CNodata from "@/components/Common/CNodata.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CShowingType from "@/modules/Courses/components/Modules/Assignments/CShowingType.vue";
import CAssignmentsProcessCard from "@/modules/Assignments/components/CAssignmentsProcessCard.vue";
import dayjs from "dayjs";
import { updateQueryParams } from "@/utils";

import { useAssignmentStore } from "@/modules/Assignments/store";
const store2 = useAssignmentStore();

const assignmentFlowsId = computed(() => store2.studentAssignmentMentorList);
const selectType = ref("");
const route = useRoute();
const { t } = useI18n();
const showDelete = ref(false);
const buttonLoading = ref(false);

const moduleId = localStorage.getItem("moduleId");

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  loading,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(
  `/backoffice/assignment/StudentAssignmentsList/${route.params.id}/?group_member__group=${assignmentFlowsId.value?.group.id}&assignment__module=${moduleId}`
);

// Draggable
const draggable = ref(false);

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "module_and_task_name",
    key: "module_and_task_name",
  },
  {
    title: "type",
    key: "type",
  },
  // {
  //   title: "number_of_students",
  //   key: "number_of_students",
  // },
  {
    title: "deadline",
    key: "deadline",
  },
  {
    title: "point",
    key: "point",
    customClass: "!text-left",
  },
];

const options = [
  {
    label: t("all"),
    value: "",
  },
  {
    label: t("writing"),
    value: "writing",
  },
  {
    label: t("file"),
    value: "file",
  },
  {
    label: t("writing_and_file"),
    value: "writing_and_file",
  },
  {
    label: t("test"),
    value: "test",
  },
];

const toggleSelect = (e: string) => {
  selectType.value = e.value;
};

watch(
  () => selectType.value,
  () => {
    updateQueryParams("assignment__type", selectType.value || undefined);
    setTimeout(() => {
      fetchTableData();
    }, 100);
  }
);
</script>
