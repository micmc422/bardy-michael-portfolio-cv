"use client";

import { Column, Flex, Heading, Media, SmartLink, Tag, Text } from '@once-ui-system/core';
import styles from './Posts.module.scss';
import { formatDate } from '@/app/utils/formatDate';

interface PostProps {
    post: any;
    thumbnail: boolean;
    direction?: "row" | "column";
    excludeNav?: boolean;
}

export default function Post({ post, thumbnail, direction, excludeNav }: PostProps) {
    const tags = post.metadata.tag?.split(',').map((tag: string) => tag.trim());
    return (
        <SmartLink
            fillWidth
            unstyled
            style={{ borderRadius: 'var(--radius-l)', alignItems:"start" }}
            key={post.slug}
            href={`/blog/${post.slug}`}>
            <Flex
                position="relative"
                transition="micro-medium"
                direction={direction}
                radius="l"
                className={styles.hover}
                mobileDirection="column"
                fillWidth>
                {post.metadata.image && thumbnail && (
                    <Media
                        priority
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, 640px"
                        border="neutral-alpha-weak"
                        cursor="interactive"
                        radius="l"
                        src={post.metadata.image}
                        alt={'Thumbnail of ' + post.metadata.title}
                        aspectRatio="16 / 9"
                    />
                )}
                <Column
                    position="relative"
                    fillWidth gap="4"
                    padding="24"
                    vertical="center">
                    <Heading
                        as="h2"
                        variant="heading-strong-l"
                        wrap="balance"
                        data-exclude-nav={excludeNav ? 'true' : 'false'}>
                        {post.metadata.title}
                    </Heading>
                    <Text
                        variant="label-default-s"
                        onBackground="neutral-weak">
                        {formatDate(post.metadata.publishedAt, false)}
                    </Text>
                    <Flex gap='8' paddingTop='12' wrap>{post.metadata.tag && tags.map((tag: string, index: number) => (
                        <Tag
                            paddingTop='4'
                            key={index}
                            label={tag}
                            variant="info" />
                    ))}
                    </Flex>
                </Column>
            </Flex>
        </SmartLink>
    );
}

export function SkeletonPost({ direction = "column" }: { direction?: "row" | "column" }) {
    return (
        <SmartLink
            fillWidth
            unstyled
            style={{ borderRadius: 'var(--radius-l)' }}
        >
            <Flex
                position="relative"
                transition="micro-medium"
                direction={direction}
                radius="l"
                className={styles.hover}
                mobileDirection="column"
                fillWidth>
                <Media
                    border="neutral-alpha-weak"
                    radius="l"
                    loading
                    src='/images/eaa.jpg'
                    aspectRatio="16 / 9"
                />
            </Flex>
        </SmartLink>
    );
}