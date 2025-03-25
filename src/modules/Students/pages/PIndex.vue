<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb :routes="routes" />
  </Teleport>
  <div>
    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="headData"
        :data="data"
        :items-per-page="pagination.page_size"
        :limit="pagination.page_size"
        :total="count"
        :loading="loading"
        :current-page="pagination.page"
        :title="t('students')"
        :subtitle="t('student_plural', { count: count })"
        @items-per-page="handleLimitChange"
        @page-change="handlePageChange"
        @search="handleSearch"
        has-sort
        sort-key="date_joined"
        @sortTable="handleSortStudent"
      >
        <template #beforeSearch>
          <div class="flex-y-center gap-5">
            <FCheckbox
              :label="$t('new_students')"
              :checked="isNew"
              @change="isNew = isNew != true"
              class="rounded"
            />
            <FSelect
              :options="groupCourses"
              v-model="course"
              selected-option-styles="bg-white !border-gray-800 rounded-md"
              value-key="id"
              label-key="title"
              class="min-w-[160px]"
              @change="handleCourseChange"
              :placeholder="$t('all_courses')"
            />
            <FSelect
              :options="groupOptions"
              v-model="group"
              selected-option-styles="bg-white !border-gray-800 rounded-md"
              value-key="id"
              label-key="title"
              class="min-w-[160px]"
              :placeholder="$t('all_groups')"
            />
            <FSelect
              :options="mentors"
              v-model="mentor"
              selected-option-styles="bg-white !border-gray-800 rounded-md"
              value-key="id"
              label-key="full_name"
              class="min-w-[160px]"
              :placeholder="$t('all_group_leads')"
            />
          </div>
        </template>
        <template #afterSearch>
          <div class="w-full max-w-12">
            <button
              @click="showParse = true"
              class="truncate w-full flex-x-center rounded-md bg-green p-2 text-white hover:bg-green/90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
            </button>
          </div>
        </template>
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data._index + '.'"
          />
        </template>
        <template #user="{ row: data }">
          <CStudentCard
            :card="{
              name: data?.full_name || data?.title,
              image: data?.avatar,
              id: data?.id,
              isBlocked: !data?.is_active,
              isOnline: data?.is_online,
            }"
            :slug="slug"
          />
        </template>
        <template #course_name="{ row: data }">
          <div
            v-for="(course, courseIndex) in data?.courses"
            :key="courseIndex"
          >
            <p v-if="data?.courses.length">{{ course }}</p>
          </div>
        </template>
        <template #group_name="{ row: data }">
          <div v-for="(group, groupIndex) in data.groups" :key="groupIndex">
            <p v-if="data.groups.length">{{ group }}</p>
          </div>
        </template>
        <template #teacher_name="{ row: data }">
          <template v-for="(mentor, index) in data.mentors" :key="index">
            <p v-if="data.mentors.length">{{ mentor.full_name }}</p>
          </template>
        </template>
        <template #phone="{ row: data }">
          <a
            :href="`tel:${data?.phone_number}`"
            class="transition-300 hover:text-green"
          >
            {{ data?.phone_number }}
          </a>
        </template>
        <template #date_joined="{ row: data }">
          <p>
            {{ dayjs(data?.date_joined).locale("ru").format("D MMMM, YYYY") }}
          </p>
        </template>
        <template #action="{ row: data }">
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
      </CTableWrapper>
    </section>
    <CDeleteDialog
      :title="$t('delete_student')"
      :subtitle="$t('delete_student_text')"
      @close="showDelete = false"
      :show="showDelete"
      @submit="deleteStudent"
    />
    <CDeleteDialog
      :title="
        selectedStudent?.is_active ? $t('block_student') : $t('unlock_student')
      "
      :subtitle="
        selectedStudent?.is_active
          ? $t('block_student_text')
          : $t('unlock_student_text')
      "
      @close="showBlock = false"
      :show="showBlock"
      :color="
        selectedStudent?.is_active
          ? '!text-red bg-red-100'
          : '!text-orange-400 bg-orange-100'
      "
      :submitText="
        selectedStudent?.is_active
          ? $t('table.dropdown.lock')
          : $t('table.dropdown.unlock')
      "
      :icon="selectedStudent?.is_active ? 'icon-lock' : 'icon-unlock'"
      :variant="selectedStudent?.is_active ? 'error' : 'warning-yellow'"
      @submit="blockAndUnlockStudent"
    />
    <CStudentParseDialog @close="showParse = false" :show="showParse" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import CStudentCard from "@/modules/Students/components/CStudentCard.vue";
import { debounce } from "@/utils";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useStudentsStore } from "@/modules/Students/store";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import { useCustomToast } from "@/composables/useCustomToast";
import { IStudent } from "@/modules/Students/types";
import FSelect from "@/components/Form/Select/FSelect.vue";
import ApiService from "@/services/ApiService";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import CStudentParseDialog from "@/modules/Students/components/CStudentParseDialog.vue";

const { t } = useI18n();
const { mounted } = useMounted();
const { showToast } = useCustomToast();
const store = useStudentsStore();
const showDelete = ref(false);
const showParse = ref(false);
const showBlock = ref(false);
const selectedStudentId = ref("");
const selectedStudent = ref<IStudent>();
const isNew = ref(false);

const course = ref("");
const group = ref("");
const mentor = ref("");

const data = computed(() => store.students);
const count = computed(() => store.count);
const loading = computed(() => store.loading);
const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("students"),
    route: "/students",
  },
]);

const headData = computed(() => [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "table.head.title2",
    key: "user",
  },
  {
    title: "table.head.title4",
    key: "phone",
  },
  {
    title: "table.head.title8",
    key: "course_name",
  },
  {
    title: "table.head.title9",
    key: "group_name",
  },
  {
    title: "table.head.title10",
    key: "teacher_name",
  },
  {
    title: "table.head.title6",
    key: "date_joined",
  },
  {
    title: "table.head.title7",
    key: "action",
  },
]);

const pagination = reactive({
  page: 1,
  page_size: 10,
});
const search = ref("");
const selectedFilter = ref("students");

const slug = computed(() =>
  selectedFilter.value === "students" ? "StudentsSingleCourses" : ""
);

function handlePageChange(page: number) {
  pagination.page = page;
  fetchStudents();
}

function handleLimitChange(limit: number) {
  pagination.page_size = limit;
  pagination.page = 1;
  fetchStudents();
}

function handleSearch(value: string) {
  search.value = value;
  pagination.page = 1;
  debounce("search", () => {
    fetchStudents();
  });
}

function handleCourseChange() {
  pagination.page = 1;
  fetchStudents();
}

watch(course, () => {
  handleCourseChange();
});
watch(group, () => {
  handleCourseChange();
});
watch(mentor, () => {
  handleCourseChange();
});

function fetchStudents() {
  store.fetchStudents({
    ...pagination,
    search: search.value || undefined,
    groups_members__flow__course: course.value || undefined,
    groups_members__group: group.value || undefined,
    groups_members__group__leads__lead: mentor.value || undefined,
    is_new: isNew.value || undefined,
    order_date_joined: sorted_by_order_date_joined.value,
  });
}
const sorted_by_order_date_joined = ref(false);
const handleSortStudent = () => {
  sorted_by_order_date_joined.value = !sorted_by_order_date_joined.value;
  fetchStudents();
};
watch(isNew, () => {
  fetchStudents();
});

const deleteStudent = () => {
  showDelete.value = false;
  store
    .deleteStudent(selectedStudentId.value)
    .then(() => {
      showToast(t("student_deleted_successfully"), "success");
      fetchStudents();
    })
    .catch(() => {
      showToast(t("student_delete_error"), "error");
    });
};

const blockAndUnlockStudent = () => {
  showBlock.value = false;
  store
    .updateStudent(selectedStudent.value)
    .then(() => {
      showToast(t("student_updated_successfully"), "success");
      fetchStudents();
    })
    .catch(() => {
      showToast(t("student_update_error"), "error");
    });
};

onMounted(() => {
  fetchStudents();
});

const groupCourses = ref([
  {
    id: 0,
    title: t("all_courses"),
  },
]);

const groupOptions = ref([
  {
    id: 0,
    title: t("all_groups"),
  },
]);

const mentors = ref([
  {
    id: 0,
    title: t("all_group_leads"),
  },
]);

function getGroups() {
  ApiService.get("backoffice/GroupsList").then((res) => {
    groupOptions.value = res.data.results;
  });
}
function GetCourses() {
  ApiService.get("backoffice/CoursesList").then((res) => {
    groupCourses.value = res.data.results;
  });
}

function getMentors() {
  ApiService.get("backoffice/GroupLeadsList").then((res) => {
    mentors.value = res.data.results;
  });
}

getMentors();
getGroups();
GetCourses();
</script>

<style scoped>
/* Add your scoped styles here */
</style>
