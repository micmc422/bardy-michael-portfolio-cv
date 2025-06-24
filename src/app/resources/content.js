
const person = {
  firstName: "Michaël",
  lastName: "Bardy",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Développeur Fullstack",
  avatar: "/images/avatar.jpg",
  email: "michael.bardy@occitaweb.fr",
  location: "Europe/Paris", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  place: "Albi, France",
  languages: ["Français"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter = {
  display: false,
  title: <>S&apos;abonner à {person.firstName}&apos;s Newsletter</>,
  description: (
    <>
      Je publie occasionnellement des articles sur le design, la technologie, et je partage des réflexions à l’intersection de la créativité et de l’ingénierie.
    </>
  ),
};

const rendezVous = {
  display: true,
  title: <>Prendre rendez-vous</>,
  description: (
    <>
      Je suis disponible pour des consultations, des collaborations ou simplement pour discuter de vos projets. N&apos;hésitez pas à me contacter !
    </>
  ),
  href: "https://cal.com/occitaweb",
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/micmc422",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/micha%C3%ABl-bardy-62249168/",
  },
  {
    name: "X",
    icon: "x",
    link: "",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Accueil",
  title: `Portfolio de ${person.name}`,
  description: `Site portfolio présentant mon travail en tant que ${person.role} et mes projets personnels.`,
  headline: <>Développeur Full-Stack</>,
  featured: {
    display: false,
    title: <>Recent project: <strong className="ml-4">Once UI</strong></>,
    href: "/work/building-once-ui-a-customizable-design-system",
  },
  subline: (
    <>
      Depuis 2015, je réalise des sites internet et des applications web pour le compte d&apos;agences et de porteur de projet. Je crée des sites internet uniques & performant.
    </>
  ),
};

const about = {
  path: "/about",
  label: "Qui suis-je ?",
  title: `${person.name}`,
  description: `Découvrez ${person.name}, ${person.role} basé à ${person.place}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com/occitaweb",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Développeur Fullstack passionné par le design et la technologie, je crée des sites internet et des applications web sur mesure. J&apos;ai une solide expérience dans le développement d&apos;applications web modernes, en utilisant des technologies telles que React, Next.js et Node.js. Je suis également formateur à l&apos;Université Champollion, où j&apos;enseigne les fondamentaux du développement web.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Expérience",
    experiences: [
      {
        company: "Occitaweb",
        timeframe: "2012 - Actuellement",
        role: "Développeur Fullstack",
        achievements: [
          <>
            Conçu et développé des applications web sur mesure pour des clients variés, en
            utilisant des technologies modernes telles que React, Next.js et Node.js.
          </>,
          <>
            Optimisé les performances des applications existantes, réduisant le temps de chargement
            de 40% et améliorant l&apos;expérience utilisateur.
          </>,
        ],
        images: [
          {
            src: "/images/gallery/occitaweb-site-capture.png",
            alt: "Site web occitaweb",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Université Champollion Albi",
        timeframe: "2023 - Actuellement",
        role: "Intervenant professionnel",
        description: "Je dispense à l’Université Champollion des cours à la fois théoriques et pratiques couvrant l’ensemble des technologies web essentielles, depuis la conteneurisation jusqu’au design d’interface utilisateur",
        achievements: [
          <>
            Docker : conteneurisation (création d’images, gestion de conteneurs), réseaux et stockage,
            pour déployer des applications de façon isolée et reproductible.
          </>,
          <>
            Node.js : installation, création de serveurs, gestion asynchrone, Express et gestion de fichiers
            pour construire des back-ends JavaScript performants.
          </>,
          <>
            GIT : installation, bases (gestion locale, branches), collaboration (GitHub/GitLab) et workflows
            avancés pour le versioning et le travail en équipe.
          </>,
          <>
            NPM : gestionnaire de paquets, package.json, commandes essentielles et résolution des dépendances
            au sein d’un projet Node.js.
          </>,
          <>
            MongoDB : introduction au NoSQL, CRUD, modélisation, indexation, administration et sécurité
            pour stocker efficacement des données.
          </>,
          <>
            GraphQL : principes de base, fonctionnement, avantages/défis et cas pratiques pour requêter
            vos API de manière flexible.
          </>,
          <>
            Authentification : concepts, protocoles, sessions, jetons et bonnes pratiques de sécurisation
            pour protéger vos applications.
          </>,
          <>
            Tooling : Prettier, ESLint, snippets, bundling, performance et outils Node.js pour automatiser
            et fiabiliser votre workflow de développement.
          </>,
          <>
            React : composants fonctionnels, hooks, routage, formulaires et déploiement pour construire
            des interfaces web réactives.
          </>,
          <>
            Next.js : App Router, Server Components, SEO, optimisation des images et actions serveurs
            pour des sites full-stack modernes.
          </>,
          <>
            JavaScript : fondamentaux du langage (fonctions async, modules ES), pour maîtriser la base
            de tout développement web.
          </>,
          <>
            UX/UI Design : principes fondamentaux, processus de conception, règles CRAP et exercices pratiques
            pour créer des interfaces centrées utilisateur.
          </>
        ],
        images: [
          {
            src: "/images/gallery/tw3-champollion-01.png",
            alt: "Site web occitaweb",
            width: 16,
            height: 9,
          }, {
            src: "/images/gallery/tw3-champollion-02.png",
            alt: "Site web occitaweb",
            width: 16,
            height: 9,
          }
        ],
      },
      {
        company: "Paris est une photo",
        timeframe: "2018 - 2023",
        role: "Développeur web",
        description: "Le site e-commerce a d’abord été développé avec WordPress, avant de migrer progressivement vers une architecture headless basée sur Next.js.",
        achievements: [
          <>
            Conception et développement d&apos;une plateforme e-commerce sur mesure, intégrant des fonctionnalités de newsletter, de gestion de produits et de paiement en ligne.
          </>,
          <>
            Mise en place d&apos;un système de gestion de contenu (CMS) personnalisé pour permettre aux utilisateurs de gérer facilement leurs produits et leurs commandes.
          </>,
          <>Intégration du paiement en ligne via Stripe</>
        ],
        images: [],
      },
      {
        company: "Cyrus formation",
        timeframe: "2015 - 2020",
        role: "Formateur wordpress",
        description: "J'ai formé des étudiants à la création de sites internet avec WordPress, en mettant l'accent sur la personnalisation et l'optimisation des performances.",
        achievements: [
          <>
            Formation de plus de 100 étudiants à la création de sites internet avec WordPress, en mettant l&apos;accent sur la personnalisation et l&apos;optimisation des performances.
          </>,
          <>
            Développement de modules de formation interactifs et pratiques pour aider les étudiants à acquérir des compétences concrètes en développement web.
          </>,
        ],
        images: [],
      },
      {
        company: "Mcdo",
        timeframe: "2002 - 2012",
        role: "Manager",
        description: "J'ai commencé ma carrière professionnelle en tant que manager dans la restauration rapide, où j'ai acquis des compétences en gestion d'équipe et en service client.",
        achievements: [
          <>
            Gestion d&apos;une équipe de 10 à 40 personnes, en assurant la formation, la motivation et la performance de l&apos;équipe.
          </>,
          <>
            Mise en place de procédures opérationnelles pour améliorer l&apos;efficacité du service et réduire les temps d&apos;attente des clients.
          </>,
          <>Mise en place de procédures environnementales éco-progress</>,
          <>Certification TBM1 & TBM2 (techniques de base de management)</>
        ],
        images: [],
      }
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Etudes",
    institutions: [
      {
        name: "Webmaster/developpeur web",
        description: <>J’ai commencé par apprendre HTML/CSS et PHP via des ressources en ligne et des stages, puis découvert WordPress. Ces dernières années, je me suis tourné vers JavaScript, Node.js, React, et enfin Next.js.</>,
      },
      {
        name: "Technique de base de managenement 2",
        description: <>En travaillant de la grande distribution j&apos;ai étudié les fondamentaux du management.</>
      },
      {
        name: "Baccalauréat technoligique en communication commerciale ICECLA albi",
        description: <>J&apos;ai obtenu un Baccalauréat technologique en communication commerciale, où j&apos;ai étudié le marketing en ligne et le personal branding.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Compétences techniques",
    skills: [
      {
        title: "Figma",
        description: <>Création de systéme d&apos;interface et de design WEB.</>,
        images: [],
      },
      {
        title: "node.js",
        description: <>Création d’API et d’applications serveur avec Node.js : gestion asynchrone, Express, accès aux fichiers et intégration de bases de données.</>,
      },
      {
        title: "Typescript",
        description: <>Développement d’applications robustes avec TypeScript : typage statique, détection d’erreurs à la compilation et amélioration de la maintenabilité du code.</>
      },
      {
        title: "Prisma",
        description: <>Gestion de base de données avec Prisma : modélisation du schéma, requêtes type-safe, migrations et intégration fluide avec Node.js et TypeScript.</>
      },
      {
        title: "Next.js",
        description: <>Conception de sites web complets : vitrine, e-commerce, front-end et back-end sur mesure.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/gallery/pagespeed-h2team.png",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Blog",
  title: `Blog – ${person.name}`,
  description: `Derniéres publications de ${person.name}.`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  path: "/work",
  label: "Portfolio",
  title: `Projets – ${person.name}`,
  description: `Projets et réalisations de ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Gallerie – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, rendezVous, home, about, blog, work, gallery };
