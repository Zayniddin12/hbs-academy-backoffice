<template>
  <div class="grid grid-cols-12 gap-6 mt-6">
    <CCard class="p-6 2xl:col-span-9 col-span-8">
      <form>
        <h3 class="text-dark-100 text-xl font-semibold">
          {{ $t("general_information") }}
        </h3>
        <FGroup :label="$t('title')" class="mt-4">
          <FInput
            :placeholder="$t('enter_title')"
            v-model="values.title"
            :error="form.$v.value.title.$error"
            @change="form.$v.value.title?.$touch()"
          />
        </FGroup>
        <FGroup :label="$t('subtitle')" class="mt-4">
          <FTextarea
            textarea-class="min-h-[120px]"
            :placeholder="$t('enter_subtitle')"
            v-model="values.subtitle"
            :error="form.$v.value.subtitle.$error"
            @change="form.$v.value.subtitle?.$touch()"
            maxlength="500"
          />
        </FGroup>
        <FGroup :label="$t('course_type')" class="mt-4">
          <div class="flex-y-center gap-4">
            <FRadio
              v-for="(type, idx) of courseTypes"
              :key="idx"
              :error="form.$v.value.course_type.$error"
              v-model="values.course_type"
              :model-value="values.course_type"
              :label="$t(type?.title)"
              :value="type?.type"
            />
          </div>
        </FGroup>
      </form>
    </CCard>
    <CCard class="2xl:col-span-3 col-span-4 p-5 h-fit">
      <h3 class="text-dark-100 text-sm mb-2">
        {{ $t("cover") }}
      </h3>
      <ImageUploader
        @change="values.cover = $event"
        :default-image="values?.cover"
        :error="form.$v.value.cover.$error"
        :key="loading"
      />
    </CCard>
  </div>
</template>
<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import ImageUploader from "@/components/Form/Uploader/ImageUploader.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import FTextarea from "@/components/Form/FTextarea.vue";
import { TForm } from "@/composables/useForm";
import { unref } from "vue";
import FRadio from "@/components/Form/Radio/FRadio.vue";

interface Props {
  form: TForm<any>;
  loading?: boolean;
}
const props = defineProps<Props>();

const { values, $v } = unref(props.form);

const courseTypes = [
  {
    title: "online",
    type: "online",
  },
  {
    title: "offline",
    type: "offline",
  },
];
</script>
