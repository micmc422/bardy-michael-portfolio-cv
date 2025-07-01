import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { Column, Grid, OgCard, Text } from "@/once-ui/components";
import { getPostBySlug } from "@/app/utils/serverActions";




export default async function Blog({
  params
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug)
  if (!post) {
    notFound();
  }

  return (
    <Column as="article" fillWidth>
      <CustomMDX source={post.content || ""} />
      {post.metadata.sources && post.metadata.sources.length > 0 && (
        <SourcesComponent sources={post.metadata.sources} />
      )}
    </Column>
  );
}

function SourcesComponent({ sources }: { sources: string[] }) {
  return (<Column>
    <Text variant="heading-strong-l">Sources :</Text>
    <Grid fillWidth columns="2" gap="16" className="mt-8" mobileColumns={"1"}>
      <>{sources.map((source, index) => <OgCard key={index} url={source} />)}</>
    </Grid>
  </Column>)
}