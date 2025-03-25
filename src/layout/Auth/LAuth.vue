<template>
  <div class="grid grid-cols-9">
    <div
      class="relative flex col-span-5 items-center flex-col justify-between py-12 overflow-y-scroll max-h-screen gap-4"
    >
      <div>
        <img src="/images/svg/logo.svg" alt="logo" />
      </div>
      <slot />

      <!--      <div class="text-center flex flex-col gap-3">-->
      <!--        <RouterLink-->
      <!--          to="/pages/privacy-policy"-->
      <!--          target="_blank"-->
      <!--          class="text-xs font-normal text-gray-500 leading-normal"-->
      <!--        >-->
      <!--          {{ $t("privacy_policy") }}-->
      <!--        </RouterLink>-->
      <!--        <p class="text-xs leading-normal text-gray-500">-->
      <!--          {{ $t("version") }} {{ CONFIG.APP_VERSION }}-->
      <!--        </p>-->
      <!--      </div>-->
    </div>
    <div
      class="col-span-4 w-full h-screen bg-green bg-image relative flex flex-col items-center justify-between"
    >
      <SUicLogo main-color="#fff" class="absolute-x bottom-24" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SUicLogo from "@/components/Logo/CUicLogo.vue";
</script>

<style scoped>
.bg-image {
  background-image: url("/images/svg/bg_png.webp");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
