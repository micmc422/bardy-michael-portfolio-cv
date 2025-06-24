import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { AvatarGroup, Button, Column, Grid, Heading, HeadingNav, Icon, OgCard, Row, SmartLink, Tag, Text } from "@/once-ui/components";
import { about, blog, person, baseURL } from "@/app/resources";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { Meta, Schema } from "@/once-ui/modules";
import { getComments, getPostBySlug, getPosts, getRelatedPost } from "@/app/utils/serverActions";
import { Metadata } from "next";
import CommentSection from "@/components/CommentSection";
import Post from "@/components/blog/Post";
import { SocialShareBar } from "@/components/SocialShare";
import { Reactions } from "@/components/reactions/Reactions";
import { getReactions } from "@/components/reactions/serverActions";


async function getAllPostsSlugs(): Promise<{ slug: string }[]> {
  const projects = await getPosts({});
  return projects.map(({ slug }) => ({ slug }));
}

async function getPostData(slug: string) {
  return await getPostBySlug(slug);
}
async function fetchComments(slug: string) {
  const { comments } = await getComments({ slug });
  return comments;
}

async function relatedPost(slug: string) {
  const posts = await getRelatedPost({ slug });
  return posts
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return await getAllPostsSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostData(slug)
  if (!post) return {};
  return Meta.generate({
    title: post.metadata.title as string,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: `${baseURL}/og?slug=${post.slug}&type=post`,
    path: `${blog.path}/${post.slug}`,
  });
}

export default async function Blog({
  params
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData(slug)
  if (!post) {
    notFound();
  }
  const comments = await fetchComments(slug)
  const related = await relatedPost(slug)
  const reactionsCount = await getReactions(slug);

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
            datePublished={post.metadata.publishedAt as string}
            dateModified={post.metadata.publishedAt as string}
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
          <Column gap="xs">
            <Row gap="12" vertical="center">
              {avatars.length > 0 && <AvatarGroup size="s" avatars={avatars} />}
              <Text variant="body-default-s" onBackground="neutral-weak">
                {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
              </Text>
              {post.metadata.tags?.map(({ name }) => <Tag key={name} variant="accent"><SmartLink style={{ marginBottom: "-3px", display: "flex" }} href={"/blog/tags/" + name}>{name}</SmartLink></Tag>)}
            </Row>
            <SocialShareBar />
          </Column>
          <Column as="article" fillWidth>
            <CustomMDX source={post.content || ""} />
            {post.metadata.sources && post.metadata.sources.length > 0 && (
              <SourcesComponent sources={post.metadata.sources} />
            )}
            <Reactions postSlug={post.slug} reactionsCount={reactionsCount} />
            <CommentSection slug={post.slug} comments={comments} />
            <Grid gap="8" columns={"2"} paddingTop="16" mobileColumns={"1"}>
              {related?.map((post: any) => <Post
                key={post.slug}
                post={post}
                thumbnail={true}
                direction={"column"}
                excludeNav
              />)}
            </Grid>
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
          <Icon name="document" size="xs" />
          Navigation
        </Row>
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}

function SourcesComponent({ sources }: { sources: string[] }) {
  return (<Column>
    <Text variant="heading-strong-l">Sources :</Text>
    <Grid fillWidth columns="2" gap="16" className="mt-8">
      <>{sources.map((source, index) => <OgCard key={index} url={source} />)}</>
    </Grid>
  </Column>)
}