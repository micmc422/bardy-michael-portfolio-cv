import React, { forwardRef } from "react";
import classNames from "classnames";
import { Avatar, Column, Flex, Icon, Row, Text } from "@/once-ui/components";
import { AutoScroll } from "@/once-ui/components/AutoScroll";
import styles from "./avisClients.module.scss"
import { getAvis } from "@/app/utils/serverActions";
interface ComponentProps extends React.ComponentProps<typeof Flex> {
    className?: string;
    style?: React.CSSProperties;
}

export interface AvisType {
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



const AvisClient = forwardRef<HTMLDivElement, ComponentProps>(
    async ({ className, style, ...rest }, ref) => {
        const { reviews } = await getAvis();
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
                className={classNames(className, styles.avisCli)}
                direction="column"
                width={25}
                gap="s"
                marginRight="s"
                background="overlay"
                padding="l"
                radius="m"
                center
                marginX="s"
                {...rest}
            >
                <Row gap="s">
                    <Avatar src={profile_photo_url} size="l" />
                    <Column center>
                        <Text variant="label-strong-xl" onBackground="accent-weak">{author_name}</Text>
                        <div>
                            {stars.map(key => <Icon key={key} name="starfill" onBackground="warning-medium" />)}
                        </div>
                    </Column>
                </Row>
                <Text as="div" wrap="wrap" align="center" onBackground="neutral-weak">{text}</Text>
            </Flex>
        );
    }
);
Avis.displayName = "Avis";

export { AvisClient };
