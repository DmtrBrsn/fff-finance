import { Timestamp } from "firebase/firestore"

export type Period = 'day' | 'D' | 'week' | 'W' | 'month' | 'M' | 'year' | 'Y'

export class DateUtils {
	static second = 1000
	static min = this.second * 60
	static hour = this.min * 60
	static day = 24 * this.hour
	static week = 7 * this.day

	static isPastDay(date: Date | number | string) {
		return new Date(date) < DateUtils.floorDateToDay(new Date)
	}

	static formatDateLoc = (date: Date | string | number) => {
		const d = new Date(date)
		return new Intl.DateTimeFormat(navigator.language, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(d)
	}

	static formatDateTimeLoc = (date: Date | number) => {
		return new Intl.DateTimeFormat(navigator.language, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		}).format(date)
	}

	static getLocPeriod(date: Date | number, per: Period) {
		switch (per) {
			case 'D':
			case 'day':
				return DateUtils.formatDateLoc(date)
			case 'W':
			case 'week':
				return DateUtils.getWeekLoc(date)
			case 'M':
			case 'month':
				return DateUtils.getMonthAndYearLoc(date)
			case 'Y':
			case 'year':
				return new Date(date).getFullYear().toString()
		}
	}

	static getWeekLoc(date: Date | number) {
		const d = new Date(date)
		const weekNum = DateUtils.getWeekNum(d)
		const weekStart = DateUtils.getFirstDayOfPeriod(d, 'W')
		const weekEnd = DateUtils.getLastDayOfPeriod(weekStart, 'W')
		return `Н${weekNum} (${DateUtils.getDatesRangeLoc(weekStart, weekEnd)})`
	}


	static getDatesRangeLoc(start: Date | number, end: Date | number) {
		//@ts-ignore
		return new Intl.DateTimeFormat(navigator.language, { month: 'short', year: 'numeric', day: 'numeric' }).formatRange(start, end)
	}
	
	static getDaysDurationLocalString(days: number) {
		if (!('DurationFormat' in Intl)) return `${days} d.`
		//@ts-ignore
		return new Intl.DurationFormat(navigator.language, { style: 'long' }).format({
			days
		})
	}

	static getMonthAndYearLoc(date: Date | number) {
		return new Intl.DateTimeFormat(navigator.language, { month: 'short', year: 'numeric' }).format(date)
	}

	static getWeekDay(date: Date | number | string) {
		return new Date(date).getDay()
	}

	static isoStrToLocal(isoStr: string) {
		return new Date(isoStr).toLocaleDateString(undefined, {dateStyle:'medium'})
	}

	static isoStrToTs(isoStr: string) {
		return Timestamp.fromDate(new Date(isoStr))
	}

	static tsToIsoStr(ts: Timestamp) {
		return this.dateToIsoDate(ts.toDate())
	}

	static dateToIsoStr(date: Date) {
		return date.toISOString()
	}
  
	static getCurIsoStr() {
		const curDate = new Date()
		return this.dateToIsoStr(curDate)
	}

	static getCurIsoDate() {
		const curDate = new Date()
		return this.dateToIsoDate(curDate)
	}

	static getCurTs() {
		return Timestamp.now()
	}

	static getCurDayStart() {
		return DateUtils.floorDateToDay(new Date())
	}

	static getCurDayStartIsoDate() {
		const curDate = DateUtils.getCurDayStart()
		return this.dateToIsoDate(curDate)
	}

	static getCurDayStartTs() {
		const curDate = DateUtils.getCurDayStart()
		return Timestamp.fromDate(curDate)
	}

	static isoStrToTime(isoStr: string) {
		return new Date(isoStr).getTime()
	}

  static dateToIsoDate(date: Date, offset?: number) {
    offset = offset===undefined ? date.getTimezoneOffset() : offset;
		return new Date(date.getTime() - (offset * 60000))
			.toISOString()
			.split('T')[0]
	}

  static isoStrToIsoDate(isoDate: string, offset?: number) {
    const date = new Date(isoDate)
    offset = offset===undefined ? date.getTimezoneOffset() : offset;
    return new Date(date.getTime() - (offset * 60000))
       .toISOString()
       .split("T")[0];
  }
	
	static add(date: Date, per: Period, amount: number) {
		switch (per) {
			case 'day':
			case 'D' :
				date.setDate(date.getDate() + amount)
				break
			case 'week':
			case 'W' :
				date.setDate(date.getDate() + 7*amount)
				break
			case 'month':
			case 'M':
				date.setMonth(date.getMonth() + amount)
				break
			case 'year':	
			case 'Y' :
				date.setFullYear(date.getFullYear() + amount)
		}
		return date
	}

  static incrementDatePeriod(date: Date, per: Period) {
		return DateUtils.add(date, per, 1)
	}
	
	static toIncrementedDatePeriod(date: Date | string, per: Period) { 
		let d = new Date(date)
		DateUtils.incrementDatePeriod(d, per)
		return d
	}

	static subtract(date: Date, per: Period, amount: number) {
		return DateUtils.add(date, per, -amount)
	}
  
  static decrementDatePeriod(date: Date, per: Period) {
		return DateUtils.subtract(date, per, 1)
	}

	static toDecrementedDatePeriod(date: Date | string, per: Period) { 
		let d = new Date(date)
		DateUtils.decrementDatePeriod(d, per)
		return d
	}

	static getLastDayOfPeriod(date: Date, period: Period) {
		const FD = this.getFirstDayOfPeriod(date, period)
		const LD = this.incrementDatePeriod(FD, period)
		LD.setDate(LD.getDate() - 1)
		return LD
	}
	
	static getFirstDayOfPeriod(date: Date, period: Period) {
		switch (period) {
			case 'day' :
			case 'D' : {
				return new Date(date)
			}
			case 'week':
			case 'W' : {
				const weekNum = this.getWeekNum(date)
				const dayNum = date.getDate()
				const weekBelongsToPreviousYear = (weekNum > 51 && dayNum < 7)
				const year = weekBelongsToPreviousYear ? date.getFullYear() - 1 : date.getFullYear()
				return this.getDateOfISOWeek(year + '-W' + weekNum)
			}
			case 'month':
			case 'M' : {
				const FD = new Date(date)
				FD.setDate(1)
				return FD
			}
			case 'year':
			case 'Y' : {
				return new Date(date.getFullYear(), 0, 1)
			}
		}
	}

	static getFirstDayOfPeriodIsoStr(date: Date, period: Period) {
		return this.dateToIsoStr(this.getFirstDayOfPeriod(date, period))
	}

	static getLastDayOfPeriodIsoStr(date: Date, period: Period) {
		return this.dateToIsoStr(this.getLastDayOfPeriod(date, period))
	}

	static getWeekNum(date: Date) {
		const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
		const dayNum = d.getUTCDay() || 7
		d.setUTCDate(d.getUTCDate() + 4 - dayNum)
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
		return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
	}

	static getDateOfISOWeek(yearAndWeek: string) {
		// получает номер и год (2020-W06), возвращает дату начала недели
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
		return ISOweekStart
	}

	static roundTimeToDay(t: number) {
    const d = new Date(t)
    const dz = new Date(t)
    dz.setUTCHours(0, 0, 0, 0)
    return d.getTime() - dz.getTime() <= this.day / 2
      ? dz.getTime()
      : this.incrementDatePeriod(dz, 'D').getTime()
	}

	static ceilTimeToDay(t: number) {
		const floored = this.floorTimeToDay(t)
		return this.incrementDatePeriod(new Date(floored), 'D').getTime()
	}

	static floorTimeToDay(t: number) {
		const d = new Date(t)
		d.setUTCHours(0, 0, 0, 0)
		return d.getTime()
	}
	static floorDateToDay(date: Date) {
		return new Date(this.floorTimeToDay(date.getTime()))
	}

	static isBetween(date: Date | number, dateFrom: Date | number, dateTo: Date | number) {
		return date >= dateFrom && date <= dateTo
	}

	static getPeriodType = (from: Date | number | string, to: Date | number | string) => {
		const now = DateUtils.getCurDayStart()
		if (new Date(to) < now) return 'past'
		if (new Date(from) > now) return 'future'
		return 'current'
	}

	static isDateValid = (date: Date | string) => {
    const invalidStr = 'Invalid Date'
    return typeof date === 'string'
      ? new Date(date).toString() !== invalidStr
      : date instanceof Date
        ? date.toString() !== invalidStr
        : false
  }
}
