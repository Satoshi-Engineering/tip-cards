<template>
  <div
    v-if="backlink != null || onlyInternalReferrer === false"
  >
    <LinkDefault
      :href="backlink"
      :to="to"
      target="_self"
      @click.prevent="backlinkAction"
    >
      <i class="bi bi-caret-left-fill rtl:hidden" /><!--
      --><i class="bi bi-caret-right-fill ltr:hidden" /><!--
      -->{{ t('general.back') }}
    </LinkDefault>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { useI18n } from 'vue-i18n'

import LinkDefault from './typography/LinkDefault.vue'

const { t } = useI18n()

const props = defineProps({
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: undefined,
  },
  onlyInternalReferrer: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

const backlink = computed(() => {
  try {
    return new URL(document.referrer).origin === location.origin && document.referrer !== document.location.href ? document.referrer : undefined
  } catch (error) {
    return undefined
  }
})

const to = computed(() => {
  if (props.to != null) {
    return props.to
  }
  if (backlink.value != null) {
    return undefined
  }
  return { name: 'home' }
})

const backlinkAction = () => {
  if (backlink.value != null) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>
