// IMPORTANT: Replace with your own domain address - it's used for SEO in meta tags and schema
const baseURL = "https://occitaweb.fr";

const routes = {
  "/": true,
  "/a-propos": true, // /about
  "/realisations": true, // /work
  "/blog": true,
  "/estimation": true,
  "/webmaster-albi": true,
  "/solutions": true,
};
const breadCrumbs = {
  "root": home,
  "a-propos": about,
  "realisations": work,
  "blog": blog,
  "estimation": estimation,
  "webmaster-albi": webmasterAlbi,
  "solutions": solutionsWeb
}
// Enable password protection on selected routes
// Set password in the .env file, refer to .env.example
const protectedRoutes = {
  "/realisations/automate-design-handovers-with-a-figma-to-code-pipeline": true,
};

import localFont from "next/font/local";
import { about, blog, estimation, home, solutionsWeb, webmasterAlbi, work } from "./content";

// Use local font for Josefin Sans (heading)
const heading = localFont({
  src: "../../../public/fonts/JosefinSans-Regular.woff2",
  variable: "--font-heading",
  weight: "400",
  display: "swap",
});

// Use local font for Geist Sans from the geist package (body)
const body = localFont({
  src: "../../../public/fonts/Geist-Variable.woff2",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});

// Use local font for Open Sans (label)
const label = localFont({
  src: "../../../public/fonts/OpenSans-Medium.woff2",
  variable: "--font-label",
  weight: "500",
  display: "swap",
});

// Use local font for Geist Mono from the geist package (code)
const code = localFont({
  src: "../../../public/fonts/GeistMono-Variable.woff2",
  variable: "--font-code",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: false,
});

const fonts = {
  heading,
  body,
  label,
  code,
};

const style = {
  theme: "dark",
  brand: "orange",
  accent: "indigo",
  neutral: "sand",
  border: "rounded",
  solid: "contrast",
  solidStyle: "flat",
  surface: "filled",
  transition: "all",
  scaling: "100",
  vizStyle: "categorical"
};

const effects = {
  mask: {
    cursor: true,
    x: 50,
    y: 50,
    radius: 100,
  },
  gradient: {
    display: true,
    opacity: 100,
    x: 50,
    y: 60,
    width: 100,
    height: 50,
    tilt: 25,
    colorStart: "brand-background-strong",
    colorEnd: "page-background",
  },
  dots: {
    display: true,
    opacity: 40,
    size: "4",
    color: "brand-background-strong",
  },
  grid: {
    display: true,
    opacity: 50,
    color: "neutral-alpha-strong",
    width: "0.25rem",
    height: "0.25rem",
  },
  lines: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-strong",
    size: "16",
    thickness: 1,
    angle: 45,
  },
};

const display = {
  location: true,
  time: true,
  themeSwitcher: true
};

const mailchimp = {
  action: "https://url/subscribe/post?parameters",
  effects: {
    mask: {
      cursor: true,
      x: 50,
      y: 0,
      radius: 100,
    },
    gradient: {
      display: true,
      opacity: 90,
      x: 50,
      y: 0,
      width: 50,
      height: 50,
      tilt: 0,
      colorStart: "accent-background-strong",
      colorEnd: "static-transparent",
    },
    dots: {
      display: true,
      opacity: 20,
      size: "2",
      color: "brand-on-background-weak",
    },
    grid: {
      display: false,
      opacity: 100,
      color: "neutral-alpha-medium",
      width: "0.25rem",
      height: "0.25rem",
    },
    lines: {
      display: false,
      opacity: 100,
      color: "neutral-alpha-medium",
      size: "16",
      thickness: 1,
      angle: 90,
    },
  },
};

const rdv = {
  action: "https://cal.com/occitaweb",
  effects: {
    mask: {
      cursor: true,
      x: 50,
      y: 0,
      radius: 25,
    },
    gradient: {
      display: true,
      opacity: 100,
      x: 50,
      y: 0,
      width: 50,
      height: 50,
      tilt: 20,
      colorStart: "brand-background-strong",
      colorEnd: "neutral-transparent",
    },
    dots: {
      display: false,
      opacity: 100,
      size: "1",
      color: "neutral-on-background-weak",
    },
    grid: {
      display: true,
      opacity: 25,
      color: "brand-alpha-weak",
      width: "0.25rem",
      height: "0.25rem",
    },
    lines: {
      display: false,
      opacity: 100,
      color: "neutral-alpha-medium",
      size: "16",
      thickness: 1,
      angle: 90,
    },
  },
};

export const dataConfig = {
  variant: "gradient", // flat | gradient | outline
  mode: "categorical", // categorical | divergent | sequential
  height: 24, // default chart height
  axisLine: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
  },
  tickLine: true
}

export { routes, protectedRoutes, effects, style, display, mailchimp, rdv, baseURL, fonts, breadCrumbs };
