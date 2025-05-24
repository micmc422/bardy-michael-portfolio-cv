"use client";

import { Grid } from '@/once-ui/components';
import Post from './Post';
import { Suspense, use } from 'react';
import useSWR from "swr";
import { Metadata } from 'next';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface PostsProps {
    range?: [number] | [number, number];
    columns?: '1' | '2' | '3';
    thumbnail?: boolean;
    direction?: 'row' | 'column';
}

interface Posts {
    metadata: Metadata & {
        projectURL?: string;
        publishedAt: string;
        summary: string;
        images: string[];
        team: {
            avatar: string;
        }[],
        link?: string;
    };
    slug: string;
    content: string;
}[]
  
export function Posts({
    range,
    columns = '1',
    thumbnail = false,
    direction
}: PostsProps) {
    const { data, error, isLoading } = useSWR<Posts[]>('/api/posts', fetcher)
    console.log(data);
    if (!data || isLoading) {
        return <>loading</>
    }

    const sortedBlogs = data.sort((a:any, b:any) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

    const displayedBlogs = range
        ? sortedBlogs.slice(
            range[0] - 1,
            range.length === 2 ? range[1] : sortedBlogs.length
        )
        : sortedBlogs;

    return (
        <Suspense fallback={null}>
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
        </Suspense>
    );
}