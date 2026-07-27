# Guideline — Rédaction d'articles de blog (Wisp CMS + composants React custom)

> Workflow : générer un fichier `.mdx` dans `articles/` (dossier non versionné), puis coller son contenu dans l'éditeur Wisp CMS. Le pipeline `formatPostData()` (`src/app/utils/serverActions.ts`) convertit le HTML Wisp → markdown (turndown), et `CustomMDX` (`src/components/mdx.tsx`) rend le tout avec les composants ci-dessous.

## 1. Pipeline & règle d'or

Wisp stocke du **HTML**. À l'affichage :
1. `formatPostData()` convertit en markdown, **préserve les `<div>`**, et transforme
   `<div data-wisp-react-component="true" data-name="X" data-props="…"></div>` en `<X data-props="…" />`.
2. `CustomMDX` rend le markdown avec le registre de composants de `src/components/mdx.tsx`.

**Règle d'or** : un composant custom s'insère dans Wisp via un bloc HTML :

```html
<div data-wisp-react-component="true" data-name="NomDuComposant" data-props="JSON_ENCODE_URI"></div>
```

- `data-name` = nom EXACT du composant enregistré dans `mdx.tsx` (sensible à la casse).
- `data-props` = JSON passé dans **`encodeURIComponent()`** (les composants font `JSON.parse(decodeURIComponent(...))`).
- Balise toujours **auto-fermée côté rendu** : ne rien mettre entre `<div>` et `</div>`.

## 2. Composants custom avec `data-props`

### `Faq` (accordéon + JSON-LD FAQPage automatique — bon pour le SEO)

Payload (mode FAQ) : `{"title":"...","faq":[{"title":"Question ?","content":"Réponse."}]}`
Payload (mode liste) : `{"title":"...","list":[{"title":"...","content":"..."}]}`

```html
<div data-wisp-react-component="true" data-name="Faq" data-props="%7B%22title%22%3A%22FAQ%22%2C%22faq%22%3A%5B%7B%22title%22%3A%22Question%20%3F%22%2C%22content%22%3A%22R%C3%A9ponse.%22%7D%5D%7D"></div>
```

### `Steps` (étapes numérotées + JSON-LD ItemList)

Payload : `{"title":"...","steps":[{"title":"Étape 1","content":"Description."},{"title":"Étape 2","content":"..."}]}`

```html
<div data-wisp-react-component="true" data-name="Steps" data-props="%7B%22title%22%3A%22Comment%20faire%22%2C%22steps%22%3A%5B%7B%22title%22%3A%22%C3%89tape%201%22%2C%22content%22%3A%22Description.%22%7D%5D%7D"></div>
```

⚠ `data-name="Steps"` (alias MDX de `StepsComponent`). Le JSON-LD est généré automatiquement — ne pas dupliquer de schema à la main.

## 3. Liens « magiques » (CustomLink)

Le composant de lien détecte certaines URLs et transforme le rendu — utiliser un lien markdown standard :

| URL du lien | Rendu automatique |
|---|---|
| `https://github.com/owner/repo.git` (finit par `.git`) | Carte résumé du repo GitHub (`GitHubRepoSummary`) |
| `https://raw.githubusercontent.com/...` | Bloc de code du fichier distant (`RawGithubFile`), le texte du lien devient le label |
| `https://codepen.io/...` | Embed CodePen (iframe 300px) |
| `https://www.wisp.blog/...` | Lien centré `nofollow` |
| `/chemin-interne` | `SmartLink` Next.js |

Exemples :
```md
[Voir le dépôt](https://github.com/micmc422/mon-projet.git)
[server.js](https://raw.githubusercontent.com/owner/repo/main/server.js)
[Démo CSS clamp()](https://codepen.io/user/pen/abc123)
```

## 4. Blocs de code

Fence avec langage, et optionnellement un nom de fichier après `:` (les tirets deviennent des espaces dans le label) :

````md
```js:mon-fichier.js
const hello = "world";
```
````

Rendu : `CodeBlock` Once UI avec bouton copier, label `Js | mon fichier.js`.

## 5. Images et médias

Image markdown standard → composant `Media` Once UI (16/9, enlarge au clic, coins arrondis) :

```md
![Texte alternatif descriptif](https://imagedelivery.net/.../image.webp)
```

- Toujours renseigner l'alt (accessibilité + SEO).
- Héberger via Wisp (imagedelivery.net) ou `/images/blog/` du site.

## 6. Structure d'un article

- **Pas de `#` (h1)** dans le corps : le titre vient des métadonnées Wisp. Commencer à `##`.
- Les `##`/`###` génèrent des ancres cliquables (slug auto) → table des matières `HeadingNav` automatique.
- Paragraphes courts (2-4 phrases), interligne géré par le thème.
- Tableaux markdown (GFM) supportés → convertis en `Table` Once UI.
- `---` pour les séparations de sections si besoin.
- Terminer idéalement par une section FAQ (composant `Faq`) : bonus SEO (rich snippets).

### Gabarit type

```mdx
Intro accrocheuse (2-3 phrases, la description Wisp ne doit PAS être recopiée mot à mot).

## Première section

Contenu…

```js:exemple.js
// code commenté
```

## Deuxième section

![alt descriptif](url-image)

<div data-wisp-react-component="true" data-name="Steps" data-props="…"></div>

## Conclusion

Appel à l'action (contact, RDV, lien interne vers /realisations ou /estimation).

<div data-wisp-react-component="true" data-name="Faq" data-props="…"></div>
```

## 7. Composants Once UI également enregistrés

Disponibles dans le registre MDX (usage direct JSX fiable uniquement via le pipeline dev — depuis Wisp, préférer les blocs `data-wisp-react-component` ou le markdown pur) : `Heading`, `Text`, `CodeBlock`, `InlineCode`, `Accordion`, `AccordionGroup`, `Table`, `Feedback`, `Button`, `Card`, `Grid`, `Row`, `Column`, `Icon`, `Media`, `SmartLink`, `OgCard`, `RDV`.

## 8. Checklist avant collage dans Wisp

- [ ] Aucun `#` h1 dans le corps
- [ ] `data-props` bien passés dans `encodeURIComponent` (tester `JSON.parse(decodeURIComponent(...))`)
- [ ] `data-name` exact : `Faq`, `Steps` (casse comprise)
- [ ] Fences avec langage (`js`, `ts`, `bash`, `css`, `html`…)
- [ ] Alt sur toutes les images
- [ ] Liens internes en chemin relatif (`/blog/...`, `/realisations/...`)
- [ ] Ton : français, vouvoiement pro, orienté freelance/PME locale (Albi/Occitanie)

## 9. Générer l'encodage `data-props`

```js
// Node one-liner
node -e "console.log(encodeURIComponent(JSON.stringify({title:'FAQ',faq:[{title:'Q ?',content:'R.'}]})))"
```
