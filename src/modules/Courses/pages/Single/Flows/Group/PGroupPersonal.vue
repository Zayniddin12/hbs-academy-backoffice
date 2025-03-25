<template>
  <Teleport v-if="mounted" to="#group-actions">
    <FSelectCustom
      :key="roles?.length > 1"
      :placeholder="$t('role')"
      v-model="filter.role"
      :options="roles"
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
      class="min-w-[220px]"
      icon-position="left"
      icon="icon-add"
      :text="$t('add_personal')"
      @click="openDialog"
    />
  </Teleport>
  <div class="w-full">
    <CTableWrapper
      no-header
      :head="headData"
      :data="tableData"
      :items-per-page="paginationData?.defaultLimit"
      :limit="paginationData?.defaultLimit"
      :total="paginationData?.total"
      :current-page="paginationData?.currentPage"
      @itemsPerPage="onChangeLimit"
      @pageChange="onPageChange"
      :loading="loading"
    >
      <template #_index="{ row: data }">
        <p class="font-semibold">{{ data?._index }}.</p>
      </template>
      <template #student="{ row: data }">
        <CStudentCard
          :card="{
            name: data?.full_name,
            image: data?.avatar,
            isBlocked: !data?.is_active,
            isOnline: data?.is_online,
          }"
        />
      </template>
      <template #username="{ row: data }">
        <p class="text-xs leading-normal font-normal text-dark-100">
          {{ data?.login }}
        </p>
      </template>
      <template #phone="{ row: data }">
        <p class="text-xs leading-normal font-normal text-dark-100">
          {{ formatPhoneNumber(data?.phone_number) }}
        </p>
      </template>
      <template #role="{ row: data }">
        <CUserRoleCard :role="data?.role" />
      </template>
      <template #actions="{ row: data }">
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
                class="min-w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-red-100 transition-300"
                @click="openDelete(data)"
              >
                <i class="icon-trash text-red text-xl"></i>
                <span
                  class="text-sm font-medium text-dark-100 leading-normal"
                  >{{ $t("remove") }}</span
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

  <CDeleteDialog
    :show="showDelete"
    :title="$t('delete_lead_from_group')"
    :subtitle="$t('delete_lead_from_group_text')"
    @close="showDelete = false"
    @submit="deleteLead"
    :loading="buttonLoading"
  />
  <CDialog :show="showModal" :title="$t('add_personal')" @close="closeDialog">
    <div class="p-6">
      <div v-if="selectedWorkers.length !== 0">
        <p class="mb-2 font-medium ml-1 text-xs leading-normal text-black">
          <strong class="">{{ selectedWorkers.length }}</strong> -
          {{ $t("added_students") }}
        </p>
      </div>
      <FSelect :options="workers" selected-option-styles="!p-0">
        <template #selectedOption>
          <FInput
            :placeholder="$t('add_personal')"
            input-class="!font-medium"
            v-model="search"
          >
            <template #prefix>
              <i class="icon-search-normal text-gray-50 text-xl mr-3" />
            </template>
          </FInput>
        </template>
        <template #option="data">
          <div class="flex-center-between px-3 py-2 border-b border-gray-800">
            <div class="flex-y-center gap-3">
              <CAvatar class="!w-9 !h-9" :image="data?.option?.avatar" />
              <div>
                <p class="text-sm leading-130 font-medium text-dark-100">
                  {{ data?.option?.full_name }}
                </p>
                <p class="mt-1 text-sm leading-130 font-normal text-gray">
                  {{ $t(data?.option?.role) }}
                </p>
              </div>
            </div>
            <CButton
              :disabled="
                selectedWorkers.findIndex(
                  (item) => item.id === data.option.id
                ) !== -1
              "
              class="h-9 flex-center"
              :text="$t('add')"
              @click="addWorker(data.option)"
            />
          </div>
        </template>
      </FSelect>
      <div class="flex flex-col gap-2 mt-5 min-h-[200px]">
        <CPreviewUserCard
          v-for="(option, index) in selectedWorkers"
          :key="index"
          :students-id="selectedWorkers.map((student) => student.id)"
          v-bind="{ option }"
          no-close
          @remove="selectedWorkers.splice(index, 1)"
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
          :text="$t('save')"
          :disabled="!selectedWorkers.length"
          @click="groupLeadCreate"
        />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import CUserRoleCard from "@/modules/Courses/components/Groups/CUserRoleCard.vue";
import { useRoute } from "vue-router";
import { useTableFetch } from "@/composables/useTableFetch";
import CStudentCard from "@/modules/Students/components/CStudentCard.vue";
import { formatPhoneNumber, updateQueryParams } from "@/utils";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import { reactive, ref, watch } from "vue";
import FSelectCustom from "@/components/Form/Select/FSelectCustom.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import ApiService from "@/services/ApiService";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import CButton from "@/components/Common/CButton.vue";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
import { useCoursesStore } from "@/modules/Courses/store";
import { computed } from "vue";
import { debounce } from "@/utils";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { IWorker } from "@/modules/Courses/types";
import CAvatar from "@/components/CAvatar.vue";
import CPreviewUserCard from "@/modules/Courses/components/Groups/Create/CPreviewUserCard.vue";

const { mounted } = useMounted();

const route = useRoute();
const { t } = useI18n();

const store = useCoursesStore();
const showDelete = ref(false);
const buttonLoading = ref(false);
const selectedLead = ref(null);
const showModal = ref(false);
const search = ref("");
const selectedWorkers = ref([]);

const workers = computed(() => store.workers);
const roles = ref([
  {
    label: t("all"),
    value: "all",
  },
]);

const filter = reactive({
  search: route.query?.search || "",
  role: route.query?.lead__role || "all",
});

const {
  tableData,
  paginationData,
  onPageChange,
  onChangeLimit,
  fetchTableData,
  onSearch,
  loading,
} = useTableFetch(`backoffice/GroupLeads/${route.params.groupId}/`, {}, true);

function getRoles() {
  ApiService.get("backoffice/LeadRoles").then((res) => {
    res.data?.roles.forEach((el) => roles.value.push(el));
  });
}
function openDialog() {
  store.fetchWorkers("");
  showModal.value = true;
}
function closeDialog() {
  showModal.value = false;
  selectedWorkers.value = [];
  search.value = "";
}

getRoles();

function deleteLead() {
  buttonLoading.value = true;
  ApiService.delete(`backoffice/GroupLeadDelete/${selectedLead.value?.id}/`)
    .then(() => {
      showDelete.value = false;
      fetchTableData();
    })
    .finally(() => (buttonLoading.value = false));
}

function openDelete(data: any) {
  selectedLead.value = data;
  showDelete.value = true;
}
const addWorker = (worker: IWorker) => {
  if (search.value) search.value = "";

  if (selectedWorkers.value.includes(worker)) return;

  selectedWorkers.value.push(worker);
};
function groupLeadCreate() {
  ApiService.post(`backoffice/GroupLeadsCreateWithIDs/`, {
    group: route.params?.groupId,
    lead_ids: selectedWorkers.value.map((lead) => lead?.id),
  }).then(() => {
    closeDialog();
    fetchTableData();
  });
}
watch(
  () => search.value,
  (value) => {
    debounce("worker_search", () => {
      store.fetchWorkers(value);
    });
  }
);
watch(
  () => filter.search,
  () => onSearch(filter.search)
);

watch(
  () => filter.role,
  async () => {
    if (filter.role === "all") {
      await updateQueryParams("lead__role", undefined);
    } else {
      await updateQueryParams("lead__role", filter.role);
    }
    await fetchTableData();
  }
);

watch(
  () => search.value,
  (value) => {
    debounce("worker_search", () => {
      store.fetchWorkers(value);
    });
  }
);
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
    title: "login",
    key: "username",
  },
  {
    title: "workers.table.phone",
    key: "phone",
  },
  {
    title: "role",
    key: "role",
  },
  {
    title: "actions",
    key: "actions",
  },
];
</script>
