export function slugify(str: string): string {
    try {
        return str
            .toLowerCase()
            .replace(/\s+/g, "-") // Replace spaces with -
            .replace(/&/g, "-and-") // Replace & with 'and'
            .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
            .replace(/\-\-+/g, "-"); // Replace multiple - with single -
    }
    catch (error) {
        console.error(error)
        return str; // Fallback to original string if an error occurs
    }
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function convertirTimestampGoogle(time: number) {
    const date = new Date(time * 1000); // Multiplier par 1000 car timestamp est en secondes
    return date.toISOString().split("T")[0]; // Garde uniquement la date : "YYYY-MM-DD"
}
export function getRandomSixDigitNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}
export function isValidEmail(email?: string) {
    if (!email) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}
export function toQueryParams(key: string, values: string[]) {
    const params = new URLSearchParams()
    values.forEach((val) => params.append(key, val))
    return params.toString()
    }