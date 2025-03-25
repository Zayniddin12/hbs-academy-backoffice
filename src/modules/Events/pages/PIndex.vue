<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="headData"
        :data="tableData"
        :loading="loading"
        :items-per-page="paginationData.defaultLimit"
        :limit="paginationData.defaultLimit"
        :total="paginationData.total"
        :current-page="paginationData.currentPage"
        :title="t('events')"
        :subtitle="t('events_count', { count: paginationData.total })"
        @search="onSearch"
        @pageChange="onPageChange"
        @itemsPerPage="onChangeLimit"
      >
        <template #_index="{ row: data }">
          <p class="font-semibold">{{ data?._index }}.</p>
        </template>
        <template #name="{ row: data }">
          <RouterLink
            :to="{ name: 'EventSingle', params: { id: data?.id } }"
            class="text-sm font-medium leading-normal hover:text-green transition-300"
            >{{ data?.title }}</RouterLink
          >
        </template>
        <template #course="{ row: data }">
          <div class="flex-y-center gap-2">
            <CAvatar
              :image="data?.course?.image"
              class="!w-[30px] !h-[30px] rounded-lg"
            />
            <p class="text-xs leading-normal font-normal text-dark-100">
              {{ data?.course?.title }}
            </p>
          </div>
        </template>
        <template #status="{ row: data }">
          <CEventStatusBadge :status="data?.status" />
        </template>
        <template #date="{ row: data }">
          <p>{{ dayjs.utc(data?.datetime).format("DD-MMMM HH:mm, YYYY") }}</p>
        </template>
        <template #visit="{ row: data }">
          <p class="text-xs leading-130 font-normal text-gray text-right">
            <span class="font-medium text-dark-100">{{
              data?.total_visited_students
            }}</span>
            / {{ data?.total_visitors }}
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
                <!--edit-->
                <div
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
                  @click="editEvent(data?.id)"
                >
                  <i class="icon-edit text-gray text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("edit") }}</span
                  >
                </div>
                <hr class="w-full h-[1px] bg-gray-300" />
                <!--delete-->
                <div
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-red-100 transition-300"
                  @click="deleteEvent(data?.id)"
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
        <template #beforeSearch>
          <div class="flex-y-center gap-5">
            <FSelect
              :options="[{ title: $t('all_courses'), id: 'all' }, ...courses]"
              v-model="eventCourse"
              selected-option-styles="bg-white !border-gray-800 rounded-md "
              value-key="id"
              label-key="title"
              :placeholder="$t('all_courses')"
              class="min-w-[160px]"
            />
            <FSelect
              v-model="eventStatus"
              :options="eventStatuses"
              selected-option-styles="bg-white !border-gray-800 rounded-md "
              value-key="value"
              :placeholder="$t('all_statuses')"
              label-key="title"
              class="min-w-[160px]"
            />
          </div>
        </template>
        <template #afterSearch>
          <CButton
            :text="$t('add')"
            icon="icon-add"
            icon-position="left"
            class="!h-10 flex-center"
            @click="showAdd = true"
          />
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
  </div>
  <CAddEvent
    :show="showAdd"
    @close="showAdd = false"
    :courses="courses"
    @updateEvents="fetchTableData()"
  />
  <CDeletedEventModal
    :id="eventID"
    :show="showDelete"
    @close="closeDeleteModal"
  />
  <CAddEvent
    edit
    :show="showEdit"
    @close="showEdit = false"
    :courses="courses"
    :single="eventSingle"
    @updateEvents="fetchTableData()"
  />
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";

import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CAvatar from "@/components/CAvatar.vue";
import dayjs from "dayjs";
import CButton from "@/components/Common/CButton.vue";
import CEventStatusBadge from "@/modules/Events/components/CEventStatusBadge.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CAddEvent from "@/modules/Events/components/CAddEvent.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import apiService from "@/services/ApiService";
import { updateQueryParams } from "@/utils";
import { useRoute } from "vue-router";
import CDropdown from "@/components/Common/CDropdown.vue";
import CDeletedEventModal from "@/modules/Events/components/CDeletedEventModal.vue";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();

const showAdd = ref(false);
const showDelete = ref(false);
const showEdit = ref(false);
const courses = ref([]);
const eventSingle = ref({});
const eventID = ref(null);

const eventStatus = ref(route?.query?.status ?? "");
const eventCourse = ref(route?.query?.course ?? "");

const eventStatuses = [
  {
    title: t("all_statuses"),
    value: "all",
  },
  {
    title: t("pending"),
    value: "pending",
  },
  {
    title: t("canceled"),
    value: "canceled",
  },
  {
    title: t("completed"),
    value: "completed",
  },
  {
    title: t("on_going"),
    value: "on_going",
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
} = useTableFetch(`backoffice/EventList/`);

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

const closeDeleteModal = () => {
  showDelete.value = false;
  fetchTableData();
};
const deleteEvent = (id: number) => {
  showDelete.value = true;
  eventID.value = id;
};
const editEvent = (id: string) => {
  fetchEventSingle(id);
};

const fetchEventSingle = (id: number) => {
  apiService
    .get(`/backoffice/Event/${id}/`)
    .then(async (res) => {
      eventSingle.value = res.data;
      if (eventSingle.value) {
        showEdit.value = true;
      }
    })
    .catch((err) => {
      console.log(err, "err");
    });
};
onMounted(() => {
  fetchCourses();
});
const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("events"),
    route: "/",
  },
]);

watch(
  () => eventStatus.value,
  async () => {
    if (eventStatus.value !== "all") {
      await updateQueryParams("status", eventStatus.value);
    } else {
      await updateQueryParams("status", "");
    }
    await fetchTableData();
  },
  { deep: true }
);
watch(
  () => eventCourse.value,
  async () => {
    if (eventCourse.value !== "all") {
      await updateQueryParams("course", eventCourse.value);
    } else {
      await updateQueryParams("course", "");
    }
    await fetchTableData();
  },
  { deep: true }
);

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "event_name",
    key: "name",
  },
  {
    title: "course",
    key: "course",
  },
  {
    title: "status",
    key: "status",
  },
  {
    title: "event_date",
    key: "date",
  },
  {
    title: "visit",
    key: "visit",
  },
  {
    title: "action",
    key: "action",
  },
];
</script>
