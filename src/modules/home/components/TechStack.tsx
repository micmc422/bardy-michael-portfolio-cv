import styles from "../home.module.scss";

const stack = [
  "Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Neon", "Vercel", "WordPress",
  "Sass", "MDX", "Vitest", "Puppeteer", "Stripe", "Cal.com", "Git",
];

export function TechStack() {
  const loop = [...stack, ...stack];
  return (
    <section className={styles.marquee} aria-label="Technologies maîtrisées">
      <div className={styles.track}>
        {loop.map((name, i) => (
          <span key={`${name}-${i}`} className={styles.tech} aria-hidden={i >= stack.length}>
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
