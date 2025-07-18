export const saveFile = (blob: Blob, name: string) => {
  const a = document.createElement('a')
  a.download = name
  a.href = URL.createObjectURL(blob)
  a.addEventListener('click', () => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  })
  a.click()
}
