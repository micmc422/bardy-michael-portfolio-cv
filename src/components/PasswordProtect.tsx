"use client";

import { useState, useEffect } from "react";
import { Button, Column, Heading, Input, Text, Icon, Row } from "@once-ui-system/core";

interface PasswordProtectProps {
  children: React.ReactNode;
  validateAction: (password: string) => Promise<boolean>;
  storageKey?: string;
}

export default function PasswordProtect({ children, validateAction, storageKey = "pw-auth" }: PasswordProtectProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(storageKey);
      if (stored === "true") {
        setIsAuthenticated(true);
      }
    }
  }, [storageKey]);

  async function handleSubmit(formData: FormData) {
    const input = formData.get("password") as string;
    const isValid = await validateAction(input);
    if (isValid) {
      setIsAuthenticated(true);
      setError(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(storageKey, "true");
      }
    } else {
      setError(true);
    }
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Column maxWidth="s" gap="l" center paddingY="xl" fillWidth horizontal="center">
      <Column gap="m" horizontal="center">
        <Icon name="shield" size="l" onBackground="brand-strong" />
        <Heading as="h1" variant="display-strong-m" align="center">
          Accès protégé
        </Heading>
        <Text variant="body-default-m" align="center" onBackground="neutral-weak">
          Cette page est protégée. Veuillez entrer le mot de passe pour accéder au contenu.
        </Text>
      </Column>

      <form action={handleSubmit}>
        <Column fillWidth gap="m" padding="l" background="surface" radius="xl" border="neutral-alpha-weak">
          <Column fillWidth gap="xs">
            <Text as="label" htmlFor="password-input" variant="label-default-s">
              Mot de passe
            </Text>
            <Input
              id="password-input"
              name="password"
              type="password"
              placeholder="Entrez le mot de passe"
              required
            />
          </Column>
          {error && (
            <Row gap="xs" vertical="center">
              <Icon name="warningTriangle" size="s" onBackground="danger-strong" />
              <Text variant="body-default-s" onBackground="danger-strong">
                Mot de passe incorrect.
              </Text>
            </Row>
          )}
          <Button type="submit" variant="primary" fillWidth>
            Accéder
          </Button>
        </Column>
      </form>
    </Column>
  );
}
