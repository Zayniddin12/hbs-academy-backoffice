<template>
  <CCard class="!p-0">
    <div class="p-6 flex gap-5" :class="{ '!pb-0': noTabs }">
      <slot name="image">
        <div
          v-if="!noImage"
          class="w-[135px] h-[140px] rounded-lg border border-white-100 overflow-hidden shrink-0"
        >
          <img
            v-if="image"
            :src="image"
            alt="title"
            class="w-full h-full object-cover"
          />
          <img
            v-else
            src="/images/default-avatar.png"
            alt="title"
            class="w-full h-full object-cover"
          />
        </div>
      </slot>
      <div class="flex flex-col gap-6 w-full">
        <div class="flex flex-col gap-3" :class="headClass">
          <div class="flex justify-between items-start">
            <slot name="title">
              <h1 class="text-dark font-semibold text-2xl" :class="titleClass">
                {{ title }}
              </h1>
            </slot>

            <div class="flex-y-center gap-3">
              <slot name="actions"> </slot>
            </div>
          </div>
          <slot name="subTitle">
            <p
              v-if="subTitle"
              class="text-sm text-gray leading-130 py-1.5 px-5 rounded-md bg-gray-100 w-fit capitalize"
            >
              {{ subTitle }}
            </p>
          </slot>
        </div>

        <div v-if="!noActions" class="flex gap-4 mb-4">
          <slot name="details">
            <CProfileDashDetail loading title="16.09.2022 / 09:41" />

            <CProfileDashDetail
              loading
              :title="formatPhoneNumber('+998712007007')"
              description="Номер телефона"
            />
            <CProfileDashDetail loading description="Электронная почта" />

            <CProfileDashDetail loading description="Читали" />
          </slot>
        </div>
      </div>
    </div>
    <div v-if="!noHr" class="w-full pl-6">
      <hr class="border-white-100" />
    </div>
    <CTab v-if="!noTabs" v-model="activeTab" :list="tabList ?? []" />

    <slot name="content" />
  </CCard>
</template>
<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import CTab from "@/components/Tab/CTab.vue";
import { ref } from "vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import { formatPhoneNumber } from "@/utils";
import { ITabItem } from "@/components/Tab/CTab.types";

interface Props {
  image?: string;
  title: string;
  date?: string;
  subTitle?: string;
  tabList?: ITabItem[];
  noTabs?: boolean;
  noImage?: boolean;
  noHr?: boolean;
  titleClass?: string;
  headClass?: string;
  noActions?: boolean;
  active?: string;
}

withDefaults(defineProps<Props>(), {
  title: "Title",
  date: new Date(),
  subTitle: "",
  noTabs: false,
});
const activeTab = ref("ProductReview");
</script>
