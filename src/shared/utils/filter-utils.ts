export type FilterCondition = 'eq' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'neq' | 'ncontains' | 'between' | 'startswith' | 'endswith'

export type FilterableValue = string | number | boolean

export type FilterBy<FilterableField extends string> = {
  field: FilterableField
  condition: FilterCondition
  value: FilterableValue
  value1?: FilterableValue
}

export class FilterUtils {

  public static getStringFiltering<T>(
    fieldExtractor: (obj: T) => string,
    value: string,
    condition: FilterCondition
  ) {
    return (elem:T, _: number, __:T[]) => {
      const elemValue = fieldExtractor(elem)
      switch (condition) {
        case 'eq': return elemValue === value
        case 'neq': return elemValue !== value
        case 'contains': return elemValue.includes(value)
        case 'ncontains': return !elemValue.includes(value)
        case 'startswith': return elemValue.startsWith(value)
        case 'endswith': return elemValue.endsWith(value)
        default: return false
      }
    }
  }

  public static getNumberFiltering<T>(
    fieldExtractor: (obj: T) => number,
    value: number,
    condition: FilterCondition,
    value1?: number
  ) {
    return (elem: T, _: number, __: T[]) => {
      if (elem == undefined) return false
      const elemValue = fieldExtractor(elem)
      switch (condition) {
        case 'eq': return elemValue === value
        case 'neq': return elemValue !== value
        case 'gt': return elemValue > value
        case 'gte': return elemValue >= value
        case 'lt': return elemValue < value
        case 'lte': return elemValue <= value
        case 'between': {
          return value1 == undefined ?
            false : (elemValue >= value && elemValue <= value1)
        }
        default: return false
      }
    }
  }

  public static getDateFiltering<T>(
    fieldExtractor: (obj: T) => string | Date,
    value: string | Date,
    condition: FilterCondition,
    value1?: string | Date
  ) {
    return (elem: T, _: number, __: T[]) => {
      if (elem == undefined) return false
      const elemValue = fieldExtractor(elem)
      const elTime = new Date(elemValue).getTime()
      const valTime = new Date(value).getTime()
      switch (condition) {
        case 'eq': return elTime === valTime
        case 'neq': return elTime !== valTime
        case 'gt': return elTime > valTime
        case 'gte': return elTime >= valTime
        case 'lt': return elTime < valTime
        case 'lte': return elTime <= valTime
        case 'between': {
          return value1 == undefined ?
            false : (elTime >= valTime && elTime <= new Date(value1).getTime())
        }
        default: return false
      }
    }
  }

  public static getBooleanFiltering<T>(
    fieldExtractor: (obj: T) => unknown,
    value: boolean,
    condition: FilterCondition
  ) {
    return (elem: T, _: number, __: T[]) => {
      if (elem == undefined) return false
      const elemValue = fieldExtractor(elem)
      switch (condition) {
        case 'eq': return elemValue === value
        case 'neq': return elemValue !== value
        default: return false
      }
    }
  }

}
