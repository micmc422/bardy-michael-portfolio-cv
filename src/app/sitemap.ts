import { getPosts, getProjects } from "@/app/utils/serverActions";
import { baseURL, routes as routesConfig } from "@/app/resources";

export const revalidate = 3600;

export default async function sitemap() {
  const blogs = (await getPosts({ limit: "all" })).map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const works = (await getProjects({ limit: "all" })).map((post) => ({
    url: `${baseURL}/work/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const activeRoutes = Object.keys(routesConfig).filter((route) => routesConfig[route as keyof typeof routesConfig]);

  const routes = activeRoutes.map((route) => ({
    url: `${baseURL}${route !== "/" ? route : ""}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs, ...works];
}
