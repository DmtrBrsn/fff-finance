import { numToPrecision } from '@shared/lib/utils'
import { Operator, operators } from './calculator-constants'

const isStringNumber = (value: string) => !isNaN(Number(value))
const isCharOperator = (value: string) => operators.includes(value as Operator)
const isCharDot = (value: string) => value === '.'

export const validateExpression = (expr: string) => {
  if (['.', ...operators].includes(expr[0] as Operator)) return false
  let isDecimalPart = false
  for (const [index, char] of expr.split('').entries()) {
    const isNumber = isStringNumber(char)
    const isOperator = isCharOperator(char)
    const isDot = isCharDot(char)
    const nextChar = expr[index + 1]
    const previousChar = expr[index - 1]
    if (isCharDot(previousChar)) {
      isDecimalPart = true
    }
    if (isDecimalPart && isOperator) {
      isDecimalPart = false
    }
    if (
      (!isNumber && !isOperator && !isDot) ||
      (nextChar != undefined && (isOperator || isDot) && (isCharOperator(nextChar) || isCharDot(nextChar))) ||
      (isDecimalPart && isDot)
    ) return false
  }
  return true
}

export const isCompleteExpression = (expr: string) => {
  return (!['.', ...operators].includes(expr[expr.length - 1] as Operator))
}

export const calculate = (expr: string) => {
  const sumArr = expr.split('+')
  for (const [sumI, sumEl] of sumArr.entries()) {
    if (isStringNumber(sumEl)) continue
    const subArr = sumEl.split('-')
    for (const [subI, subEl] of subArr.entries()) {
      if (isStringNumber(subEl)) continue
      const multArr = subEl.split('*')
      for (const [multI, multEl] of multArr.entries()) {
        if (isStringNumber(multEl)) continue
        const divArr = multEl.split('/')
        if (divArr.length > 1) {
          let divResult = Number(divArr[0])
          for (const divEl of divArr.toSpliced(0, 1)) divResult /= Number(divEl)
          multArr[multI] = divResult.toString()
        }
      }
      let multResult = Number(multArr[0])
      for (const mult of multArr.toSpliced(0, 1)) multResult *= Number(mult)
      subArr[subI] = multResult.toString()
    }
    let subResult = Number(subArr[0])
    for (const sub of subArr.toSpliced(0, 1)) subResult -= Number(sub)
    sumArr[sumI] = subResult.toString()
  }
  let sumResult = 0
  for (const sum of sumArr) sumResult += Number(sum)
  return numToPrecision(sumResult)
}
