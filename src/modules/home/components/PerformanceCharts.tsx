"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import home from "../home.module.scss";
import styles from "../showcase.module.scss";

const BRAND = "var(--brand-solid-strong, #ff7a3d)";
const ACCENT = "var(--accent-solid-strong, #7c8cff)";
const MUTED = "var(--neutral-alpha-strong, rgba(255,255,255,0.35))";
const AXIS = "var(--neutral-on-background-weak, #9aa4b8)";
const GRID = "var(--neutral-alpha-weak, rgba(255,255,255,0.08))";

const latency = [
  { region: "Paris", origine: 38, edge: 14 },
  { region: "New York", origine: 168, edge: 22 },
  { region: "São Paulo", origine: 262, edge: 31 },
  { region: "Singapour", origine: 342, edge: 27 },
  { region: "Sydney", origine: 391, edge: 34 },
];

const lcp = [
  { page: "Accueil", classique: 4.2, optimise: 1.1 },
  { page: "Blog", classique: 3.8, optimise: 1.0 },
  { page: "Catalogue", classique: 5.1, optimise: 1.4 },
  { page: "Application", classique: 4.6, optimise: 1.2 },
];

const lighthouse = [
  { name: "Performance", score: 98, fill: BRAND },
  { name: "Accessibilité", score: 100, fill: ACCENT },
  { name: "Bonnes pratiques", score: 100, fill: "var(--success-solid-strong, #3ddc97)" },
  { name: "SEO", score: 100, fill: "var(--warning-solid-strong, #ffc857)" },
];

const skills = [
  { axis: "Front-end", value: 95 },
  { axis: "Back-end", value: 88 },
  { axis: "SEO", value: 90 },
  { axis: "Accessibilité", value: 86 },
  { axis: "DevOps", value: 80 },
  { axis: "Design", value: 82 },
];

const tooltipStyle = {
  background: "var(--surface-background, #111)",
  border: "1px solid var(--neutral-alpha-medium, rgba(255,255,255,0.15))",
  borderRadius: 12,
  fontSize: 13,
  color: "var(--neutral-on-background-strong, #fff)",
};

const axisProps = {
  stroke: AXIS,
  tick: { fill: AXIS, fontSize: 12 },
  tickLine: false,
  axisLine: false,
} as const;

function ChartCard({
  className,
  tag,
  title,
  caption,
  label,
  children,
}: {
  className: string | undefined;
  tag: string;
  title: string;
  caption: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <figure className={`${styles.chartCard} ${className}`} aria-label={label}>
      <header className={styles.chartHead}>
        <span className={styles.chartTag}>{tag}</span>
        <h3 className={styles.chartTitle}>{title}</h3>
      </header>
      <div className={styles.chartBody}>{children}</div>
      <figcaption className={styles.chartCaption}>{caption}</figcaption>
    </figure>
  );
}

export function PerformanceCharts() {
  return (
    <section className={`${home.section} ${styles.chartsSection}`} aria-labelledby="perf-title">
      <div className={styles.sectionHead}>
        <span className={home.eyebrow}>Performance</span>
        <h2 className={home.sectionTitle} id="perf-title">
          La vitesse n&apos;est pas un détail, <span className={styles.accent}>c&apos;est un objectif mesuré.</span>
        </h2>
        <p className={home.sectionLead}>
          Chaque projet est conçu autour des Core Web Vitals, de l&apos;accessibilité et du référencement. Voici les
          ordres de grandeur visés et observés sur une architecture Next.js bien optimisée.
        </p>
      </div>

      <div className={styles.chartsGrid}>
        <ChartCard
          className={styles.spanWide}
          tag="Latence"
          title="Temps de réponse selon la région (ms)"
          label="Graphique en aires comparant la latence d'un serveur unique et d'un réseau edge pour cinq régions"
          caption="Valeurs indicatives : un serveur unique situé en Europe face à une diffusion edge."
        >
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 280 }}>
            <AreaChart data={latency} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="gradEdge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BRAND} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradOrigin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="region" {...axisProps} />
              <YAxis {...axisProps} width={44} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: MUTED }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: AXIS }} />
              <Area type="monotone" dataKey="origine" name="Serveur unique" stroke={ACCENT} strokeWidth={2} fill="url(#gradOrigin)" />
              <Area type="monotone" dataKey="edge" name="Réseau edge" stroke={BRAND} strokeWidth={2.5} fill="url(#gradEdge)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          className={styles.spanNarrow}
          tag="Lighthouse"
          title="Scores visés en production"
          label="Graphique radial des scores Lighthouse visés : performance 98, accessibilité 100, bonnes pratiques 100, SEO 100"
          caption="Objectifs de livraison sur mobile, mesurés avec Lighthouse."
        >
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 360, height: 280 }}>
            <RadialBarChart data={lighthouse} innerRadius="24%" outerRadius="88%" startAngle={90} endAngle={-270} barSize={14}>
              <RadialBar dataKey="score" background={{ fill: GRID }} cornerRadius={8} />
              <Legend iconType="circle" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 12, color: AXIS }} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          className={styles.spanNarrow}
          tag="Core Web Vitals"
          title="LCP par type de page (s)"
          label="Graphique en barres comparant le Largest Contentful Paint d'un site classique et d'un site optimisé"
          caption="Seuil « bon » défini par Google : 2,5 s. Valeurs indicatives avant et après optimisation."
        >
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 360, height: 280 }}>
            <BarChart data={lcp} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barGap={4}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="page" {...axisProps} />
              <YAxis {...axisProps} width={44} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: GRID }} />
              <ReferenceLine y={2.5} stroke="var(--success-solid-strong, #3ddc97)" strokeDasharray="4 4" />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: AXIS }} />
              <Bar dataKey="classique" name="Site classique" fill={MUTED} radius={[6, 6, 0, 0]} />
              <Bar dataKey="optimise" name="Optimisé" fill={BRAND} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          className={styles.spanWide}
          tag="Profil"
          title="Champs d'expertise"
          label="Graphique radar des champs d'expertise : front-end, back-end, SEO, accessibilité, DevOps et design"
          caption="Un profil full-stack : de l'interface à la mise en production."
        >
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 280 }}>
            <RadarChart data={skills} outerRadius="80%">
              <PolarGrid stroke={GRID} />
              <PolarAngleAxis dataKey="axis" tick={{ fill: AXIS, fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Radar dataKey="value" name="Niveau" stroke={BRAND} strokeWidth={2} fill={BRAND} fillOpacity={0.28} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}
