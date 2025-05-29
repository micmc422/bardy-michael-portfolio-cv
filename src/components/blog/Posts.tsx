import { Grid } from '@/once-ui/components';
import Post from './Post';
import { getPosts } from '@/app/utils/serverActions';
import { use } from 'react';

interface PostsProps {
    range?: [number] | [number, number];
    columns?: '1' | '2' | '3';
    thumbnail?: boolean;
    direction?: 'row' | 'column';
    tags?: string[];
}

async function fetchPosts(tags?:string[]) {
    const data = await getPosts({tags});
    const sortedBlogs = data.sort((a: any, b: any) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });
    return sortedBlogs;
}

export function Posts({
    range,
    columns = '1',
    thumbnail = false,
    direction,
    tags
}: PostsProps) {
    const sortedBlogs = use(fetchPosts(tags))

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