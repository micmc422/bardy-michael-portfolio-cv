import IconCroixOccitane from "@/lib/jsxSvg/croixOccitane";
import { Row } from "@/once-ui/components";

const person = {
  firstName: "Michaël",
  lastName: "Bardy",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Développeur Fullstack",
  avatar: "/images/avatar.jpg",
  email: "michael.bardy@occitaweb.fr",
  adress: "25 avenue Gambetta",
  postCode: "81000",
  phone: "(+33) 06 72 11 50 06",
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
    name: "Facebook",
    icon: "facebook",
    link: "https://www.facebook.com/occitaweb/",
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
  title: `Occitaweb création de sites internet`,
  description: `Découvrez mon portfolio de ${person.role} : réalisations professionnelles, projets personnels, expertise web et création de sites performants.

`,
  get headline() {
    return `${this.title}`;
  },
  featured: {
    display: true,
    title: <Row center gap="xs"><strong className="ml-4">Webmaster à Albi</strong><IconCroixOccitane /></Row>,
    href: "/webmaster-albi",
  },
  subline: (
    <>
      Depuis 2015, je réalise des sites internet et des applications web pour le compte d&apos;agences et de porteur de projet. Je crée des sites internet uniques & performant.
    </>
  ),
};

const about = {
  path: "/a-propos",
  label: "Qui suis-je ?",
  title: `${person.name} Développeur full-stack`,
  description: `Découvrez ${person.name}, ${person.role} basé à ${person.place}. Portfolio, projets web, création de sites performants pour associations et entreprises.

`,
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
  description: `Dernières publications de ${person.name}, ${person.role} à Albi : articles, actualités web, projets récents, tutoriels et retours d'expérience.`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};
const webmasterAlbi = {
  path: "/webmaster-albi",
  label: "Webmaster Albi",
  title: `Webmaster Albi - Création Site Internet & SEO | ${person.name}`,
  description: `Besoin d'un webmaster à Albi ? Nous créons des sites web performants et optimisés SEO pour les entreprises albigeoises. Demandez votre devis gratuit dès aujourd'hui !`,
  headline: "Votre Webmaster Expert à Albi pour un Référencement Optimal",
  subline: "Besoin d'un coup de pouce pour votre présence en ligne à Albi ? En tant que webmaster local, je vous accompagne dans la création de sites internet performants et l'optimisation de votre visibilité sur Google. Découvrez comment transformer votre projet digital en succès, ici, au cœur du Tarn.",
  pourquoi: [
    {
      "titre": "Expertise Locale à Albi",
      "description": "En tant que webmaster basé à Albi, je connais les spécificités du marché local et les attentes des entreprises du Tarn. Je construis des stratégies digitales qui résonnent avec votre clientèle locale, maximisant votre visibilité à Albi et ses environs.",
      "icone": "pin",
      "mots_cles_seo": ["webmaster Albi local", "marché digital Albi", "entreprises Tarn", "visibilité Albi", "référencement local Albi"]
    },
    {
      "titre": "Proximité et Accompagnement Personnalisé à Albi",
      "description": "Travailler avec un webmaster à Albi, c'est bénéficier d'un contact direct et privilégié. Je vous offre un suivi sur mesure, des rencontres facilitées et une réactivité optimale pour tous vos projets de création de site internet ou d'optimisation SEO à Albi.",
      "icone": "handshake",
      "mots_cles_seo": ["webmaster Albi personnalisé", "contact direct Albi", "création site Albi", "SEO Albi", "accompagnement web Albi"]
    },
    {
      "titre": "Résultats Concrets pour Votre Entreprise à Albi",
      "description": "Mon objectif est de vous apporter des résultats mesurables : plus de trafic, plus de leads et un meilleur positionnement pour votre site web à Albi. Chaque projet est pensé pour optimiser votre retour sur investissement et renforcer votre présence en ligne locale.",
      "icone": "chart-line",
      "mots_cles_seo": ["résultats SEO Albi", "trafic site Albi", "leads Albi", "positionnement Google Albi", "présence web Albi"]
    },
    {
      "titre": "Portfolio de Succès à Albi et dans le Tarn",
      "description": "Découvrez mes réalisations pour des clients situés à Albi et dans le Tarn. Mon portfolio témoigne de mon savoir-faire en développement web, en design UI/UX et en stratégies de référencement naturel adaptées aux entreprises locales d'Albi.",
      "icone": "lightbulb",
      "mots_cles_seo": ["portfolio webmaster Albi", "réalisations sites Albi", "développement web Albi", "design UI/UX Albi", "référencement Albi"]
    }
  ],
  process: {
    title: "Processus de travail simplifié",
    steps: [
      {
        title: "Définition de Votre Projet & Audit Gratuit",
        content: "Nous commençons par échanger pour comprendre précisément vos besoins, vos objectifs et votre activité à Albi. Un audit initial de votre présence en ligne (ou de celle de vos concurrents) est offert pour poser les bases de votre stratégie digitale et maximiser votre référencement local."
      },
      {
        title: "Proposition Personnalisée & Devis Transparent",
        content: "Sur la base de nos échanges, je vous soumets une proposition détaillée et un devis clair, sans surprise, adapté à vos ambitions et à votre budget. Chaque élément est justifié, que ce soit pour la création de site internet ou l'optimisation SEO à Albi."
      },
      {
        title: "Conception & Développement Sur Mesure",
        content: "Place à la création ! Je développe votre site web en suivant les meilleures pratiques, avec un design optimisé pour l'expérience utilisateur et le mobile. Le SEO 'on-page' est intégré dès cette étape pour un site performant et visible à Albi."
      },
      {
        title: "Optimisation SEO & Lancement",
        content: "Une fois le site prêt, nous procédons aux dernières optimisations techniques et de contenu pour le référencement. Après votre validation finale, votre site est mis en ligne. Le vrai travail de visibilité pour Albi commence !"
      },
      {
        title: "Suivi, Maintenance & Évolution Continue",
        content: "Mon accompagnement ne s'arrête pas au lancement. Je propose des services de maintenance, de mises à jour et d'analyse de performances. Nous ajustons ensemble la stratégie pour que votre site continue de grandir et de performer sur Albi et au-delà."
      }
    ]
  },
  faq: {
    title: "Questions fréquentes sur mes services de webmaster à Albi",
    faq: [
      {
        title: "Quel est le coût moyen pour la création d'un site internet à Albi ?",
        content: "Le coût d'un site internet à Albi varie considérablement en fonction de sa complexité (site vitrine simple, e-commerce, fonctionnalités spécifiques), du design et du contenu. Après une première discussion sur vos besoins, je vous fournis un devis détaillé et transparent, adapté à votre budget et à vos objectifs à Albi.",
        link: {
          label: "estimation en ligne",
          path: "/estimation"
        }
      },
      {
        title: "Combien de temps faut-il pour créer un site web complet ?",
        content: "La durée de création d'un site web dépend de l'envergure du projet. Un site vitrine standard pour une entreprise d'Albi peut prendre de 3 à 6 semaines, tandis qu'un site e-commerce plus complexe peut nécessiter plusieurs mois. Je vous donnerai une estimation précise après avoir défini ensemble le cahier des charges de votre projet."
      },
      {
        "title": "Proposez-vous le référencement(SEO) pour mon site à Albi?",
        content: "Oui, absolument ! L'optimisation pour les moteurs de recherche (SEO) est une composante essentielle de mes services. Je mets en place des stratégies de référencement local à Albi pour améliorer votre visibilité sur Google, attirer plus de clients du Tarn et assurer une croissance durable à votre site web."
      },
      {
        title: "Assurez-vous la maintenance et les mises à jour après la livraison du site ?",
        content: "Oui, je propose des services de maintenance pour assurer la sécurité, la performance et l'actualisation de votre site web. La maintenance est cruciale pour la pérennité de votre investissement et pour maintenir un bon référencement à Albi. Nous pouvons discuter d'un forfait adapté à vos besoins."
      },
      {
        title: "Pourquoi choisir un webmaster local à Albi plutôt qu'une grande agence ?",
        content: "Choisir un webmaster local à Albi, c'est bénéficier d'une relation de proximité et d'un accompagnement personnalisé. Je comprends les enjeux spécifiques du marché albigeois et je suis plus réactif. Vous avez un interlocuteur unique et dédié, passionné par la réussite des entreprises du Tarn."
      }
    ]
  }
};
const solutionsWeb = {
  path: "/solutions",
  label: "Solutions Web",
  title: `Solutions digitales pour chaque métier | ${person.name}`,
  description: `Dans le monde numérique actuel, avoir un site internet est bien plus qu'une simple présence en ligne. Ce n'est pas un prospectus statique ; c'est le centre névralgique de votre communication digitale, un outil dynamique qui évolue avec votre entreprise et interagit avec vos clients.`,
  headline: "Des solutions adaptées à chaque métier",
  subline: "Dans le monde numérique actuel, avoir un site internet est bien plus qu'une simple présence en ligne. Ce n'est pas un prospectus statique ; c'est le centre névralgique de votre communication digitale, un outil dynamique qui évolue avec votre entreprise et interagit avec vos clients.",
  pourquoi: [
    {
      "titre": "Restaurateurs",
      "description": "Que vous soyez un restaurant gastronomique, un bistrot convivial ou un service de livraison, un site web adapté peut révolutionner votre activité.",
      "icone": "pin",
      "fonctions": [
        "Présentation de votre carte et menus dynamiques",
        "Système de réservation en ligne",
        "Galerie photos de vos plats et de votre établissement",
        "Gestion des avis clients",
        "Intégration avec les plateformes de livraison",
        "Actualités(événements, soirées à thème)"
      ]
    },
    {
      "titre": "Commerçants",
      "description": "Du petit commerce de quartier à la boutique spécialisée, attirez plus de clients et simplifiez vos ventes grâce à une présence en ligne efficace.",
      "icone": "handshake",
      "fonctions": [
        "Vitrine produits en ligne(catalogue ou e-commerce)",
        "Click & Collect",
        "Présentation de vos promotions et actualités",
        "Informations pratiques(horaires, accès, contact)",
        "Mise en avant de vos événements et ateliers"
      ]
    },
    {
      "titre": "Entreprises (TPE/PME)",
      "description": "Développez votre clientèle, renforcez votre crédibilité et facilitez la prise de contact pour les professionnels de la santé, du droit, du conseil, etc.",
      "icone": "chart-line",
      "fonctions": ["Site vitrine professionnel et moderne",
        "Présentation de vos services et savoir-faire",
        "Formulaires de contact et devis en ligne",
        "Section actualités / blog(pour le référencement et l'expertise)",
        "Portfolios et études de cas",
        "Espace client sécurisé(si nécessaire)"]
    }, ,
    {
      "titre": "Professions Libérales",
      "description": "Développez votre clientèle, renforcez votre crédibilité et facilitez la prise de contact pour les professionnels de la santé, du droit, du conseil, etc.",
      "icone": "chart-line",
      "fonctions": ["Site institutionnel et informatif",
        "Prise de rendez-vous en ligne",
        "Présentation détaillée de vos spécialités et expériences",
        "Articles de blog ou fiches conseils(pour démontrer votre expertise)",
        "Témoignages et références",
        "Accès sécurisé pour la documentation(si pertinent)"]
    },
  ],
  process: {
    title: "Processus de travail simplifié",
    steps: [
      {
        title: "Définition de Votre Projet & Audit Gratuit",
        content: "Nous commençons par échanger pour comprendre précisément vos besoins, vos objectifs et votre activité à Albi. Un audit initial de votre présence en ligne (ou de celle de vos concurrents) est offert pour poser les bases de votre stratégie digitale et maximiser votre référencement local."
      },
      {
        title: "Proposition Personnalisée & Devis Transparent",
        content: "Sur la base de nos échanges, je vous soumets une proposition détaillée et un devis clair, sans surprise, adapté à vos ambitions et à votre budget. Chaque élément est justifié, que ce soit pour la création de site internet ou l'optimisation SEO à Albi."
      },
      {
        title: "Conception & Développement Sur Mesure",
        content: "Place à la création ! Je développe votre site web en suivant les meilleures pratiques, avec un design optimisé pour l'expérience utilisateur et le mobile. Le SEO 'on-page' est intégré dès cette étape pour un site performant et visible à Albi."
      },
      {
        title: "Optimisation SEO & Lancement",
        content: "Une fois le site prêt, nous procédons aux dernières optimisations techniques et de contenu pour le référencement. Après votre validation finale, votre site est mis en ligne. Le vrai travail de visibilité pour Albi commence !"
      },
      {
        title: "Suivi, Maintenance & Évolution Continue",
        content: "Mon accompagnement ne s'arrête pas au lancement. Je propose des services de maintenance, de mises à jour et d'analyse de performances. Nous ajustons ensemble la stratégie pour que votre site continue de grandir et de performer sur Albi et au-delà."
      }
    ]
  },
  faq: {
    title: "Questions fréquentes sur mes services de webmaster à Albi",
    faq: [
      {
        title: "Quel est le coût moyen pour la création d'un site internet à Albi ?",
        content: "Le coût d'un site internet à Albi varie considérablement en fonction de sa complexité (site vitrine simple, e-commerce, fonctionnalités spécifiques), du design et du contenu. Après une première discussion sur vos besoins, je vous fournis un devis détaillé et transparent, adapté à votre budget et à vos objectifs à Albi.",
        link: {
          label: "estimation en ligne",
          path: "/estimation"
        }
      },
      {
        title: "Combien de temps faut-il pour créer un site web complet ?",
        content: "La durée de création d'un site web dépend de l'envergure du projet. Un site vitrine standard pour une entreprise d'Albi peut prendre de 3 à 6 semaines, tandis qu'un site e-commerce plus complexe peut nécessiter plusieurs mois. Je vous donnerai une estimation précise après avoir défini ensemble le cahier des charges de votre projet."
      },
      {
        "title": "Proposez-vous le référencement(SEO) pour mon site à Albi?",
        content: "Oui, absolument ! L'optimisation pour les moteurs de recherche (SEO) est une composante essentielle de mes services. Je mets en place des stratégies de référencement local à Albi pour améliorer votre visibilité sur Google, attirer plus de clients du Tarn et assurer une croissance durable à votre site web."
      },
      {
        title: "Assurez-vous la maintenance et les mises à jour après la livraison du site ?",
        content: "Oui, je propose des services de maintenance pour assurer la sécurité, la performance et l'actualisation de votre site web. La maintenance est cruciale pour la pérennité de votre investissement et pour maintenir un bon référencement à Albi. Nous pouvons discuter d'un forfait adapté à vos besoins."
      },
      {
        title: "Pourquoi choisir un webmaster local à Albi plutôt qu'une grande agence ?",
        content: "Choisir un webmaster local à Albi, c'est bénéficier d'une relation de proximité et d'un accompagnement personnalisé. Je comprends les enjeux spécifiques du marché albigeois et je suis plus réactif. Vous avez un interlocuteur unique et dédié, passionné par la réussite des entreprises du Tarn."
      }
    ]
  }
};
const estimation = {
  path: "/estimation",
  label: "Estimation",
  title: `Estimation de votre projet web`,
  description: `Réalisez une estimation en ligne de votre projet, transmettez moi l'estimation et je réaliserais un devis en 72h.`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  path: "/realisations",
  label: "Portfolio",
  title: `Projets – ${person.name}`,
  description: `${person.name} présente ses projets web réalisés pour entreprises, associations et collectivités locales : sites vitrines, plateformes, outils sur mesure.`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /realisationsisations routes
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

export { person, social, newsletter, rendezVous, home, about, blog, work, estimation, gallery, webmasterAlbi, solutionsWeb };
