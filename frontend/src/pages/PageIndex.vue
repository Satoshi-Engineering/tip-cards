<template>
  <DefaultLayout>
    <div class="grid justify-items-center text-center">
      <div class="max-w-3xl w-full px-4">
        <div class="mt-18 text-6xl">
          ⚡
        </div>
        <HeadlineDefault level="h1">
          Lightning TipCards
        </HeadlineDefault>
        <p class="mb-4">
          by <a href="https://satoshiengineering.com" target="_blank">Satoshi Engineering</a>
        </p>
        <p>
          <ButtonDefault @click="$router.push({ name: 'cards', params: { lang: $route.params.lang } })">
            {{ t('index.buttonCreate') }}
          </ButtonDefault>
        </p>
        <div v-if="isLoggedIn || hasSetsInLocalStorage" class="mt-24">
          <HeadlineDefault level="h2" styling="h4">
            {{ t('index.savedCardsSetsHeadline') }}
          </HeadlineDefault>
          <div v-if="hasSetsInLocalStorage" class="max-w-lg mb-5 mx-auto text-sm text-grey">
            <I18nT keypath="localStorageDeprecation.loginCta">
              <template #loginCtaAction>
                <LinkDefault @click="showModalLogin = true">{{ $t('localStorageDeprecation.loginCtaAction') }}</LinkDefault>
              </template>
            </I18nT>
            <br><LinkDefault @click="showModalDeprecation = true">{{ $t('localStorageDeprecation.moreInfo') }}</LinkDefault>
          </div>
          <div class="flex flex-col">
            <UserErrorMessages :user-error-messages="fetchingUserErrorMessages" />
            <div
              v-if="sets.length < 1"
              class="mx-auto text-sm text-grey"
            >
              {{ t('index.noSavedCardsSetsMessage') }}
            </div>
            <ul
              v-else
              class="mx-auto"
            >
              <li
                v-for="cardsSet in sortedSavedCardsSets"
                :key="cardsSet.setId"
                class="leading-tight my-2"
              >
                <LinkDefault
                  class="no-underline group"
                  :bold="false"
                  :to="{
                    name: 'cards',
                    params: {
                      setId: cardsSet.setId,
                      settings: encodeCardsSetSettings(cardsSet.settings),
                      lang: $route.params.lang,
                    }
                  }"
                >
                  <small>
                    {{ d(cardsSet.date, {
                      year: 'numeric', month: 'numeric', day: 'numeric',
                      hour: 'numeric', minute: 'numeric'
                    }) }}
                    -
                    {{ t('general.cards', { count: cardsSet.settings.numberOfCards }) }}
                  </small>
                  <br>
                  <span
                    v-if="typeof cardsSet.settings.setName === 'string' && cardsSet.settings.setName !== ''"
                    class="underline group-hover:no-underline"
                  >
                    {{ cardsSet.settings.setName }}
                  </span>
                  <span
                    v-else
                    class="underline group-hover:no-underline italic text-grey"
                  >
                    {{ t('index.unnamedSetNameFallback') }}
                  </span>
                </LinkDefault>
                <template v-if="!isLoggedIn">
                  &nbsp;<LinkDefault class="no-underline" @click="showModalDeprecation = true">⚠️</LinkDefault>
                </template>
              </li>
            </ul>
          </div>
        </div>
        <div
          v-if="t('index.youtube.create.link').length > 0 && t('index.youtube.use.link').length > 0"
          class="mt-24"
        >
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <HeadlineDefault level="h2" styling="h4">
                {{ t('index.youtube.create.label') }}
              </HeadlineDefault>
              <a
                class="flex items-center justify-center aspect-[356/200] bg-black bg-[url('/src/assets/images/create-tipcards.square.webp')] bg-[length:70%] bg-center bg-no-repeat"
                :href="t('index.youtube.create.link')"
                :aria-label="t('index.youtube.create.label')"
                target="_blank"
              >
                <svg
                  version="1.1"
                  viewBox="0 0 68 48"
                  height="48"
                  width="68"
                >
                  <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00" />
                  <path d="M 45,24 27,14 27,34" fill="#fff" />
                </svg>
              </a>
            </div>
            <div class="flex-1">
              <HeadlineDefault level="h2" styling="h4">
                {{ t('index.youtube.use.label') }}
              </HeadlineDefault>
              <a
                class="flex items-center justify-center aspect-[356/200] w-full bg-black bg-[url('/src/assets/images/use-tipcards.square.webp')] bg-[length:70%] bg-center bg-no-repeat"
                :href="t('index.youtube.use.link')"
                :aria-label="t('index.youtube.use.label')"
                target="_blank"
              >
                <svg
                  version="1.1"
                  viewBox="0 0 68 48"
                  height="48"
                  width="68"
                >
                  <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00" />
                  <path d="M 45,24 27,14 27,34" fill="#fff" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
  <ModalLocalStorageDeprecation
    v-if="showModalDeprecation"
    @login="onLogin"
    @close="showModalDeprecation = false"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import HeadlineDefault from '@/components/typography/HeadlineDefault.vue'
import LinkDefault from '@/components/typography/LinkDefault.vue'
import UserErrorMessages from '@/components/UserErrorMessages.vue'
import ButtonDefault from '@/components/buttons/ButtonDefault.vue'
import ModalLocalStorageDeprecation from '@/components/ModalLocalStorageDeprecation.vue'
import { useAuthStore } from '@/stores/auth'
import { encodeCardsSetSettings, getDefaultSettings, useCardsSetsStore } from '@/stores/cardsSets'
import { useModalLoginStore } from '@/stores/modalLogin'

import DefaultLayout from './layouts/DefaultLayout.vue'

const { t, d } = useI18n()

const { isLoggedIn } = storeToRefs(useAuthStore())

const cardsStore = useCardsSetsStore()
const { subscribe } = cardsStore
const { sets, hasSetsInLocalStorage, fetchingUserErrorMessages } = storeToRefs(cardsStore)

const { showModalLogin } = storeToRefs(useModalLoginStore())

const showModalDeprecation = ref(false)
const onLogin = () => {
  showModalDeprecation.value = false
  showModalLogin.value = true
}

const sortedSavedCardsSets = computed(() => {
  return [...sets.value]
    .map((set) => {
      let date = new Date().toISOString()
      if (set.date != null) {
        date = new Date(set.date * 1000).toISOString()
      }
      let settings = getDefaultSettings()
      if (set.settings != null) {
        settings = set.settings
      }
      return {
        setId: set.id,
        date,
        settings,
      }
    })
    .sort((a, b) => {
      const nameA = a.settings.setName?.toLowerCase()
      const nameB = b.settings.setName?.toLowerCase()
      if (nameA == null || nameA === '') {
        return 1
      }
      if (nameB == null || nameB === '') {
        return -1
      }
      return nameA.localeCompare(nameB)
    })
})

onMounted(async () => {
  await subscribe()

  const originMapping: Record<string, string> = {
    'https://tipcards.sate.tools': 'https://tipcards.io',
    'https://dev.tipcards.sate.tools': 'https://dev.tipcards.io',
  }
  if (
    !hasSetsInLocalStorage.value
    && typeof originMapping[location.origin] === 'string'
  ) {
    location.href = `${originMapping[location.origin]}${location.pathname}${location.search}${location.hash}`
  }
})
</script>
