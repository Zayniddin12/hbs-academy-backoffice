<template>
  <div class="relative w-full max-w-full" :class="wrapperClass">
    <Transition name="dropdown" mode="out-in">
      <div>
        <table class="w-full c-table" v-if="!loading">
          <thead>
            <tr>
              <th
                v-for="(h, index) in head"
                :key="index"
                class="p-3 custom-class bg-gray-800 first:rounded-l-md last:rounded-r-md text-xs text-left last:text-right first:pl-4 last:pr-4 text-gray font-semibold"
                :class="[
                  { 'w-[5%]': h.key === '_index' },
                  thClass,
                  h.customClass,
                ]"
              >
                <FCheckbox
                  v-if="index === 0 && hasCheckbox"
                  :checked="checkAllValue"
                  @change="toggleCheckAll"
                />
                {{ $t(h.title) }}
                <svg
                  @click="handleSortTable"
                  class="w-4 h-4 inline-block cursor-pointer hover:text-green"
                  :class="{ '!text-green': sortTrigger }"
                  v-if="hasSort && sortKey === h.key"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="24"
                  height="24"
                  stroke-width="2"
                >
                  <path d="M17 3l0 18"></path>
                  <path d="M10 18l-3 3l-3 -3"></path>
                  <path d="M7 21l0 -18"></path>
                  <path d="M20 6l-3 -3l-3 3"></path>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody v-if="data?.length">
            <tr
              v-for="(d, index) in data"
              :key="index"
              class="border-b border-gray-100 relative"
              :class="[
                bodyTrClass,
                { 'bg-white-500': index % 2 !== 0 },
                { 'even:bg-white-50': type === 'filled' },
              ]"
            >
              <td
                v-for="(h, idx) in head"
                :key="idx"
                class="py-3 px-4 text-xs text-dark-100"
                :class="[tdClass]"
              >
                <div
                  v-if="idx === 0 && hasCheckbox"
                  class="flex-y-center gap-1"
                >
                  <FCheckbox
                    :checked="allIds?.includes(d?.id)"
                    @change="toggleItemCheck(d?.id)"
                  />
                  <p class="font-medium text-dark">{{ getIndex(index) }}.</p>
                </div>
                <div v-if="idx === 0" class="w-1 h-10 absolute left-0 top-2" />
                <slot :name="h.key" :data="{ ...d, _index: getIndex(index) }">
                  {{ h.key === "_index" ? getIndex(index) : d[h.key] }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
        <slot v-if="!data?.length && !loading" name="no-data">
          <div class="flex-center py-16">No Data</div>
        </slot>
      </div>
    </Transition>
    <div
      v-if="loading"
      class="w-full h-[500px] flex items-center justify-center"
    >
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TClassName } from "@/types/common";
import { ITableHead } from "@/types/components/table";
import { ref, watch } from "vue";
import FCheckbox from "@/components/Form/Checkbox/FCheckbox.vue";
import { useAssignmentStore } from "@/modules/Assignments/store";

interface Props {
  type?: "filled" | "transparent";

  head: ITableHead[];

  thClass?: TClassName;
  bodyTrClass?: TClassName;
  tdClass?: TClassName;
  wrapperClass?: TClassName;

  data: Record<string, any>[];
  trigger?: boolean;
  limit: number;
  currentPage: number;
  hasCheckbox?: boolean;
  hasSort?: boolean;
  sortKey?: string;
  loading?: boolean;
  statusKey?: string;
  statusColors?: any;
}
const emit = defineEmits(["checked", "sortTable"]);
const props = withDefaults(defineProps<Props>(), {
  loading: true,
});
const store = useAssignmentStore();

const allIds = ref([]);

function getIndex(index: number) {
  return (props?.currentPage - 1) * props?.limit + index + 1;
}

const sortTrigger = ref(false);
function handleSortTable() {
  sortTrigger.value = !sortTrigger.value;
  emit("sortTable");
}
// Checkbox handling functions
const checkAllValue = ref(false);

function toggleCheckAll() {
  checkAllValue.value = !checkAllValue.value;
  if (checkAllValue.value) {
    allIds.value = props?.data?.map((item) => item?.id);
    store.allIds = allIds.value;
  } else {
    allIds.value = [];
    store.allIds = allIds.value;
  }
}

function toggleItemCheck(id: number) {
  if (allIds.value.includes(id)) {
    allIds.value = allIds.value.filter((item) => item !== id);
    store.allIds = allIds.value;
  } else {
    allIds.value.push(id);
    store.allIds = allIds.value;
  }
}

watch(
  () => checkAllValue.value,
  (newValue) => {
    if (newValue) {
      allIds.value = props?.data?.map((item) => item?.id);
      store.allIds = allIds.value;
    } else {
      allIds.value = [];
      store.allIds = allIds.value;
    }
  }
);

watch(
  () => allIds.value,
  () => {
    emit("checked", allIds.value);
  }
);

watch(
  () => props.trigger,
  () => {
    allIds.value = [];
    checkAllValue.value = false;
  }
);
</script>

<style>
.spinner {
  width: 56px;
  height: 56px;
  display: grid;
  border-radius: 50%;
  -webkit-mask: radial-gradient(farthest-side, #0000 40%, #52618f 41%);
  background: linear-gradient(0deg, #52618f 50%, #52618f 0) center/4.5px 100%,
    linear-gradient(90deg, #52618f 50%, #52618f 0) center/100% 4.5px;
  background-repeat: no-repeat;
  animation: spinner-d3o0rx 1.5s infinite steps(12);
}
.spinner::before,
.spinner::after {
  content: "";
  grid-area: 1/1;
  border-radius: 50%;
  background: inherit;
  opacity: 0.915;
  transform: rotate(30deg);
}
.spinner::after {
  opacity: 0.83;
  transform: rotate(60deg);
}
@keyframes spinner-d3o0rx {
  100% {
    transform: rotate(1turn);
  }
}
</style>
