<template>
  <Teleport v-if="mounted" to="#header-breadcrumbs">
    <CBreadcrumb v-bind="{ routes }" />
  </Teleport>
  <div>
    <CPageHeader
      title="course_edit"
      :accept-btn="{
        disabled: form.$v.value.$invalid,
        text: 'edit',
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
    <CCourseCreateForm v-bind="{ form, loading }" />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useMounted } from "@/composables/useMounted";
import { useI18n } from "vue-i18n";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CPageHeader from "@/components/CPageHeader.vue";
import CCourseCreateForm from "@/modules/Courses/components/CCourseCreateForm.vue";
import { useForm } from "@/composables/useForm";
import { required } from "@vuelidate/validators";
import { useRoute, useRouter } from "vue-router";
import ApiService from "@/services/ApiService";
import { useHandleError } from "@/composables/useHandleError";

const { t } = useI18n();
const { mounted } = useMounted();
const route = useRoute();
const { handleError } = useHandleError();
const router = useRouter();

const single = ref({});
const buttonLoading = ref(false);
const loading = ref(false);

function getSingle() {
  ApiService.get(`backoffice/Courses/${route.params?.id}`)
    .then((res) => {
      single.value = res?.data;
    })
    .finally(() => (loading.value = false));
}

getSingle();

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
    name: t("course_edit"),
    route: "/",
  },
]);
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
    if (typeof form.values?.cover === "string") {
      delete data.photo;
    }
    ApiService.patch(`backoffice/UpdateCourses/${route?.params?.id}/`, data)
      .then(() => {
        router.push({ name: "Courses" });
      })
      .catch(({ response }) => {
        handleError(response);
      })
      .finally(() => (buttonLoading.value = false));
  }
};

watch(
  () => single.value,
  () => {
    form.values.title = single?.value?.title;
    form.values.subtitle = single?.value?.description;
    form.values.cover = single?.value?.photo;
    form.values.course_type = single?.value?.course_type;
  }
);
</script>
