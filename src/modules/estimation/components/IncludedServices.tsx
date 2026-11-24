import { Icon } from "@once-ui-system/core";
import { SectionHead } from "@/shared/components/PageHeader";
import panel from "@/shared/components/PageHeader.module.scss";
import { includedServices } from "../models/estimationContent";
import styles from "../estimation.module.scss";

export function IncludedServices() {
  return (
    <section className={styles.block} aria-labelledby="services-inclus-title">
      <SectionHead
        id="services-inclus-title"
        eyebrow="Inclus dans chaque projet"
        title="Ce que comprend toute estimation."
        lead="Quel que soit le type de site, ces fondamentaux sont toujours livrés."
      />
      <div className={styles.included}>
        {includedServices.map(({ name, icon, description }) => (
          <article key={name} className={`${panel.panel} ${panel.lift} ${styles.includedCard}`}>
            <span className={styles.iconChip}>
              <Icon name={icon} size="s" />
            </span>
            <h3>{name}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
