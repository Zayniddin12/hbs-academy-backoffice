<template>
  <CCard class="p-5">
    <p class="text-xl leading-130 font-semibold text-dark-100">
      {{ $t("general_information_about_group") }}
    </p>
    <div class="grid grid-cols-2 gap-4 mt-5">
      <FGroup :label="$t('module_name')">
        <FInput
          v-model="values.name"
          :error="form.$v.value.name.$error"
          :placeholder="$t('think_about_group_name')"
        />
      </FGroup>
      <div class="">
        <FGroup :label="$t('duration')" wrapper-class="!justify-start gap-1">
          <FInput
            v-model="values.days"
            :error="form.$v.value.days.$error"
            placeholder="0"
            v-maska="'###'"
            class="max-w-[170px]"
          />
          <template #labelOpposite>
            <p class="text-xs leading-normal font-normal text-gray">
              {{ $t("in_days") }}
            </p>
          </template>
        </FGroup>
      </div>
    </div>

    <div class="mt-5 flex flex-col gap-4">
      <CModuleLessonFinish
        v-for="lesson in filteredLessons"
        :key="lesson?.id"
        v-bind="{ lesson }"
        @edit-lesson="$emit('back')"
        @remove-lesson="(i) => removeLesson(i)"
        @modified-lessons="(i) => modify(i)"
      />
    </div>
  </CCard>

  <CCard class="flex-center-between p-5 mt-6">
    <CButton
      class="min-w-[190px]"
      variant="info"
      :text="$t('back')"
      @click="$emit('back')"
    />
    <CButton
      class="min-w-[190px]"
      icon="icon-tick-square !text-base"
      :text="$t('add')"
      @click="submit"
    />
  </CCard>
  <CDeleteDialog
    :title="$t('delete_lesson')"
    :subtitle="$t('delete_lesson_text')"
    @close="showDelete = false"
    @submit="deleteLesson"
    :show="showDelete"
  />
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import CModuleLessonFinish from "@/modules/Courses/components/Modules/Create/CModuleLessonFinish.vue";
import CButton from "@/components/Common/CButton.vue";
import { TForm } from "@/composables/useForm";
import { ref, unref, watch } from "vue";
import CDeleteDialog from "@/components/Common/Dialog/CDeleteDialog.vue";

interface Props {
  lessons: {
    id: number;
    title: string;
    name: string;
    video: string;
    extraFiles: boolean;
    description: string;
    files: any[];
  }[];
  form: TForm<any>;
}

const props = defineProps<Props>();
const { form } = unref(props);
const { values } = form;

const showDelete = ref(false);
const deleteId = ref("");

const emit = defineEmits(["next", "back", "modify", "delete"]);

const filteredLessons = ref<any>([]);

watch(
  () => props.lessons,
  (val) => {
    filteredLessons.value = val;
  },
  {
    deep: true,
    immediate: true,
  }
);

const removeLesson = (id: string) => {
  deleteId.value = id;
  showDelete.value = true;
};
const deleteLesson = () => {
  filteredLessons.value = filteredLessons.value?.filter(
    (i) => i?.id !== deleteId.value
  );
  showDelete.value = false;
  emit("delete", filteredLessons.value);
};
const modify = (data) => {
  emit("modify", data);
};

function submit() {
  form.$v.value.$touch();
  if (!form.$v.value.$invalid) {
    emit("next");
  }
}
</script>
