import { AppTheme } from "@app/app-store"

export const getRootCssProperty = (propName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(propName)
  
export const setRootCssProperty = (propName: string, value: string | null) =>
  document.documentElement.style.setProperty(propName, value)
  
export function updateRootThemeAttr(newTheme: AppTheme) {
  newTheme === 'auto' ?
    document.documentElement.removeAttribute('data-theme')
    :
    document.documentElement.setAttribute('data-theme', newTheme)
}

export const remToPx = (rem: number) =>
  parseInt(getRootCssProperty('--font-size-html').replace('px', '')) * rem

export const isTouchDevice = () => ("maxTouchPoints" in navigator) && navigator.maxTouchPoints > 0
