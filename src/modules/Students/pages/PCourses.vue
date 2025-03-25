<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="coursesHeadData"
        :data="tableData"
        :items-per-page="paginationData.defaultLimit"
        :limit="paginationData.defaultLimit"
        :total="paginationData.total"
        :current-page="paginationData.currentPage"
        :title="t('courses')"
        :subtitle="t('courses_count', { count: paginationData.total ?? 0 })"
        @items-per-page="onChangeLimit"
        @page-change="onPageChange"
        @search="onSearch"
      >
        <template #afterSearch>
          <CButton
            class="shrink-0"
            icon="icon-add"
            icon-position="left"
            text="добавить в группу"
            @click="
              $router.push({
                name: 'Courses',
                query: { studentId: route.params.id },
              })
            "
          />
        </template>
        <template #_index="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data._index + '.'"
          />
        </template>
        <template #course="{ row: data }">
          <CCourseCard
            :card="data?.details"
            :params="{ courseId: data?.id }"
            route-name="StudentsCourseSingle"
          />
        </template>
        <template #group="{ row: data }">
          <p class="text-xs font-normal text-dark-100">
            {{ data?.group_name }}
          </p>
        </template>
        <template #process="{ row: data }">
          <CCourseProcessCard
            :value="data?.finished_lessons_count"
            :max="data?.lessons_count"
          />
        </template>
        <template #point="{ row: data }">
          <p class="text-xs leading-130 font-normal text-gray">
            <span class="text-dark-100 font-medium">{{
              data?.received_ball
            }}</span>
            /
            {{ data?.ball }}
          </p>
        </template>
        <template #start="{ row: data }">
          <p
            v-if="data?.start_at"
            class="text-xs leading-130 font-normal text-dark-100"
          >
            {{ dayjs(data?.start_at).format("DD MMMM YYYY") }}
          </p>
          <p
            v-if="data?.start_at"
            class="text-xs leading-130 font-normal text-gray mt-1"
          >
            {{ dayjs(data?.start_at).format("HH:mm") }}
          </p>
          <p
            v-if="!data?.start_at"
            class="text-xs leading-130 font-normal text-gray mt-1"
          >
            -
          </p>
        </template>
        <template #action="{ row: data }">
          <div class="flex justify-end">
            <CCoursePaymentStatus :is-paid="data?.is_paid" />
          </div>
        </template>
        <template #no-data>
          <CNodata
            :title="$t('no_courses')"
            :subtitle="$t('no_courses_text')"
            image="/images/svg/no-data/no-groups.svg"
          />
        </template>
      </CTableWrapper>
    </section>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";

import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import CCourseCard from "@/modules/Students/components/CCourseCard.vue";
import { coursesHeadData } from "@/modules/Students/data";
import CCourseProcessCard from "@/modules/Students/components/CCourseProcessCard.vue";
import dayjs from "dayjs";
import CCoursePaymentStatus from "@/modules/Students/components/CCoursePaymentStatus.vue";
import { useRoute } from "vue-router";
import { useStudentsStore } from "@/modules/Students/store";
import { useTableFetch } from "@/composables/useTableFetch";
import CNodata from "@/components/Common/CNodata.vue";
import CButton from "@/components/Common/CButton.vue";

const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();
const store = useStudentsStore();

const { tableData, paginationData, onChangeLimit, onPageChange, onSearch } =
  useTableFetch(`/backoffice/StudentCourses/?student=${route.params.id}`);

const user = computed(() => store.student);

const routes = computed(() => [
  {
    name: t("students"),
    route: "/students",
  },
  {
    name: user.value?.full_name,
    route: "/students/" + route.params.id + "/courses",
  },
]);
</script>
