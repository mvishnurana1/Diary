// Takes new Date() and returns date in format - YYYY-MM-DD
export const dateFormat = (dateArg: Date): string => {
    const date = new Date(dateArg);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
