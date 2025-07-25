import type { ReactNode } from "react";
import { baseURL } from "../resources";
import { about, person } from "../resources/content";
import { Schema } from "@/once-ui/modules";

export default async function AproposLayout({ children }: { children: ReactNode }) {
    return <>
        <Schema
            as="aboutPage"
            baseURL={baseURL}
            path={about.path}
            title={about.title}
            description={about.description}
            image={`${baseURL}/og?title=${encodeURIComponent(about.title)}`}
            author={{
                name: person.name,
                url: `${baseURL}${about.path}`,
                image: `${baseURL}${person.avatar}`,
            }}
        />
        {children}
    </>
}