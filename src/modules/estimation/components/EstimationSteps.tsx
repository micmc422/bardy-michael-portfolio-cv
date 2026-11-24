import { estimationSteps } from "../models/estimationContent";
import styles from "../estimation.module.scss";

export function EstimationSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className={styles.steps} aria-label="Étapes de l'estimation">
      {estimationSteps.map(({ label, hint }, index) => {
        const position = index + 1;
        const state = position === current ? "step" : undefined;
        return (
          <li
            key={label}
            className={`${styles.step} ${position < current ? styles.stepDone : ""}`}
            aria-current={state}
          >
            <span className={styles.stepIndex} aria-hidden="true">
              {position}
            </span>
            <span className={styles.stepText}>
              <span className={styles.stepLabel}>{label}</span>
              <span className={styles.stepHint}>{hint}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
