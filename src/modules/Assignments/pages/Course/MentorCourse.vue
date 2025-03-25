<template>
  <Transition mode="out-in">
    <section :key="draggable">
      <CTableWrapper
        v-if="!draggable"
        :head="headData"
        :data="tableData"
        no-search
        :items-per-page="paginationData?.defaultLimit"
        :limit="paginationData?.defaultLimit"
        :total="paginationData?.total"
        :current-page="paginationData?.currentPage"
        @search="onSearch"
        no-header
        :loading="loading"
        footer-class="flex !justify-between !w-full"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
        :title="$t('course_module')"
        :subtitle="t('course_module_count', { count: tableData?.length })"
      >
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data?._index + '.'"
          />
        </template>
        <template #student="{ row: data }">
          <RouterLink
            :to="`/assignments/mentors/mentor/course/${data.student_id}/assignments`"
            class="flex items-center justify-between"
          >
            <CUserCard
              :isOnline="data.is_online"
              :card="{
                full_name: data?.full_name,
                avatar: data?.avatar,
              }"
            />
          </RouterLink>
        </template>
        <template #point_per_lesson="{ row: data }">
          <p>{{ data?.lessons_ball }}</p>
        </template>
        <template #point_for_tasks="{ row: data }">
          <p>{{ data?.assignments_ball }}</p>
        </template>
        <template #total_point="{ row: data }">
          <div class="flex items-center gap-0.5">
            <p>{{ data.overall_ball }}</p>
            /
            <p class="text-gray">{{ data.max_ball }}</p>
          </div>
        </template>
        <template #payment="{ row: data }">
          <div class="flex items-center gap-0.5">
            <CCoursePaymentStatus :is-paid="data.paid" />
          </div>
        </template>
        <template #actions="{ row: data }">
          <CDropdown>
            <template #head>
              <div
                class="h-7 w-7 ml-auto nr-5 flex items-center justify-center gap-2.5 rounded-md bg-gray-100 group hover:bg-green-100 focus:bg-green-100 cursor-pointer"
              >
                <i
                  class="icon icon-more text-dark-100 group-hover:text-green"
                ></i>
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
                  <i class="icon-unlock text-orange-400 text-xl"></i>
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
                  <i class="icon-trash text-gray text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("table.dropdown.delete") }}</span
                  >
                </div>
              </div>
            </template>
          </CDropdown>
        </template>
        <template #beforePagination>
          <div class="flex items-center gap-5">
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6.5"
                  fill="white"
                  stroke="#3DD641"
                  stroke-width="3"
                />
              </svg>
              <p class="text-gray-700 text-xs">{{ $t("active") }}</p>
            </div>
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6.5"
                  fill="white"
                  stroke="#C8CFD6"
                  stroke-width="3"
                />
              </svg>
              <p class="text-gray-700 text-xs">{{ $t("no_active") }}</p>
            </div>
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6.5"
                  fill="white"
                  stroke="#E62E30"
                  stroke-width="3"
                />
              </svg>
              <p class="text-gray-700 text-xs">{{ $t("block") }}</p>
            </div>
          </div>
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
import { computed, reactive, ref } from "vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CButton from "@/components/Common/CButton.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import CLessonDraggable from "@/modules/Courses/components/Modules/CLessonDraggable.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import CNodata from "@/components/Common/CNodata.vue";
import { useAuthStore } from "@/modules/Auth/stores";
import CUserCard from "@/components/Card/CUserCard.vue";
import CCoursePaymentStatus from "@/modules/Students/components/CCoursePaymentStatus.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { useAssignmentStore } from "@/modules/Assignments/store";

const route = useRoute();
const { t } = useI18n();
const showDelete = ref(false);
const store2 = useAssignmentStore();
const buttonLoading = ref(false);
const { tableData, paginationData, onSearch, onPageChange, onChangeLimit, loading } =
  useTableFetch(`/backoffice/GroupStudents/${route.params?.id}/`);

// Draggable
const draggable = ref(false);
const authStore = useAuthStore();
const dataMentor = store2.fetchStudentAssignmentStudentList;
const userRole = computed(() => authStore?.user?.role);
const questionOptions = reactive([
  {
    name: t("all"),
    value: "all",
  },
  {
    name: t("active"),
    value: "active",
  },
  {
    name: t("no_active"),
    value: "no_active",
  },
  {
    name: t("block"),
    value: "block",
  },
]);

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "student",
    key: "student",
  },
  {
    title: "point_per_lesson",
    key: "point_per_lesson",
  },
  {
    title: "point_for_tasks",
    key: "point_for_tasks",
  },
  {
    title: "total_point",
    key: "total_point",
  },
  {
    title: "payment",
    key: "payment",
  },
  {
    title: "actions",
    key: "actions",
  },
];
</script>
