"use client";

import { Feedback, Icon, Textarea, type IconName } from "@once-ui-system/core";
import { useSearchParams } from "next/navigation";
import { useToggleOptionParam } from "../hooks/useToggleOptionParam";
import type { Option } from "../models/estimationData";
import { formatPrice } from "../utils/pricing";
import styles from "../estimation.module.scss";

function priceLabel({ price, periodicite }: Option) {
  const suffix = periodicite === "mensuelle" ? " /mois" : periodicite === "annuelle" ? " /an" : "";
  return `+ ${formatPrice(price)}${suffix}`;
}

function OptionCard({ option, checked, onToggle }: { option: Option; checked: boolean; onToggle: (next: boolean) => void }) {
  return (
    <label className={styles.option}>
      <input
        type="checkbox"
        className={styles.optionInput}
        checked={checked}
        onChange={(event) => onToggle(event.target.checked)}
      />
      <span className={styles.optionBox} aria-hidden="true">
        <Icon name="check" size="xs" />
      </span>
      <span className={styles.optionBody}>
        <span className={styles.optionTop}>
          <span className={styles.optionName}>
            <Icon name={option.icon as IconName} size="xs" onBackground="brand-strong" />
            {option.name}
          </span>
          <span className={styles.optionPrice}>{priceLabel(option)}</span>
        </span>
        <span className={styles.optionDesc}>{option.description}</span>
      </span>
    </label>
  );
}

function OptionGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: Option[];
  selected: string[];
  onToggle: (slug: string, next: boolean) => void;
}) {
  if (options.length === 0) return null;
  const count = options.filter((option) => selected.includes(option.slug)).length;
  return (
    <fieldset className={styles.group}>
      <legend className={styles.groupTitle}>
        {title}
        <span className={styles.groupCount}>
          {count}/{options.length}
        </span>
      </legend>
      <div className={styles.optionGrid}>
        {options.map((option) => (
          <OptionCard
            key={option.slug}
            option={option}
            checked={selected.includes(option.slug)}
            onToggle={(next) => onToggle(option.slug, next)}
          />
        ))}
      </div>
    </fieldset>
  );
}

export function OptionsForm({ options }: { options: Option[] }) {
  const selected = useSearchParams().getAll("options");
  const toggleOption = useToggleOptionParam();

  const oneShot = options.filter((option) => !option.periodicite);
  const subscriptions = options.filter((option) => option.periodicite);

  return (
    <>
      <OptionGroup title="Fonctionnalités" options={oneShot} selected={selected} onToggle={toggleOption} />
      <OptionGroup title="Abonnements" options={subscriptions} selected={selected} onToggle={toggleOption} />
      <div className={styles.comments}>
        <Feedback
          title="Compléments"
          description="Ajoutez les informations importantes à communiquer pour la rédaction du devis."
        />
        <Textarea id="commentaire-estimation" label="Informations complémentaires" lines={3} />
      </div>
    </>
  );
}
