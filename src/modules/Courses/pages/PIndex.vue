<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="headData"
        :data="tableData"
        :items-per-page="paginationData?.defaultLimit"
        :limit="paginationData?.defaultLimit"
        :total="paginationData?.total"
        :current-page="paginationData?.currentPage"
        :title="t('courses')"
        :subtitle="t('courses_count', { count: paginationData?.total })"
        :tr-class="{
          'animate-bg': $route.query.course,
        }"
        @search="onSearch"
        :loading="loading"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
      >
        <template #afterSearch>
          <CButton
            v-if="grandAccess(userRole ?? '')"
            class="shrink-0"
            icon="icon-add"
            icon-position="left"
            :text="$t('add_course')"
            @click="$router.push({ name: 'CourseCreate' })"
          />
        </template>
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data._index + '.'"
          />
        </template>
        <template #course_type="{ row: data }">
          <span>{{ $t(data?.course_type) }}</span>
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
          <p>{{ data?.lessons_count }}</p>
        </template>
        <template #duration="{ row: data }">
          <p>{{ secondsToTime(data?.duration, true) }}</p>
        </template>
        <template #task="{ row: data }">
          <p>{{ data?.tasks_count }}</p>
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
                <!--edit-->
                <div
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
                  @click="
                    $router.push({
                      name: 'CourseEdit',
                      params: { id: data?.id },
                    })
                  "
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
                <hr class="w-full h-[1px] bg-gray-300" />
                <!--deep copy-->
                <div
                  class="w-[158px] h-11 flex items-center p-3 gap-2 hover:bg-yellow-100 transition-300"
                  @click="
                    showCopy = true;
                    selectedCourse = data?.id;
                  "
                >
                  <i class="icon-copy text-yellow text-xl"></i>

                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("table.dropdown.copy") }}</span
                  >
                </div>
              </div>
            </template>
          </CDropdown>
        </template>
        <template #no-data>
          <CNodata
            :title="$t('no_courses')"
            :subtitle="$t('no_courses_text')"
          />
        </template>
      </CTableWrapper>
    </section>
  </div>
  <CDeleteCourse
    :show="showDelete"
    :user-role="userRole"
    @close="showDelete = false"
    @submit="fetchTableData"
    :id="selectedCourse"
  />

  <CDeepCopyCourseWarning
    :show="showCopy"
    @close="closeCopyCourseWarning"
    :id="selectedCourse"
  />
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import dayjs from "dayjs";
import CCourseCard from "@/modules/Students/components/CCourseCard.vue";
import CButton from "@/components/Common/CButton.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { secondsToTime, updateQueryParams } from "@/utils";
import CNodata from "@/components/Common/CNodata.vue";
import CDeleteCourse from "@/modules/Courses/components/Delete/CDeleteCourse.vue";
import { useAuthStore } from "@/modules/Auth/stores";
import CDeepCopyCourseWarning from "@/modules/Courses/components/Delete/CDeepCopyCourseWarning.vue";

const { t } = useI18n();
const { mounted } = useMounted();

const showDelete = ref(false);
const showCopy = ref(false);
const selectedCourse = ref(null);

const {
  tableData,
  paginationData,
  onSearch,
  loading,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(`/backoffice/Courses/`);

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

onMounted(() => {
  setTimeout(() => {
    updateQueryParams("course", undefined);
  }, 4000);
});

const authStore = useAuthStore();

const userRole = computed(() => authStore?.user?.role);

function grandAccess(role: string) {
  return ["admin", "manager"]?.includes(role);
}

const closeCopyCourseWarning = () => {
  showCopy.value = false;
  selectedCourse.value = null;

  fetchTableData();
};

const headData = computed(() => {
  let data = [
    {
      title: "table.head.title1",
      key: "_index",
    },
    {
      title: "naming",
      key: "name",
    },
    {
      title: "course_type",
      key: "course_type",
    },
    {
      title: "created_at",
      key: "created_at",
    },
    {
      title: "modules",
      key: "module",
    },
    {
      title: "lessons",
      key: "lessons",
    },
    {
      title: "home_task",
      key: "task",
    },
    {
      title: "duration",
      key: "duration",
    },
    {
      title: "course_students",
      key: "course_students",
    },
    {
      title: "action",
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
</script>

<style>
.animate-bg:first-child {
  animation: fadeBg 4s ease-in forwards;
}

@keyframes fadeBg {
  0% {
    background-color: #f0fff4;
  }
  100% {
    background-color: #fff;
  }
}
</style>
