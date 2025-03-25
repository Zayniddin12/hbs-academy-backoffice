<template>
  <div>
    <Teleport v-if="mounted" to="#header-breadcrumbs">
      <CBreadcrumb v-bind="{ routes }" />
    </Teleport>
    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        v-if="!draggable"
        :head="modulesHeadData"
        :data="tableData"
        no-search
        :items-per-page="paginationData?.defaultLimit"
        :limit="paginationData?.defaultLimit"
        :total="paginationData?.total"
        th-class="last:!text-left"
        :current-page="paginationData?.currentPage"
        :title="$t('course_module')"
        :subtitle="t('course_module_count', { count: tableData?.length })"
        @search="onSearch"
        @itemsPerPage="onChangeLimit"
        @pageChange="onPageChange"
      >
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data?._index + '.'"
          />
        </template>
        <template #afterSearch>
          <CButton
            v-if="grandAccess(userRole ?? '')"
            icon="icon-add"
            icon-position="left"
            :text="$t('create_course_module')"
            @click="
              $router.push({
                name: 'CourseSingleModuleCreate',
                params: { courseId: $route.params.courseId },
              })
            "
          />
          <div v-else></div>
        </template>
        <template #name="{ row: data }">
          <RouterLink
            :to="{
              name: 'CourseModulesSingle',
              params: { moduleId: data?.id },
              query: { ...$route.query }
            }"
            class="text-dark-100 text-sm font-medium hover:text-green transition-300"
          >
            {{ data?.title }}
          </RouterLink>
        </template>
        <template #duration="{ row: data }">
          <p>{{ t("days", { day: data?.duration_days }) }}</p>
        </template>
        <template #lessons="{ row: data }">
          <p>{{ data?.lessons_count }}</p>
        </template>
        <template #task="{ row: data }">
          <p class="">{{ data?.assignments_count }}</p>
        </template>
        <template #action="{ row: data }">
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
                  class="w-full h-11 flex items-center p-3 gap-2 hover:bg-gray-300 transition-300"
                  @click="draggable = true"
                >
                  <i class="icon-repeate-music text-blue text-xl"></i>
                  <span
                    class="text-sm font-medium text-dark-100 leading-normal"
                    >{{ $t("replace") }}</span
                  >
                </div>
                <hr
                  v-if="grandAccess(userRole ?? '')"
                  class="w-full h-[1px] bg-gray-300"
                />
                <div
                  v-if="grandAccess(userRole ?? '')"
                  class="w-full h-11 flex items-center p-3 gap-2 hover:bg-red-100 transition-300"
                  @click="
                    showDelete = true;
                    selectedLesson = data;
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
        <template #no-data>
          <CNodata
            image="/images/svg/no-data/no-modules.svg"
            :title="$t('no_modules')"
            :subtitle="$t('no_modules_text')"
          />
        </template>
      </CTableWrapper>
      <CLessonDraggable
        v-else
        class="pb-3"
        @on-save="onSave"
        :table-data="tableData"
        v-model="tableData"
        :loading="buttonLoading"
      />
    </section>
  </div>
  <CDeleteDialog
    :title="$t('delete_module')"
    :subtitle="$t('delete_module_text')"
    @close="showDelete = false"
    @submit="deleteLesson"
    :show="showDelete"
    :loading="buttonLoading"
  />
</template>
<script setup lang="ts">
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import { modulesHeadData } from "@/modules/Courses/data";
import CButton from "@/components/Common/CButton.vue";
import { useTableFetch } from "@/composables/useTableFetch";
import { useRoute } from "vue-router";
import CNodata from "@/components/Common/CNodata.vue";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { useCoursesStore } from "@/modules/Courses/store";
import CDropdown from "@/components/Common/CDropdown.vue";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import CLessonDraggable from "@/modules/Courses/components/Modules/CLessonDraggable.vue";
import { useAuthStore } from "@/modules/Auth/stores";

const route = useRoute();
const { mounted } = useMounted();
const { t } = useI18n();
const { handleError } = useHandleError();

const {
  tableData,
  paginationData,
  onSearch,
  onPageChange,
  onChangeLimit,
  fetchTableData,
} = useTableFetch(
  `/backoffice/Courses/${route?.params?.courseId}/Modules/`,
  {},
  true
);
const showDelete = ref(false);
const selectedLesson = ref(null);
const buttonLoading = ref(false);

const store = useCoursesStore();
const single = computed(() => store.courseSingle);

const authStore = useAuthStore();

const userRole = computed(() => authStore?.user?.role);

function grandAccess(role: string) {
  return ["admin", "manager"]?.includes(role);
}

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("courses"),
    route: "/courses",
  },
  {
    name: single.value?.title,
    route: "/",
  },
]);

// Draggable
const draggable = ref(false);

function onSave() {
  buttonLoading.value = true;
  const data = {
    modules: tableData.value.map((el, index) => {
      return {
        module_id: el?.id,
        order: index + 1,
      };
    }),
  };
  ApiService.post(`backoffice/UpdateModuleOrder/`, data)
    .then(() => {
      draggable.value = false;
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}

function deleteLesson() {
  buttonLoading.value = true;
  ApiService.delete(`backoffice/Modules/${selectedLesson.value?.id}/`)
    .then(() => {
      showDelete.value = false;
      fetchTableData();
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}
</script>
