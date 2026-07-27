import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { Column } from "@once-ui-system/core";
import { getPostBySlug } from "@/app/utils/serverActions";




export default async function Blog({
  params
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postResult = await getPostBySlug(slug);
  if (!postResult) notFound();
  const post = postResult;

  return (
    <Column as="article" fillWidth>
      <CustomMDX source={post.content || ""} />
    </Column>
  );
}

