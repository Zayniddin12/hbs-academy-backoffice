<template>
  <div class="bg-[#F5F6F7] min-h-screen flex">
    <CSidebar />

    <div class="w-full h-full">
      <CHeader v-bind="{ activeRoute }" />

      <div class="h-full w-full max-w-[1920px] p-6 mx-auto">
        <div class="w-full h-full">
          <slot />
        </div>
      </div>
    </div>
    <StudentInfo />
  </div>
</template>
<script lang="ts" setup>
import CSidebar from "@/layout/Dashboard/components/CSidebar.vue";
import CHeader from "@/layout/Dashboard/components/CHeader.vue";
import StudentInfo from "@/layout/Dashboard/components/StudentInfo.vue";

const activeRoute = "/";
</script>
