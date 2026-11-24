"use client";

import { Button, Icon, IconButton, Input, useToast, type IconName } from "@once-ui-system/core";
import { LetterFx } from "@once-ui-system/fx";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { baseURL } from "@/core/config";
import { estimation } from "@/core/config/content";
import { isValidEmail, toQueryParams } from "@/core/utils/utils";
import { siteTypes } from "../models/estimationData";
import { computeTotals, formatPrice, getPriceValidUntilDate } from "../utils/pricing";
import styles from "../estimation.module.scss";

export function ResumePanel({ slug }: { slug: string }) {
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const selectedSlugs = useMemo(() => searchParams.getAll("options"), [searchParams]);
  const [email, setEmail] = useState<string>();
  const [loading, startTransition] = useTransition();

  const site = useMemo(() => siteTypes.find((item) => item.slug === slug), [slug]);
  const activeOptions = useMemo(
    () => site?.options.filter((option) => selectedSlugs.includes(option.slug)) ?? [],
    [site, selectedSlugs],
  );
  const totals = useMemo(() => (site ? computeTotals(site, activeOptions) : null), [site, activeOptions]);
  const query = toQueryParams("options", selectedSlugs);

  if (!site || !totals) {
    return <p className={styles.emptyHint}>Sélectionnez un type de site pour démarrer.</p>;
  }

  function handleSubmit() {
    startTransition(async () => {
      try {
        const comments = document.getElementById("commentaire-estimation") as HTMLTextAreaElement | null;
        const response = await fetch(`/api/estimation/${slug}?${query}`, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ email: `${email}`, commentaires: `${comments?.value ?? ""}` }),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        addToast({
          tone: "success",
          message: "Votre estimation a bien été transmise. Je reviens vers vous avec un devis dans les meilleurs délais.",
        });
      } catch (error) {
        console.error(error);
        addToast({ tone: "danger", message: "L'envoi a échoué. Réessayez ou prenez rendez-vous directement." });
      }
    });
  }

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Création de site ${site.name}`,
    description: site.description,
    image: `${baseURL}/og?type=estimation&slug=${site.slug}`,
    brand: { "@type": "Organization", name: "Occitaweb" },
    category: "Création de site web sur mesure",
    offers: {
      "@type": "Offer",
      price: totals.oneShot,
      priceCurrency: "EUR",
      priceValidUntil: getPriceValidUntilDate(),
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
        price: site.basePrice,
        valueAddedTaxIncluded: false,
      },
      availability: "https://schema.org/InStock",
      url: `${baseURL}${estimation.path}/${slug}${query ? `?${query}` : ""}`,
      addOn: activeOptions.map((option) => ({
        "@type": "Offer",
        name: option.name,
        description: option.description,
        price: option.price,
        priceCurrency: "EUR",
        priceValidUntil: getPriceValidUntilDate(),
        availability: "https://schema.org/InStock",
        url: `${baseURL}${estimation.path}/${slug}?options=${option.slug}`,
      })),
    },
  });

  return (
    <div className={styles.resume}>
      <h2 className={styles.resumeTitle}>
        <span className={styles.eyebrow}>Récapitulatif</span>
        Votre estimation
      </h2>

      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt style={{ display: "flex", alignItems: "center", gap: "var(--static-space-8)", fontWeight: 600 }}>
            <Icon name={site.icon as IconName} size="xs" onBackground="brand-strong" />
            {site.name}
          </dt>
          <dd>{formatPrice(site.basePrice)}</dd>
        </div>
        {activeOptions.map(({ slug: optionSlug, name, price, periodicite }) => (
          <div key={optionSlug} className={`${styles.line} ${styles.lineMuted}`}>
            <dt>
              <LetterFx speed="fast" trigger="instant">
                {name}
              </LetterFx>
            </dt>
            <dd>
              {formatPrice(price)}
              {periodicite === "mensuelle" && " /mois"}
              {periodicite === "annuelle" && " /an"}
            </dd>
          </div>
        ))}
      </dl>

      <hr className={styles.divider} />

      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt>Création (HT)</dt>
          <dd>{formatPrice(totals.oneShot)}</dd>
        </div>
        <div className={styles.line}>
          <dt style={{ display: "flex", alignItems: "center" }}>
            Abonnement annuel (HT)
            <IconButton
              variant="ghost"
              icon="infoCircle"
              size="s"
              tooltip="Hébergement, maintenance et options récurrentes, facturés chaque année."
              tooltipPosition="bottom"
            />
          </dt>
          <dd>{formatPrice(totals.yearly)}</dd>
        </div>
        <div className={styles.line}>
          <dt>TVA 20 %</dt>
          <dd>{formatPrice(totals.vat)}</dd>
        </div>
      </dl>

      <div className={styles.total}>
        <span className={styles.totalLabel}>
          Total TTC
          <small>1re année, abonnement inclus</small>
        </span>
        <span className={styles.totalValue}>
          <LetterFx key={totals.firstYearTTC} speed="fast" trigger="instant">
            {formatPrice(totals.firstYearTTC)}
          </LetterFx>
        </span>
      </div>

      {totals.yearly > 0 && (
        <p className={styles.emptyHint}>
          Puis {formatPrice(totals.yearlyTTC)} TTC par an à partir de la deuxième année.
        </p>
      )}

      <hr className={styles.divider} />

      <div className={styles.quoteForm}>
        <p className={styles.note}>
          <Icon name="check" size="xs" onBackground="success-strong" />
          Votre adresse courriel est utilisée uniquement pour vous transmettre le devis.
        </p>
        <Input
          id="Courriel"
          label="Courriel"
          type="email"
          prefix={<Icon marginLeft="4" onBackground="neutral-weak" name="mail" size="xs" />}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button
          prefixIcon="document"
          fillWidth
          loading={loading}
          disabled={!isValidEmail(email) || loading}
          onClick={handleSubmit}
        >
          Demander un devis
        </Button>
      </div>

      <script
        id={`Estimation-${site.slug}`}
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
    </div>
  );
}
