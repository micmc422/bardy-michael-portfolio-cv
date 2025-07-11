import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { type IframeHTMLAttributes, type ReactNode } from "react";
import dynamic from "next/dynamic";
import remarkGfm from 'remark-gfm'
import {
  Heading,
  HeadingLink,
  SmartImage,
  SmartLink,
  Text,
  InlineCode,
} from "@/once-ui/components";
import { CodeBlock } from "@/once-ui/modules/code/CodeBlock";
import type { TextProps } from "@/once-ui/interfaces";
import type { SmartImageProps } from "@/once-ui/components/SmartImage";
import { RawGithubFile } from "./RawGithubFile";
import GitHubRepoSummary from "./gitHubResume";
import { Faq } from "./Faq";
import { StepsComponent } from "./steps/Steps";
import { slugify } from "@/utils/utils";

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.endsWith(".git")) {
    const path = href.replace("https://github.com/", "").replace(".git", "")
    const [ownerProvided, repoProvided] = path.split("/")

    return <>
      <br />
      <GitHubRepoSummary ownerProvided={ownerProvided} repoProvided={repoProvided} />
    </>
  }
  if (href.startsWith("https://www.wisp.blog")) {
    return <>
      <br />
      <a href={href} {...props} style={{ marginTop: "2rem", display: "block", textAlign: "center" }} rel="nofollow noreferrer" target="_blank">
        {children}
      </a>
    </>
  }
  if (href.startsWith("https://raw.githubusercontent.com")) {
    return <RawGithubFile rawCodeUrl={href} label={children} />
  }
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }
  if (href.startsWith("https://codepen.io")) {
    const codepenUrl = href.split("?")[0]
    return (<>
      <br />
      <iframe height="300" style={{ width: "100%" }} scrolling="no" title="CSS clamp()" src={href} frameBorder="no" loading="lazy" allowTransparency={true} allowFullScreen={true}>
        See the Pen <a href={codepenUrl}>
          {children}</a>
      </iframe>      <br />
    </>);
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  if (props.style) {
    return (
      <a href={href}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function createImage({ alt, src, ...props }: SmartImageProps & { src: string }) {
  if (!src) {
    console.error("SmartImage requires a valid 'src' property.");
    return null;
  }

  return (
    <SmartImage
      marginTop="8"
      marginBottom="16"
      enlarge
      radius="m"
      aspectRatio="16 / 9"
      border="neutral-alpha-medium"
      sizes="(max-width: 960px) 100vw, 960px"
      alt={alt}
      src={src}
      {...props}
    />
  );
}


function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({ children, ...props }: TextProps<typeof as>) => {
    const slug =
      children &&
        typeof children === "object" &&
        "props" in children &&
        children.props &&
        typeof (children as { props?: any }).props.children === "string"
        ? slugify((children as { props: { children: string } }).props.children)
        : slugify(typeof children === "string" ? children : "");
    return (
      <HeadingLink
        style={{ marginTop: "var(--static-space-24)", marginBottom: "var(--static-space-12)" }}
        as={as}
        id={slug}
        {...props}
      >
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}
function createIframe(props: IframeHTMLAttributes<HTMLIFrameElement>) {
  return <iframe {...props} loading="lazy" allowTransparency={true} allowFullScreen={true}></iframe>;
}

function createCodeBlock(props: any) {
  // For pre tags that contain code blocks
  if (props.children && props.children.props && props.children.props.className) {
    const { className, children } = props.children.props;
    // Extract language from className (format: language-xxx)
    const [language, labelBase] = className.replace('language-', '').split(':');
    const fileName = labelBase ? labelBase.replace(/-/g, ' ') : '';
    const label = language.charAt(0).toUpperCase() + language.slice(1) + (fileName ? ` | ${fileName}` : "");
    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codeInstances={[
          {
            code: children,
            language,
            label
          }
        ]}
        copyButton={true}
      />
    );
  }

  // Fallback for other pre tags or empty code blocks
  return <pre {...props} />;
}

const components = {
  iframe: createIframe as any,
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,
  table: dynamic(() => import("@/components").then(mod => mod.ReactNodeTableToOnceUI)),
  img: createImage as any,
  a: CustomLink as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  Faq: Faq as any,
  Steps: StepsComponent as any,
  Heading,
  Text,
  CodeBlock,
  InlineCode,
  Accordion: dynamic(() => import("@/once-ui/components").then(mod => mod.Accordion)),
  AccordionGroup: dynamic(() => import("@/once-ui/components").then(mod => mod.AccordionGroup)),
  Table: dynamic(() => import("@/once-ui/components").then(mod => mod.Table)),
  Feedback: dynamic(() => import("@/once-ui/components").then(mod => mod.Feedback)),
  Button: dynamic(() => import("@/once-ui/components").then(mod => mod.Button)),
  Card: dynamic(() => import("@/once-ui/components").then(mod => mod.Card)),
  Grid: dynamic(() => import("@/once-ui/components").then(mod => mod.Grid)),
  Row: dynamic(() => import("@/once-ui/components").then(mod => mod.Row)),
  Column: dynamic(() => import("@/once-ui/components").then(mod => mod.Column)),
  Icon: dynamic(() => import("@/once-ui/components").then(mod => mod.Icon)),
  SmartImage: dynamic(() => import("@/once-ui/components").then(mod => mod.SmartImage)),
  SmartLink: dynamic(() => import("@/once-ui/components").then(mod => mod.SmartLink)),
  OgCard: dynamic(() => import("@/once-ui/components").then(mod => mod.OgCard)),
  RDV: dynamic(() => import("@/components").then(mod => mod.RDV)),
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
};
const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
};

export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={options} />
  );
}