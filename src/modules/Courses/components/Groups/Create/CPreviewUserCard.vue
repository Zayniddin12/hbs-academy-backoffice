<template>
  <div
    :class="{
      'bg-green-100': studentsId.find((studentId) => studentId === option.id),
    }"
    class="flex-center-between px-3 py-2 border rounded-lg transition-300 transition-all border-gray-800"
  >
    <div class="flex-y-center gap-3">
      <CAvatar class="!w-9 !h-9" :image="option?.avatar" />
      <div>
        <p class="text-sm leading-130 font-medium text-dark-100">
          {{ option?.full_name }}
        </p>

        <div class="flex flex-row space-x-2">
          <p
            v-if="!noRole"
            class="mt-1 text-sm leading-130 font-normal text-gray"
          >
            {{ $t(option?.role) }} |
          </p>
          <p class="mt-1 text-sm leading-130 font-normal text-gray">
            {{ $t(option?.phone_number) }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex flex-row space-x-2">
      <button
        v-if="
          studentsId.find((studentId) => studentId === option.id) && !noRemove
        "
        class="w-8 h-8 rounded-full border border-gray flex-center group hover:border-red transition-300"
        @click="$emit('remove')"
      >
        <i
          class="icon-close text-sm text-gray font-bold group-hover:text-red transition-300"
        />
      </button>
      <button
        v-if="!noClose"
        :class="{
          '!bg-green-500 !border-white': studentsId.find(
            (studentId) => studentId === option.id
          ),
        }"
        class="w-8 h-8 rounded-full border border-gray flex-center group hover:border-green transition-300"
        @click="$emit('add')"
      >
        <i
          :class="{
            '!text-white': studentsId.find(
              (studentId) => studentId === option.id
            ),
          }"
          class="icon-add text-sm text-gray font-bold group-hover:text-green transition-300"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CAvatar from "@/components/CAvatar.vue";
import { IWorker } from "@/modules/Courses/types";

interface Props {
  option: IWorker;
  studentsId: string[];
  noRole?: boolean;
  noClose?: boolean;
  noRemove?: boolean;
}

defineProps<Props>();
</script>
