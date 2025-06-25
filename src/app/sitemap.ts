import { getPosts, getProjects, getTags } from "@/app/utils/serverActions";
import { baseURL, routes as routesConfig } from "@/app/resources";


export default async function sitemap() {
  const blogs = (await getPosts({ limit: "all" })).map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const tags = (await getTags({ limit: "all" })).map((tag) => ({
    url: `${baseURL}/blog/tags/${tag.name}`
  }))

  const works = (await getProjects({ limit: "all" })).map((post) => ({
    url: `${baseURL}/realisations/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const activeRoutes = Object.keys(routesConfig).filter((route) => routesConfig[route as keyof typeof routesConfig]);

  const routesPromise = activeRoutes.map(async (route) => {
    const lastModified = await getFileData(route !== "/" ? route : "")
    return ({
      url: `${baseURL}${route !== "/" ? route : ""}`,
      lastModified
    })
  });
  const routes = await Promise.all([...routesPromise])
  return [...routes, ...blogs, ...tags, ...works];
}

async function getFileData(route: string) {

  const url = process.env.GITHUB_API!;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Stocke ton token ici de préférence
  const query = `
  {
    repository(owner: "micmc422", name: "bardy-michael-portfolio-cv") {
      defaultBranchRef {
        target {
          ... on Commit {
            history(path: "src/app${route}/page.tsx", first: 1) {
              nodes {
                committedDate
                author {
                  name
                }
                oid
              }
            }
          }
        }
      }
    }
  }
  `;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const node = data.data.repository.defaultBranchRef.target.history.nodes[0];
  console.log(node)

  console.log(`📅 Dernière modification : ${node.committedDate}`);
  console.log(`👤 Auteur : ${node.author.name}`);
  console.log(`🔗 Commit : ${node.oid}`);
  return node.committedDate
}