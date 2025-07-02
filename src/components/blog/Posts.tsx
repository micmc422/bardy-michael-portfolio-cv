import { Column, Flex, Grid, Skeleton } from '@/once-ui/components';
import Post from './Post';
import { getPosts } from '@/app/utils/serverActions';

interface PostsProps {
    range?: [number] | [number, number];
    columns?: '1' | '2' | '3';
    thumbnail?: boolean;
    direction?: 'row' | 'column';
    tags?: string[];
}

async function fetchPosts(tags?: string[], limit =10) {
    const data = await getPosts({ tags, limit });
    const sortedBlogs = data.sort((a: any, b: any) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });
    return sortedBlogs;
}

export async function Posts({
    range,
    columns = '1',
    thumbnail = false,
    direction,
    tags
}: PostsProps) {
    const sortedBlogs = await fetchPosts(tags, 0)

    const displayedBlogs = range
        ? sortedBlogs.slice(
            range[0] - 1,
            range.length === 2 ? range[1] : sortedBlogs.length
        )
        : sortedBlogs;

    return (
        <>
            {displayedBlogs.length > 0 && (
                <Grid
                    columns={columns} mobileColumns="1"
                    fillWidth marginBottom="40" gap="12">
                    {displayedBlogs.map((post) => (
                        <Post
                            key={post.slug}
                            post={post}
                            thumbnail={thumbnail}
                            direction={direction}
                        />
                    ))}
                </Grid>
            )}
        </>
    );
}

export function SkeletonPosts() {
    return <Column gap='l'>
        <SkeletonPost />
        {[0, 1, 2, 3].map(el => <SkeletonPost direction={"row"} key={el} />)}
    </Column>
}

export function SkeletonPost({ direction = "column", ...attrs }: { direction?: "column" | "row" }) {
    return <Flex
        position="relative"
        transition="micro-medium"
        direction={direction}
        radius="l"
        mobileDirection="column"
        fillWidth
        gap='m'
        center
        {...attrs}>
        <Skeleton shape='block' style={{ borderRadius: "16px" }} minHeight={direction === "column" ? "m" : "xs"} />
        <Column fillWidth gap='s'>
            <Skeleton shape='line' height='l' fillWidth />
            <Skeleton shape='line' height='l' fillWidth />
            {direction !== "column" && <Skeleton shape='line' height='l' width={"m"} />}
        </Column>
    </Flex>
}