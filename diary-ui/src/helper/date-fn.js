// Takes new Date() and returns date in format - YYYY-MM-DD
export function dateFormat(dateArg) {
    const date = new Date(dateArg);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
