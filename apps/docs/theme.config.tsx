import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span><strong>Occitaweb</strong> Docs</span>,
  project: {
    link: 'https://github.com/micmc422/bardy-michael-portfolio-cv',
  },
  docsRepositoryBase: 'https://github.com/micmc422/bardy-michael-portfolio-cv/tree/main/apps/docs',
  footer: {
    content: '© 2024 Occitaweb - Documentation',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Occitaweb Documentation" />
      <meta property="og:description" content="Documentation du monorepo Occitaweb" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Occitaweb Docs'
    }
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
  navigation: {
    prev: true,
    next: true,
  },
}

export default config
