export type Period = 'D' | 'W' | 'M' | 'Q' | 'HY' | 'Y' | 'day' | 'week' | 'month' | 'quarter' | 'halfYear' | 'year'
type DateStringOptions = {
  tzOffsetHours?: number
  withTime?: boolean
}
type AnyDate = string | number | Date

export class DateUtils {
  static second = 1000
  static min = DateUtils.second * 60
  static hour = DateUtils.min * 60
  static day = 24 * DateUtils.hour
  static week = 7 * DateUtils.day

  /** by default: tz is local, without time*/
  static now(options?: DateStringOptions) {
    return DateUtils.dateObjToDateString(new Date, options)
  }
  static nowNum() {
    return new Date().getTime()
  }
  static dateObjToNum(date: Date) {
    return date.getTime()
  }
  /** by default: tz is local, without time*/
  static dateObjToDateString(
    date: Date,
    options?: DateStringOptions
  ) {
    const d = new Date(date)
    return (
      new Date(d.getTime() -
        (options?.tzOffsetHours ?? d.getTimezoneOffset() / 60) * 60 * 60 * 1000
      ).toISOString()
    ).split(options?.withTime ? 'Z' : 'T')[0]
  }
  /** by default: tz is local, without time*/
  static numToDateString(date: number, options?: DateStringOptions) {
    return DateUtils.dateObjToDateString(new Date(date), options)
  }
  /** date is considered local*/
  static dateStringToNum(date: string) {
    return new Date(date).getTime()
  }

  static dateObjToDateTimeString(date: Date) {
    return DateUtils.dateObjToDateString(date, { withTime: true })
  }

  static removeTimeFromString(date: string) {
    return DateUtils.dateObjToDateString(new Date(date), { withTime: false })
  }

  static formatDateLoc = (
    date: AnyDate,
    options?: {
      month?: 'numeric' | 'long' | 'short' | 'narrow',
      year?: 'numeric' | '2-digit'
    }
  ) => {
    const d = new Date(date)
    return new Intl.DateTimeFormat(navigator.language, {
      year: options?.year ?? 'numeric',
      month: options?.month ?? 'short',
      day: 'numeric'
    }).format(d)
  }

  static formatDateTimeLoc = (
    date: AnyDate,
    options?: {
      month?: 'numeric' | 'long' | 'short' | 'narrow',
      year?: 'numeric' | '2-digit'
    }
  ) => {
    const d = new Date(date)
    return new Intl.DateTimeFormat(navigator.language, {
      year: options?.year ?? 'numeric',
      month: options?.month ?? 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }).format(d)
  }

  static formatPeriod(date: AnyDate, per: Period) {
    switch (per) {
      case 'D':
      case 'day':
        return DateUtils.formatDateLoc(date)
      case 'W':
      case 'week':
        return DateUtils.formatWeek(date)
      case 'M':
      case 'month':
        return DateUtils.formatMonth(date)
      case 'Q':
      case 'quarter':
        return DateUtils.formatQuarter(date)
      case 'HY':
      case 'halfYear':
        return DateUtils.formatHalfYear(date)
      case 'Y':
      case 'year':
        return (new Date(date)).getFullYear().toString()
    }
  }

  static formatMonth(date: AnyDate) {
    const d = new Date(date)
    return new Intl.DateTimeFormat(navigator.language, { month: 'short', year: 'numeric' }).format(d)
  }

  static formatWeek(date: AnyDate) {
    const d = new Date(date)
    const weekNum = DateUtils.getWeekNum(d)
    const weekStart = DateUtils.getFirstDayOfPeriod(d, 'W')
    const weekEnd = DateUtils.getLastDayOfPeriod(weekStart, 'W')
    return `Н${weekNum} (${DateUtils.formatRange(weekStart, weekEnd)})`
  }

  static formatRange(start: AnyDate, end: AnyDate) {
    const s = new Date(start)
    const e = new Date(end)
    return new Intl.DateTimeFormat(navigator.language, { month: 'short', year: 'numeric', day: 'numeric' }).formatRange(s, e)
  }

  static formatQuarter(date: AnyDate) {
    const d = new Date(date)
    const quarter = Math.floor((d.getMonth() / 3))
    return `Q${quarter} ${d.getFullYear()}`
  }

  static formatHalfYear(date: AnyDate) {
    const d = new Date(date)
    const hy = Math.floor(((d.getMonth() + 1) / 6))
    return `HY${hy} ${d.getFullYear()}`
  }

  static formatDurationDays(days: number) {
    if (!('DurationFormat' in Intl)) return `${days} d.`
    return new (Intl as any).DurationFormat(navigator.language, { style: 'long' }).format({
      days
    }) as string
  }

  static getDurationFullDays(start: AnyDate, end: AnyDate, abs = true) {
    const s = new Date(start)
    const e = new Date(end)
    const d = (s.getTime() - e.getTime()) / DateUtils.day
    return Math.floor(abs ? Math.abs(d) : -d)
  }

  static getDurationPartDays(start: AnyDate, end: AnyDate) {
    return DateUtils.getDurationFullDays(start, end) + 1
  }

  static roundTimeToDay(t: number) {
    const d = new Date(t)
    const dz = DateUtils.floorDay(t)
    return d.getTime() - dz <= DateUtils.day / 2 ?
      dz
      :
      DateUtils.add(dz, 'D', 1)
  }

  static floorDay(date: AnyDate) {
    const floored = new Date(date)
    floored.setUTCHours(0, 0, 0, 0)
    return floored.getTime()
  }

  static isPastDay(date: number | string) {
    return new Date(date).getTime() < DateUtils.floorDay(new Date)
  }

  static getDaysInMonth(date: AnyDate) {
    const d = new Date(date)
    return new Date(d.getFullYear(), d.getMonth() + 1, 0)
      .getDate()
  }

  static getWeekDay(date: AnyDate) {
    return new Date(date).getDay()
  }

  /** Mutates date */
  static incrementDatePeriodMutate(date: Date, per: Period) {
    return DateUtils.addMutate(date, per, 1)
  }
  /** Mutates date */
  static decrementDatePeriodMutate(date: Date, per: Period) {
    return DateUtils.subtractMutate(date, per, 1)
  }

  static add(date: AnyDate, per: Period, amount: number) {
    return DateUtils.addMutate(new Date(date), per, amount).getTime()
  }
  static subtract(date: AnyDate, per: Period, amount: number) {
    return DateUtils.subtractMutate(new Date(date), per, amount).getTime()
  }
  static increment(date: AnyDate, per: Period) {
    return DateUtils.add(date, per, 1)
  }
  static decrement(date: AnyDate, per: Period) {
    return DateUtils.subtract(date, per, 1)
  }

  static getFinYearStart(date: AnyDate) {
    const dateCopy = new Date(date)
    const finYearStart = new Date(date)
    finYearStart.setUTCHours(0, 0, 0, 0)
    finYearStart.setDate(1)
    finYearStart.setMonth(1)
    if (dateCopy.getMonth() === 0) {
      finYearStart.setFullYear(finYearStart.getFullYear() - 1)
      return finYearStart.getTime()
    }
  }

  static getDateOfISOWeek(yearAndWeek: string) {
    const w = parseInt(yearAndWeek.substring(6, 8))
    const y = parseInt(yearAndWeek.substring(0, 4))
    const simple = new Date(y, 0, 1 + (w - 1) * 7)
    const dow = simple.getDay()
    const ISOweekStart = simple
    if (dow <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    }
    return ISOweekStart.getTime()
  }

  static getLastDayOfPeriod(date: AnyDate, period: Period) {
    const firstDay = DateUtils.getFirstDayOfPeriod(date, period)
    const LD = new Date(DateUtils.add(firstDay, period, 1))
    LD.setDate(LD.getDate() - 1)
    return LD.getTime()
  }

  static getFirstDayOfPeriod(date: AnyDate, period: Period) {
    const d = new Date(date)
    let FD: Date
    switch (period) {
      case 'D':
      case 'day': {
        FD = d
        break
      }
      case 'W':
      case 'week': {
        const weekNum = DateUtils.getWeekNum(d)
        const dayNum = d.getDate()
        const weekBelongsToPreviousYear = (weekNum > 51 && dayNum < 7)
        const year = weekBelongsToPreviousYear ? d.getFullYear() - 1 : d.getFullYear()
        FD = new Date(DateUtils.getDateOfISOWeek(year + '-W' + weekNum))
        break
      }
      case 'M':
      case 'month': {
        FD = d
        FD.setDate(1)
        break
      }
      case 'Q':
      case 'quarter': {
        const quarter = Math.floor((d.getMonth() / 3))
        FD = new Date(d.getFullYear(), quarter * 3, 1)
        break
      }
      case 'HY':
      case 'halfYear': {
        const fdMonth = d.getMonth() > 5 ? 6 : 0
        FD = new Date(d.getFullYear(), fdMonth, 1)
        break
      }
      case 'Y':
      case 'year': {
        FD = new Date(d.getFullYear(), 0, 1)
      }
    }
    return FD.getTime()
  }

  /** returns YYYY-MM */
  static getMonthString(date: AnyDate) {
    const d = new Date(date)
    const split = DateUtils.dateObjToDateString(d).split('-')
    return split[0] + '-' + split[1]
  }
  /** monthString YYYY-MM */
  static monthStringToNum(monthString: string) {
    const split = monthString.split('-')
    return new Date(+split[0], +split[1] - 1, 1).getTime()
  }

  /** monthString YYYY-MM */
  static monthStrToStartEndStr = (monthString: string) => {
    const firstDay = DateUtils.monthStringToNum(monthString)
    const lastDay = DateUtils.getLastDayOfPeriod(firstDay, 'M')
    const dateStart = DateUtils.numToDateString(firstDay)
    const dateEnd = DateUtils.numToDateString(lastDay)
    return { dateStart, dateEnd }
  }

  static getWeekNum(date: AnyDate) {
    const copy = new Date(date)
    const d = new Date(Date.UTC(copy.getFullYear(), copy.getMonth(), copy.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  static isDateValid = (date: Date | string) => {
    const invalidStr = 'Invalid Date'
    return typeof date === 'string'
      ? new Date(date).toString() !== invalidStr
      : date instanceof Date
        ? date.toString() !== invalidStr
        : false
  }

  static isBetween(date: Date | number, from: Date | number, to: Date | number) {
    const dateStart = DateUtils.floorDay(new Date(date))
    const fromDayStart = DateUtils.floorDay(new Date(from))
    const toDayStart = DateUtils.floorDay(new Date(to))
    return dateStart >= fromDayStart && dateStart <= toDayStart
  }

  static getPeriodType = (from: AnyDate, to: AnyDate) => {
    const now = DateUtils.floorDay(DateUtils.nowNum())
    const fromDayStart = DateUtils.floorDay(new Date(from))
    const toDayStart = DateUtils.floorDay(new Date(to))
    if (toDayStart < now) return 'past'
    if (fromDayStart > now) return 'future'
    return 'current'
  }

  /** Mutates date */
  static addMutate(date: Date, per: Period, amount: number) {
    switch (per) {
      case 'D':
      case 'day':
        date.setDate(date.getDate() + amount)
        break
      case 'W':
      case 'week':
        date.setDate(date.getDate() + 7 * amount)
        break
      case 'M':
      case 'month':
        date.setMonth(date.getMonth() + amount)
        break
      case 'Q':
      case 'quarter':
        date.setMonth(date.getMonth() + 3 * amount)
        break
      case 'HY':
      case 'halfYear':
        date.setMonth(date.getMonth() + 6 * amount)
        break
      case 'Y':
      case 'year':
        date.setFullYear(date.getFullYear() + amount)
    }
    return date
  }
  /** Mutates date */
  static subtractMutate(date: Date, per: Period, amount: number) {
    return DateUtils.addMutate(date, per, -amount)
  }


  static getDateForInputDate(value?: AnyDate) {
    return DateUtils.dateObjToDateString(new Date(value ?? new Date()))
  }
  static formatDateForInput(date: Date) {
    return DateUtils.dateObjToDateString(date, { withTime: false })
  }
  static formatDateTimeForInput(date: Date) {
    return DateUtils.dateObjToDateString(date, { withTime: true })
  }
}