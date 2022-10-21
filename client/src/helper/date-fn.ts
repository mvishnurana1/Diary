// Takes new Date() and returns date in format - YYYY-MM-DD
export const dateFormat = (dateArg: Date): string => {
    const date = new Date(dateArg);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export const getMonthTitle = (): string => {
    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August', 'September', 
        'October', 'November', 'December'
    ];
    
    const month = (new Date().getMonth());
    
    return months[month];
}

export const localisedDate = (): string => {
    const date = new Date();

    return date.toDateString();
}
