"use client";

import { useRouter, useSearchParams } from "next/navigation";

/** Ajoute ou retire une option dans l'URL (`?options=a&options=b`) sans recharger la page. */
export function useToggleOptionParam() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (option: string, checked: boolean) => {
    const current = new URLSearchParams(searchParams.toString());
    const existing = current.getAll("options");
    const updated = checked ? [...new Set([...existing, option])] : existing.filter((opt) => opt !== option);

    current.delete("options");
    for (const opt of updated) current.append("options", opt);

    const query = current.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  };
}
