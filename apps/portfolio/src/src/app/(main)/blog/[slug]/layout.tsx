import { baseURL, blog, person } from "@/app/resources";
import { formatDate } from "@/app/utils/formatDate";
import { getComments, getPostBySlug, getPosts, getRelatedPost } from "@/app/utils/serverActions";
import { getReactions } from "@/components/reactions/serverActions";
import { AvatarGroup, Button, Column, Grid, Heading, HeadingNav, Icon, OgCard, Row, Skeleton, SmartLink, Spinner, Tag, Text } from "@once-ui-system/core";
import Meta from "@/modules/seo/Meta";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import Schema from "@/modules/seo/Schema";

// import { SocialShareBar } from "@/components/SocialShare";
const SocialShareBar = dynamic(() => import('@/components/SocialShare').then(mod => mod.SocialShareBar), {
    loading: () => <>
        <Skeleton shape="line" height="m" width="xs" />
    </>,
});

const ScrollToHash = dynamic(() => import('@/components/ScrollToHash'));

// import CommentSection from "@/components/CommentSection";
const CommentSection = dynamic(() => import('@/components/CommentSection'), {
    loading: () => <Column>
        <Skeleton shape="line" height="xl" width="l" />
        <Skeleton shape="line" height="m" width="m" />
    </Column>
    , // Composant optionnel affiché pendant le chargement
});

// import Post from "@/components/blog/Post";
const Post = dynamic(() => import('@/components/blog/Post'), {
    loading: () => <Column>
        <Skeleton shape="block" width="l" minHeight={"40"} />
        <Skeleton shape="line" height="xl" width="l" />
        <Skeleton shape="line" height="m" width="m" />
    </Column>, // Composant optionnel affiché pendant le chargement
});


// import { Reactions } from "@/components/reactions/Reactions";
const Reactions = dynamic(() => import('@/components/reactions/Reactions').then(mod => mod.Reactions), {
    loading: () => <Spinner />,
});

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const posts = await getPosts({ limit: 0 });
    return posts.map(({ slug }) => ({ slug }));

}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug)
    if (!post) return {};
    return Meta.generate({
        title: post.metadata.title as string,
        description: post.metadata.summary,
        baseURL: baseURL,
        image: `${baseURL}/og?slug=${post.slug}&type=post`,
        path: `${blog.path}/${post.slug}`,
    });
}

interface BlogLayoutProps {
    children: React.ReactNode;
    params: Promise<{ slug: string }>
}

export default async function BlogLayout({ children, params }: BlogLayoutProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug)
    if (!post) {
        notFound();
    }
    const publishedAt = post.metadata.publishedAt ? new Date(post.metadata.publishedAt) : new Date();
    const modifiedAt = post.metadata.updatedAt ? new Date(post.metadata.updatedAt) : new Date();

    const reactions = await getReactions(slug);
    const { comments } = await getComments({ slug })
    const related = await getRelatedPost({ slug })
    const avatars =
        post.metadata.team?.map((person) => ({
            src: person.avatar,
        })) || [];

    return <Row as="article" fillWidth zIndex={0}>
        <Row maxWidth={12} m={{ hide: true }} />
        <Row fillWidth horizontal="center">
            <Column maxWidth="xs" gap="l" paddingX="s">
                <Schema
                    as="blogPosting"
                    baseURL={baseURL}
                    path={`${blog.path}/${post.slug}`}
                    title={post.metadata.title as string}
                    description={post.metadata.summary}
                    datePublished={publishedAt.toISOString()}
                    dateModified={modifiedAt.toISOString()}
                    image={`${baseURL}/og?title=${encodeURIComponent(post.metadata.title as string)}`}
                    author={{
                        name: person.name,
                        url: `${baseURL}${blog.path}`,
                        image: `${baseURL}${person.avatar}`,
                    }}
                    reactions={reactions}
                />
                <Button rounded href="/blog" weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft">
                    Publications
                </Button>
                <Heading as="h1" variant="display-strong-s">{post.metadata.title as string}</Heading>
                <Column as="header" gap="xs">
                    <Row gap="xs" vertical="center" wrap>
                        {avatars.length > 0 && <AvatarGroup size="s" avatars={avatars} />}
                        <Text variant="body-default-s" onBackground="neutral-weak">
                            {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
                        </Text>
                        {post.metadata.tags?.map(({ name }) => <Tag key={name} variant="info"><SmartLink href={"/blog/tags/" + name}>{name}</SmartLink></Tag>)}
                    </Row>
                    <SocialShareBar />
                </Column>
                {children}
                <ScrollToHash />
                <Column as="footer" gap="l">
                    <Reactions postSlug={post.slug} reactions={reactions} />
                    <CommentSection slug={post.slug} comments={comments} />
                    {post.metadata.sources && post.metadata.sources.length > 0 && (
                        <SourcesComponent sources={post.metadata.sources} />
                    )}
                    <Grid gap="8" columns={"2"} paddingTop="16" s={{ columns: "1" }} >
                        {related?.map((post: any) => <Post
                            key={post.slug}
                            post={post}
                            thumbnail={true}
                            direction={"column"}
                            excludeNav
                        />)}
                    </Grid>
                </Column>
            </Column>
        </Row>
        <Column as="aside" maxWidth={12} paddingLeft="40" fitHeight position="sticky" top="80" gap="16" m={{ hide: true }} aria-label="Navigation dans l'article">
            <Row
                gap="12"
                paddingLeft="2"
                vertical="center"
                onBackground="neutral-medium"
                textVariant="label-default-s"
            >
                <Icon name="document" size="xs" />
                Navigation
            </Row>
            <HeadingNav fitHeight />
        </Column>
    </Row>
}

function SourcesComponent({ sources }: { sources: string[] }) {
    return (<Column>
        <Text variant="heading-strong-l">Sources :</Text>
        <Grid fillWidth columns="2" gap="16" className="mt-8" s={{ columns: "1" }}>
            <>{sources.map((source, index) => <OgCard key={index} url={source} />)}</>
        </Grid>
    </Column>)
}