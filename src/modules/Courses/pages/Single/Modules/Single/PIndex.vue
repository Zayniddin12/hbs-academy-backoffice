<template>
  <div class="relative">
    <CBackButton :link="`/courses/${route.params.courseId}`" />
    <CCommonHeader no-hr title="Title" no-image no-tabs class="relative">
      <template #title><div></div></template>
      <template #subTitle>
        <div class="flex-y-center gap-2">
          <p class="text-xl leading-130 font-semibold text-dark-100">
            {{ single?.title }}
          </p>
          <i
            v-if="grandAccess(userRole ?? '')"
            @click="openEdit"
            class="icon-edit text-xl text-gray hover:text-green transition-300 cursor-pointer"
          />
        </div>
      </template>
      <template #details>
        <CProfileDashDetail
          :title="single?.lessons_count"
          :description="$t('lessons')"
          description-class="lowercase"
        />
        <CProfileDashDetail
          :title="single?.lessons_count"
          :description="$t('assignments')"
          description-class="lowercase"
        />
        <CProfileDashDetail
          :title="formatDuration(single?.duration)"
          :description="$t('duration')"
          description-class="lowercase"
        />
        <CProfileDashDetail
          :title="single?.duration_days"
          :description="$t('period')"
          description-class="lowercase"
        />
      </template>
      <template #content>
        <div class="w-full p-5 pt-0 -mt-1">
          <div class="flex justify-between items-center">
            <CTabFull
              :list="listTab"
              class="mb-4"
              v-model="tab"
              active-items-class="font-medium"
              item-class="min-w-[162px]"
            />
            <div class="flex gap-5 items-center">
              <FInput
                v-model="search"
                prefix-class="pr-2.5"
                :placeholder="$t('search')"
                class="border border-gray-100 min-w-[240px]"
              >
                <template #prefix>
                  <span class="icon-search-normal text-gray text-xl"></span>
                </template>
                <template #suffix>
                  <button
                    :class="{ '!opacity-100 !visible': search?.length }"
                    class="w-5 h-5 flex-center bg-gray/[16%] rounded-full p-1 transition-200 group hover:bg-red opacity-0 invisible"
                    @click="search = ''"
                  >
                    <span
                      class="icon-close text-gray text-[10px] transition-200 group-hover:text-white"
                    />
                  </button>
                </template>
              </FInput>
              <div
                id="action-lesson-single"
                class="shrink-0 min-w-[160px]"
              ></div>
            </div>
          </div>
          <Transition name="fade" mode="out-in">
            <div :key="$route.name">
              <RouterView />
            </div>
          </Transition>
        </div>
      </template>
    </CCommonHeader>
  </div>
  <CEditModuleDialog
    :edit-form="editForm"
    :show="showEdit"
    :data="single"
    @close="showEdit = false"
    :loading="buttonLoading"
    @submit="editModule"
  />
</template>

<script setup lang="ts">
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import CBackButton from "@/modules/Students/components/CBackButton.vue";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import CCommonHeader from "@/components/Profile/CCommonHeader.vue";
import CTabFull from "@/components/Tab/CTabFull.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import ApiService from "@/services/ApiService";
import { IModuleSingle } from "@/modules/Courses/types";
import { debounce, formatDuration, updateQueryParams } from "@/utils";
import CEditModuleDialog from "@/modules/Courses/components/Modules/Edit/CEditModuleDialog.vue";
import { useForm } from "@/composables/useForm";
import { requiredIf } from "@vuelidate/validators";
import { useHandleError } from "@/composables/useHandleError";
import { useCustomToast } from "@/composables/useCustomToast";
import { useAuthStore } from "@/modules/Auth/stores";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { showToast } = useCustomToast();
const { handleError } = useHandleError();

const tab = ref(route?.name);
const single = ref<IModuleSingle>();
const search = ref(route.query.search || "");
const showEdit = ref(false);
const buttonLoading = ref(false);

function getSingle() {
  ApiService.get(`/backoffice/Modules/${route.params?.moduleId}`).then(
    (res) => {
      single.value = res.data;
    }
  );
}

getSingle();

const authStore = useAuthStore();

const userRole = computed(() => authStore?.user?.role);

function grandAccess(role: string) {
  return ["admin", "manager"]?.includes(role);
}

const editForm = useForm(
  {
    name: "",
    days: "",
    photo: "",
  },
  {
    name: {
      requiredIf: requiredIf(() => showEdit.value),
    },
    days: {
      requiredIf: requiredIf(() => showEdit.value),
    },
  }
);

function openEdit() {
  editForm.values.name = single.value?.title;
  editForm.values.days = single.value?.duration_days;
  showEdit.value = true;
}

function editModule() {
  buttonLoading.value = true;
  const data = {
    title: editForm.values.name,
    duration_days: +editForm.values.days,
    photo: editForm.values.photo[0]?.id,
  };
  ApiService.put(`backoffice/Modules/${single.value?.id}/`, data)
    .then(() => {
      showEdit.value = false;
      getSingle();
      showToast(t("module_edited_successfully"), "success");
    })
    .catch(({ response }) => {
      handleError(response);
    })
    .finally(() => (buttonLoading.value = false));
}

const listTab = [
  {
    label: t("lessons"),
    value: "CourseModulesSingleLessons",
  },
  {
    label: t("assignments"),
    value: "CourseModulesSingleAssignments",
  },
];

watch(
  () => tab.value,
  () => {
    router.push({ name: tab.value });
  }
);

watch(
  () => search.value,
  () =>
    debounce(
      "search-list",
      async () => await updateQueryParams("search", search.value || undefined)
    )
);

watch(
  () => route.name,
  () => {
    search.value = "";
  }
);
</script>
