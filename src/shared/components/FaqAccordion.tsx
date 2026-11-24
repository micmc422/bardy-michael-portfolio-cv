import type { ReactNode } from "react";
import styles from "./faqAccordion.module.scss";

export type FaqAccordionItem = {
  title: ReactNode;
  content: ReactNode;
  link?: { label?: string; path?: string };
};

interface FaqAccordionProps {
  items: FaqAccordionItem[];
  /** Un seul panneau ouvert à la fois (attribut name des balises details) */
  group?: string;
  defaultOpenFirst?: boolean;
}

export function FaqAccordion({ items, group, defaultOpenFirst = false }: FaqAccordionProps) {
  return (
    <div className={styles.list}>
      {items.map((item, index) => (
        <details
          key={index}
          className={styles.item}
          name={group}
          open={defaultOpenFirst && index === 0 ? true : undefined}
        >
          <summary className={styles.summary}>
            <span className={styles.index} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={styles.question}>{item.title}</span>
            <span className={styles.toggle} aria-hidden="true" />
          </summary>
          <div className={styles.answer}>
            <div className={styles.answerInner}>
              {typeof item.content === "string" ? <p>{item.content}</p> : item.content}
              {item.link?.path && (
                <a className={styles.link} href={item.link.path}>
                  {item.link.label ?? "En savoir plus"}
                </a>
              )}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
