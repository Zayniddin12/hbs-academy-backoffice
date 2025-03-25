<template>
  <div>
    <div class="header-test w-full h-[142px] rounded-xl p-6">
      <div class="flex-y-center gap-3">
        <CAvatar
          class="!w-10 !h-10 !rounded-lg bg-white"
          :image="assignment?.student_avatar"
        />
        <p class="text-xl font-medium leading-130 text-white">
          {{ assignment?.student_name }}
        </p>
      </div>
    </div>

    <div class="px-6 grid grid-cols-4 gap-5 mt-[-50px]">
      <CResultInfo v-for="(card, i) in testList" :key="i" v-bind="{ card }" />
    </div>
    <div class="mt-8 grid grid-cols-12 gap-6">
      <div class="col-span-8">
        <CTestWrapper
          :count="assignment?.answer_questions?.length"
          v-bind="{ current, loading }"
          @next="handleNext"
          @back="handlePrev"
        >
          <template
            v-for="(question, index) in assignment?.answer_questions"
            :key="index"
          >
            <CQuestion
              v-if="current === index + 1"
              v-bind="{ question, index }"
              :form="useFormQuestions"
              :answered="question?.is_answered"
            />
          </template>
        </CTestWrapper>
      </div>
      <div class="col-span-4">
        <CTestSidebar
          v-bind="{
            questions: assignment?.answer_questions,
            time: assignment?.test_spent_time,
            current,
            values: useFormQuestions?.values,
          }"
          @map-change="current = $event"
          answered
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CTestWrapper from "@/modules/Assignments/components/Test/CTestWrapper.vue";
import CTestSidebar from "@/modules/Assignments/components/Test/CTestSidebar.vue";
import { computed, ref, watch } from "vue";
import CQuestion from "@/modules/Assignments/components/Test/CQuestion.vue";
import { useForm } from "@/composables/useForm";
import { useRouter } from "vue-router";
import CAvatar from "@/components/CAvatar.vue";
import CResultInfo from "@/modules/Assignments/components/result/CResultInfo.vue";
import { useI18n } from "vue-i18n";
import { IStudentAssignment } from "@/modules/Assignments/types";
import { formatDuration, secondsToTime } from "@/utils";

interface Props {
  assignment: IStudentAssignment;
}

const props = defineProps<Props>();

const router = useRouter();
const { t } = useI18n();

const current = ref(1);
const loading = ref(false);

const useFormQuestions = useForm({}, {});

function handleNext() {
  const index = Object.values(useFormQuestions.values)?.findIndex(
    (item) => !item.answer
  );
  if (current.value < props.assignment?.answer_questions?.length) {
    current.value++;
  } else if (index > 0) {
    current.value = index + 1;
  } else {
    loading.value = true;
    setTimeout(() => {
      router.push({ name: "AssignmentSingle", params: { id: 1 } });
    }, 1000);
  }
}

function handlePrev() {
  if (current.value > 1) {
    current.value--;
  }
}

const testList = computed(() => [
  {
    image: "/images/svg/icon-list.svg",
    title: t("point_count", { point: props.assignment?.ball ?? 0 }),
    value: `${props.assignment?.answer_questions_correct_count ?? 0}/${
      props.assignment?.answer_questions?.length ?? 0
    }`,
    description: "Ваш итоговый результат по тестовым вопросам",
  },
  {
    image: "/images/svg/time-test.svg",
    title: secondsToTime(props.assignment?.test_spent_time),
    value:
      t("from") + " " + secondsToTime(props.assignment?.test_stat_max_time),
    description: "Общее время потраченное на прохождение теста",
  },
  {
    image: "/images/svg/time-question.svg",
    title: formatDuration(props.assignment?.test_stat_average_time),
    value: `${t("min")}: ${formatDuration(
      props.assignment?.test_stat_min_time
    )} / ${t("max")}: ${formatDuration(props.assignment?.test_stat_max_time)}`,
    description: "Среднее время потраченное на один вопрос",
  },
  {
    image: props.assignment?.module?.course?.photo,
    title: props.assignment?.module?.course?.title,
    value: "",
    description: "Название курса",
  },
]);

function assignSingleAnswer(data, index) {
  const selectedAnswer = data?.answers.find((item) => item?.is_selected);
  if (selectedAnswer?.is_selected) {
    return selectedAnswer.id;
  }
}

function assignMultipleAnswer(data, index) {
  const selectedAnswers = data?.answers.filter((item) => item?.is_selected);
  if (selectedAnswers?.length) {
    return selectedAnswers.map((item) => item.id);
  }
}

watch(
  () => props.assignment?.answer_questions,
  () => {
    useFormQuestions.values = props.assignment?.answer_questions?.map(
      (item: any, index: number) => {
        return {
          ...item,
          answer:
            item.details?.answer_type === "single_answer"
              ? assignSingleAnswer(item, index)
              : item.details?.answer_type === "multiple_answer"
              ? assignMultipleAnswer(item, index)
              : "",
        };
      }
    );
  },
  {
    immediate: true,
  }
);
</script>

<style scoped>
.header-test {
  background: linear-gradient(91deg, #16cc53 -23.31%, #080a15 132.45%);
}
</style>
