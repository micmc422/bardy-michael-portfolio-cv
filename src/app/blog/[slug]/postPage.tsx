"use client";

import { baseURL, blog, person, about } from "@/app/resources";
import { formatDate } from "@/app/utils/formatDate";
import { PostType } from "@/app/utils/types";
import { CustomMDX } from "@/components/mdx";
import ScrollToHash from "@/components/ScrollToHash";
import { Row, Column, Button, Heading, AvatarGroup, Icon, HeadingNav, Text } from "@/once-ui/components";
import { Schema } from "@/once-ui/modules";
import { use } from "react";

export function PostPage({ postPromise }: { postPromise: Promise<PostType> }) {
    const post = use(postPromise);
    const avatars =
        post.metadata.team?.map((person) => ({
            src: person.avatar,
        })) || [];

    return (
        <Row fillWidth>
            <Row maxWidth={12} hide="m" />
            <Row fillWidth horizontal="center">
                <Column as="section" maxWidth="xs" gap="l">
                    <Schema
                        as="blogPosting"
                        baseURL={baseURL}
                        path={`${blog.path}/${post.slug}`}
                        title={post.metadata.title as string}
                        description={post.metadata.summary}
                        datePublished={post.metadata.publishedAt}
                        dateModified={post.metadata.publishedAt}
                        image={`${baseURL}/og?title=${encodeURIComponent(post.metadata.title as string)}`}
                        author={{
                            name: person.name,
                            url: `${baseURL}${about.path}`,
                            image: `${baseURL}${person.avatar}`,
                        }}
                    />
                    <Button data-border="rounded" href="/blog" weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft">
                        Publications
                    </Button>
                    <Heading variant="display-strong-s">{post.metadata.title as string}</Heading>
                    <Row gap="12" vertical="center">
                        {avatars.length > 0 && <AvatarGroup size="s" avatars={avatars} />}
                        <Text variant="body-default-s" onBackground="neutral-weak">
                            {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
                        </Text>
                    </Row>
                    <ScrollToHash />
                </Column>
            </Row>
            <Column maxWidth={12} paddingLeft="40" fitHeight position="sticky" top="80" gap="16" hide="m">
                <Row
                    gap="12"
                    paddingLeft="2"
                    vertical="center"
                    onBackground="neutral-medium"
                    textVariant="label-default-s"
                >
                    <Icon name="chevronDown" size="xs" />
                    Navigation
                </Row>
            </Column>
        </Row>
    );
    return (
        <Row fillWidth>
            <Row maxWidth={12} hide="m" />
            <Row fillWidth horizontal="center">
                <Column as="section" maxWidth="xs" gap="l">
                    <Schema
                        as="blogPosting"
                        baseURL={baseURL}
                        path={`${blog.path}/${post.slug}`}
                        title={post.metadata.title as string}
                        description={post.metadata.summary}
                        datePublished={post.metadata.publishedAt}
                        dateModified={post.metadata.publishedAt}
                        image={`${baseURL}/og?title=${encodeURIComponent(post.metadata.title as string)}`}
                        author={{
                            name: person.name,
                            url: `${baseURL}${about.path}`,
                            image: `${baseURL}${person.avatar}`,
                        }}
                    />
                    <Button data-border="rounded" href="/blog" weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft">
                        Publications
                    </Button>
                    <Heading variant="display-strong-s">{post.metadata.title as string}</Heading>
                    <Row gap="12" vertical="center">
                        {avatars.length > 0 && <AvatarGroup size="s" avatars={avatars} />}
                        <Text variant="body-default-s" onBackground="neutral-weak">
                            {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
                        </Text>
                    </Row>
                    <Column as="article" fillWidth>
                        <CustomMDX source={post.content} />
                    </Column>
                    <ScrollToHash />
                </Column>
            </Row>
            <Column maxWidth={12} paddingLeft="40" fitHeight position="sticky" top="80" gap="16" hide="m">
                <Row
                    gap="12"
                    paddingLeft="2"
                    vertical="center"
                    onBackground="neutral-medium"
                    textVariant="label-default-s"
                >
                    <Icon name="chevronDown" size="xs" />
                    Navigation
                </Row>
                <HeadingNav fitHeight />
            </Column>
        </Row>
    );
}