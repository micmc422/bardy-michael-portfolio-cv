import type { ReactNode } from "react";
import styles from "../home.module.scss";

interface SectionHeadProps {
  eyebrow: string;
  title: string;
  titleId: string;
  lead?: ReactNode;
  action?: ReactNode;
}

export function SectionHead({ eyebrow, title, titleId, lead, action }: SectionHeadProps) {
  return (
    <div className={styles.sectionHead}>
      <div className={styles.sectionHeadCopy}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 id={titleId} className={styles.sectionTitle}>
          {title}
        </h2>
        {lead && <p className={styles.sectionLead}>{lead}</p>}
      </div>
      {action}
    </div>
  );
}
