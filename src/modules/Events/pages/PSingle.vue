<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <CCommonHeader
      class="mb-6"
      :title="single?.title"
      no-tabs
      no-image
      no-hr
      :sub-title="single?.description"
    >
      <template #actions v-if="single">
        <CButton
          :text="$t('edit_event')"
          icon="icon-edit"
          icon-position="left"
          class="!h-10 flex-center"
          @click="showEditEvent = true"
        />
      </template>
      <template #details v-if="single">
        <CProfileDashDetail
          :title="
            single?.datetime
              ? dayjs.utc(single?.datetime).format('D MMMM YYYY, HH:mm')
              : '-'
          "
          :description="$t('date_conducted') + ':'"
        />
        <CProfileDashDetail :description="$t('event_status')">
          <CEventStatusBadge :status="single?.status" />
        </CProfileDashDetail>
        <CProfileDashDetail
          :title="formatMoneyDecimal(single?.total_visitors)"
          :description="$t('prediction_visitors')"
        />
        <CProfileDashDetail
          :title="formatMoneyDecimal(single?.total_visited_students)"
          :description="$t('come_visitors')"
        />
      </template>
    </CCommonHeader>

    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="headData"
        :data="tableData"
        :loading="loading"
        :items-per-page="paginationData.defaultLimit"
        :limit="paginationData.defaultLimit"
        :total="paginationData.total"
        :current-page="paginationData.currentPage"
        :title="$t('students_come')"
        :subtitle="$t('students_come_count', { count: paginationData.total })"
        @search="onSearch"
        @pageChange="onPageChange"
        @itemsPerPage="onChangeLimit"
      >
        <template #_index="{ row: data }">
          <p class="font-semibold">{{ data?._index }}.</p>
        </template>
        <template #name="{ row: data }">
          <CUserCard
            :card="{ full_name: data?.full_name, avatar: data?.avatar }"
            :isOnline="data?.is_online"
          />
        </template>
        <template #flow="{ row: data }">
          <div>
            <p class="text-sm leading-normal font-medium text-dark-100">
              {{ data?.flow?.flow_name }}
            </p>
            <p class="text-xs leading-normal font-normal text-gray-700 mt-0.5">
              {{ data?.flow?.group_name }}
            </p>
          </div>
        </template>
        <template #date="{ row: data }">
          <CEventStatusBadge :status="data?.attendance_status?.status" />
          <p
            class="mt-1 text-xs leading-normal font-normal text-dark-100"
            v-if="
              data?.attendance_status?.datetime &&
              data?.attendance_status?.datetime !== 'not_set'
            "
          >
            {{
              dayjs(
                new Date(data?.attendance_status?.datetime).toISOString()
              ).format("YYYY-MM-DD HH:mm")
            }}
          </p>
          <p
            class="mt-1 text-xs leading-normal font-normal text-dark-100"
            v-else
          >
            -
          </p>
        </template>
        <template
          #actions="{ row: data }"
          v-if="
            single?.status === 'on_going' &&
            (data?.attendance_status?.status !== 'present' ||
              data?.attendance_status?.status !== 'absent')
          "
        >
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
                  v-for="(el, idx) of attendanceTypes"
                  :key="idx"
                  @click="handleCreateAttendance(el?.value, data?.id)"
                  class="min-w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
                >
                  <i :class="el?.icon"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                  >
                    {{ $t(el?.title) }}
                  </span>
                </div>
              </div>
            </template>
          </CDropdown>
        </template>

        <!--    Actions    -->
        <template #beforeSearch>
          <div class="flex-y-center gap-5">
            <FSelect
              :options="[
                {
                  name: $t('all_flows'),
                  id: 'all',
                },
                ...flows,
              ]"
              v-model="eventFlow"
              selected-option-styles="bg-white !border-gray-800 rounded-md "
              value-key="id"
              :placeholder="$t('all_flows')"
              label-key="name"
              class="min-w-[160px]"
            />
            <FSelect
              :options="statusOptions"
              v-model="eventStatus"
              selected-option-styles="bg-white !border-gray-800 rounded-md "
              value-key="value"
              label-key="label"
              :placeholder="$t('all_attendance')"
              class="min-w-[160px]"
            />
          </div>
        </template>

        <template #no-data>
          <div class="py-[128px] flex-center">
            <div class="text-center">
              <img
                src="/images/svg/no-data/no-events.svg"
                alt="no-events"
                class="mx-auto"
              />
              <p class="text-base leading-130 font-semibold text-dark-100 mt-6">
                {{ $t("no_events_yet") }}
              </p>
              <p class="mt-1.5 text-sm leading-130 font-normal text-gray">
                {{ $t("no_events_yet_text") }}
              </p>
            </div>
          </div>
        </template>
      </CTableWrapper>
    </section>
    <CAddEvent
      edit
      :show="showEditEvent"
      @close="showEditEvent = false"
      :courses="courses"
      :single="single"
      @updateEvents="handleUpdateEvent"
    />
  </div>
</template>

<script setup lang="ts">
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import CEventStatusBadge from "@/modules/Events/components/CEventStatusBadge.vue";
import { formatMoneyDecimal, updateQueryParams } from "@/utils";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CUserCard from "@/components/Card/CUserCard.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import { computed, onMounted, ref, watch } from "vue";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import apiService from "@/services/ApiService";
import { useRoute } from "vue-router";
import { useTableFetch } from "@/composables/useTableFetch";
import CAddEvent from "@/modules/Events/components/CAddEvent.vue";
import CButton from "@/components/Common/CButton.vue";

dayjs.extend(utc);
const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();

const showEditEvent = ref(false);

const attendanceLoading = ref(false);

const single = ref(null);
const flows = ref([]);
const courses = ref([]);

const eventStatus = ref(route?.query?.status ?? "");
const eventFlow = ref(route?.query?.flow ?? "");

const attendanceTypes = [
  {
    title: "mark_as_visited",
    value: "present",
    icon: "icon-tick-circle text-green text-xl",
  },
  {
    title: "mark_as_unvisited",
    value: "absent",
    icon: "icon-forbidden text-gray text-xl",
  },
];

const {
  tableData,
  paginationData,
  onPageChange,
  onChangeLimit,
  onSearch,
  loading,
  fetchTableData,
} = useTableFetch(`backoffice/EventVisitors/${route.params.id}/`);

const handleCreateAttendance = (
  value: "present" | "absent",
  studentID: string
) => {
  attendanceLoading.value = true;
  apiService
    .post(`backoffice/StudentOnlineAttendanceCreate/`, {
      event: Number(route.params.id),
      student: studentID,
      status: value,
    })
    .then((response) => {
      fetchTableData();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      attendanceLoading.value = false;
    });
};

const fetchCourses = () => {
  apiService
    .query("/backoffice/EventCourseList/", { page_size: 100, page: 1 })
    .then((res) => {
      courses.value = res.data.results;
    })
    .catch((err) => {
      console.log(err, "err");
    });
};

const fetchEventSingle = () => {
  apiService
    .get(`/backoffice/Event/${route.params.id}/`)
    .then(async (res) => {
      single.value = res.data;
      if (single.value) {
        await fetchFlows();
        await fetchCourses();
      }
    })
    .catch((err) => {
      console.log(err, "err");
    });
};
const fetchFlows = () => {
  apiService
    .query(`/backoffice/EventFlows/${single.value?.course?.id}/`, {
      page_size: 100,
      page: 1,
    })
    .then((res) => {
      flows.value = res.data.results;
    })
    .catch((err) => {
      console.log(err, "err");
    });
};

const handleUpdateEvent = () => {
  fetchEventSingle();
  fetchTableData();
};

onMounted(async () => {
  await fetchEventSingle();
});

watch(
  () => eventStatus.value,
  async () => {
    if (eventStatus.value !== "all") {
      await updateQueryParams("attendance_status", eventStatus.value);
    } else {
      await updateQueryParams("attendance_status", "");
    }
    await fetchTableData();
  },
  { deep: true }
);
watch(
  () => eventFlow.value,
  async () => {
    if (eventFlow.value !== "all") {
      await updateQueryParams("flow", eventFlow.value);
    } else {
      await updateQueryParams("flow", "");
    }
    await fetchTableData();
  },
  { deep: true }
);

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("events"),
    route: "/events",
  },
  {
    name: "Single",
    route: "/",
  },
]);

const statusOptions = [
  {
    label: t("all_attendance"),
    value: "all",
  },
  {
    label: t("present"),
    value: "present",
  },
  {
    label: t("absent"),
    value: "absent",
  },
  {
    label: t("not_set"),
    value: "not_set",
  },
];

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "name_student",
    key: "name",
  },
  {
    title: "flow_group",
    key: "flow",
  },
  {
    title: "date_entrance",
    key: "date",
  },
  {
    title: "actions",
    key: "actions",
  },
];
</script>
