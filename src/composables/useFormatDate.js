export default function useFormatDate() {
  const formatDate = (date) => {
    return (
      new Date(parseInt(date)).getFullYear().toString() +
      '-' +
      (new Date(parseInt(date)).getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      new Date(parseInt(date)).getDate().toString().padStart(2, '0') +
      ' ' +
      new Date(parseInt(date)).getHours().toString().padStart(2, '0') +
      ':' +
      new Date(parseInt(date)).getMinutes().toString().padStart(2, '0')
    )
  }
  return { formatDate }
}
