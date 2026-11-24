import type { JSX } from "react";
import { Suspense } from "react";
import { ArrowIcon } from "@/modules/home/components/ArrowIcon";
import homeStyles from "@/modules/home/home.module.scss";
import type { RDVContentType } from "@/app/api/cal/types/route";
import styles from "./Rdv.module.scss";

const CAL_API_KEY = process.env.CAL_API_KEY;
const CAL_API_BASE_URL = "https://api.cal.com/v2";
const CAL_PROFILE_URL = "https://cal.com/occitaweb";

type SectionContentProps = {
  display: boolean;
  title: string | JSX.Element;
  description: string | JSX.Element;
  href?: string;
};

const POINTS = [
  "Cadrage de votre besoin et de vos objectifs",
  "Conseils techniques et budget indicatif",
  "En visio ou par téléphone, à l'heure qui vous convient",
];

async function getRDVContent(): Promise<RDVContentType[]> {
  if (!CAL_API_KEY) return [];
  try {
    const response = await fetch(`${CAL_API_BASE_URL}/event-types`, {
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];

    const { data } = await response.json();
    return data.eventTypeGroups[0].eventTypes
      .filter((event: { hidden?: boolean }) => !event.hidden)
      .map((event: Record<string, unknown>) => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        duration: event.length,
        locations: event.locations,
        requiresConfirmation: event.requiresConfirmation,
        price: event.price,
        currency: event.currency,
      }));
  } catch (error) {
    console.error("Erreur lors de la récupération des types de rendez-vous :", error);
    return [];
  }
}

function cleanDescription(description: unknown) {
  return typeof description === "string" ? description.replaceAll("*", "").trim() : "";
}

async function EventList({ fallbackHref }: { fallbackHref: string }) {
  const events = await getRDVContent();

  if (events.length === 0) {
    return (
      <a href={fallbackHref} target="_blank" rel="noopener noreferrer" className={styles.cta}>
        Choisir un créneau
        <ArrowIcon />
      </a>
    );
  }

  return (
    <ul className={styles.events}>
      {events.map((event) => {
        const description = cleanDescription(event.description);
        return (
          <li key={event.id}>
            <a
              href={`${CAL_PROFILE_URL}/${event.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.event}
            >
              <span className={styles.eventBody}>
                <span className={styles.eventTitle}>
                  {String(event.title).replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "").trim()}
                </span>
                {description && <span className={styles.eventText}>{description}</span>}
              </span>
              <span className={styles.eventSide}>
                <span className={styles.duration}>{event.duration} min</span>
                <span className={styles.eventArrow}>
                  <ArrowIcon />
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function EventSkeleton() {
  return (
    <div className={styles.events} aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement des disponibilités…</span>
      {[0, 1, 2].map((i) => (
        <div key={i} className={styles.skeleton} aria-hidden="true" />
      ))}
    </div>
  );
}

export const RDV = ({ content }: { content: SectionContentProps }) => {
  const href = content.href ?? CAL_PROFILE_URL;

  return (
    <section id="RDV" className={styles.section} aria-labelledby="rdv-title">
      <div className={styles.band}>
        <div className={styles.copy}>
          <span className={homeStyles.eyebrow}>Contact</span>
          <h2 id="rdv-title" className={styles.title}>
            {content.title}
          </h2>
          <p className={styles.lead}>{content.description}</p>
          <ul className={styles.points}>
            {POINTS.map((point) => (
              <li key={point}>
                <span className={styles.check} aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 6.5l2.2 2.2 4.8-5" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.panel}>
          <span className={styles.panelLabel}>Choisissez un format</span>
          <Suspense fallback={<EventSkeleton />}>
            <EventList fallbackHref={href} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};
