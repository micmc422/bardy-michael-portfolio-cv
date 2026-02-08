import { useSearchParams, useRouter } from "next/navigation";

export function useToggleOptionParam() {
    const router = useRouter()
    const searchParams = useSearchParams()

    return (option: string, checked: boolean) => {
        const current = new URLSearchParams(searchParams.toString())

        // Récupère toutes les options actuelles
        const existingOptions = current.getAll("options")

        const updatedOptions = checked
            ? [...new Set([...existingOptions, option])] // Ajout sans doublon
            : existingOptions.filter((opt) => opt !== option) // Suppression

        // Supprime toutes les occurrences existantes
        current.delete("options")

        // Réajoute les options mises à jour
        updatedOptions.forEach((opt) => current.append("options", opt))
        router.replace(`?${current.toString()}`, { scroll: false })
    }
}