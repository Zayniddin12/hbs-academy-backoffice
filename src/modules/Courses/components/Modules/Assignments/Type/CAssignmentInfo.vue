<template>
  <CCard class="p-6">
    <p class="text-xl leading-normal font-semibold text-dark-100">
      {{ $t("general_information") }}
    </p>

    <div class="mt-4 flex flex-col gap-4">
      <FGroup :label="$t('title')">
        <FInput
          :placeholder="$t('enter_title')"
          v-model="values.title"
          :error="form.$v.value.title.$error"
        />
      </FGroup>
      <FGroup :label="$t('assignment_description')">
        <FTextarea
          :placeholder="$t('enter_assignment_description')"
          textarea-class="h-[120px]"
          maxlength="3000"
          v-model="values.description"
          :error="form.$v.value.description.$error"
        />
      </FGroup>

      <div class="mt-4 grid grid-cols-2 gap-4">
        <FGroup :label="$t('allotted_point')">
          <FInput
            placeholder="0"
            v-maska="'###'"
            v-model="values.ball"
            :error="form.$v.value.ball.$error"
          />
        </FGroup>
        <FGroup :label="$t('add_day')">
          <FInput
            placeholder="0"
            v-maska="'####'"
            v-model="values.duration_days"
            :error="form.$v.value?.duration_days?.$error"
          />
        </FGroup>
        <FGroup v-if="isTest" :label="$t('allotted_time')">
          <FInput
            :placeholder="$t('0_min')"
            v-maska="'####'"
            v-model="values.allocated_time"
            :error="form.$v.value?.allocated_time?.$error"
          />
        </FGroup>
      </div>
    </div>
  </CCard>
</template>

<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import FGroup from "@/components/Form/FGroup.vue";
import FInput from "@/components/Form/Input/FInput.vue";
import FTextarea from "@/components/Form/FTextarea.vue";
import { ref, unref } from "vue";
import { TForm } from "@/composables/useForm";

interface Props {
  isTest: boolean;
  form: TForm<any>;
}

const props = defineProps<Props>();
const { form } = unref(props);
const { values } = form;

const text = ref("");
</script>
