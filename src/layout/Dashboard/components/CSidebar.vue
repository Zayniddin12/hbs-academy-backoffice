<template>
  <div
    :class="[isOpen ? 'w-[265px]' : 'w-[75px]']"
    class="h-screen transition-300 shrink-0"
  />
  <div
    :class="[isOpen || hovered ? 'w-[265px]' : 'w-[75px]']"
    class="h-screen bg-dark-100 transition-300 fixed flex flex-col justify-between z-30 overflow-hidden"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div
      class="absolute w-full h-[132px] bg-green -top-[56px] blur-[99px] opacity-60 z-[-1]"
    ></div>
    <div>
      <div
        class="w-full px-4 py-5 flex items-center justify-center border-b border-solid border-white/30"
      >
        <div
          :class="{ 'opacity-0 invisible !w-0': !isOpen && !hovered }"
          class="relative overflow-hidden transition-300 w-[211px]"
        >
          <LogoMain />
        </div>
        <div
          class="cursor-pointer w-6 h-6 flex items-center justify-center transition-300"
          @click="isOpen = !isOpen"
        >
          <span
            :class="{ '!rotate-180': !isOpen }"
            class="flex items-center transition-300"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.7071 6.70711C13.0976 6.31658 13.0976 5.68342 12.7071 5.29289C12.3166 4.90237 11.6834 4.90237 11.2929 5.29289L5.29289 11.2929C4.91431 11.6715 4.90107 12.2811 5.26285 12.6757L10.7628 18.6757C11.136 19.0828 11.7686 19.1103 12.1757 18.7372C12.5828 18.364 12.6103 17.7314 12.2372 17.3243L7.38414 12.0301L12.7071 6.70711Z"
                fill="white"
              />
              <path
                opacity="0.4"
                d="M19.7071 6.70711C20.0976 6.31658 20.0976 5.68342 19.7071 5.29289C19.3166 4.90237 18.6834 4.90237 18.2929 5.29289L12.2929 11.2929C11.9143 11.6715 11.9011 12.2811 12.2628 12.6757L17.7628 18.6757C18.136 19.0828 18.7686 19.1103 19.1757 18.7372C19.5828 18.364 19.6103 17.7314 19.2372 17.3243L14.3841 12.0301L19.7071 6.70711Z"
                fill="white"
              />
            </svg>
          </span>
        </div>
      </div>
      <div class="flex flex-col py-5 gap-1">
        <div v-for="(menuItem, index) in filteredMenu" :key="index">
          <RouterLink
            v-if="!menuItem?.sub?.length"
            :class="{ '!bg-green/[0.08]': location === menuItem?.route }"
            :to="menuItem?.route"
            class="py-3 px-5 hover:bg-blue-200/10 transition-300 flex items-center group gap-3 h-12"
            @click="openMenu(index)"
          >
            <i
              :class="[
                menuItem?.svgIcon,
                {
                  '!text-green': location === menuItem?.route,
                },
              ]"
              class="text-xl text-gray group-hover:!text-green transition-300"
            />
            <CollapseTransition :duration="300" dimension="width">
              <p
                v-if="isOpen || hovered"
                class="text-sm text-white font-semibold"
              >
                {{ $t(menuItem?.heading) }}
              </p>
            </CollapseTransition>
          </RouterLink>
          <div
            v-else
            :class="[
              index === openIndex || isActiveSub(menuItem?.sub)
                ? 'bg-green/[0.08]'
                : '',
            ]"
            class="transition-300 cursor-pointer"
          >
            <div
              class="py-3 px-5 flex hover:bg-green/[0.08] transition-300 items-center justify-between gap-3 h-12 group"
              @click="openMenu(index)"
            >
              <div class="flex items-center gap-3">
                <i
                  :class="[
                    menuItem?.svgIcon,
                    {
                      '!text-primary':
                        location === menuItem?.route ||
                        openIndex ||
                        isActiveSub(menuItem?.sub),
                    },
                  ]"
                  class="text-xl text-gray group-hover:!text-primary transition-300"
                />
                <CollapseTransition :duration="300" dimension="width">
                  <p
                    v-if="isOpen || hovered"
                    class="text-sm text-white font-semibold"
                  >
                    {{ $t(menuItem?.heading) }}
                  </p>
                </CollapseTransition>
              </div>
              <i
                v-if="isOpen || hovered"
                :class="[
                  {
                    '!-rotate-90 ': index !== openIndex,
                  },
                ]"
                class="icon-chevron text-xl leading-5 transition-300 text-gray"
              />
            </div>

            <CollapseTransition>
              <div
                v-if="
                  (menuItem?.sub?.length && index === openIndex && isOpen) ||
                  (index === openIndex && !isOpen && hovered)
                "
              >
                <RouterLink
                  v-for="(subMenuItem, idx) in menuItem?.sub"
                  :key="idx"
                  :to="subMenuItem?.route"
                  class="p-3 pl-6 transition-300 flex items-center gap-3 h-12 text-gray-700 group"
                >
                  <span
                    :class="{ '!text-white': location === subMenuItem?.route }"
                    class="text-gray-200 group-hover:text-white transition-300"
                    >-</span
                  >
                  <CollapseTransition :duration="300" dimension="width">
                    <p
                      v-if="isOpen || hovered"
                      :class="{
                        '!text-white': location === subMenuItem?.route,
                      }"
                      class="text-xs text-gray-200 group-hover:text-white transition-300"
                    >
                      {{ $t(subMenuItem?.heading) }}
                    </p>
                  </CollapseTransition>
                </RouterLink>
              </div>
            </CollapseTransition>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isOpen || hovered" class="p-5">
      <RouterLink
        class="text-xs underline text-gray hover:opacity-60 transition-300"
        to="/pages/privacy-policy"
      >
        {{ $t("privacy_policy") }}
      </RouterLink>
      <p class="text-xs text-blue-200 mt-2.5">
        {{ $t("version") }} {{ CONFIG.APP_VERSION }}
      </p>
      <i18n-t
        keypath="supported_by"
        tag="div"
        class="text-xs leading-normal text-blue-200 my-2"
      >
        <template #logo>
          <a class="block my-2" href="https://uic.group" target="_blank">
            <img src="/images/uic-logo.svg" alt="logo" />
          </a>
        </template>
      </i18n-t>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CollapseTransition from "@ivanv/vue-collapse-transition/src/CollapseTransition.vue";
import { computed, onMounted, ref } from "vue";
import { IMenu, menu } from "@/data/menu";
import { useRoute } from "vue-router";
import LogoMain from "@/components/Logo/CLogo.vue";
import { CONFIG } from "@/config";
import { useAuthStore } from "@/modules/Auth/stores";

const openIndex = ref<number>();
const isOpen = ref(true);
const hovered = ref(false);
const route = useRoute();
const store = useAuthStore();

const location = computed(() => route.path);

function openMenu(index?: number) {
  if (openIndex.value === index) {
    openIndex.value = undefined;
  } else {
    openIndex.value = index;
  }
}

function checkIndexActive() {
  menu.forEach((el, index) => {
    if (el?.sub?.length) {
      el?.sub?.forEach((elSub) => {
        if (elSub?.route === location.value) {
          openIndex.value = index;
        }
      });
    }
  });
}

onMounted(() => {
  localStorage.setItem("isOpen", "true");
  setTimeout(() => {
    checkIndexActive();
  }, 100);
});

function isActiveSub(arr?: IMenu[]) {
  return arr?.find((el) => el?.route === location.value);
}

const user = computed(() => store.user);

// Filter the menu based on the user's role
const filteredMenu = computed(() => {
  return menu.filter((item) => {
    // If the user's role is admin, teacher, or manager, exclude the "colleagues" and "home" menu items
    if (
      (user.value.role === "teacher" || user.value.role === "mentor") &&
      (item.heading === "colleagues" || item.heading === "home")
    ) {
      return false;
    }
    return true;
  });
});
</script>
