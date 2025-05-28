// pages/index.js

export async function getStaticProps() {
    const res = await fetch('https://votre-site.com/wp-json/wp/v2/posts');
    const posts = await res.json();
    return {
        props: { posts },
        revalidate: 120, // ISR : régénération toutes les 2 minutes
    };
}

export default function Home({ posts }) {
    return (
        <main>
            {posts.map(post => (
                <article key={post.id}>
                    <h2>{post.title.rendered}</h2>
                    <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                </article>
            ))}
        </main>
    );
}

