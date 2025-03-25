<template>
  <CDropdown head-class="cursor-pointer">
    <template #head="{ show }">
      <div class="flex-y-center gap-3">
        <div>
          <p class="font-semibold text-base text-dark mb-0.5">
            {{ user?.full_name }}
          </p>
          <p class="text-sm text-gray text-right">
            {{ $t(user?.role) }}
          </p>
        </div>

        <CAvatar :image="user?.avatar" size="sm" />

        <span
          :class="{ 'rotate-180': show }"
          class="icon-chevron-down font-medium transition-200 text-2xl text-gray"
        ></span>
      </div>
    </template>
    <ul class="p-2">
      <li
        class="transition-200 flex flex-col gap-1 text-sm w-full text-dark hover:bg-gray/[10%] rounded"
        v-for="(item, idx) in dropdownItems"
        :key="idx"
        :class="item.styles"
        @click="item.action"
      >
        <div
          class="flex-y-center px-3 py-2 border-b border-[#F5F6F7] gap-2"
          :class="{ '!border-b-0': idx === dropdownItems.length - 1 }"
        >
          <i :class="item?.icon" class="text-lg" />
          {{ item.label }}
        </div>
      </li>
    </ul>
  </CDropdown>
</template>

<script lang="ts" setup>
import CDropdown from "@/components/Common/CDropdown.vue";
import { computed, defineComponent } from "vue";
import CAvatar from "@/components/CAvatar.vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/modules/Auth/stores";

defineComponent({
  name: "HeaderProfile",
});

interface Props {
  user?: {
    fullName: string;
    avatar: string;
    subtitle: string;
  };
  profileItems?: {
    title: string;
    class?: string;
    icon?: string;
    event?: string;
  }[];
}
defineProps<Props>();

const router = useRouter();
const { t } = useI18n();
const store = useAuthStore();

const user = computed(() => store.user);
interface IDropdownItem {
  label: string;
  styles?: string;
  action: () => void;
  icon: string;
}

const dropdownItems: IDropdownItem[] = [
  {
    label: t("profile"),
    action: () => router.push({ name: "PProfile" }),
    icon: "icon-user",
  },
  {
    label: t("log_out"),
    styles: "text-red-500 hover:!bg-red-50",
    action: () => logout(),
    icon: "icon-log-out",
  },
];
function logout() {
  store.logout();
  router.push({ name: "PAuth" });
}
</script>
