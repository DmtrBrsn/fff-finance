export class DateUtils {

  static tzs = {
    msk: { name:'Europe/Moscow', offset: -180}
  }

  static dateToIsoStr(date: Date) {
    return date.toISOString()
  }
  
  static getCurIsoStr() {
    const curDate = new Date()
    return DateUtils.dateToIsoStr(curDate)
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
    return new Date(date.getTime() - (offset * 60000 ))
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

}
