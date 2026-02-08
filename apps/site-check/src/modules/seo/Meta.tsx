import type { Metadata as NextMetadata } from "next";

export interface MetaProps {
    title: string;
    description: string;
    baseURL: string;
    path?: string;
    type?: "website" | "article";
    image?: string;
    publishedTime?: string;
    author?: {
        name: string;
        url?: string;
    };
    noIndex?: boolean,
}

export function generateMetadata({
    title,
    description,
    baseURL,
    path = "",
    type = "website",
    image,
    publishedTime,
    author,
    noIndex
}: MetaProps): NextMetadata {
    const normalizedBaseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    const isFullUrl = (url: string) => /^https?:\/\//.test(url);

    const ogImage = image
        ? isFullUrl(image)
            ? image
            : `${normalizedBaseURL}${image.startsWith("/") ? image : `/${image}`}`
        : `${normalizedBaseURL}/og?title=${encodeURIComponent(title)}`;

    const url = `${normalizedBaseURL}${normalizedPath}`;
    const robots = noIndex ? {
        index: false,
        follow: false,
        nosnippet: true,
        noarchive: true,
        nocache: true,
        noimageindex: true,
        nositelinkssearchbox: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            nocache: true,
            noarchive: true,
            nosnippet: true,
            nositelinkssearchbox: true,
        },
    } : undefined
    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            type,
            ...(publishedTime && type === "article" ? { publishedTime } : {}),
            url,
            images: [
                {
                    url: ogImage,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
        ...(author ? { authors: [{ name: author.name, url: author.url }] } : {}),
        robots
    };
}

export const Meta = {
    generate: generateMetadata,
};

export default Meta;