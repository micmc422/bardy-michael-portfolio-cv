"use client"

import { Button, type ButtonProps } from "@once-ui-system/core";
import { useRouter } from "next/navigation";
import { type ReactNode, type TransitionStartFunction, useActionState, useContext, useRef } from "react"
import { createContext } from 'react'

interface FormContextType {
    isSubmitting: boolean;
    startTransition?: TransitionStartFunction
};

export interface ActionToastResponse {
    variant: 'success' | 'danger';
    message: string;
    action?: ReactNode;
}

const FormContext = createContext<FormContextType>({
    isSubmitting: false,
})

interface CustomFormProps {
    action: (data: FormData | void | null) => Promise<ActionToastResponse | null | void>;
    children: React.ReactNode;
}
export const useFormContext = () => useContext(FormContext);

export default function FormComponent({ action, ...props }: CustomFormProps
) {
    const formRef = useRef<HTMLFormElement>(null);
    const route = useRouter()
    const [_state, formAction, isSubmitting] = useActionState(handleSubmit, null);

    async function handleSubmit(prev: any, formData: FormData) {
        if (!formData) throw new Error('Aucune donnée de formulaire !');
        try {
            const result = await action(formData);
            return result
        } catch (e) {
            console.log(e, _state);
        } finally {
            route.refresh()
        }
    }
    return (<FormContext.Provider value={{ isSubmitting }}>
        <form ref={formRef} {...props} action={formAction} />
    </FormContext.Provider>
    )
}

export function SubmitButton({ children, ...props }: ButtonProps) {
    const { isSubmitting } = useFormContext?.() || {};
    if (!useFormContext) return <Button type="submit" {...props}>
        {children}
    </Button>;
    return <Button type="submit" disabled={isSubmitting} loading={isSubmitting} {...props}>
        {children}
    </Button>
}