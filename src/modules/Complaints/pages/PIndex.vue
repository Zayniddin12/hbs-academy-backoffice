<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <SBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <section class="px-5 pt-5 bg-white rounded-2xl">
      <CTableWrapper
        :head="headData"
        :data="complainTableFakeData"
        :items-per-page="10"
        :limit="10"
        :total="222"
        :current-page="1"
        :title="t('student')"
        :subtitle="t('student_plural', { count: 222 })"
      >
        <!--        header    -->
        <template #beforeSearch>
          <FDatePicker v-model="date" range class="w-[250px]" />
        </template>

        <!--        body   -->
        <template #id="{ row: data }">
          <span
            class="text-sm text-dark-100 font-semibold leading-normal"
            v-text="data.id + '.'"
          />
        </template>

        <template #student="{ row: data }">
          <CStudentCard :card="data?.student" slug="ComplaintSingle" />
        </template>
        <template #registration_date="{ row: data }">
          <p>
            {{ dayjs(data?.registration_date).format("DD.MM.YYYY, hh:mm") }}
          </p>
        </template>
        <template #last_active="{ row: data }">
          <p>
            {{ dayjs(data?.last_active).format("DD.MM.YYYY, hh:mm") }}
          </p>
        </template>
        <template #gender="{ row: data }">
          <p
            class="flex items-center justify-end space-x-1 capitalize"
            :class="data.gender === 'male' ? 'text-blue-100' : 'text-[#FD5994]'"
          >
            <img
              :src="
                data.gender === 'male'
                  ? '/images/svg/male.svg'
                  : '/images/svg/female.svg'
              "
              alt="Gender icon"
            />
            <span>{{ data.gender }}</span>
          </p>
        </template>

        <template #beforePagination>
          <ul class="flex gap-5 mr-auto">
            <li
              v-for="{ id, className, text } in workersStatus"
              :key="id"
              class="flex items-center gap-2 cursor-pointer"
            >
              <span
                class="inline-block h-4 w-4 bg-white rounded-full border-[3px] border-solid"
                :class="className"
              />
              <span
                v-text="$t(text)"
                class="text-gray-700 text-xs font-medium"
              />
            </li>
          </ul>
        </template>
        <template #filter>
          <div class="mb-4 flex-y-center justify-end gap-4">
            <FSelect
              label-key="label"
              value-key="value"
              :options="options"
              :placeholder="$t('status')"
              selected-option-styles="bg-white !border-gray-800"
              class="min-w-[200px]"
            />
            <FSelect
              label-key="label"
              value-key="value"
              :options="options"
              :placeholder="$t('region')"
              selected-option-styles="bg-white !border-gray-800"
              class="min-w-[200px]"
            />
            <FSelect
              label-key="label"
              value-key="value"
              :options="options"
              :placeholder="$t('courses_count_short')"
              selected-option-styles="bg-white !border-gray-800"
              class="min-w-[200px]"
            />
            <FSelect
              label-key="label"
              value-key="value"
              :options="options"
              :placeholder="$t('gender')"
              selected-option-styles="bg-white !border-gray-800"
              class="min-w-[200px]"
            />
          </div>
        </template>
      </CTableWrapper>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import SBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import { workersStatus } from "@/modules/Colleagues/data";
import CTableWrapper from "@/components/Common/Table/CTableWrapper.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import CStudentCard from "@/modules/Students/components/CStudentCard.vue";
import dayjs from "dayjs";
import { complainTableFakeData } from "@/modules/Complaints/data";
import FDatePicker from "@/components/Form/Date/FDatePicker.vue";

const { t } = useI18n();
const { mounted } = useMounted();
const date = ref("");
const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
  {
    name: t("complaints"),
    route: "/",
  },
]);

const headData = [
  {
    title: "complain.table.id",
    key: "id",
  },
  {
    title: "complain.table.student",
    key: "student",
  },
  {
    title: "complain.table.registration_date",
    key: "registration_date",
  },
  {
    title: "complain.table.course",
    key: "course",
  },
  {
    title: "complain.table.region",
    key: "region",
  },
  {
    title: "complain.table.last_active",
    key: "last_active",
  },
  {
    title: "complain.table.gender",
    key: "gender",
  },
];

const options = [
  {
    label: "label",
    value: "value",
  },
  {
    label: "Label 2",
    value: "value 2",
  },
  {
    label: "Label 3",
    value: "value 3",
  },
  {
    label: "Label 4",
    value: "value 4",
  },
  {
    label: "Label 5",
    value: "value 5",
  },
  {
    label: "Label 6",
    value: "value 6",
  },
];
</script>
