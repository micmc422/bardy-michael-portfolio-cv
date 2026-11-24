"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import styles from "../showcase.module.scss";

const NetworkGlobe = dynamic(() => import("./three/NetworkGlobe"), {
  ssr: false,
  loading: () => <div className={styles.globePlaceholder} />,
});

export function GlobeCanvas() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: "200px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} className={styles.canvasWrap}>
      {visible ? <NetworkGlobe reducedMotion={reducedMotion} /> : <div className={styles.globePlaceholder} />}
    </div>
  );
}
