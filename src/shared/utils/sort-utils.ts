export type SortDirection = 'asc' | 'desc'

export type SortBy<SortableField extends string> = { field: SortableField, dir: SortDirection }

export class SortUtils {

  public static getDateSorting<T>(fieldExtractor: (obj: T) => string | Date, dir: SortDirection) {
    return (a: T, b: T) => {
      if (a==undefined || b==undefined) return 0
      let aTime = new Date(fieldExtractor(a)).getTime()
      let bTime = new Date(fieldExtractor(b)).getTime()
      return dir === 'desc' ? aTime  - bTime : bTime - aTime
    }
  }

  public static getNumSorting<T>(fieldExtractor: (obj: T) => number, dir: SortDirection) {
    return (a: T, b: T) => {
      if (a==undefined || b==undefined) return 0
      const aVal = fieldExtractor(a)
      const bVal = fieldExtractor(b)
      return dir === 'desc' ? aVal - bVal :  bVal - aVal
    }
  }

  public static getBooleanSorting<T>(fieldExtractor: (obj: T) => unknown, dir: SortDirection) {
    return (a: T, b: T) => {
      if (a==undefined || b==undefined) return 0
      const valA = fieldExtractor(a)
      const valB = fieldExtractor(b)
      if (dir === 'asc') {
        return valA === valB ? 0 : valA ? -1 : 1
      }
      else {
        return valA === valB ? 0 : valA ? 1 : -1
      }
    }
  }

  public static getStringSorting<T>(fieldExtractor: ((obj: T) => string), dir: SortDirection) {
    return (a: T, b: T) => {
      if (a==undefined || b==undefined) return 0
      const valA = fieldExtractor(a).toLowerCase();
      const valB = fieldExtractor(b).toLowerCase();
      if (dir === 'asc') {
        return valA.localeCompare(valB);
      }
      else {
        return valA.localeCompare(valB);
      }
    }
  }

}
