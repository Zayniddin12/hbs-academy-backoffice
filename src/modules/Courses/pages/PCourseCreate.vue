<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <CPageHeader
      title="course_create"
      :accept-btn="{
        disabled: form.$v.value.$invalid,
        text: 'create',
        loading: buttonLoading,
      }"
      :cancel-btn="{
        disabled: false,
        text: 'cancel',
        loading: false,
      }"
      @on-cancel="onCancel"
      @on-create="onCreate"
    />
    <CCourseCreateForm v-bind="{ form }" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CPageHeader from "@/components/CPageHeader.vue";
import CCourseCreateForm from "@/modules/Courses/components/CCourseCreateForm.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";
import { useRouter } from "vue-router";
import { useCustomToast } from "@/composables/useCustomToast";

const { t } = useI18n();
const { showToast } = useCustomToast();
const { mounted } = useMounted();
const { handleError } = useHandleError();
const router = useRouter();

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
    name: t("course_create"),
    route: "/",
  },
]);

const buttonLoading = ref(false);

const form = useForm(
  {
    title: "",
    subtitle: "",
    cover: "",
    course_type: "",
  },
  {
    title: { required },
    subtitle: { required },
    cover: { required },
    course_type: { required },
  }
);
const onCancel = () => {
  router.push({ name: "Courses" });
};

const onCreate = () => {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    buttonLoading.value = true;
    const data = {
      title: form.values.title,
      description: form.values.subtitle,
      photo: form.values.cover?.id,
      course_type: form.values.course_type,
    };
    ApiService.post("backoffice/CreateCourses/", data)
      .then((res: any) => {
        showToast(t("course_created_successfully"), "success");
        router.push({ name: "Courses", query: { course: res?.data?.id } });
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => (buttonLoading.value = false));
  }
};
</script>
