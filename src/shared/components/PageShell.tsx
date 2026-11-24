import type { ReactNode } from "react";
import styles from "./PageShell.module.scss";

type PageShellProps = {
  children: ReactNode;
  labelledBy?: string;
  narrow?: boolean;
};

export function PageShell({ children, labelledBy, narrow }: PageShellProps) {
  return (
    <section className={`${styles.shell} ${narrow ? styles.narrow : ""}`} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}

type PageBlockProps = {
  children: ReactNode;
  labelledBy?: string;
  id?: string;
};

export function PageBlock({ children, labelledBy, id }: PageBlockProps) {
  return (
    <section id={id} className={styles.block} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}
