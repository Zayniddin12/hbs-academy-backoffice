<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="headData"
        :data="tableData"
        :items-per-page="paginationData?.defaultLimit ?? 0"
        :limit="paginationData?.defaultLimit ?? 0"
        :total="paginationData?.total"
        :current-page="paginationData?.currentPage ?? 0"
        :title="t('workers.title')"
        :subtitle="t('workers.plural', { count: paginationData?.total })"
        @search="onSearch"
        @itemsPerPage="onChangeLimit"
        :loading="loading"
        @pageChange="onPageChange"
      >
        <!--        header    -->
        <template #beforeSearch>
          <FSelect
            :key="leadRoles?.length"
            :options="leadRoles"
            value-key="value"
            label-key="label"
            :placeholder="t('all_roles')"
            v-model="selectedRole"
            active-icon
            head-styles="!bg-transparent px-3 py-2.5 min-w-[200px] border !border-[1px] !border-gray-800 rounded-md"
          />
        </template>
        <template #afterSearch>
          <CButton
            v-if="grandAccess(userRole ?? '')"
            class="h-10 flex items-center justify-center whitespace-nowrap !px-3 !py-2"
            icon="icon-add"
            icon-position="left"
            :text="t('add_worker')"
            @click="openModal"
          />
        </template>
        <!--        body   -->
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data._index + '.'"
          />
        </template>
        <template #user="{ row: data }">
          <CWorkerCard
            :card="{
              id: data?.id ?? 0,
              full_name: data?.full_name,
              avatar: data?.avatar,
              isOnline: data?.is_online,
            }"
            slug="ColleaguesSingle"
          />
        </template>
        <template #login="{ row: data }">
          <p class="transition-300 hover:text-green">
            {{ data?.username }}
          </p>
        </template>
        <template #phone="{ row: data }">
          <a
            :href="`tel:${data?.phone_number}`"
            class="transition-300 hover:text-green"
          >
            {{ formatPhoneNumber(data?.phone_number) }}
          </a>
        </template>

        <template #role="{ row: data }">
          <span
            class="inline-flex items-center justify-center py-1.5 px-2 text-xs leading-normal text-center rounded-md capitalize"
            :class="getRoleStyle(data?.role)"
            v-text="t(data?.role)"
          />
        </template>

        <template v-if="grandAccess(userRole ?? '')" #action="{ row: data }">
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
                  @click="openEditModal(data?.id)"
                  class="min-w-[158px] h-11 cursor-pointer flex items-center p-3 gap-2 hover:bg-gray-300"
                >
                  <i class="icon-edit-2 text-gray text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                  >
                    {{ t("table.dropdown.edit") }}
                  </span>
                </div>
                <hr class="w-full h-[1px] bg-gray-300" />
                <div
                  class="min-w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300"
                  @click="
                    () => {
                      showResetPassword = true;
                      selectedWorkerId = data?.id;
                    }
                  "
                >
                  <i class="icon-key-converted text-gray text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ t("table.dropdown.key") }}</span
                  >
                </div>
                <hr class="w-full h-[1px] bg-gray-300" />
                <div
                  class="min-w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300"
                  @click="
                    () => {
                      showDelete = true;
                      selectedWorkerId = data?.id;
                    }
                  "
                >
                  <i class="icon-trash text-red text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ t("table.dropdown.delete") }}</span
                  >
                </div>
              </div>
            </template>
          </CDropdown>
        </template>

        <template #beforePagination>
          <ul class="flex gap-5 mr-auto">
            <li
              v-for="{ id, className, text } in workersStatus"
              :key="id"
              class="flex items-center gap-2 cursor-pointer"
            >
              <span
                class="inline-block h-4 w-4 bg-white rounded-full border-[3px] border-solid"
                :class="className"
              />
              <span
                v-text="t(text)"
                class="text-gray-700 text-xs font-medium"
              />
            </li>
          </ul>
        </template>
        <template #no-data>
          <CNodata
            :title="$t('no_workers')"
            :subtitle="$t('no_workers_text')"
          />
        </template>
      </CTableWrapper>
    </section>

    <PAdd
      :visible="visible"
      @close="visible = false"
      @submit="fetchTableData"
    />
    <PUpdate
      :edit-visible="editVisible"
      @close="editVisible = false"
      @submit="fetchTableData"
    />
    <CDeleteDialog
      :title="$t('delete_worker')"
      :subtitle="$t('delete_worker_text')"
      @close="showDelete = false"
      :show="showDelete"
      @submit="deleteWorker"
    />
    <CResetPasswordModal
      v-bind="{ form }"
      :loading="buttonLoading"
      :show="showResetPassword"
      @close="showResetPassword = false"
      @submit="resetPassword"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { formatPhoneNumber, updateQueryParams } from "@/utils";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import { workersStatus } from "@/modules/Colleagues/data";
import CButton from "@/components/Common/CButton.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import PAdd from "@/modules/Colleagues/pages/PAdd.vue";
import { useWorkersStore } from "@/modules/Colleagues/store";
import CWorkerCard from "@/modules/Colleagues/components/CWorkerCard.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import PUpdate from "@/modules/Colleagues/pages/PUpdate.vue";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import { useCustomToast } from "@/composables/useCustomToast";
import CResetPasswordModal from "@/modules/Students/components/CResetPasswordModal.vue";
import { useHandleError } from "@/composables/useHandleError";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { useRoute } from "vue-router";
import { useStudentsStore } from "@/modules/Students/store";
import CNodata from "@/components/Common/CNodata.vue";
import { useAuthStore } from "@/modules/Auth/stores";

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  loading,
  fetchTableData,
} = useTableFetch(`/backoffice/WorkerList/`);

const { handleError } = useHandleError();
const { t } = useI18n();
const { mounted } = useMounted();
const { showToast } = useCustomToast();
const route = useRoute();

const selectedRole = ref(route.query?.role || "all");
const showDelete = ref(false);
const showResetPassword = ref(false);
const selectedWorkerId = ref("");
const buttonLoading = ref(false);

const store = useWorkersStore();
const studentStore = useStudentsStore();

const authStore = useAuthStore();

const userRole = computed(() => authStore?.user?.role);

function grandAccess(role: string) {
  return ["admin", "manager"]?.includes(role);
}

const leadRoles = computed(() => {
  return [
    {
      label: t("all_roles"),
      value: "all",
    },
    ...store.leadRoles.map((r) => {
      return {
        label: t(r.label),
        value: r.value,
      };
    }),
  ];
});

const visible = ref(false);
const editVisible = ref(false);

const routes = computed(() => [
  {
    name: t("workers.title"),
    route: "/colleagues",
  },
]);

const headData = computed(() => {
  const data = [
    {
      title: "workers.table.index",
      key: "_index",
    },
    {
      title: "workers.table.user",
      key: "user",
    },
    {
      title: "workers.table.login",
      key: "login",
    },
    {
      title: "workers.table.phone",
      key: "phone",
    },
    {
      title: "workers.table.role",
      key: "role",
    },
    {
      title: "workers.table.actions",
      key: "action",
    },
  ];

  if (userRole.value === "mentor") {
    return data.map((item) =>
      item.key === "action"
        ? { title: "", key: "" }
        : { title: item?.title, key: item?.key }
    );
  }

  return data;
});

const getRoleStyle = (role: string) => {
  if (role === "manager") return "text-dark-100 bg-gray-800";
  if (role === "teacher") return "text-green bg-green-100";
  return "text-yellow bg-yellow-100";
};

const openModal = () => (visible.value = true);
const openEditModal = (id: string) => {
  store.fetchWorkerDetails(id);
  editVisible.value = true;
};

// States

watch(
  () => selectedRole.value,
  async (val) => {
    if (val === "all") {
      await updateQueryParams("role", undefined);
    } else {
      await updateQueryParams("role", val);
    }
    fetchTableData();
  }
);

const deleteWorker = () => {
  showDelete.value = false;
  store
    .deleteWorker(selectedWorkerId.value)
    .then(() => {
      showToast(t("worker_deleted_successfully"), "success");
      fetchTableData();
    })
    .catch(() => {
      showToast(t("worker_delete_error"), "error");
    });
};

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
    buttonLoading.value = true;
    studentStore
      .resetStudentPassword(String(selectedWorkerId.value), form.values)
      .then(() => {
        showToast(t("worker_updated_successfully"), "success");
        fetchTableData();
        showResetPassword.value = false;
        form.values.new_password = "";
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => (buttonLoading.value = false));
  }
};

watch(
  () => showResetPassword.value,
  () => {
    if (showResetPassword.value) {
      form.values.new_password = "";
      form.$v.value.$reset();
    }
  }
);

// Fetch data
store.fetchLeadRoles();
</script>
