<template>
  <div class="p-5">
    <CTableWrapper
      :head="headData"
      :data="tableData"
      :loading="loading"
      :items-per-page="paginationData?.defaultLimit"
      :limit="paginationData?.defaultLimit"
      :total="paginationData?.total"
      :current-page="paginationData?.currentPage"
      :title="t('flows')"
      :subtitle="t('flows_count', { count: paginationData?.total })"
      th-class="last:!text-left"
      @search="onSearch"
      @itemsPerPage="onChangeLimit"
      @pageChange="onPageChange"
    >
      <template #_index="{ row: data }">
        <p class="font-semibold">{{ data?._index }}.</p>
      </template>
      <template #name="{ row: data }">
        <RouterLink
          :to="{
            name: 'CourseFlowsSingle',
            params: { flowId: data?.id },
            query: { ...$route.query },
          }"
          class="font-medium text-sm leading-130"
          >{{ data?.name }}</RouterLink
        >
      </template>
      <template #groups="{ row: data }">
        <p>{{ data?.groups_count }}</p>
      </template>
      <template #students="{ row: data }">
        <p
          class="text-xs leading-normal font-normal text-dark-100 flex-y-center gap-1"
        >
          <i class="icon-people text-xl leading-130 text-gray" />
          {{ formatMoneyDecimal(data?.students_count) }}
        </p>
      </template>
      <template #start="{ row: data }">
        <p class="text-xs leading-130 font-normal text-dark-100">
          {{ dayjs(data?.start).format("D MMMM YYYY") }}
        </p>
      </template>
      <template #end="{ row: data }">
        <p class="text-xs leading-130 font-normal text-dark-100">
          {{ dayjs(data?.end).format("D MMMM YYYY") }}
        </p>
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
                class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-red/10 transition-300"
                @click="
                  showDelete = true;
                  selectedFlow = data?.id;
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

      <!--   Actions   -->
      <template #afterSearch>
        <CButton
          :text="$t('add_group')"
          icon="icon-add"
          icon-position="left"
          class="!h-10 flex-center shrink-0"
          @click="showAdd = true"
        />
      </template>

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
            <CButton
              icon-position="left"
              icon="icon-add"
              :text="$t('add_group')"
              class="h-10 flex-center mx-auto mt-6"
              @click="showAdd = true"
            />
          </div>
        </div>
      </template>
    </CTableWrapper>
  </div>
  <CAddGroupModal
    :form="addForm"
    :show="showAdd"
    @close="showAdd = false"
    :loading="buttonLoading"
    @submit="createFlow"
  />
  <CDeleteDialog
    :title="$t('delete_flow')"
    :subtitle="$t('delete_flow_text')"
    @close="showDelete = false"
    :show="showDelete"
    @submit="deleteFlow"
    :loading="buttonLoading"
  />
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CButton from "@/components/Common/CButton.vue";
import { formatDateRightOrder, formatMoneyDecimal } from "@/utils";
import dayjs from "dayjs";
import CAddGroupModal from "@/modules/Courses/components/Groups/CAddGroupModal.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import ApiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";
import { useHandleError } from "@/composables/useHandleError";
import CDropdown from "@/components/Common/CDropdown.vue";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";

const { t } = useI18n();
const { showToast } = useCustomToast();
const showAdd = ref(false);
const route = useRoute();
const { handleError } = useHandleError();
const showDelete = ref(false);
const selectedFlow = ref(0);

const {
  tableData,
  paginationData,
  onSearch,
  loading,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(`/backoffice/Courses/${route?.params?.courseId}/Flows/`);

const buttonLoading = ref(false);

const addForm = useForm(
  {
    name: "",
    start: "",
    end: "",
  },
  {
    name: {
      required,
    },
    start: {
      required,
    },
    end: {
      required,
    },
  }
);

function createFlow() {
  buttonLoading.value = true;
  const data = {
    course: +route?.params?.courseId,
    name: addForm.values.name,
    start: dayjs(formatDateRightOrder(addForm.values.start)).format(
      "YYYY-MM-DD"
    ),
    end: dayjs(formatDateRightOrder(addForm.values.end)).format("YYYY-MM-DD"),
  };
  ApiService.post("backoffice/CreateFlows/", data)
    .then(() => {
      showAdd.value = false;
      fetchTableData();
      showToast(t("flow_created_successfully"), "success");
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}

function deleteFlow() {
  buttonLoading.value = true;
  ApiService.delete(`/backoffice/Flows/${selectedFlow.value}/`)
    .then(() => {
      showDelete.value = false;
      fetchTableData();
      showToast(t("flow_deleted_successfully"), "success");
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "name_group",
    key: "name",
  },
  {
    title: "id_group",
    key: "id",
  },
  {
    title: "groups_count",
    key: "groups",
  },
  {
    title: "students_count",
    key: "students",
  },
  {
    title: "start",
    key: "start",
  },
  {
    title: "end_date",
    key: "end",
  },
  {
    title: "actions",
    key: "actions",
  },
];

watch(
  () => showAdd.value,
  () => {
    addForm.values.name = "";
    addForm.values.start = "";
    addForm.values.end = "";
    addForm.$v.value.$reset();
  }
);
</script>
