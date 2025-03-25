<template>
  <div
    class="border py-2 px-3 rounded-md border-dashed border-[#E4E6EF] group flex-y-center gap-2"
  >
    <CPreloader width="32px" height="32px" v-bind="{ loading }" v-if="image">
      <CAvatar class="!w-8 !h-8" v-if="image" v-bind="{ image }" />
    </CPreloader>
    <div>
      <slot>
        <CPreloader width="120px" height="18px" v-bind="{ loading }">
          <p
            class="text-sm font-bold text-dark-100 leading-130 relative"
            :class="{ 'group-last:!text-green': course }"
          >
            {{ title ? title : "-" }}
          </p>
        </CPreloader>
      </slot>
      <CPreloader width="100px" height="18px" class="mt-1" v-bind="{ loading }">
        <p class="text-gray text-2xs leading-130" :class="descriptionClass">
          {{ t(description) }}
        </p>
      </CPreloader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import CAvatar from "@/components/CAvatar.vue";
import CPreloader from "@/components/CPreloader.vue";

interface Props {
  title?: string;
  description: string;
  course?: boolean;
  image?: boolean;
  descriptionClass?: string;
  loading?: boolean;
}

const { t } = useI18n();

withDefaults(defineProps<Props>(), {
  title: "-",
  description: "-",
});
</script>
