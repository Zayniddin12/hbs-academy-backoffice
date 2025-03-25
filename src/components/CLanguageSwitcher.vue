<template>
  <CDropdown head-class="cursor-pointer">
    <template #head="{ show }">
      <div
        class="transition-300 flex items-center justify-between gap-1 bg-white group pl-4 p-1 rounded-md"
      >
        <div class="flex-y-center space-x-1 text-gray-700">
          <i class="icon-language flex-center text-base h-4"></i>
          <span class="text-2xs leading-[123%]">
            {{ currentLanguage?.label }}
          </span>
          <i
            class="icon-chevron-down transition-200 text-xs inline-block"
            :class="{ 'rotate-180': show }"
          ></i>
        </div>
      </div>
    </template>

    <ul class="p-2">
      <li
        v-for="(item, index) in languages"
        :key="index"
        class="transition-200 min-w-[118px] px-3 py-2 rounded text-2xs text-dark-100 hover:bg-gray-300/[0.24] flex-center-between"
        @click="changeLocale(item.value)"
        :class="{ 'bg-gray-300': item.value === currentLanguage?.value }"
      >
        <span>{{ item.label }}</span>
        <i
          v-if="item.value === currentLanguage?.value"
          class="icon-tick-square text-green"
        ></i>
      </li>
    </ul>
  </CDropdown>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CDropdown from "@/components/Common/CDropdown.vue";
import { ELanguage, ILanguage } from "@/types/components/languageSwitcher";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const languages: ILanguage[] = [
  {
    value: ELanguage.UZ,
    label: "O'zbekcha",
    icon: "/src/assets/svg/flags/ru.svg",
  },
  {
    value: ELanguage.RU,
    label: "Русский",
    icon: "/src/assets/svg/flags/ru.svg",
  },
  {
    value: ELanguage.EN,
    label: "English",
    icon: "/src/assets/svg/flags/ru.svg",
  },
];

const currentLanguage = computed(() => {
  const currentLocale =
    (window.localStorage.getItem("locale") as unknown as ELanguage) || "ru";

  return languages.find((lang) => lang.value === currentLocale);
});

function changeLocale(_locale: ELanguage) {
  window.localStorage.setItem("locale", _locale);
  window.location.reload();
}
</script>
