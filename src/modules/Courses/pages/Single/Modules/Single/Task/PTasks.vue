<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <Teleport v-if="mounted" to="#action-lesson-single">
    <CButton
      :text="$t('add_assignment')"
      icon-position="left"
      icon="icon-add"
      class="!w-full shrink-0"
      @click="showAdd = true"
    />
  </Teleport>
  <section>
    <CTableWrapper
      v-if="!draggable"
      :head="moduleAssignmentsHeadData"
      :data="tableData"
      no-search
      :items-per-page="paginationData?.defaultLimit"
      :limit="paginationData?.defaultLimit"
      :total="paginationData?.total"
      :current-page="paginationData?.currentPage"
      no-header
      :title="t('course_module')"
      :subtitle="t('course_module_count', { count: tableData?.length })"
      @search="onSearch"
      @itemsPerPage="onChangeLimit"
      @pageChange="onPageChange"
    >
      <template #_index="{ row: data }">
        <span
          class="text-sm text-dark-100 font-semibold leading-normal"
          v-text="data?._index + '.'"
        />
      </template>
      <template #afterSearch>
        <CButton
          icon="icon-add"
          icon-position="left"
          :text="$t('create_course_module')"
          @click="$router.push({ name: 'CourseCreate' })"
        />
      </template>
      <template #name="{ row: data }">
        <RouterLink
          :to="{
            name: 'CourseModulesSingleTask',
            params: { taskId: data?.id },
          }"
          class="text-dark-100 text-sm font-normal hover:text-green transition-300"
        >
          {{ data?.title }}
        </RouterLink>
      </template>
      <template #type="{ row: data }">
        <CShowingType :type="data?.type" />
      </template>
      <template #duration_module="{ row: data }">
        <p>
          {{ t("days", { day: data?.duration_days }) }}
        </p>
      </template>
      <template #passed="{ row: data }">
        <p class="text-xs leading-130 font-normal text-gray">
          <span class="text-dark-100">{{ data?.submitted_count }}</span> /
          {{ data?.students_count }}
        </p>
      </template>
      <template #point="{ row: data }">
        <p class="text-right">
          {{ t("point_count", { point: data?.ball }) }}
        </p>
      </template>
      <template #action="{ row: data }">
        <CDropdown>
          <template #head>
            <div
              class="h-7 w-7 ml-auto nr-5 flex items-center justify-center gap-2.5 rounded-md bg-gray-100 group hover:bg-green-100 focus:bg-green-100 cursor-pointer transition-300"
            >
              <i
                class="icon icon-more text-dark-100 group-hover:text-green"
              ></i>
            </div>
          </template>

          <template #default>
            <div class="flex flex-col bg-white rounded-lg shadow-dropdown">
              <div
                class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
                @click="draggable = true"
              >
                <i class="icon-repeate-music text-blue text-xl"></i>
                <span
                  class="text-sm font-medium text-dark-100 leading-normal"
                  >{{ $t("replace") }}</span
                >
              </div>
              <hr class="w-full h-[1px] bg-gray-300" />
              <div
                class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-red-100 transition-300"
                @click="
                  showDelete = true;
                  selectedTask = data;
                "
              >
                <i class="icon-trash text-red text-xl"></i>
                <span
                  class="text-sm font-medium text-dark-100 leading-normal"
                  >{{ $t("table.dropdown.remove") }}</span
                >
              </div>
            </div>
          </template>
        </CDropdown>
      </template>
      <template #no-data>
        <CNodata
          image="/images/svg/no-data/46.svg"
          :title="$t('no_assignments')"
          :subtitle="$t('no_assignments_text')"
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
  <CAssignmentTypeCreateModal
    :show="showAdd"
    @close="showAdd = false"
    @submit="submit"
  />
  <CDeleteDialog
    :title="$t('delete_task')"
    :subtitle="$t('delete_task_text')"
    @close="showDelete = false"
    @submit="deleteTask"
    :show="showDelete"
    :loading="buttonLoading"
  />
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { moduleAssignmentsHeadData } from "@/modules/Courses/data";
import CButton from "@/components/Common/CButton.vue";
import { computed, ref, watch } from "vue";
import CAssignmentTypeCreateModal from "@/modules/Courses/components/Modules/Assignments/CAssignmentTypeCreateModal.vue";
import { useRoute, useRouter } from "vue-router";
import CShowingType from "@/modules/Courses/components/Modules/Assignments/CShowingType.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useMounted } from "@/composables/useMounted";
import CNodata from "@/components/Common/CNodata.vue";
import { useCoursesStore } from "@/modules/Courses/store";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import CLessonDraggable from "@/modules/Courses/components/Modules/CLessonDraggable.vue";

const { t } = useI18n();
const router = useRouter();
const { mounted } = useMounted();
const route = useRoute();

const { handleError } = useHandleError();

const showAdd = ref(false);
const showDelete = ref(false);
const selectedTask = ref(null);
const buttonLoading = ref(false);

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(
  `backoffice/assignment/ModuleAssignments/${route?.params?.moduleId}/`,
  {}
);

function submit(type: string) {
  showAdd.value = false;
  router.push({ name: "CourseModulesSingleTaskCreate", query: { type: type } });
}

watch(
  () => route.query?.search,
  () => fetchTableData()
);

const store = useCoursesStore();
const single = computed(() => store.courseSingle);
const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("courses"),
    route: "/courses",
  },
  {
    name: single.value?.title ?? sessionStorage.getItem("courseTitle"),
    route: `/courses/${route.params.courseId}/module`,
  },
  {
    name: t("assignments"),
    route: "/",
  },
]);

// Draggable
const draggable = ref(false);

function onSave() {
  buttonLoading.value = true;
  const data = {
    assignments: tableData.value.map((el, index) => {
      return {
        assignment_id: el?.id,
        order: index + 1,
      };
    }),
  };
  ApiService.post(`backoffice/assignment/UpdateModuleAssignmentOrder/`, data)
    .then(() => {
      draggable.value = false;
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}

function deleteTask() {
  buttonLoading.value = true;
  ApiService.delete(
    `backoffice/assignment/DeleteAssignment/${selectedTask.value?.id}/`
  )
    .then(() => {
      showDelete.value = false;
      fetchTableData();
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}
</script>
