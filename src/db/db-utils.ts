export const getUid = () => {
  const lsUid = localStorage.getItem('uid')
  return lsUid==undefined || lsUid==='' ? undefined : lsUid
}

export const getColPath = (collectionName: string) => {
  const uid = getUid()
  if (uid===undefined) throw new Error('No uid!')
  return `root/${uid}/${collectionName}`
}
