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

  const routes = activeRoutes.map((route) => ({
    url: `${baseURL}${route !== "/" ? route : ""}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs, ...tags, ...works];
}
