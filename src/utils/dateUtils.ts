import { Timestamp } from "firebase/firestore"

export class DateUtils {

  static tzs = {
    msk: { name:'Europe/Moscow', offset: -180}
	}
	
	static tsToDateStr(ts: Timestamp) {
		return ts.toDate().toLocaleDateString('ru-RU')
	}

	static tsToDateTimeStr(ts: Timestamp) {
		return ts.toDate().toLocaleString('ru-RU')
	}

	static isoStrToTs(isoStr: string) {
		return Timestamp.fromDate(new Date(isoStr))
	}

	static tsToIsoStr(ts: Timestamp) {
		return DateUtils.formatDateForInput(ts.toDate())
	}

  static dateToIsoStr(date: Date) {
    return date.toISOString()
  }
  
  static getCurIsoStr() {
    const curDate = new Date()
    return DateUtils.dateToIsoStr(curDate)
  }

  static getCurInpDate() {
    const curDate = new Date()
    return DateUtils.formatDateForInput(curDate)
  }

  static formatDateForInput(date: Date, offset: number | undefined = DateUtils.tzs.msk.offset) {
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
    return DateUtils.dateToIsoStr(date)
  }

  static isoStrToInpDate(isoDate: string, offset: number | undefined  = DateUtils.tzs.msk.offset) {
    const date = DateUtils.isoStrToDate(isoDate)
    offset = offset===undefined ? date.getTimezoneOffset() : offset;
    return new Date(date.getTime() - (offset * 60000))
       .toISOString()
       .split("T")[0];
  }

  static isoStrToInpDateTime(isoDate: string, offset: number | undefined  = DateUtils.tzs.msk.offset) {
    const date = DateUtils.isoStrToDate(isoDate)
    offset = offset===undefined ? date.getTimezoneOffset() : offset;
    return new Date(date.getTime() - (offset * 60000 ))
      .toISOString()
     .split("Z")[0];
   }

  static isoStrToTzDateStr(isoDate: string, timeZone: string | undefined = DateUtils.tzs.msk.name) {
    const date = DateUtils.isoStrToDate(isoDate)
    return timeZone === undefined ?
      date.toLocaleDateString('ru-RU')
      :
      date.toLocaleDateString('ru-RU', { timeZone })
  }

  static isoStrToTzDateTimeStr(isoDate: string, timeZone: string | undefined = DateUtils.tzs.msk.name) { 
    const date = DateUtils.isoStrToDate(isoDate)
    return timeZone === undefined ?
      date.toLocaleString('ru-RU')
      :
      date.toLocaleString('ru-RU', { timeZone })
  }

  static incrementDatePeriod(date: Date, per: string) {
		switch (per) {
			case 'День':
			case 'D' :
				date.setDate(date.getDate() + 1)
				break
			case 'Неделя':
			case 'W' :
				date.setDate(date.getDate() + 7)
				break
			case 'Месяц':
				date.setMonth(date.getMonth() + 1)
				break
			case 'Квартал':
			case 'Q' :
				date.setMonth(date.getMonth() + 3)
				break
			case 'Полгода':
			case 'HY' :
				date.setMonth(date.getMonth() + 6)
				break
			case 'Год':
			case 'Y' :
				date.setMonth(date.getMonth() + 12)
		}
		return date
  }
  
  static decrementDatePeriod(date: Date, per: string) {
		switch (per) {
			case 'День':
			case 'D' :
				date.setDate(date.getDate() - 1)
				break
			case 'Неделя':
			case 'W' :
				date.setDate(date.getDate() - 7)
				break
			case 'Месяц':
				date.setMonth(date.getMonth() - 1)
				break
			case 'Квартал':
			case 'Q' :
				date.setMonth(date.getMonth() - 3)
				break
			case 'Полгода':
			case 'HY' :
				date.setMonth(date.getMonth() - 6)
				break
			case 'Год':
			case 'Y' :
				date.setMonth(date.getMonth() - 12)
		}
		return date
	}

}
