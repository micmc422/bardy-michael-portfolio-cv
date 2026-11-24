import { FaqAccordion } from "@/shared/components/FaqAccordion";
import { SectionHead } from "@/shared/components/PageHeader";
import { buildFaqSchema } from "@/modules/blog/components/Faq";
import { ArrowIcon } from "@/modules/home/components/ArrowIcon";
import { estimationFaq } from "../models/estimationContent";
import styles from "../estimation.module.scss";

export function EstimationFaq() {
  return (
    <section className={styles.faq} aria-labelledby="estimation-faq-title">
      <div className={styles.faqIntro}>
        <SectionHead
          id="estimation-faq-title"
          eyebrow="FAQ"
          title="Vos questions sur l'estimation."
          lead="Tarifs, périmètre, délais : l'essentiel avant de demander un devis."
        />
        <a href="#RDV" className={styles.help}>
          Une autre question ? Parlons-en
          <ArrowIcon />
        </a>
      </div>
      <FaqAccordion items={estimationFaq} group="estimation-faq" defaultOpenFirst />
      {buildFaqSchema(estimationFaq, "estimation")}
    </section>
  );
}
