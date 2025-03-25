<template>
  <div>
    <Teleport v-if="mounted" to="#header-breadcrumbs">
      <CBreadcrumb v-bind="{ routes }" />
    </Teleport>
    <div class="px-5 py-[26px] bg-white rounded-xl">
      <p class="text-xl leading-normal font-semibold text-dark-100">
        {{ single?.title }}
      </p>
    </div>
    <CCard class="p-6 mt-6 static-text" v-html="single?.text" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMounted } from "@/composables/useMounted";
import CBreadcrumb from "@/components/Common/CBreadcrumb.vue";
import CCard from "@/components/Card/CCard.vue";
import ApiService from "@/services/ApiService";

const { t } = useI18n();
const { mounted } = useMounted();

const single = ref();

function getSingle() {
  ApiService.get("common/Privacy").then((res) => {
    single.value = res.data;
  });
}

getSingle();

const routes = computed(() => [
  {
    name: t("dashboard_title"),
    route: "/",
  },
]);
</script>

<style>
.static-text > p {
  margin-bottom: 20px !important;
}
.static-text p,
.static-text li {
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
}
.static-text ol,
.static-text ul {
  padding-left: 16px;
}
.static-text ul li {
  list-style: disc;
  position: relative;
}
.static-text ol li {
  list-style: auto;
}
.static-text a {
  color: #16cc53;
}
.static-text a:hover {
  text-decoration: underline;
}
.static-text img {
  width: 100%;
  max-height: 438px;
  border-radius: 8px;
}
.static-text b {
  font-weight: 500;
}

.static-text h4,
.static-text h1,
.static-text h2,
.static-text h3,
.static-text h5,
.static-text h6 {
  color: #080a15;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 12px;
}
</style>
