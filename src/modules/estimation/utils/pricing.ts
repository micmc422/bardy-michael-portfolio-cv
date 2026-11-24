import type { Option, PricingTier } from "../models/estimationData";

export const VAT_RATE = 0.2;

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number) {
  return euro.format(Math.round(value * 100) / 100);
}

export type EstimationTotals = {
  /** Création : prix de base + options ponctuelles (HT) */
  oneShot: number;
  /** Abonnement annuel : forfait annuel + options annuelles + options mensuelles x 12 (HT) */
  yearly: number;
  firstYearHT: number;
  vat: number;
  firstYearTTC: number;
  yearlyTTC: number;
};

export function computeTotals(site: PricingTier, selected: Option[]): EstimationTotals {
  let oneShot = site.basePrice;
  let yearly = site.annualPrice;
  for (const { price, periodicite } of selected) {
    if (periodicite === "mensuelle") yearly += price * 12;
    else if (periodicite === "annuelle") yearly += price;
    else oneShot += price;
  }
  const firstYearHT = oneShot + yearly;
  const vat = firstYearHT * VAT_RATE;
  return {
    oneShot,
    yearly,
    firstYearHT,
    vat,
    firstYearTTC: firstYearHT + vat,
    yearlyTTC: yearly * (1 + VAT_RATE),
  };
}

export function getPriceValidUntilDate(days = 90) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}
