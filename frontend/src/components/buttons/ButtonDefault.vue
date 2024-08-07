<template>
  <RouterLink
    v-if="to != null"
    :to="to"
    :class="cssClasses"
    :target="targetComputed"
    :disabled="disabledComputed"
  >
    <ButtonDefaultIcon
      v-if="variant == 'primary'"
      :loading="loading"
      :reduced-animation="reducedAnimation"
    />
    <span class="relative">
      <slot />
    </span>
  </RouterLink>
  <a
    v-else-if="href != null"
    :href="href"
    :target="targetComputed"
    class="inline-block"
    :class="cssClasses"
  >
    <ButtonDefaultIcon
      v-if="variant == 'primary'"
      :loading="loading"
      :reduced-animation="reducedAnimation"
    />
    <span class="relative">
      <slot />
    </span>
  </a>
  <button
    v-else
    :class="cssClasses"
    :disabled="disabledComputed"
  >
    <ButtonDefaultIcon
      v-if="variant == 'primary'"
      :loading="loading"
      :reduced-animation="reducedAnimation"
    />
    <span class="relative">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import ButtonDefaultIcon from './ButtonDefaultIcon.vue'

const props = defineProps({
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: undefined,
  },
  href: {
    type: String,
    default: undefined,
  },
  target: {
    type: String,
    default: undefined,
  },
  variant: {
    type: String as PropType<'primary' | 'secondary' | 'outline' | 'no-border'>,
    default: 'primary',
    validator: (value) => {
      if (
        typeof value !== 'string'
        || !['primary', 'secondary'].includes(value)
      ) {
        console.warn(`Invalid variant: ${value}. Must be one of 'primary' or 'secondary'. All others are deprecated!`)
      }
      return true
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  reducedAnimation: {
    type: Boolean,
    default: false,
  },
})

const disabledComputed = computed(() => props.disabled || props.loading)

const cssClasses = computed(() => props.variant == 'primary' ? cssClassesPrimary.value : cssClassesSecondary.value)

const cssClassesPrimary = computed(() => [
  `
    group
    relative inline-flex items-center justify-center
    rounded-full min-h-[40px] overflow-hidden
    max-w-md my-1 px-16 py-2
    font-medium text-center bg-yellow
  `,
  {
    'transition-colors ease-in duration-50 hover:text-white': !props.reducedAnimation,
    'opacity-50 cursor-default pointer-events-none': disabledComputed.value,
  },
])

const cssClassesSecondary = computed(() => [
  'max-w-md min-h-[40px] my-1 px-0 py-2 font-medium text-center underline hover:no-underline',
  {
    'opacity-50 cursor-default pointer-events-none': disabledComputed.value,
  },
])

const targetComputed = computed(() => {
  if (props.target != null) {
    return props.target
  }
  if (props.href != null && /^https?:\/\/.+/.test(props.href)) {
    return '_blank'
  }
  return undefined
})
</script>
