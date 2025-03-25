<template>
  <CCard class="w-full p-5">
    <p class="text-xl leading-130 font-semibold text-dark-100">
      {{ $t("students") }}
    </p>
    <p class="mt-1 text-xs leading-normal text-gray-700">
      {{ $t("added_students") }}
      <span class="text-gray">{{ values.students?.length }}</span>
    </p>

    <FSelect
      :selected-options="values.students"
      :options="students"
      selected-option-styles="!p-0 mt-4"
    >
      <template #selectedOption>
        <FInput
          :placeholder="$t('add_student')"
          input-class="!font-medium"
          v-model="search"
        >
          <template #prefix>
            <i class="icon-search-normal text-gray-50 text-xl mr-3" />
          </template>
        </FInput>
      </template>
      <template #option="data">
        <div class="flex-center-between px-3 py-2 border-b border-gray-800">
          <div class="flex-y-center gap-3">
            <CAvatar class="!w-9 !h-9" :image="data?.option?.avatar" />
            <div>
              <p class="text-sm leading-130 font-medium text-dark-100">
                {{ data?.option?.full_name }}
              </p>
              <p class="text-sm leading-130 font-medium text-gray">
                {{ data?.option?.phone_number }}
              </p>
            </div>
          </div>
          <CButton
            :disabled="
              values.students.findIndex(
                (item) => item.id === data.option.id
              ) !== -1
            "
            class="h-9 flex-center"
            :text="$t('add')"
            @click="addStudent(data.option)"
          />
        </div>
      </template>
    </FSelect>

    <div>
      <div class="flex flex-col gap-2 mt-5">
        <CPreviewUserCard
          v-for="(option, index) in form.values.students"
          :key="index"
          v-bind="{ option }"
          :studentsId="form.values.students.map((student) => student.id)"
          @remove="removeStudent(index)"
          no-role
          no-close
        />
      </div>
      <CGroupNoData
        v-if="!values.students?.length"
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
        :disabled="!values.students?.length"
        @click="$emit('next')"
      />
    </div>
  </CCard>
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import { TForm } from "@/composables/useForm";
import { unref, ref, onMounted, watch } from "vue";
import CButton from "@/components/Common/CButton.vue";
import CGroupNoData from "@/modules/Courses/components/Groups/Create/CGroupNoData.vue";
import CPreviewUserCard from "@/modules/Courses/components/Groups/Create/CPreviewUserCard.vue";
import apiService from "@/services/ApiService";
import { useRoute } from "vue-router";
import { useCustomToast } from "@/composables/useCustomToast";
import { useI18n } from "vue-i18n";
import CAvatar from "@/components/CAvatar.vue";
import FSelect from "@/components/Form/Select/FSelect.vue";
import { debounce } from "@/utils";
import ApiService from "@/services/ApiService";
const route = useRoute();
const { showToast } = useCustomToast();
interface Props {
  form: TForm<any>;
}

const props = defineProps<Props>();

const { form } = unref(props);
const { t } = useI18n();
const { values, $v } = form;
const loading = ref(false);
const search = ref("");
const responseError = ref(false);
const students = ref(form.values.students);
const studentAddLoading = ref(false);

async function getStudents() {
  try {
    studentAddLoading.value = true;
    // const res = await apiService.get(
    //   `backoffice/StudentsList${
    //     search.value && search.value.trim() !== ""
    //       ? `?search=${search.value}`
    //       : ""
    //   }`
    // );

    const res = await ApiService.get(
      `backoffice/StudentsList`,
      `?search=${search.value}`
    );

    students.value = res.data.results;
    responseError.value = false;
  } catch (err) {
    responseError.value = true;
    showToast(err?.response?.data?.[0]?.error?.message, "error");
  } finally {
    studentAddLoading.value = false;
  }
}

const removeStudent = (index) => {
  values.students.splice(index, 1);
};

const addStudent = (student) => {
  if (search.value) search.value = "";

  if (
    values.students.includes(student.id) ||
    values.students.findIndex((item) => item.id === student.id) !== -1
  )
    return;

  values.students.push(student);
};

onMounted(() => {
  getStudents();
});

watch(
  () => search.value,
  () => {
    debounce("get-students", () => getStudents());
  }
);

// async function getStudents() {
//   $v.value.$touch();
//   if ($v.value.$error) return;
//   try {
//     loading.value = true;
//     const response = await apiService.post("backoffice/CRMStudents/", {
//       flow: route.params?.flowId,
//       student_ids: values.url,
//     });
//     response.data?.forEach((element) => {
//       if (!element?.is_flow_member) {
//         values.students.push(element?.student);
//       } else {
//         showToast(
//           element?.student?.full_name + " " + t("already_in_flow"),
//           "error"
//         );
//         // values.url = "";
//         // $v.value.$reset();
//       }
//     });
//   } catch (err) {
//     responseError.value = true;
//     showToast(err?.response?.data?.[0]?.error?.message, "error");
//   } finally {
//     loading.value = false;
//   }
// }
</script>
