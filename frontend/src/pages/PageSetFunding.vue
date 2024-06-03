<template>
  <DefaultLayout>
    <div class="flex flex-col flex-1 mx-auto w-full max-w-md">
      <div
        v-if="initializing"
        class="flex justify-center flex-1 mt-8 px-4"
      >
        <AnimatedLoadingWheel />
      </div>
      <div
        v-else-if="numberOfCardsToFund !== settings.numberOfCards"
        class="flex-1 mt-8 px-4"
      >
        <HeadlineDefault
          level="h1"
          class="mt-10"
        >
          {{ t('setFunding.headline') }}
        </HeadlineDefault>
        <p class="my-3">
          <I18nT keypath="setFunding.setName">
            <template #setName>
              <strong>{{ settings.setName || t('index.unnamedSetNameFallback') }}</strong>
            </template>
          </I18nT>
        </p>
        <p>
          {{ t('setFunding.textFundingNotPossible') }}
        </p>
        <ButtonDefault
          class="text-sm mt-4"
          :href="cardsHref"
        >
          {{ t('setFunding.backToSet') }}
        </ButtonDefault>
      </div>
      <div
        v-else
        class="flex-1 mt-8 px-4"
      >
        <HeadlineDefault
          level="h1"
          class="mt-10"
        >
          {{ t('setFunding.headline') }}
        </HeadlineDefault>
        <p class="my-3">
          <I18nT keypath="setFunding.setName">
            <template #setName>
              <strong>{{ settings.setName || t('index.unnamedSetNameFallback') }}</strong>
            </template>
          </I18nT>
        </p>
        <div v-if="invoice != null">
          <ParagraphDefault>
            <I18nT
              v-if="funded"
              keypath="setFunding.textFunded"
            >
              <template #numberOfCardsToFund>
                {{ numberOfCardsToFund }}
              </template>
              <template #amountAndUnitPerCard>
                <strong
                  v-if="invoiceAmount != null"
                  class="inline-block"
                >
                  {{ t('setFunding.amountAndUnit', { amount: formatNumber(invoiceAmount / numberOfCardsToFund / (100 * 1000 * 1000), 8, 8) }) }}
                </strong>
              </template>
            </I18nT>
            <I18nT
              v-else
              keypath="setFunding.invoiceText"
            >
              <template #numberOfCardsToFund>
                {{ numberOfCardsToFund }}
              </template>
              <template #amountAndUnit>
                <strong
                  v-if="invoiceAmount != null"
                  class="inline-block"
                >
                  {{ t('setFunding.amountAndUnit', { amount: formatNumber(invoiceAmount / (100 * 1000 * 1000), 8, 8) }) }}
                </strong>
              </template>
            </I18nT>
          </ParagraphDefault>
          <LightningQrCode
            :value="invoice"
            :success="funded"
            :error="invoiceExpired ? t('setFunding.invoiceExpired') : undefined"
          />
          <p
            v-if="invoiceExpired"
            class="mb-4"
          >
            {{ t('setFunding.invoiceExpired') }}
          </p>
          <div class="flex justify-center">
            <ButtonWithTooltip
              type="submit"
              variant="outline"
              :disabled="funded"
              :tooltip="funded ? t('setFunding.resetDisabledTooltip') : undefined"
              @click="resetInvoice"
            >
              {{ t('setFunding.resetInvoice') }} 
            </ButtonWithTooltip>
          </div>
        </div>
        <div v-else>
          <ParagraphDefault class="mb-8">
            <I18nT keypath="setFunding.text">
              <template #numberOfCardsToFund>
                {{ numberOfCardsToFund }}
              </template>
              <template #amountAndUnit>
                <strong class="inline-block">
                  {{ t('setFunding.amountAndUnit', { amount: formatNumber(amountTotal / (100 * 1000 * 1000), 8, 8) }) }}
                </strong>
              </template>
            </I18nT>
          </ParagraphDefault>
          <form @submit.prevent="createInvoice">
            <label class="block mb-2">
              <span class="block">
                {{ t('setFunding.form.amountLabel') }}:
              </span>
              <SatsAmountSelector
                :amount-sats="amountPerCard"
                :rate-btc-eur="rateBtcEur"
                :min="21"
                :disabled="creatingInvoice"
                @update="amountPerCard = $event"
              />
              <small v-if="amountPerCard < 210" class="block leading-tight mt-1 mb-3 text-sm text-btcorange-effect">
                {{ t('setFunding.form.smallAmountWarning') }}
              </small>
            </label>
            <div class="block leading-tight my-3">
              {{ t('setFunding.form.totalAmountLabel') }}:
              <strong>{{ t('setFunding.amountAndUnit', { amount: formatNumber(amountTotal / (100 * 1000 * 1000), 8, 8) }) }}</strong>
            </div>
            <label class="block mb-2">
              <input
                v-model="text"
                type="text"
                class="w-full border my-1 px-3 py-2 focus:outline-none"
                :disabled="creatingInvoice"
              >
              <small class="block">({{ t('setFunding.form.textHint') }})</small>
            </label>
            <label class="block mb-2">
              <input
                v-model="note"
                type="text"
                class="w-full border my-1 px-3 py-2 focus:outline-none"
                :placeholder="t('setFunding.form.notePlaceholder')"
                :disabled="creatingInvoice"
              >
              <small class="block">({{ t('setFunding.form.noteHint') }})</small>
            </label>
            <div class="flex flex-col items-center mt-4">
              <ButtonDefault
                type="submit"
                :disabled="creatingInvoice"
              >
                {{ t('setFunding.form.button') }}
              </ButtonDefault>
            </div>
          </form>
        </div>
        <div
          v-if="userErrorMessage != null"
          class="mt-4"
        >
          <ParagraphDefault class="text-red-500" dir="ltr">
            {{ userErrorMessage }}
          </ParagraphDefault>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onBeforeMount, ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import type { Set, Settings } from '@shared/data/api/Set'

import I18nT from '@/modules/I18nT'
import HeadlineDefault from '@/components/typography/HeadlineDefault.vue'
import ParagraphDefault from '@/components/typography/ParagraphDefault.vue'
import AnimatedLoadingWheel from '@/components/AnimatedLoadingWheel.vue'
import ButtonDefault from '@/components/ButtonDefault.vue'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import LightningQrCode from '@/components/LightningQrCode.vue'
import SatsAmountSelector from '@/components/SatsAmountSelector.vue'
import formatNumber from '@/modules/formatNumber'
import { rateBtcEur } from '@/modules/rateBtcFiat'
import { loadCardStatus } from '@/modules/loadCardStatus'
import hashSha256 from '@/modules/hashSha256'
import { getDefaultSettings, decodeCardsSetSettings } from '@/stores/cardsSets'
import { BACKEND_API_ORIGIN } from '@/constants'
import { useI18nHelpers, type LocaleCode } from '@/modules/initI18n'

const { currentLocale } = useI18nHelpers()

import DefaultLayout from './layouts/DefaultLayout.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const initializing = ref(true)
const settings = reactive(getDefaultSettings())
const amountPerCard = ref(2100)

let textValue = ''

const text = computed({
  get: () => currentLocale.value && textValue === '' ? t('cards.settings.defaults.invoiceText') : textValue,
  set: (val) => textValue = val,
})

const textIsDirty = ref(false)
const note = ref<string>()
const noteIsDirty = ref(false)
const userErrorMessage = ref<string>()
const set = ref<Set>()
const cardIndicesNotUnfunded = ref<number[]>([])
const creatingInvoice = ref(false)

const funded = computed(() => set.value?.invoice?.paid != null)
const invoice = computed(() => set.value?.invoice?.payment_request)
const invoiceAmount = computed(() => set.value?.invoice?.amount)
const invoiceExpired = computed(() => !!set.value?.invoice?.expired)

const loadSetData = async () => {
  try {
    const response = await axios.get(`${BACKEND_API_ORIGIN}/api/set/${route.params.setId}`)
    if (response.data.status === 'success' && response.data.data != null) {
      set.value = response.data.data
    }
  } catch(error) {
    set.value = undefined
    console.error(error)
  }

  const cardIndicesNotUnfundedLocal: number[] = []
  try {
    await Promise.all([...new Array(settings.numberOfCards).keys()].map(async (index) => {
      const cardHash = await hashSha256(`${route.params.setId}/${index}`)
      const { status } = await loadCardStatus(cardHash, 'cards')
      if (status !== 'unfunded') {
        cardIndicesNotUnfundedLocal.push(index)
      }
    }))
    cardIndicesNotUnfunded.value = cardIndicesNotUnfundedLocal
  } catch (error) {
    console.error(error)
  }
  initializing.value = false

  setTimeout(loadSetData, 10 * 1000)
}

onBeforeMount(() => {
  const settingsEncoded = String(route.params.settings)
  let settingsDecoded: Settings | undefined = undefined
  try {
    settingsDecoded = decodeCardsSetSettings(settingsEncoded)
  } catch (error) {
    // do nothing
  }
  Object.assign(settings, settingsDecoded)

  loadSetData()
})

const numberOfCardsToFund = computed<number>(() => {
  if (set.value?.invoice?.fundedCards != null) {
    return set.value.invoice.fundedCards.length
  }
  return settings.numberOfCards - cardIndicesNotUnfunded.value.length
})
const amountTotal = computed<number>(() => amountPerCard.value * numberOfCardsToFund.value)
const cardIndicesToFund = computed<number[]>(() => [...new Array(settings.numberOfCards).keys()].filter(index => !cardIndicesNotUnfunded.value.includes(index)))

const createInvoice = async () => {
  creatingInvoice.value = true
  try {
    const response = await axios.post(
      `${BACKEND_API_ORIGIN}/api/set/invoice/${route.params.setId}`,
      {
        amountPerCard: amountPerCard.value,
        text: text.value,
        note: note.value,
        cardIndices: cardIndicesToFund.value,
      },
    )
    if (response.data.status === 'success' && response.data.data != null) {
      set.value = response.data.data
      userErrorMessage.value = undefined
    }
  } catch(error) {
    console.error(error)
  }
  creatingInvoice.value = false

  if (invoice.value == null) {
    userErrorMessage.value = 'Unable to create funding invoice. Please try again later.'
  }
}

const resetInvoice = async () => {
  try {
    const response = await axios.delete(
      `${BACKEND_API_ORIGIN}/api/set/invoice/${route.params.setId}`)
    if (response.data.status === 'success') {
      set.value = undefined
      amountPerCard.value = 2100
      userErrorMessage.value = undefined
      creatingInvoice.value = false
      text.value = t('cards.settings.defaults.invoiceText')
      textIsDirty.value = false
      note.value = undefined
      noteIsDirty.value = false
    }
  } catch(error) {
    console.error(error)
    userErrorMessage.value = 'Unable to reset set. Please try again later.'
  }
}

const cardsHref = computed(() => router.resolve({
  name: 'cards',
  params: {
    lang: route.params.lang,
    setId: route.params.setId,
    settings: route.params.settings,
  },
}).href)
</script>
