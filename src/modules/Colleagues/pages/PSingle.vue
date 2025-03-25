<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>

  <CCommonHeader
    no-tabs
    :title="selectedWorker?.full_name ?? ''"
    :image="selectedWorker?.avatar"
  >
    <template #subTitle>
      <CProfileStatus :role="role" class="mt-2 capitalize" />
    </template>
    <template #details>
      <CProfileDashDetail
        v-for="(detail, index) in dashDetails"
        :key="index"
        v-bind="{ ...detail }"
      />
    </template>
    <template v-if="grandAccess(userRole ?? '')" #actions>
      <CButton
        class="h-9 flex-center text-xs"
        variant="warning-yellow"
        icon="icon-key-converted"
        :text="t('table.dropdown.key')"
        icon-position="left"
        @click="showResetPassword = true"
      />
      <CButton
        class="h-9 flex-center text-xs"
        variant="warning"
        icon="icon-trash"
        :text="t('table.dropdown.remove')"
        icon-position="left"
        @click="showDelete = true"
      />
      <CButton
        class="h-9 flex-center text-xs"
        variant="info"
        icon="icon-edit-2"
        :text="t('table.dropdown.edit')"
        icon-position="left"
        @click="openEditModal"
      />
    </template>
  </CCommonHeader>

  <section class="mt-5 px-5 pt-5 bg-white rounded-2xl">
    <CTableWrapper
      :head="headData"
      :data="leadGroups"
      :items-per-page="paginationData?.defaultLimit ?? 0"
      :limit="paginationData?.defaultLimit ?? 0"
      :total="paginationData?.total"
      :current-page="paginationData?.currentPage ?? 0"
      :title="t('workers_group.title')"
      :subtitle="t('workers_group.plural', { count: paginationData?.total })"
      @search="onSearch"
      @itemsPerPage="onChangeLimit"
      @pageChange="onPageChange"
    >
      <template #_index="{ row: data }">
        <span
          class="text-sm text-dark-100 font-semibold leading-normal"
          v-text="data._index + '.'"
        />
      </template>

      <template #group="{ row: data }">
        <span class="font-medium" v-text="data.group_title" />
      </template>

      <template #course="{ row: data }">
        <CCourseCard
          :card="{
            title: data?.course_title,
            photo: data?.course_photo,
            description: '',
          }"
          route-name="ColleaguesSingle"
        />
      </template>

      <template #average_point="{ row: data }">
        <p>
          <span
            class="text-dark-100 font-medium"
            v-text="data?.course_students_avg_ball ?? 0"
          />
          <span class="text-gray"> / 100</span>
        </p>
      </template>
      <template #date="{ row: data }">
        <p>
          {{ dayjs(data?.start_date).format("D MMMM, YYYY") }} -
          {{ dayjs(data?.end_date).format("D MMMM, YYYY") }}
        </p>
      </template>
      <template #student="{ row: data }">
        <p class="flex items-center justify-end text-dark-100 text-xs gap-1">
          <i class="icon-people text-xl text-gray"></i>{{ data?.student_count }}
        </p>
      </template>
      <template #action>
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
                class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300"
              >
                <i class="icon-lock text-red text-xl"></i>
                <span
                  class="text-sm font-medium text-dark-100 leading-normal"
                  >{{ t("table.dropdown.lock") }}</span
                >
              </div>
              <hr class="w-full h-[1px] bg-gray-300" />
              <div
                class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300"
              >
                <i class="icon-trash text-gray text-xl"></i>
                <span
                  class="text-sm font-medium text-dark-100 leading-normal"
                  >{{ t("table.dropdown.delete") }}</span
                >
              </div>
            </div>
          </template>
        </CDropdown>
      </template>
    </CTableWrapper>
    <PUpdate :edit-visible="editVisible" @close="editVisible = false" />
    <CDeleteDialog
      :title="$t('delete_worker')"
      :subtitle="$t('delete_worker_text')"
      @close="showDelete = false"
      :show="showDelete"
      @submit="deleteWorker"
    />
    <CResetPasswordModal
      v-bind="{ form }"
      :show="showResetPassword"
      @close="showResetPassword = false"
      @submit="resetPassword"
    />
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import { computed, ref } from "vue";

import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CProfileStatus from "@/modules/Students/components/CProfileStatus.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CButton from "@/components/Common/CButton.vue";
import dayjs from "dayjs";
import CCourseCard from "@/modules/Students/components/CCourseCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import { useRoute } from "vue-router";
import { useWorkersStore } from "@/modules/Colleagues/store";
import { WorkersRole } from "@/modules/Colleagues/types";
import { useTableFetch } from "@/composables/useTableFetch";
import PUpdate from "@/modules/Colleagues/pages/PUpdate.vue";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import { useCustomToast } from "@/composables/useCustomToast";
import router from "@/router";
import CResetPasswordModal from "@/modules/Students/components/CResetPasswordModal.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { useHandleError } from "@/composables/useHandleError";
import { useStudentsStore } from "@/modules/Students/store";
import { useAuthStore } from "@/modules/Auth/stores";

const route = useRoute();
const { handleError } = useHandleError();

const { tableData, paginationData, onSearch, onPageChange, onChangeLimit } =
  useTableFetch(`/backoffice/LeadGroups/?lead=${route?.path?.split("/")[2]}`);

const { mounted } = useMounted();
const { t } = useI18n();
const { showToast } = useCustomToast();

const store = useWorkersStore();
const studentStore = useStudentsStore();
const editVisible = ref(false);
const showDelete = ref(false);
const showResetPassword = ref(false);

const openEditModal = () => {
  editVisible.value = true;
};

const deleteWorker = () => {
  showDelete.value = false;
  store
    .deleteWorker(selectedWorker.value?.id + "")
    .then(() => {
      showToast(t("worker_deleted_successfully"), "success");
      router.push("/colleagues");
    })
    .catch(() => {
      showToast(t("worker_delete_error"), "error");
    });
};

const authStore = useAuthStore();

const userRole = computed(() => authStore?.user?.role);

function grandAccess(role: string) {
  return ["admin", "manager"]?.includes(role);
}

const selectedWorker = computed(() => store.worker);
const leadGroups = computed(() => store.leadGroups);

const role = computed(() => {
  return (selectedWorker.value?.role ?? "admin") as WorkersRole;
});

const routes = computed(() => [
  {
    name: t("workers.title"),
    route: "/colleagues",
  },
  {
    name: selectedWorker.value?.full_name,
    route: "/colleagues/" + selectedWorker.value?.id,
  },
]);

const dashDetails = computed(() => [
  {
    title: selectedWorker.value?.phone_number,
    description: t("workers.form.phone"),
  },
  {
    title: selectedWorker.value?.username,
    description: t("workers.form.login"),
  },
  {
    title: dayjs(selectedWorker.value?.data_joined)
      .locale("ru")
      .format("DD MMMM YYYY"),
    description: t("workers.form.date"),
  },
  {
    title: selectedWorker.value?.is_active ? t("active") : t("no_active"),
    description: t("workers.form.status"),
  },
]);

const headData = [
  {
    title: "workers_group.table.id",
    key: "_index",
  },
  {
    title: "workers_group.table.group",
    key: "group",
  },
  {
    title: "workers_group.table.course",
    key: "course",
  },
  {
    title: "workers_group.table.average_point",
    key: "average_point",
  },
  {
    title: "workers_group.table.date",
    key: "date",
  },
  {
    title: "workers_group.table.student",
    key: "student",
  },
];

const form = useForm(
  {
    new_password: "",
  },
  {
    new_password: { required },
  }
);

const resetPassword = () => {
  if (!form.$v.value.$invalid) {
    studentStore
      .resetStudentPassword(String(selectedWorker.value?.id), form.values)
      .then(() => {
        showToast(t("worker_updated_successfully"), "success");
        store.fetchWorkerDetails(route?.path?.split("/")[2]);
        showResetPassword.value = false;
        form.values.new_password = "";
      })
      .catch(({ response }) => {
        handleError(response);
      });
  }
};
// Fetch Single Worker data
store.fetchWorkerDetails(route?.path?.split("/")[2]);
store.fetchLeadRoles();
store.fetchLeadGroups(route?.path?.split("/")[2]);
</script>
