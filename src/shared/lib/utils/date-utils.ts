export type Period = 'D' | 'W' | 'M' | 'Q' | 'HY' | 'Y' | 'day' | 'week' | 'month' | 'quarter' | 'halfYear' | 'year'
type DateStringOptions = {
	tzOffsetHours?: number
	withTime?: boolean
}
type AnyDate = string | number | Date

export class Dates {
	static second = 1000
	static min = Dates.second * 60
	static hour = Dates.min * 60
	static day = 24 * Dates.hour
	static week = 7 * Dates.day

	/** by default: tz is local, without time*/
	static now(options?: DateStringOptions) {
		return Dates.dateObjToString(new Date, options)
	}
	static nowNum() {
		return new Date().getTime()
	}
	/** by default: tz is local, without time*/
	private static dateObjToString(
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

	static toString(date: AnyDate, options?: DateStringOptions) {
		return Dates.dateObjToString(new Date(date), options)
	}

	static toNum(date: AnyDate) {
		return new Date(date).getTime()
	}

	static toDate(date: AnyDate) {
		return new Date(date)
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

	static formatPeriod(per: Period, date: AnyDate) {
		switch (per) {
			case 'D':
			case 'day':
				return Dates.formatDateLoc(date)
			case 'W':
			case 'week':
				return Dates.formatWeek(date)
			case 'M':
			case 'month':
				return Dates.formatMonth(date)
			case 'Q':
			case 'quarter':
				return Dates.formatQuarter(date)
			case 'HY':
			case 'halfYear':
				return Dates.formatHalfYear(date)
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
		const weekNum = Dates.getWeekNum(d)
		const weekStart = Dates.getFirstDayNum('W', d)
		const weekEnd = Dates.getLastDayNum('W', weekStart,)
		return `Н${weekNum} (${Dates.formatRange(weekStart, weekEnd)})`
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
		const d = (s.getTime() - e.getTime()) / Dates.day
		return Math.floor(abs ? Math.abs(d) : -d)
	}

	static getDurationPartDays(start: AnyDate, end: AnyDate) {
		return Dates.getDurationFullDays(start, end) + 1
	}

	static roundTimeToDay(t: number) {
		const d = new Date(t)
		const dz = Dates.floorDay(t)
		return d.getTime() - dz <= Dates.day / 2 ?
			dz
			:
			Dates.addNum(dz, 'D', 1)
	}

	static floorDay(date: AnyDate) {
		const floored = new Date(date)
		floored.setUTCHours(0, 0, 0, 0)
		return floored.getTime()
	}

	static isPastDay(date: AnyDate) {
		return new Date(date).getTime() < Dates.floorDay(new Date)
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
		return Dates.addMutate(date, per, 1)
	}
	/** Mutates date */
	static decrementDatePeriodMutate(date: Date, per: Period) {
		return Dates.subtractMutate(date, per, 1)
	}

	static add(date: AnyDate, per: Period, amount: number, options?: DateStringOptions) {
		return Dates.toString(Dates.addMutate(new Date(date), per, amount), options)
	}
	static addNum(date: AnyDate, per: Period, amount: number) {
		return Dates.addMutate(new Date(date), per, amount).getTime()
	}

	static subtract(date: AnyDate, per: Period, amount: number, options?: DateStringOptions) {
		return Dates.toString(Dates.subtractMutate(new Date(date), per, amount), options)
	}
	static subtractNum(date: AnyDate, per: Period, amount: number) {
		return Dates.subtractMutate(new Date(date), per, amount).getTime()
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

	static getLastDayNum(period: Period, date?: AnyDate) {
		const firstDay = Dates.getFirstDayNum(period, date ?? new Date)
		const LD = new Date(Dates.addNum(firstDay, period, 1))
		LD.setDate(LD.getDate() - 1)
		return LD.getTime()
	}

	static getLastDay(period: Period, date?: AnyDate, options?: DateStringOptions) {
		return Dates.toString(Dates.getLastDayNum(period, date), options)
	}

	static getFirstDayNum(period: Period, date?: AnyDate) {
		const d = date ? new Date(date) : new Date
		let FD: Date
		switch (period) {
			case 'D':
			case 'day': {
				FD = d
				break
			}
			case 'W':
			case 'week': {
				const weekNum = Dates.getWeekNum(d)
				const dayNum = d.getDate()
				const weekBelongsToPreviousYear = (weekNum > 51 && dayNum < 7)
				const year = weekBelongsToPreviousYear ? d.getFullYear() - 1 : d.getFullYear()
				FD = new Date(Dates.getDateOfISOWeek(year + '-W' + weekNum))
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

	static getFirstDay(period: Period, date?: AnyDate, options?: DateStringOptions) {
		return Dates.toString(Dates.getFirstDayNum(period, date), options)
	}

	/** returns YYYY-MM */
	static getMonthString(date: AnyDate) {
		const d = new Date(date)
		const split = Dates.dateObjToString(d).split('-')
		return split[0] + '-' + split[1]
	}
	/** monthString YYYY-MM */
	static monthStringToNum(monthString: string) {
		const split = monthString.split('-')
		return new Date(+split[0], +split[1] - 1, 1).getTime()
	}

	/** monthString YYYY-MM */
	static monthStrToStartEndStr = (monthString: string) => {
		const firstDay = Dates.monthStringToNum(monthString)
		const lastDay = Dates.getLastDayNum('M', firstDay)
		const dateStart = Dates.toString(firstDay)
		const dateEnd = Dates.toString(lastDay)
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
		return (typeof date === 'string') ?
			new Date(date).toString() !== invalidStr
			:
			(date instanceof Date) ?
				date.toString() !== invalidStr
				:
				false
	}

	static isBetween(date: AnyDate, from: AnyDate, to: AnyDate) {
		const dateStart = Dates.floorDay(new Date(date))
		const fromDayStart = Dates.floorDay(new Date(from))
		const toDayStart = Dates.floorDay(new Date(to))
		return dateStart >= fromDayStart && dateStart <= toDayStart
	}

	static getPeriodType = (from: AnyDate, to: AnyDate) => {
		const now = Dates.floorDay(Dates.nowNum())
		const fromDayStart = Dates.floorDay(new Date(from))
		const toDayStart = Dates.floorDay(new Date(to))
		if (toDayStart < now) return 'past'
		if (fromDayStart > now) return 'future'
		return 'current'
	}

	private static addMutate(date: Date, per: Period, amount: number) {
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
	private static subtractMutate(date: Date, per: Period, amount: number) {
		return Dates.addMutate(date, per, -amount)
	}
}
