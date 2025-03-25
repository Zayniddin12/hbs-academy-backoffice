<template>
  <div class="grid grid-cols-12 gap-5">
    <div class="col-span-4">
      <CGroupAddSteps v-bind="{ step, steps }" />
    </div>
    <div class="col-span-8">
      <CGroupStepInfo v-if="step === 1" :form="infoForm" @next="step = 2" />
      <CGroupStepStudents
        :form="studentsForm"
        v-if="step === 2"
        @back="step = 1"
        @next="step = 3"
      />
      <CGroupStepFinal
        v-if="step === 3"
        @back="step = 2"
        @submit="submit"
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
import ApiService from "@/services/ApiService";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const step = ref(1);
const single = ref();
const leads = ref([]);
const students = ref([]);

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

function getSingle() {
  ApiService.get(`backoffice/Groups/${route.params?.groupId}`).then((res) => {
    single.value = res?.data;
    infoForm.values.name = res?.data?.title;
  });
}
function getLeads() {
  ApiService.get(`backoffice/GroupLeads/${route.params?.groupId}`).then(
    (res) => {
      leads.value = res?.data;
      infoForm.values.selectedLeads = res?.data;
    }
  );
}
function getStudents() {
  ApiService.get(`backoffice/GroupStudents/${route.params?.groupId}`).then(
    (res) => {
      students.value = res?.data?.results;
      studentsForm.values.students = res?.data?.results;
    }
  );
}
function groupMemberCreate() {
  ApiService.post(`backoffice/GroupMemberCreate/`, {
    group: Number(route.params?.groupId),
    students_ids: studentsForm.values.students.map(
      (student) => student?.student_id || student?.id
    ),
  });
}
function groupLeadCreate() {
  ApiService.post(`backoffice/GroupLeadsCreateWithIDs/`, {
    group: route.params?.groupId,
    lead_ids: infoForm.values.selectedLeads.map(
      (lead) => lead?.lead_id || lead?.id
    ),
  });
}
function groupTitleUpdate() {
  ApiService.patch(`backoffice/UpdateGroup/${route.params?.groupId}/`, {
    title: infoForm.values.name,
  })
}
async function submit() {
  await groupMemberCreate();
  await groupLeadCreate();
  await groupTitleUpdate();
  await router.push({ name: "CourseFlowsSingle" });
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

getSingle();
getLeads();
getStudents();
</script>
