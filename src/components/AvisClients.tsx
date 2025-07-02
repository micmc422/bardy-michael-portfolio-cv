import React, { forwardRef } from "react";
import classNames from "classnames";
import { Avatar, Column, Flex, Icon, Row, Text } from "@/once-ui/components";
import { AutoScroll } from "@/once-ui/components/AutoScroll";
import styles from "./avisClients.module.scss"
interface ComponentProps extends React.ComponentProps<typeof Flex> {
    className?: string;
    style?: React.CSSProperties;
}

interface AvisType {
    author_name: string,
    author_url: string,
    language: 'fr-FR',
    original_language: 'fr' | "en",
    profile_photo_url: string,
    rating: number,
    relative_time_description: string,
    text: string,
    time: number,
    translated: string
}

async function getAvis() {
    const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID!
    const GOOGLE_PLACE_API_KEY = process.env.GOOGLE_PLACE_API_KEY!
    const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,reviews&language=fr&key=${GOOGLE_PLACE_API_KEY}`);
    const avisClients = await res.json();
    return { rating: avisClients.result.rating, reviews: avisClients.result.reviews.map((el: AvisType) => ({ ...el, translated: `${el.translated}` })) as AvisType[] }
}

function convertirTimestampGoogle(time: number) {
    const date = new Date(time * 1000); // Multiplier par 1000 car timestamp est en secondes
    return date.toISOString().split("T")[0]; // Garde uniquement la date : "YYYY-MM-DD"
}

const AvisClient = forwardRef<HTMLDivElement, ComponentProps>(
    async ({ className, style, ...rest }, ref) => {
        const { rating, reviews } = await getAvis();
        const reviewsArr = JSON.stringify(reviews.map((el) => ({
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": el.author_name
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": el.rating,
                "bestRating": "5"
            },
            "reviewBody": el.text,
            "datePublished": convertirTimestampGoogle(el.time)
        })))
        return (
            <Flex
                ref={ref}
                style={style}
                className={classNames(styles.root, className)}
                {...rest}
            >
                <AutoScroll>
                    {reviews.map((avis, i) => <Avis key={i} {...avis} />)}
                </AutoScroll>
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: `{
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": "Occitaweb",
                        "url": "https://occitaweb.fr",
                        "telephone": "+33 6 72 11 50 06",
                        "priceRange": "€€€",
                        "image": "https://occitaweb.fr/trademark/icon-dark.png",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "25 avenue gambetta",
                            "addressLocality": "Albi",
                            "postalCode": "81000",
                            "addressCountry": "FR"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": ${rating},
                            "reviewCount": ${reviews.length}
                        },
                        "review": ${reviewsArr}
                    }`
                }} />
            </Flex>
        );
    }
);

AvisClient.displayName = "AvisClient";

interface AvisProps extends React.ComponentProps<typeof Flex & AvisType> {
    className?: string;
    style?: React.CSSProperties;
    author_name: string,
    author_url: string,
    language: 'fr-FR',
    original_language: 'fr' | "en",
    profile_photo_url: string,
    rating: number,
    relative_time_description: string,
    text: string,
    time: number,
    translated: string
}

const Avis = forwardRef<HTMLDivElement, AvisProps>(
    async ({ className, style, author_name, author_url, profile_photo_url, rating, relative_time_description, text, ...rest }, ref) => {
        const stars = Array.from({ length: rating }, (_, i) => i);
        return (
            <Flex
                ref={ref}
                style={style}
                className={classNames(className)}
                direction="column"
                width={25}
                gap="s"
                background="overlay"
                padding="s"
                radius="m"
                center
                marginX="s"
                {...rest}
            >
                <Row gap="xs">
                    <Avatar src={profile_photo_url} size="l" />
                    <Column>
                        <Text>{author_name}</Text>
                        <div>
                            {stars.map(key => <Icon key={key} name="starfill" onBackground="warning-medium" />)}
                        </div>
                    </Column>
                </Row>
                <Text as="div" wrap="wrap" align="center" onBackground="neutral-medium">{text}</Text>
            </Flex>
        );
    }
);

export { AvisClient };
