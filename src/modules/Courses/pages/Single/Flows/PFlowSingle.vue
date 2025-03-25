<template>
  <div>
    <div class="relative">
      <CBackButton :link="`/courses/${$route.params.courseId}/flows`" />
      <CCommonHeader no-hr title="Title" no-image no-tabs class="relative">
        <template #title><div></div></template>

        <template #subTitle>
          <div class="flex-y-center gap-1">
            <p class="text-xl leading-130 font-semibold text-dark-100">
              {{ single?.name }}
            </p>
            <i
              @click="showEdit = true"
              class="icon-edit text-xl text-gray cursor-pointer hover:text-green transition-300"
            />
          </div>
        </template>
        <template #details>
          <div class="flex-center-between w-full">
            <div class="flex-y-center gap-4">
              <CProfileDashDetail
                :title="dayjs(single?.start).format('DD.MM.YYYY')"
                :description="$t('start')"
              />
              <CProfileDashDetail
                :title="dayjs(single?.end).format('DD.MM.YYYY')"
                :description="$t('end_date')"
              />
              <CProfileDashDetail
                :title="single?.groups_count ?? 0"
                :description="$t('dashboard.card.title3')"
              />
            </div>
            <div class="flex-y-center gap-4">
              <FInput
                :placeholder="$t('search')"
                class="min-w-[240px]"
                v-model="search"
              >
                <template #prefix>
                  <span
                    class="icon-search-normal text-gray text-xl mr-2"
                  ></span>
                </template>
              </FInput>
              <RouterLink :to="{ name: 'CourseGroupCreate' }" class="shrink-0">
                <CButton
                  icon-position="left"
                  icon="icon-add"
                  :text="$t('add_group_flow')"
                />
              </RouterLink>
            </div>
          </div>
        </template>
        <template #content>
          <div class="w-full p-5 pt-0 -mt-1">
            <CTableWrapper
              no-header
              :head="headData"
              :data="tableData"
              :loading="loading"
              :items-per-page="paginationData?.defaultLimit"
              :limit="paginationData?.defaultLimit"
              :total="paginationData?.total"
              :current-page="paginationData?.currentPage"
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
                    name: 'CourseFlowsSingleGroup',
                    params: { groupId: data?.id },
                    query: { ...$route.query },
                  }"
                  class="font-medium text-sm leading-130"
                  >{{ data?.title }}</RouterLink
                >
              </template>
              <template #students="{ row: data }">
                <p
                  class="text-xs leading-normal font-normal text-dark-100 flex-y-center gap-1"
                >
                  <i class="icon-people text-xl leading-130 text-gray" />
                  {{ formatMoneyDecimal(data?.students_count) }}
                </p>
              </template>
              <template #point="{ row: data }">
                <p class="text-right text-xs leading-130 text-gray">
                  <span class="font-medium text-dark-100">{{
                    data?.average_score
                  }}</span>
                  /
                  {{ data?.total_ball }}
                </p>
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
                    <p
                      class="text-base leading-130 font-semibold text-dark-100 mt-6"
                    >
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
        </template>
      </CCommonHeader>
    </div>
  </div>
  <CAddGroupModal
    :form="editForm"
    :show="showEdit"
    @close="showEdit = false"
    :loading="buttonLoading"
    :data="single"
    @submit="editFlow"
    edit
  />
</template>

<script setup lang="ts">
import CBackButton from "@/modules/Students/components/CBackButton.vue";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { formatDateRightOrder, formatMoneyDecimal } from "@/utils";
import FInput from "@/components/Form/Input/FInput.vue";
import CButton from "@/components/Common/CButton.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
import ApiService from "@/services/ApiService";
import dayjs from "dayjs";
import CAddGroupModal from "@/modules/Courses/components/Groups/CAddGroupModal.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { useI18n } from "vue-i18n";
import { useCustomToast } from "@/composables/useCustomToast";
import { useHandleError } from "@/composables/useHandleError";

const { t } = useI18n();
const { showToast } = useCustomToast();
const { handleError } = useHandleError();
const route = useRoute();

const single = ref();
const showEdit = ref(false);
const search = ref(route.query?.search || "");

function getSingle() {
  ApiService.get(`backoffice/Flows/${route?.params?.flowId}`).then((res) => {
    single.value = res?.data;
  });
}

getSingle();

const {
  tableData,
  paginationData,
  loading,
  onSearch,
  onPageChange,
  onChangeLimit,
} = useTableFetch(`backoffice/FlowGroups/${route?.params?.flowId}/`);
// backoffice/FlowGroups/1/

const buttonLoading = ref(false);

const editForm = useForm(
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

function editFlow() {
  buttonLoading.value = true;
  const data = {
    course: +route?.params?.courseId,
    name: editForm.values.name,
    start: dayjs(formatDateRightOrder(editForm.values.start)).format(
      "YYYY-MM-DD"
    ),
    end: dayjs(formatDateRightOrder(editForm.values.end)).format("YYYY-MM-DD"),
  };
  ApiService.put(`backoffice/Flows/${route.params?.flowId}/`, data)
    .then(() => {
      showEdit.value = false;
      showToast(t("flow_edited_successfully"), "success");
      getSingle();
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}

watch(
  () => search.value,
  () => onSearch(search.value)
);

watch(
  () => single.value,
  (value: any) => {
    editForm.values.name = value?.name;
    editForm.values.start = dayjs(value?.start).format("DD.MM.YYYY");
    editForm.values.end = dayjs(value?.end).format("DD.MM.YYYY");
  }
);

watch(
  () => showEdit.value,
  () => {
    editForm.values.name = single?.value?.name;
    editForm.values.start = dayjs(single?.value?.start).format("DD.MM.YYYY");
    editForm.values.end = dayjs(single?.value?.end).format("DD.MM.YYYY");
  }
);

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
    title: "students_count",
    key: "students",
  },
  {
    title: "average_point",
    key: "point",
  },
];
</script>
