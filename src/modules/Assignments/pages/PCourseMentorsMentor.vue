<template>
  <div>
    <Teleport v-if="mounted" to="#header-breadcrumbs">
      <CBreadcrumb v-bind="{ routes }" />
    </Teleport>
    <CCard class="p-5">
      <CTableWrapper
        :head="headData"
        :data="tableData"
        :items-per-page="paginationData?.defaultLimit ?? 0"
        :limit="paginationData?.defaultLimit ?? 0"
        :total="paginationData?.total"
        :current-page="paginationData?.currentPage ?? 1"
        @search="onSearch"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
      >
        <template #header_title>
          <div class="flex items-center gap-3">
            <CAvatar
              :is-active="single.is_active"
              :src="single.avatar"
              :name="single.full_name"
              class="mr-2"
            />
            <div>
              <div class="flex items-center gap-2">
                <p>{{ single.full_name }}</p>
                <div>
                  <RouterLink
                    :to="`/colleagues/${route.params.id}`"
                    class="text-[#16CC53] bg-green-100 text-[13px] py-0.5 px-2.5 rounded-md font-semibold flex items-center gap-1"
                  >
                    {{ $t("go_to_employee") }}
                    <i class="icon-export text-[#16CC53]"></i>
                  </RouterLink>
                </div>
              </div>
              <p class="text-gray text-xs mt-1">
                {{ tableData.length }} {{ $t("group") }}
              </p>
            </div>
          </div>
        </template>
        <template #_index="{ row: data }">
          <p class="font-semibold">{{ data?._index }}.</p>
        </template>
        <template #group="{ row: data }">
          <div class="flex">
            <RouterLink
              :to="`course/${data.group_id}`"
              class="text-sm rounded-md leading-normal font-medium"
            >
              {{ data?.group_title }}
            </RouterLink>
          </div>
        </template>
        <template #course="{ row: data }">
          <CUserCard
            :card="{
              full_name: data?.course_title,
              avatar: data?.course_photo,
            }"
          />
        </template>
        <template #average_point="{ row: data }">
          <div class="flex items-center gap-1">
            <p class="mt-1 text-xs leading-normal font-normal text-dark-100">
              {{ data?.course_students_avg_ball }}
            </p>
            /
            <p class="mt-1 text-xs leading-normal font-normal text-gray">
              {{ data?.course_ball }}
            </p>
          </div>
        </template>
        <template #date="{ row: data }">
          <p class="mt-1 text-xs leading-normal font-normal text-dark-100">
            {{ dayjs(data?.start_date).format("D MMMM, YYYY") }} -
            {{ dayjs(data?.end_date).format("D MMMM, YYYY") }}
          </p>
        </template>
        <template #students_count="{ row: data }">
          <p class="flex items-center text-dark-100 text-xs gap-1">
            <i class="icon-people text-xl text-gray"></i
            >{{ data?.student_count }}
          </p>
        </template>
        <template #point="{ row: data }">
          <p class="text-xs leading-130 font-normal text-gray text-right">
            <span class="text-dark-100">{{ data?.ball ?? 0 }}</span> /
            {{ data?.max_ball }}
          </p>
        </template>
        <!--    Actions    -->

        <template #no-data>
          <div class="py-[128px] flex-center">
            <div class="text-center">
              <img
                src="/images/svg/no-data/no-events.svg"
                alt="no-events"
                class="mx-auto"
              />
              <p class="text-base leading-130 font-semibold text-dark-100 mt-6">
                {{ t("no_events_yet") }}
              </p>
              <p class="mt-1.5 text-sm leading-130 font-normal text-gray">
                {{ t("no_events_yet_text") }}
              </p>
            </div>
          </div>
        </template>
      </CTableWrapper>
    </CCard>
  </div>
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CUserCard from "@/components/Card/CUserCard.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useI18n } from "vue-i18n";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import { useWorkersStore } from "@/modules/Colleagues/store";
import CAvatar from "@/components/CAvatar.vue";
import dayjs from "dayjs";
const route = useRoute();
const { mounted } = useMounted();
const { t } = useI18n();
const store = useWorkersStore();

const single = computed(() => store.worker);

store.fetchWorkerDetails(route.params?.id);

const { tableData, paginationData, onSearch, onPageChange, onChangeLimit } =
  useTableFetch(`/backoffice/LeadGroups/?lead=${route.params?.id}`);

const headData = [
  {
    title: "table.head.title1",
    key: "_index",
  },
  {
    title: "group",
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
    title: "students",
    key: "students_count",
    customClass: "!text-left",
  },
];

const routes = computed(() => [
  {
    name: t("assignments"),
    route: "/assignments",
  },
  {
    name: single.value?.full_name,
    route: "/",
  },
]);
</script>
