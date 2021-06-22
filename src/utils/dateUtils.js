//格式化日期
export default function formDate(time) {
    if (!time) return ''
    let date = new Date(time)
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        + ' ' + date.getHours() + ':' + (Number(date.getMinutes()) < 10 ? '0' + date.getMinutes() : date.getMinutes())
        + ':' + (Number(date.getSeconds()) < 10 ? '0' + date.getSeconds() : date.getSeconds())
}
