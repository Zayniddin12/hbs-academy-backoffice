<template>
  <div class="flex flex-col gap-5">
    <CCard class="p-6">
      <p class="text-2xl leading-130 font-semibold text-dark-100">
        {{ data?.name }}
      </p>

      <CProfileDashDetail
        class="w-max mt-4"
        :title="`${dayjs(single?.start).format('DD MMMM YYYY')} - ${dayjs(
          single?.end
        ).format('DD MMMM YYYY')}`"
        :description="$t('period')"
      />

      <div class="flex flex-y-center gap-4 mt-4">
        <CProfileDashDetail
          v-for="(item, index) in data?.selectedLeads"
          :key="index"
          :image="item?.avatar"
          :title="item?.full_name"
          :description="$t(item?.role)"
        />
      </div>
    </CCard>
    <CCard class="w-full p-5">
      <div>
        <p class="text-base leading-130 font-semibold text-dark-100">
          {{ $t("students") }}
        </p>
        <p class="mt-1 text-xs leading-normal text-gray">
          {{ $t("student_plural", { count: data?.students?.length }) }}
        </p>
        <div class="flex flex-col gap-2 mt-5">
          <CPreviewUserCard
            v-for="(option, index) in data?.students"
            :key="index"
            v-bind="{ option }"
            :studentsId="studentsId"
            no-role
            no-close
            noRemove
          />
        </div>
        <CGroupNoData
          v-if="false"
          :title="$t('no_students_list')"
          :text="$t('no_students_list_text')"
        />
      </div>

      <div class="mt-10 flex-center-between">
        <CButton
          class="min-w-[190px]"
          variant="info"
          :text="$t('back')"
          icon="icon-arrow-right rotate-180"
          icon-position="left"
          @click="$emit('back')"
        />
        <CButton
          class="min-w-[190px]"
          icon="icon-arrow-right"
          :text="$t('next_continue')"
          :loading="loading"
          :disabled="loading"
          @click="$emit('submit')"
        />
      </div>
    </CCard>
  </div>
</template>

<script setup lang="ts">
import CButton from "@/components/Common/CButton.vue";
import CGroupNoData from "@/modules/Courses/components/Groups/Create/CGroupNoData.vue";
import CPreviewUserCard from "@/modules/Courses/components/Groups/Create/CPreviewUserCard.vue";
import CCard from "@/components/Card/CCard.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import { IWorker } from "@/modules/Courses/types";
import ApiService from "@/services/ApiService";
import { defineProps, ref } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

interface Props {
  data: {
    name: string;
    selectedLeads: IWorker[];
    students: IWorker[];
  };
  loading: boolean;
  studentsId: string[];
}

const props = defineProps<Props>();
const route = useRoute();
const single = ref<any>(null);
function getSingle() {
  ApiService.get(`backoffice/Flows/${route?.params?.flowId}`).then((res) => {
    single.value = res?.data;
  });
}

getSingle();
</script>
