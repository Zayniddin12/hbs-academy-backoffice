<template>
  <label
    class="group inline-flex items-center relative select-none min-h-6"
    :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
  >
    <input
      v-bind="{ disabled }"
      type="checkbox"
      class="absolute opacity-0 invisible h-0 w-0 peer"
      :checked="checked"
      :value="value"
      :name="name"
      @change="handleChange"
    />
    <slot name="value">
      <span
        :class="[
          'duration-200 ease-in-out inline-block bg-gray-100 h-6 w-6 rounded-md border-2 peer-checked:-rotate-90 peer-checked:after:opacity-100 peer-checked:after:rotate-[138deg] after:transition-all after:duration-200 after:absolute after:left-2 after:top-1 after:w-[7px] after:h-3 after:border-r-[2.2px] after:border-b-[2.2px] after:rotate-[0deg] after:opacity-0 peer-checked:bg-green',
          'border-[#C8CFD6] peer-checked:border-[#3bd46f] after:border-white peer-disabled:border-grey-100 peer-disabled:after:border-grey-100',
          {
            '!border-red': error,
            'group-hover:border-primary': !disabled,
          },
        ]"
        class="shrink-0"
      />
    </slot>
    <span class="ml-2">
      <slot name="label">
        <p :class="['leading-130 text-dark text-sm', labelStyles]">
          {{ label }}
        </p>
      </slot>
    </span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number | boolean;
  label?: string;
  name?: string;
  value?: string | number | boolean;
  disabled?: boolean;
  error?: boolean;
  labelStyles?: string;
  checked: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: "change", value: boolean): void;
}>();
const handleChange = (e: Event) => {
  emit("change", !props.checked);
};
</script>
