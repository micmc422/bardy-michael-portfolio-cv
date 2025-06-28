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
