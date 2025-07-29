import { getPosts, getProjects } from "@/app/utils/serverActions";
import { baseURL, routes as routesConfig } from "@/app/resources";
import { siteTypes } from "./estimation/estimationData";


export default async function sitemap() {
  const posts = (await getPosts({ limit: "all" })).map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

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
  const estimationsPromises = siteTypes.map(async ({ slug }) => {
    const lastModified = await getFileData(`/estimation`)
    return ({
      url: `${baseURL}/estimation/${slug}`,
      lastModified
    })
  });

  const routes = await Promise.all([...routesPromise])
  const estimations = await Promise.all([...estimationsPromises])
  return [...routes, ...posts, ...works, ...estimations];
}

export async function getFileData(route: string) {

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
  if (!node) {
    console.warn(`No commit found for path: src/app${route}/page.tsx`);
    return new Date().toISOString(); // Retourne la date actuelle si aucune donnée n'est trouvée
  }
  return node.committedDate
}