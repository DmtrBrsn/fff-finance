import { AppTheme } from '../../../app/app-store'


export const getRootCssProperty = (propName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(propName)

export const setRootCssProperty = (propName: string, value: string | null) =>
  document.documentElement.style.setProperty(propName, value)

export function updateRootThemeAttr(newTheme: AppTheme) {
  const bgColor = getRootCssProperty('--background-color')
  setMetaThemeColor(bgColor)
  if (newTheme === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  }
  else {
    document.documentElement.setAttribute('data-theme', newTheme)
  }
}

export const remToPx = (rem: number) =>
  parseInt(getRootCssProperty('--font-size-html').replace('px', '')) * rem

export const isTouchDevice = () => ("maxTouchPoints" in navigator) && navigator.maxTouchPoints > 0

export const setMetaThemeColor = (color: string) => {
  let element = document.querySelector('meta[name="theme-color"]')
  if (element === null) {
    element = document.createElement('meta')
    element.setAttribute('name', 'theme-color')
    document.head.appendChild(element)
  }
  element.setAttribute('content', color)
}

export const removeMetaThemeColor = () => document.querySelector('meta[name="theme-color"]')?.remove()
