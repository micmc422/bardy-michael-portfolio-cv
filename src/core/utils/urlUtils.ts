// URL validation and normalization utilities

export function isValidUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
        return false
    }
}

export function normalizeUrl(urlString: string): string {
    // Add protocol if missing
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
        urlString = 'https://' + urlString
    }
    try {
        const url = new URL(urlString)
        return url.toString()
    } catch {
        return urlString
    }
}
