<template>
  <div class="grid place-items-center text-center min-h-screen">
    <div class="max-w-3xl w-full px-4">
      <div class="mt-18 text-6xl">
        ⚡
      </div>
      <HeadlineDefault level="h1">
        Lightning Tip Cards
      </HeadlineDefault>
      <p>by <a href="https://satoshiengineering.com" target="_blank">Satoshi Engineering</a></p>
      <p
        v-if="!isLoggedIn"
        class="mt-4"
      >
        <ButtonDefault @click="showLogin = true">
          {{ t('auth.login') }}
        </ButtonDefault>
      </p>
    </div>
  </div>
  <ModalLogin
    v-if="showLogin"
    @close="showLogin = false"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import HeadlineDefault from '@/components/typography/HeadlineDefault.vue'
import ButtonDefault from '@/components/ButtonDefault.vue'
import ModalLogin from '@/components/ModalLogin.vue'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()

const { isLoggedIn } = storeToRefs(useUserStore())

const showLogin = ref(false)
</script>
