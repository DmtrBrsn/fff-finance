export type FilterCondition = 'eq' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'neq' | 'ncontains' | 'between' | 'startswith' | 'endswith' | 'in'

export type FilterableValue = string | number | boolean

export type FilterBy<FilterableField extends string> = {
  field: FilterableField
  condition: FilterCondition
  value?: FilterableValue
  value1?: FilterableValue
  values?: (string | number)[]
}

export class FilterUtils {

  public static getStringFiltering<T>(
    fieldExtractor: (obj: T) => string,
    condition: FilterCondition,
    value?: string,
    values?: string[]
  ) {
    return (elem: T) => {
      const lcElemValue = fieldExtractor(elem).toLowerCase()
      if (condition === 'in') {
        if (values == undefined) return true
        if (values.length === 0) return false
        const lcValues = values.map(v => v.toLowerCase())
        return lcValues.includes(lcElemValue)
      }
      if (value === undefined) throw new Error('Аргумент не может быть undefined')
      const lcValue = value.toLowerCase()
      switch (condition) {
        case 'eq': return lcElemValue === lcValue
        case 'neq': return lcElemValue !== lcValue
        case 'contains': return lcElemValue.includes(lcValue)
        case 'ncontains': return !lcElemValue.includes(lcValue)
        case 'startswith': return lcElemValue.startsWith(lcValue)
        case 'endswith': return lcElemValue.endsWith(lcValue)
        default: return false
      }
    }
  }

  public static getNumberFiltering<T>(
    fieldExtractor: (obj: T) => number,
    condition: FilterCondition,
    value?: number,
    value1?: number,
    values?: number[]
  ) {
    return (elem: T) => {
      if (elem == undefined) return false
      const elemValue = fieldExtractor(elem)
      if (condition === 'in') {
        if (values == undefined) return true
        if (values.length === 0) return false
        return values.includes(elemValue)
      }
      if (value === undefined) throw new Error('Аргумент не может быть undefined')
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
    fieldExtractor: (obj: T) => string | number,
    condition: FilterCondition,
    value?: string | number,
    value1?: string | number,
    values?: (string | number)[]
  ) {
    return (elem: T) => {
      if (elem == undefined) return false
      const elemValue = fieldExtractor(elem)
      const elTime = new Date(elemValue).getTime()

      if (condition === 'in') {
        if (values == undefined) return true
        if (values.length === 0) return false
        const valuesTime = values.map(v => new Date(v).getTime())
        return valuesTime.includes(elTime)
      }
      if (value === undefined) throw new Error('Аргумент не может быть undefined')
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
    fieldExtractor: (obj: T) => boolean,
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
