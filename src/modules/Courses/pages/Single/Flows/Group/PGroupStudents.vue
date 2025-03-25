<template>
  <Teleport v-if="mounted" to="#group-actions">
    <template v-if="!activateExclude">
      <FSelectCustom
        :placeholder="$t('payment')"
        v-model="filter.status"
        :options="options"
        label-key="label"
        value-key="value"
        class="min-w-[220px]"
      />
      <FInput
        v-model="filter.search"
        prefix-class="pr-2.5"
        :placeholder="$t('search')"
        class="border border-gray-100 min-w-[240px]"
      >
        <template #prefix>
          <span class="icon-search-normal text-gray text-xl"></span>
        </template>
        <template #suffix>
          <button
            :class="{ '!opacity-100 !visible': filter.search?.length }"
            class="w-5 h-5 flex-center bg-gray/[16%] rounded-full p-1 transition-200 group hover:bg-red opacity-0 invisible"
            @click="filter.search = ''"
          >
            <span
              class="icon-close text-gray text-[10px] transition-200 group-hover:text-white"
            />
          </button>
        </template>
      </FInput>
      <CButton
        v-if="!route.query.studentId"
        class="min-w-[220px]"
        icon-position="left"
        icon="icon-add"
        :text="$t('add_student')"
        @click="openDialog"
      />

      <CButton
        v-if="route.query.studentId"
        class="min-w-[220px]"
        icon-position="left"
        icon="icon-add"
        :text="$t('add_student')"
        @click="showModalConfirm = true"
      />
    </template>
  </Teleport>
  <div class="w-full" v-if="!activateExclude">
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
      <template #actions>
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
                class="min-w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
              >
                <i class="icon-lock text-red text-xl"></i>
                <span
                  class="text-sm font-medium text-dark-100 leading-normal"
                  >{{ $t("student_profile.block") }}</span
                >
              </div>
              <hr class="w-full h-[1px] bg-gray-300" />
              <div
                class="min-w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
                @click="showExcluded"
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
  </div>
  <CExcludeStudent
    @excludeStudents="handleExcludeStudents"
    v-if="activateExclude"
  />
  <CDeleteDialog
    :show="showExcludedDialog"
    :title="$t('excluded_student')"
    :subtitle="$t('excluded_student_text')"
    icon="icon-trash"
    color="!text-yellow bg-[#FEF5E6]"
    variant="warning-yellow"
    submit-text="table.dropdown.delete"
    :loading="buttonLoading"
    @close="showExcludedDialog = false"
    @submit="excludeStudent"
  />

  <CDialog :show="showModalConfirm" no-header body-class="!max-w-[480px]">
    <div class="p-6">
      <div class="p-2 flex flex-col items-center justify-center">
        <CRoundedIcon :color="'!text-green bg-green-100'" :icon="'icon-add'" />

        <p
          class="text-center mt-5 text-xl leading-130 font-semibold text-dark-100"
        >
          {{ t("confirm_addition") }}
        </p>

        <p
          class="text-base leading-130 font-normal text-gray-700 text-center mt-2 mx-auto"
        >
          {{ t("really_want_to_add_a_student") }}
        </p>
      </div>

      <div class="flex items-center gap-4 mt-6">
        <CButton
          class="w-full"
          :text="$t('cancel')"
          @click="showModalConfirm = false"
          variant="secondary"
        />
        <CButton
          class="w-full"
          :text="$t('add')"
          @click="addStudentToGroup"
          :loading="memberCreateLoading"
        />
      </div>
    </div>
  </CDialog>

  <CDialog :show="showModal" :title="$t('add_student')" @close="closeDialog">
    <div class="p-6">
      <FInput
        :disabled="studentsLoading"
        :placeholder="$t('add_student')"
        class="min-w-[240px] !pr-0.5 !border-gray-800"
        v-model="studentPhoneNumber"
        :error="responseError"
        @enter="getStudents"
      >
        <template #prefix>
          <span class="icon-search-normal text-gray text-xl mr-2"></span>
        </template>
        <template #suffix>
          <CButton
            class="!h-9"
            :text="$t('search')"
            :loading="studentsLoading"
            @click="getStudents"
          />
        </template>
      </FInput>
      <div
        class="mt-4 ml-1 flex flex-row space-x-2 items-center justify-between"
      >
        <FCheckbox
          :label="$t('new_students')"
          :checked="isNew"
          @change="isNew = !isNew"
          class="rounded"
        />
        <p class="text-sm p-1">
          {{ $t("added_students") }} : <strong>{{ studentsId.length }}</strong>
        </p>
      </div>
      <div class="flex flex-col gap-2 mt-4 max-h-[350px] overflow-y-auto">
        <!--        @remove="students.splice(index, 1)"-->
        <div
          class="p-2 text-black text-center"
          v-if="students?.length === 0 && !studentsLoading"
        >
          {{ $t("no_result") }}
        </div>
        <div
          v-if="studentsLoading && students?.length === 0"
          class="flex flex-col gap-3"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="flex-center-between px-3 py-2 border rounded-lg border-gray-800 animate-pulse"
          >
            <div class="flex-y-center gap-3">
              <!-- Avatar Skeleton -->
              <div class="w-9 h-9 bg-gray-300 rounded-full animate-pulse"></div>

              <!-- Content Skeleton -->
              <div class="space-y-2">
                <!-- Name Skeleton -->
                <div class="h-4 w-32 bg-gray-300 rounded"></div>

                <div class="flex space-x-2">
                  <!-- Role Skeleton -->
                  <div class="h-4 w-16 bg-gray-300 rounded"></div>
                  <!-- Separator -->
                  <div class="h-4 w-1 bg-transparent"></div>
                  <!-- Phone Skeleton -->
                  <div class="h-4 w-24 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CPreviewUserCard
          v-for="(option, index) in students"
          :key="index"
          v-bind="{ option, studentsId }"
          @add="
            studentsId.indexOf(option?.id) === -1
              ? studentsId.push(option.id)
              : null
          "
          @remove="studentsId = studentsId.filter((id) => id !== option.id)"
          no-role
        />
        <div
          v-if="studentsCount > students?.length"
          ref="target"
          class="my-2"
        />
      </div>
      <div class="flex items-center gap-4 mt-6">
        <CButton
          class="w-full"
          :text="$t('cancel')"
          @click="closeDialog"
          variant="secondary"
        />
        <CButton
          class="w-full"
          :text="$t('add')"
          :disabled="!students.length"
          @click="groupMemberCreate"
          :loading="memberCreateLoading"
        />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CCoursePaymentStatus from "@/modules/Students/components/CCoursePaymentStatus.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute, useRouter } from "vue-router";
import { useMounted } from "@/composables/useMounted";
import FInput from "@/components/Form/Input/FInput.vue";
import { onMounted, reactive, ref, watch } from "vue";
import { debounce, updateQueryParams } from "@/utils";
import FSelectCustom from "@/components/Form/Select/FSelectCustom.vue";
import { useI18n } from "vue-i18n";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import ApiService from "@/services/ApiService";
import CButton from "@/components/Common/CButton.vue";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { useCustomToast } from "@/composables/useCustomToast";
import CPreviewUserCard from "@/modules/Courses/components/Groups/Create/CPreviewUserCard.vue";
import CUserCardCopy from "@/components/Card/CUserCardCopy.vue";
import CRoundedIcon from "@/components/Common/CRoundedIcon.vue";
import FCheckbox from "@/components/Form/FCheckbox.vue";
import { useIntersectionObserver } from "@vueuse/core";
import CExcludeStudent from "@/modules/Courses/components/Groups/CExcludeStudent.vue";
import { StudentsHeadData } from "@/modules/Courses/data";

const { mounted } = useMounted();

const { showToast } = useCustomToast();
const route = useRoute();
const { t } = useI18n();

const buttonLoading = ref(false);
const showExcludedDialog = ref(false);
const activateExclude = ref(false);
const selectedStudent = ref(null);
const showModal = ref(false);
const showModalConfirm = ref(false);
const studentsLoading = ref(false);
const memberCreateLoading = ref(false);
const responseError = ref(false);
const studentPhoneNumber = ref("");
const studentsId = ref([]);
const isNew = ref(false);
const target = ref(null);

const students = ref([]);
const excludeStudentList = ref([]);
const studentsCount = ref(0);
const router = useRouter();

const filter = reactive({
  search: route.query?.search || "",
  status: route.query?.paid || "all",
});

const {
  tableData,
  paginationData,
  onPageChange,
  onChangeLimit,
  onSearch,
  fetchTableData,
  loading,
} = useTableFetch(`backoffice/GroupStudents/${route.params.groupId}/`);

function showExcluded() {
  activateExclude.value = true;
}

function excludeStudent() {
  buttonLoading.value = true;
  ApiService.delete(`backoffice/BulkGroupMemberDelete/`, {
    data: { ids: excludeStudentList.value },
  })
    .then(() => {
      showExcludedDialog.value = false;
      activateExclude.value = false;
      fetchTableData();
    })
    .finally(() => (buttonLoading.value = false));
}
function handleExcludeStudents(data: number[]): void {
  excludeStudentList.value = data;
  if (excludeStudentList.value?.length) {
    showExcludedDialog.value = true;
  }
}

function closeDialog() {
  showModal.value = false;
  studentPhoneNumber.value = "";
  responseError.value = false;
  students.value = [];
  studentsId.value = [];
  router.push({ path: route.path, query: {} });
}

function openDialog() {
  showModal.value = true;
  getStudents();
}

function groupMemberCreate() {
  memberCreateLoading.value = true;
  ApiService.post(`backoffice/GroupMemberCreate/`, {
    group: Number(route.params?.groupId),
    students_ids: studentsId.value,
  })
    .then(() => {
      fetchTableData();
      closeDialog();
    })
    .catch((err) => {
      showToast(err?.response?.data?.[0]?.error?.message, "error");
    })
    .finally(() => (memberCreateLoading.value = false));
}

function addStudentToGroup() {
  if (!route.query.studentId && !route.params?.groupId) return;

  memberCreateLoading.value = true;
  ApiService.post(`/backoffice/GroupMemberCreate/`, {
    group: Number(route.params?.groupId),
    students_ids: [route.query?.studentId],
  })
    .then(() => {
      fetchTableData();
      closeDialog();
    })
    .catch((err) => {
      showToast(err?.response?.data?.[0]?.error?.message, "error");
    })
    .finally(() => {
      memberCreateLoading.value = false;
      showModalConfirm.value = false;
    });
}

const students_page_size = ref(10);
async function getStudents() {
  try {
    studentsLoading.value = true;
    const res = await ApiService.get(
      `backoffice/StudentsList`,
      `?search=${studentPhoneNumber.value}${
        isNew.value ? "&is_new=true" : ""
      }${`&page_size=${students_page_size.value}`}`
    );

    students.value = res.data.results;
    studentsCount.value = res?.data?.count;
    responseError.value = false;
  } catch (err) {
    responseError.value = true;
    showToast(err?.response?.data?.[0]?.error?.message, "error");
  } finally {
    studentsLoading.value = false;
  }
}

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  console.log(isIntersecting, "isIntersecting");
  if (isIntersecting) {
    students_page_size.value += 10;
    getStudents();
  }
});
watch(
  () => filter.search,
  () => onSearch(filter.search)
);

watch(
  () => filter.status,
  async () => {
    if (filter.status === "all") {
      await updateQueryParams("paid", undefined);
    } else {
      await updateQueryParams("paid", filter.status);
    }
    await fetchTableData();
  }
);

onMounted(async () => {
  await getStudents();
});

watch(
  () => isNew.value,
  () => {
    debounce("student-search", async () => {
      await getStudents();
    });
  }
);

const options = [
  {
    label: t("all"),
    value: "all",
  },
  {
    label: t("succeed"),
    value: "true",
  },
  {
    label: t("no_succeed"),
    value: "false",
  },
];
</script>
