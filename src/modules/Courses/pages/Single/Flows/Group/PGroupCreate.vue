<template>
  <div class="grid grid-cols-12 gap-5">
    <div class="col-span-4">
      <CGroupAddSteps v-bind="{ step, steps }" />
    </div>
    <div class="col-span-8">
      <CGroupStepInfo
        v-if="step === 1"
        :form="infoForm"
        @next="step = 2"
        @back="$router.push({ name: 'CourseFlowsSingle' })"
      />
      <CGroupStepStudents
        :form="studentsForm"
        v-if="step === 2"
        @back="step = 1"
        @next="step = 3"
      />
      <CGroupStepFinal
        :studentsId="studentsForm.values.students.map((student) => student.id)"
        v-if="step === 3"
        @back="step = 2"
        @submit="submit"
        :loading="loading"
        :data="{ ...infoForm.values, ...studentsForm.values }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CGroupAddSteps from "@/modules/Courses/components/Groups/Create/CGroupAddSteps.vue";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import CGroupStepInfo from "@/modules/Courses/components/Groups/Create/CGroupStepInfo.vue";
import { useForm } from "@/composables/useForm";
import CGroupStepStudents from "@/modules/Courses/components/Groups/Create/CGroupStepStudents.vue";
import CGroupStepFinal from "@/modules/Courses/components/Groups/Create/CGroupStepFinal.vue";
import { useRoute, useRouter } from "vue-router";
import { required } from "@vuelidate/validators";
import apiService from "@/services/ApiService";
import { useCustomToast } from "@/composables/useCustomToast";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { showToast } = useCustomToast();

const step = ref(1);
const loading = ref(false);

const infoForm = useForm(
  {
    name: "",
    selectedLeads: [],
  },
  {
    name: {
      required,
    },
    selectedLeads: {
      required,
    },
  }
);

const studentsForm = useForm(
  {
    url: "",
    students: [],
  },
  {
    url: {
      required,
    },
  }
);

function submit() {
  loading.value = true;
  apiService
    .post("backoffice/CreateGroup/", {
      flow: route.params.flowId,
      title: infoForm.values.name,
      lead_ids: infoForm.values.selectedLeads.map((lead) => lead?.id),
      student_ids: studentsForm.values.students.map((student) => student?.id),
    })
    .then(() => {
      router.push({ name: "CourseFlowsSingle" });
      showToast(t("successfully"), "success");
    })
    .catch((err) => {
      showToast(
        err?.response?.data?.[0]?.error?.message || t("error"),
        "error"
      );
    })
    .finally(() => {
      loading.value = false;
    });
  // router.push({ name: "CourseFlowsSingle" });
}

const steps = [
  {
    id: 1,
    title: t("about_group"),
    subtitle: t("general_information"),
  },
  {
    id: 2,
    title: t("students"),
    subtitle: t("students_list"),
  },
  {
    id: 3,
    title: t("checking"),
    subtitle: t("checking_entered_data"),
  },
];
</script>
