import type { ReactNode } from "react";
import styles from "./PageHeader.module.scss";

type PageHeaderProps = {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "start" | "center";
  children?: ReactNode;
  srOnlyTitle?: boolean;
};

export function PageHeader({ id, eyebrow, title, lead, align = "start", children, srOnlyTitle }: PageHeaderProps) {
  return (
    <header className={`${styles.header} ${align === "center" ? styles.center : ""}`}>
      <div className={styles.glow} aria-hidden="true" />
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h1 id={id} className={srOnlyTitle ? "sr-only" : styles.title}>
        {title}
      </h1>
      {lead && <p className={styles.lead}>{lead}</p>}
      {children && <div className={styles.actions}>{children}</div>}
    </header>
  );
}

type SectionHeadProps = {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "start" | "center";
};

export function SectionHead({ id, eyebrow, title, lead, align = "start" }: SectionHeadProps) {
  return (
    <div className={`${styles.sectionHead} ${align === "center" ? styles.center : ""}`}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 id={id}>{title}</h2>
      {lead && <p>{lead}</p>}
    </div>
  );
}
