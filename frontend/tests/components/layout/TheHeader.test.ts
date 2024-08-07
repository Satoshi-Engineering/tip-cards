import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import TheHeader from '@/components/layout/TheHeader.vue'
import TheMainNav from '@/components/layout/TheMainNav.vue'
import TheLangNav from '@/components/layout/TheLangNav.vue'
import IconWorld from '@/components/svgs/IconWorld.vue'
import IconClose from '@/components/svgs/IconClose.vue'

import '../../mocks/router'

describe('TheHeader', () => {
  it('renders the header', async () => {
    const wrapper = mount(TheHeader)
    expect(wrapper.getComponent(RouterLinkStub).vm.to).toEqual(expect.objectContaining({ name: 'home' }))
    expect(wrapper.getComponent(TheMainNav)).toBeDefined()
    expect(wrapper.findComponent(TheLangNav).exists()).toBe(false)
  })

  it('keeps the language in the home link', async () => {
    const wrapper = mount(TheHeader, {
      global: {
        mocks: {
          $route: {
            params: {
              lang: 'en',
            },
          },
        },
      },
    })
    expect(wrapper.getComponent(RouterLinkStub).vm.to).toEqual(expect.objectContaining({
      name: 'home',
      params: {
        lang: 'en',
      },
    }))
    expect(wrapper.findComponent(TheLangNav).exists()).toBe(false)
  })

  it('click on the WorldIcon should toggle TheLangNav and X should close it again', async () => {
    const wrapper = mount(TheHeader)
    expect(wrapper.getComponent(IconWorld)).toBeDefined()
    expect(wrapper.getComponent(TheMainNav)).toBeDefined()
    expect(wrapper.findComponent(TheLangNav).exists()).toBe(false)

    const langNavOpenButton = wrapper.getComponent(IconWorld)
    await langNavOpenButton.trigger('click')
    expect(wrapper.findComponent(IconWorld).exists()).toBe(false)
    expect(wrapper.findComponent(TheMainNav).exists()).toBe(false)
    expect(wrapper.getComponent(TheLangNav)).toBeDefined()

    const langNavCloseButton = wrapper.getComponent(IconClose)
    await langNavCloseButton.trigger('click')
    expect(wrapper.getComponent(IconWorld)).toBeDefined()
    expect(wrapper.getComponent(TheMainNav)).toBeDefined()
    expect(wrapper.findComponent(TheLangNav).exists()).toBe(false)
  })

  it('Mouse over on lang icon, main icon and close icon should color icon yellow', async () => {
    const wrapper = mount(TheHeader)
    wrapper.findAll('button').forEach(async (button) => {
      expect(button.classes()).not.toContain('text-yellow')
      await button.trigger('mouseover')
      expect(button.classes()).toContain('hover:text-yellow')
    })

    wrapper.get('button').trigger('click')
    wrapper.findAll('button').forEach(async (button) => {
      expect(button.classes()).not.toContain('text-yellow')
      await button.trigger('mouseover')
      expect(button.classes()).toContain('hover:text-yellow')
    })
  })
})
