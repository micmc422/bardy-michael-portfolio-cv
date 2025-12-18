'use client';

import React, { useEffect, useState } from 'react';
import { ToggleButton, useTheme } from '@once-ui-system/core';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ToggleButton
      prefixIcon="moon"
      selected={false}
      disabled
      aria-label="Chargement du toggle thème"
    />;
  }

  return (
    <ToggleButton
      prefixIcon={theme === 'dark' ? 'sun' : 'moon'}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      selected={false}
      aria-label={`Afficher en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
    />
  );
};
