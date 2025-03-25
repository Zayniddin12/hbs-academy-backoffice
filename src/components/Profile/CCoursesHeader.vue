<template>
  <CCard class="!p-0">
    <div class="p-6 flex gap-5" :class="{ 'pb-0': !noTabs }">
      <div
        class="w-[122px] h-[122px] rounded-lg border border-white-100 overflow-hidden shrink-0"
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
      <div class="flex flex-col w-full">
        <div class="flex-grow flex justify-between items-start">
          <div class="h-full flex flex-col">
            <slot name="title">
              <CPreloader v-bind="{ loading }" width="184px" height="32px">
                <h1 class="text-dark font-semibold text-2xl">{{ title }}</h1>
              </CPreloader>
            </slot>
            <slot name="subTitle">
              <p v-if="descriptionName" class="text-gray text-2xs mb-2">
                {{ descriptionName }}
              </p>
              <p class="text-sm text-dark-100 font-medium leading-130">
                {{ subTitle }}
              </p>
            </slot>
          </div>

          <div class="flex-y-center gap-3">
            <slot name="actions">
              <CButton />
            </slot>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-4 p-6 !pb-0">
      <slot name="details">
        <CProfileDashDetail title="16.09.2022 / 09:41" />

        <CProfileDashDetail
          :title="formatPhoneNumber('+998712007007')"
          description="Номер телефона"
        />
        <CProfileDashDetail description="Электронная почта" />

        <CProfileDashDetail description="Читали" />
      </slot>
    </div>
    <div v-if="!noTabs" class="w-full pl-6 mt-6">
      <hr class="border-white-100" />
    </div>
    <CTab v-if="!noTabs" v-model="activeTab" :list="tabList" />
  </CCard>
</template>
<script setup lang="ts">
import CCard from "@/components/Card/CCard.vue";
import CTab from "@/components/Tab/CTab.vue";
import { ref, watch } from "vue";
import CButton from "@/components/Common/CButton.vue";
import CProfileDashDetail from "@/components/Profile/CProfileDashDetail.vue";
import { formatPhoneNumber } from "@/utils";
import { ITabItem } from "@/components/Tab/CTab.types";
import { useRoute, useRouter } from "vue-router";
import CPreloader from "@/components/CPreloader.vue";

interface Props {
  image?: string;
  title: string;
  date?: Date | string;
  subTitle?: string;
  tabList?: ITabItem[];
  noTabs?: boolean;
  descriptionName?: string;
  currentTab?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Title",
  date: () => new Date(),
  subTitle: "Technologist",
});

const route = useRoute();
const router = useRouter();

const activeTab = ref(props.currentTab);

watch(activeTab, (val) => {
  router.push({ name: val, query: { ...route.query } });
  console.log("val", val);
});
</script>
