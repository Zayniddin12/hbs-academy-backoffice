<template>
  <div
    class="custom-stepper relative z-10 min-w-[250px] w-full overflow-x-scroll md:overflow-x-auto inline-flex items-start justify-between md:justify-start md:flex-col pb-6 md:pr-6 border-b md:border-b-0 md:border-r border-solid border-grey"
  >
    <div
      v-for="(item, index) in steps"
      :key="index"
      class="w-[38.333%] md:w-auto flex-shrink-0 flex md:flex-col items-center justify-center md:items-start list-step select-none"
    >
      <div class="flex items-center flex-col md:flex-row">
        <div
          :class="checkActive(index + 1)"
          class="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-grey rounded-lg flex-center transition duration-300"
        >
          <span class="text-base font-medium leading-20 flex-shrink-0">
            {{ index + 1 }}
          </span>
        </div>
        <div class="text-center md:text-left mt-2 md:mt-0 md:ml-3">
          <p
            class="text-sm font-semibold mb-0.5"
            :class="[
              index + 1 === modelValue
                ? 'text-dark'
                : index + 1 < modelValue
                ? 'text-dark'
                : 'text-gray-700',
            ]"
          >
            {{ $t(item?.title) }}
          </p>
          <p class="text-xs text-gray font-normal hidden md:block">
            {{ $t(item?.text) }}
          </p>
        </div>
      </div>
      <div
        class="w-8 h-0.5 md:h-5 md:w-px mr-auto md:ml-5 my-3 colored-line bg-blue/20"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  modelValue: number;
  steps: {
    title: string;
    text: string;
    icon?: string;
  }[];
}
const props = withDefaults(defineProps<Props>(), {
  steps: () => [
    {
      title: "Telefon raqamingiz",
      text: "Telefon raqamingizni tasdiqlang",
      icon: "icon-phone",
    },
    {
      title: "Test vaqtini belgilash",
      text: "Test topshirish sanasini belgilang",
      icon: "icon-calendar-event",
    },
    {
      title: "To‘lovni amalga oshirish",
      text: "Belgilangan test bojini to‘lang",
      icon: "icon-credit-card1",
    },
    {
      title: "Yakunlash",
      text: "Muvaffaqiyatli ro‘yxatdan o‘tish",
      icon: "icon-rocket",
    },
  ],
});

function checkActive(target: number) {
  if (target === props.modelValue) {
    return "!bg-blue text-white";
  } else if (props.modelValue > target) {
    return "!bg-blue-50 text-blue";
  } else {
    return "bg-gray-300 text-gray-700";
  }
}
</script>

<style scoped>
.custom-stepper::-webkit-scrollbar {
  width: 3px;
  height: 8px;
  background-color: #f6f7f7;
}

.custom-stepper::-moz-scrollbar {
  height: 1px;
  background-color: #6a7380;
}

.custom-stepper::-ms-scrollbar {
  height: 1px;
  background-color: #6a7380;
}

.custom-stepper::-o-scrollbar {
  height: 1px;
  background-color: #6a7380;
}

.custom-stepper::-webkit-scrollbar-thumb {
  background-color: #6a7380;
  border-radius: 4px;
}

.custom-stepper::-moz-scrollbar-thumb {
  background-color: #6a7380;
  border-radius: 4px;
}

.custom-stepper::-ms-scrollbar-thumb {
  background-color: #6a7380;
  border-radius: 4px;
}

.custom-stepper::-o-scrollbar-thumb {
  background-color: #6a7380;
  border-radius: 4px;
}

.list-step:last-child .colored-line {
  display: none;
}
</style>
