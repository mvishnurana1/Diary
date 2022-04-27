// Takes new Date() and returns date in format - YYYY-MM-DD
export function dateFormat(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
