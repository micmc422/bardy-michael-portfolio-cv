import { Column } from "@/once-ui/components";
import { baseURL, display } from "@/app/resources";
import { about, person, work } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import { Projects } from "@/components/work/Projects";

export async function generateMetadata() {
  return {
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  };
}
const demanderUnDevis = {
  display: true,
  title: "Demandez un devis",
  description: "Je vous propose un rapide échange pour discuter de votre projet. Cela me permettra de mieux comprendre vos attentes et de vous envoyer un devis sur-mesure.",
  href: `${about.calendar.link}/discutons-d-un-devis`
}
export default async function Work() {
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`${baseURL}/og?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Projects />
    </Column>
  );
}
