import { Timestamp } from 'firebase/firestore'
import { Dates } from './date-utils'

export const getUid = () => {
  const lsUid = localStorage.getItem('uid')
  return lsUid == undefined || lsUid === '' ? undefined : lsUid
}

export const getColPath = (collectionName: string) => {
  const uid = getUid()
  if (uid === undefined) throw new Error('No uid!')
  return `root/${uid}/${collectionName}`
}

export class TimestampAdapter {
  static isoStrToTs(isoStr: string) {
    return Timestamp.fromDate(new Date(isoStr))
  }

  static tsToIsoStr(ts: Timestamp, withTime: boolean = false) {
    return withTime ? Dates.dateObjToDateTimeString(ts.toDate()) : Dates.dateObjToDateString(ts.toDate())
  }

  static getCurTs() {
    return Timestamp.now()
  }

}
