<template>
  <!--begin::Navbar-->
  <CCommonHeader
    :title="user?.full_name ?? ''"
    :image="user?.avatar"
    :sub-title="user?.role"
    no-tabs
  >
    <template #details>
      <CProfileDashDetail
        v-for="(detail, index) in dataDetails"
        :key="index"
        v-bind="{ ...detail }"
      />
    </template>
    <template #actions>
      <CButton
        class="h-9 flex-center text-xs"
        variant="info"
        icon="icon-edit"
        :text="$t('student_profile.edit')"
        icon-position="left"
      />
    </template>
  </CCommonHeader>
  <!--end::Navbar-->
  <section class="px-5 pt-5 bg-white rounded-2xl mt-6">
    <CTableWrapper
      :head="headData"
      :data="tableData"
      :items-per-page="paginationData?.defaultLimit ?? 0"
      :limit="paginationData?.defaultLimit ?? 0"
      :total="paginationData?.total"
      :current-page="paginationData?.currentPage ?? 0"
      :title="t('courses')"
      :subtitle="t('courses_count', { count: paginationData?.total })"
      @itemsPerPage="onChangeLimit"
      @pageChange="onPageChange"
      no-search
    >
      <template #_index="{ row: data }">
        <span
          class="text-sm text-dark-100 font-semibold leading-normal"
          v-text="data._index + '.'"
        />
      </template>
      <template #name="{ row: data }">
        <CCourseCard
          :card="data"
          :params="{ courseId: data?.id }"
          route-name="CourseSingle"
        />
      </template>
      <template #created_at="{ row: data }">
        <p>{{ dayjs(data?.created_at).format("D MMMM, YYYY") }}</p>
      </template>
      <template #module="{ row: data }">
        <p>{{ data?.modules_count }}</p>
      </template>
      <template #lessons="{ row: data }">
        <p>{{ data?.modules_count }}</p>
      </template>
      <template #duration="{ row: data }">
        <p>{{ secondsToTime(data?.duration, true) }}</p>
      </template>
      <template #task="{ row: data }">
        <p>{{ data?.modules_count }}</p>
      </template>
      <template #course_students="{ row: data }">
        <p class="flex items-center text-dark-100 text-xs gap-1">
          <i class="icon-people text-xl text-gray"></i
          >{{ data?.students_count }}
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
                class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300"
              >
                <i class="icon-edit text-gray text-xl"></i>
                <span
                  class="text-sm font-medium text-dark-100 leading-normal"
                  >{{ $t("edit") }}</span
                >
              </div>
              <hr class="w-full h-[1px] bg-gray-300" />
              <div
                class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300"
                @click="
                  showDelete = true;
                  selectedCourse = data?.id;
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
    </CTableWrapper>
  </section>
  <CDeleteCourse
    :show="showDelete"
    @close="showDelete = false"
    @submit="fetchTableData"
    :id="selectedCourse"
  />
</template>

<script lang="ts" setup>
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import dayjs from "dayjs";
import { headData } from "@/modules/Courses/data";
import { useTableFetch } from "@/composables/useTableFetch";
import { formatPhoneNumber, secondsToTime } from "@/utils";
import CButton from "@/components/Common/CButton.vue";
import CCourseCard from "@/modules/Students/components/CCourseCard.vue";
import { useAuthStore } from "@/modules/Auth/stores";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CDeleteCourse from "@/modules/Courses/components/Delete/CDeleteCourse.vue";

const { t } = useI18n();
const { mounted } = useMounted();

const {
  tableData,
  paginationData,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(`/backoffice/Courses/`);

const user = computed(() => useAuthStore()?.user);

const showDelete = ref(false);
const selectedCourse = ref(null);

const dataDetails = computed(() => [
  {
    title: formatPhoneNumber(user.value?.phone_number),
    description: t("student_profile.phone_number"),
  },
  {
    title: dayjs(user?.value?.date_joined).locale("ru").format("DD MMMM YYYY"),
    description: t("student_profile.registration_date"),
  },
]);

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("courses"),
    route: "/",
  },
]);
</script>
