"use server";

export async function validateAtomicBd81Password(password: string): Promise<boolean> {
    return password === "atomicbd81";
}
