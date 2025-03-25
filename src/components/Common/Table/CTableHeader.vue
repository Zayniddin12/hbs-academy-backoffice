<template>
  <header class="flex justify-between mb-4">
    <slot name="header_title">
      <div>
        <h2 class="mb-[3px] text-base leading-130 font-semibold text-dark-100">
          {{ title }}
        </h2>
        <p class="text-xs leading-130 font-normal text-gray">
          {{ subtitle }}
        </p>
      </div>
    </slot>
    <div class="flex-y-center gap-5 focus-within:border-green">
      <div class="shrink-0">
        <slot name="beforeSearch" />
      </div>
      <Input
        v-model="search"
        v-if="!noSearch"
        prefix-class="pr-2.5"
        :placeholder="$t(searchPlaceholder)"
        class="border border-gray-100"
        :input-class="inputClasses"
      >
        <template #prefix>
          <span class="icon-search-normal text-gray text-xl"></span>
        </template>
        <template #suffix>
          <button
            :class="{ '!opacity-100 !visible': search?.length }"
            class="w-5 h-5 flex-center bg-gray/[16%] rounded-full p-1 transition-200 group hover:bg-red opacity-0 invisible"
            @click="clearSearch"
          >
            <span
              class="icon-close text-gray text-[10px] transition-200 group-hover:text-white"
            />
          </button>
        </template>
      </Input>
      <slot name="afterSearch" />
    </div>
  </header>
</template>

<script setup lang="ts">
import Input from "@/components/Form/Input/FInput.vue";

import { ref, watch } from "vue";
import { useRoute } from "vue-router";

interface Props {
  searchPlaceholder?: string;
  title?: string;
  subtitle?: string;
  noSearch?: boolean;
  inputClasses?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: "search",
});
const emit = defineEmits(["search"]);
const route = useRoute();
const search = ref(route.query.search || "");

function clearSearch() {
  search.value = "";
}

watch(
  () => search.value,
  () => {
    emit("search", search.value);
  }
);
//
// watch(
//   () => props?.search,
//   () => {
//     search.value = props?.search;
//   },
//   { immediate: true }
// );
</script>

<style scoped></style>
