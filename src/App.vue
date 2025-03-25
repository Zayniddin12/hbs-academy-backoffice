<template>
  <div>
    <RouterView v-slot="{ Component }">
      <div :key="detectLayout">
        <component :is="detectLayout">
          <Component :is="Component" />
        </component>
      </div>
    </RouterView>
    <CDialog :show="show" title="" no-header>
      <div class="text-dark text-xl font-medium text-center py-14">
        {{ $t("using_chrome") }}
      </div>
    </CDialog>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import LDefault from "@/layout/Dashboard/LDefault.vue";
import LError from "@/layout/Error/LError.vue";
import LAuth from "@/layout/Auth/LAuth.vue";
import { useClientSecret } from "@/composables/useClientSecretToken";
import LEmpty from "@/layout/Empty/LEmpty.vue";
import CDialog from "@/components/Common/Dialog/CDialog.vue";
// Setup
// const { t } = useI18n();
const clientSecret = useClientSecret();
const route = useRoute();
const layouts: { [key: string]: string } = {
  default: LDefault,
  error: LError,
  auth: LAuth,
  empty: LEmpty,
};
const show = ref(false);

const detectLayout = computed(() => {
  return layouts[route.meta.layout as string];
});

clientSecret.init();

const isChrome =
  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

if (!isChrome) {
  show.value = true;
  // Your code for Chrome users here
  // alert(t("using_chrome"));
}
</script>
