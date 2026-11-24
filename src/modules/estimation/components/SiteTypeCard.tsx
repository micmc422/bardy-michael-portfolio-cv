import Link from "next/link";
import { Icon, type IconName } from "@once-ui-system/core";
import { ArrowIcon } from "@/modules/home/components/ArrowIcon";
import panel from "@/shared/components/PageHeader.module.scss";
import type { PricingTier } from "../models/estimationData";
import styles from "../estimation.module.scss";

export function SiteTypeCard({ name, slug, basePrice, icon, description, includes, serviceType }: PricingTier) {
  const isMonthly = serviceType === "Maintenance";
  return (
    <Link
      href={`/estimation/${slug}`}
      className={`${panel.panel} ${panel.lift} ${styles.typeCard}`}
      aria-label={`Estimer un projet ${name}, à partir de ${basePrice} euros`}
    >
      <div className={styles.typeHead}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--static-space-12)" }}>
          <span className={styles.iconChip}>
            <Icon name={icon as IconName} size="s" />
          </span>
          <h2 className={styles.typeTitle}>{name}</h2>
        </div>
        <span className={styles.price}>
          à partir de
          <strong>
            {basePrice} €{isMonthly ? " /mois" : ""}
          </strong>
        </span>
      </div>
      <p className={styles.typeDesc}>{description}</p>
      <ul className={styles.checkList}>
        {includes.map((item) => (
          <li key={item}>
            <Icon name="check" size="xs" />
            {item}
          </li>
        ))}
      </ul>
      <span className={styles.cardCta}>
        Configurer mon estimation
        <ArrowIcon />
      </span>
    </Link>
  );
}
