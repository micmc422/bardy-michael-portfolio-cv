import { Column } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { about, person, work } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import { Projects } from "@/components/work/Projects";

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: "https://" + baseURL,
    image: `https://${baseURL}/og?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

export default function Work() {
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={"https://"+baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`https://${baseURL}/og?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `https://${baseURL}${about.path}`,
          image: `https://${baseURL}${person.avatar}`,
        }}
      />
      <Projects />
    </Column>
  );
}
