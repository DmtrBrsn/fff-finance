import { Timestamp } from "firebase/firestore"

type Period = 'День' | 'day' | 'D' | 'Неделя' | 'week' | 'W' | 'Месяц' | 'month' | 'M' | 'Полгода' | 'halfyear' | 'HY' | 'Год' |'year' | 'Y'

export class DateUtils {
	static second = 1000
	static min = this.second * 60
	static hour = this.min * 60
	static day = 24 * this.hour
	static week = 7 * this.day

	static tzs = {
		msk: { name: 'Europe/Moscow', offset: -180 }
	}

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

	static getDatesRangeLoc(start: Date | number, end: Date | number) {
		//@ts-ignore
		return new Intl.DateTimeFormat(navigator.language, { month: 'short', year: 'numeric', day: 'numeric' }).formatRange(start, end)
	}
	
	static getDaysDurationLocalString(days: number) {
		if (!('DurationFormat' in Intl)) return `${days} дн.`
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
	
	static tsToDateStr(ts: Timestamp) {
		return ts.toDate().toLocaleDateString(undefined, {dateStyle:'medium'})
	}

	static isoStrToLocal(isoStr: string) {
		return new Date(isoStr).toLocaleDateString(undefined, {dateStyle:'medium'})
	}

	static tsToDateTimeStr(ts: Timestamp) {
		return ts.toDate().toLocaleString(undefined, {dateStyle:'medium'})
	}

	static isoStrToTs(isoStr: string) {
		return Timestamp.fromDate(new Date(isoStr))
	}

	static tsToIsoStr(ts: Timestamp) {
		return this.formatDateForInput(ts.toDate())
	}

	static dateToIsoStr(date: Date) {
		return date.toISOString()
	}
  
	static getCurIsoStr() {
		const curDate = new Date()
		return this.dateToIsoStr(curDate)
	}

	static getCurInpDate() {
		const curDate = new Date()
		return this.formatDateForInput(curDate)
	}

	static getCurTs() {
		return Timestamp.now()
	}

	
	static isoStrToTime(isoStr: string) {
		return new Date(isoStr).getTime()
	}

  static formatDateForInput(date: Date, offset: number | undefined = this.tzs.msk.offset) {
    offset = offset===undefined ? date.getTimezoneOffset() : offset;
		return new Date(date.getTime() - (offset * 60000))
			.toISOString()
			.split('T')[0]
	}

  static isoStrToDate(isoDate: string) {
    return new Date(isoDate)
  }

  static inpDateToIsoDate(inpDate: string) {
    const date = new Date(inpDate)
    return this.dateToIsoStr(date)
  }

  static isoStrToInpDate(isoDate: string, offset: number | undefined  = this.tzs.msk.offset) {
    const date = this.isoStrToDate(isoDate)
    offset = offset===undefined ? date.getTimezoneOffset() : offset;
    return new Date(date.getTime() - (offset * 60000))
       .toISOString()
       .split("T")[0];
  }

  static isoStrToInpDateTime(isoDate: string, offset: number | undefined  = this.tzs.msk.offset) {
    const date = this.isoStrToDate(isoDate)
    offset = offset===undefined ? date.getTimezoneOffset() : offset;
    return new Date(date.getTime() - (offset * 60000 ))
      .toISOString()
     .split("Z")[0];
   }

  static isoStrToTzDateStr(isoDate: string, timeZone: string | undefined = this.tzs.msk.name) {
    const date = this.isoStrToDate(isoDate)
    return timeZone === undefined ?
      date.toLocaleDateString(navigator.language)
      :
      date.toLocaleDateString(navigator.language, { timeZone })
  }

  static isoStrToTzDateTimeStr(isoDate: string, timeZone: string | undefined = this.tzs.msk.name) { 
    const date = this.isoStrToDate(isoDate)
    return timeZone === undefined ?
      date.toLocaleString(navigator.language)
      :
      date.toLocaleString(navigator.language, { timeZone })
	}
	
	static add(date: Date, per: Period, amount: number) {
		switch (per) {
			case 'День':
			case 'day':
			case 'D' :
				date.setDate(date.getDate() + amount)
				break
			case 'Неделя':
			case 'week':
			case 'W' :
				date.setDate(date.getDate() + 7*amount)
				break
			case 'Месяц':
			case 'month':
			case 'M':
				date.setMonth(date.getMonth() + amount)
				break
			case 'Полгода':
			case 'halfyear':
			case 'HY' :
				date.setMonth(date.getMonth() + 6*amount)
				break
			case 'Год':
			case 'year':	
			case 'Y' :
				date.setMonth(date.getMonth() + 12*amount)
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
			case 'День' :
			case 'day' :
			case 'D' : {
				return new Date(date)
			}
			case 'Неделя':
			case 'week':
			case 'W' : {
				const weekNum = this.getWeekNum(date)
				const dayNum = date.getDate()
				const weekBelongsToPreviousYear = (weekNum > 51 && dayNum < 7)
				const year = weekBelongsToPreviousYear ? date.getFullYear() - 1 : date.getFullYear()
				return this.getDateOfISOWeek(year + '-W' + weekNum)
			}
			case 'Месяц':
			case 'month':
			case 'M' : {
				const FD = new Date(date)
				FD.setDate(1)
				return FD
			}
			case 'Полгода':
			case 'halfyear':
			case 'HY' : {
				const fdMonth = date.getMonth() > 5 ? 6 : 0
				return new Date(date.getFullYear(), fdMonth, 1)
			}
			case 'Год':
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

	static isDateValid = (date: Date | string) => {
    const invalidStr = 'Invalid Date'
    return typeof date === 'string'
      ? new Date(date).toString() !== invalidStr
      : date instanceof Date
        ? date.toString() !== invalidStr
        : false
  }
}
