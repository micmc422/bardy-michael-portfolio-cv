import type { ReactNode } from "react";
import { EstimationFaq, IncludedServices } from "@/modules/estimation/components";
import styles from "@/modules/estimation/estimation.module.scss";

export default function EstimationLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      {children}
      <IncludedServices />
      <EstimationFaq />
    </div>
  );
}
