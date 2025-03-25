<template>
  <div class="p-6 rounded-xl bg-white grid grid-cols-[1fr_1px_1fr] gap-5">
    <div class="flex flex-col gap-4">
      <div v-if="assignment?.answer_text">
        <p class="text-xl leading-normal font-semibold text-dark-100">
          {{ $t("writing_answer") }}
        </p>

        <p class="mt-4 text-sm leading-130 text-dark-100 whitespace-pre-line">
          {{ assignment?.answer_text }}
        </p>
      </div>
      <div v-if="assignment?.answer_files?.length">
        <p class="text-xl leading-normal font-semibold text-dark-100">
          {{ $t("attached_files") }}
        </p>

        <div class="flex flex-col mt-4">
          <CFile
            v-for="(file, idx) in assignment.answer_files"
            :key="idx"
            :file="file"
            has-download
          />
        </div>
      </div>
    </div>
    <div class="w-px h-[calc(100%-42px)] bg-gray-800 mt-auto" />
    <CResultRating :assignment="assignment" />
  </div>
</template>

<script setup lang="ts">
import CFile from "@/components/Common/CFile.vue";
import CResultRating from "@/modules/Assignments/components/result/CResultRating.vue";
import { IStudentAssignment } from "@/modules/Assignments/types";

interface Props {
  assignment: IStudentAssignment;
}

defineProps<Props>();
</script>
