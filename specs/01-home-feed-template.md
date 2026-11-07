# SPEC 01 — Home feed template

> **Status:** Approved  
> **Depends on:** None
> **Date:** 2026-11-07
> **Objective:** Implement the home page `/` matching the visual design, typography, and static structure of `references/pantallas/feed.dc.html` using Tailwind CSS and mock data.

---

## Why this spec exists

The project currently has only the initial Next.js scaffold. The UI design truth is specified in `references/pantallas/*.dc.html`. This spec establishes the design foundations (fonts Fredoka and Nunito, color palette, sidebar navigation structure) and builds the primary landing screen (`/`, feed view) with pure frontend mockup data before any backend, database, or authentication layers are introduced.

---

## Scope

**In:**

- Configure Google Fonts `Fredoka` and `Nunito` in `app/layout.tsx`.
- Establish theme background color (`#F6ECDF`) and base font styles.
- Create modular components:
  - `components/sidebar.tsx`: Sticky desktop navigation sidebar matching the mockup.
  - `components/feed/create-post-prompt.tsx`: Quick share bar ("Compartí un momento…").
  - `components/feed/post-card.tsx`: Card component supporting different post categories (`LOGRO`, `ACTIVIDAD`, `ANUNCIO`), metadata, text, optional photo placeholder, likes, comments, and edit link.
- Define typed mock data in `lib/mock-data.ts` containing the 3 sample posts and user profile from `feed.dc.html`.
- Assemble the home feed view in `app/page.tsx`.
- Wire navigational links to future route paths (`/`, `/ninos`, `/avisos`, `/mi-cuenta`, `/crear-publicacion`, `/login`) as client-safe static links.

**Out of scope (for future specs):**

- User authentication, login session verification, or logout logic.
- Database persistence or backend API handlers.
- Interactive creation or editing of posts (opening forms, submitting data).
- Interactive reaction counters (like/unlike state persistence).
- Mobile-specific responsive adaptations (drawer/bottom navigation) beyond base desktop-first layout fidelity.

---

## Data model

Typed static mock model stored in `lib/mock-data.ts`:

```ts
export type PostCategory = "milestone" | "activity" | "announcement";

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  milestone: "LOGRO",
  activity: "ACTIVIDAD",
  announcement: "ANUNCIO",
};

export const POST_CATEGORY_STYLES: Record<
  PostCategory,
  { bg: string; dot: string; text: string }
> = {
  milestone: { bg: "#CFEBD8", dot: "#3E9B6C", text: "#3E9B6C" },
  activity: { bg: "#C7E7F1", dot: "#2E89A6", text: "#2E89A6" },
  announcement: { bg: "#CCD8F4", dot: "#4E72C8", text: "#4E72C8" },
};

export interface FeedPost {
  id: string;
  author: {
    name: string;
    avatarInitial: string;
    avatarBg: string;
    avatarColor: string;
  };
  timestampText: string;
  category: PostCategory;
  recipientText: string;
  content: string;
  photoPlaceholderText?: string;
  likesCount: number;
  commentsCount: number;
}

export interface UserProfile {
  name: string;
  role: string;
  roomName: string;
  avatarInitial: string;
}
```

---

## Implementation plan

1. **Configure Typography and Layout:**
   - Update `app/layout.tsx` to import and load `Fredoka` and `Nunito` via `next/font/google`.
   - Update body styles and global theme variables in `app/globals.css` to match background `#F6ECDF` and text color `#3F362E`.
   - Set document title to `OpenDayCare`.
   - Verification: `npx tsc --noEmit` passes and dev server loads fonts without errors.

2. **Define Mock Data and Types:**
   - Create `lib/mock-data.ts` with TypeScript interfaces `FeedPost`, `UserProfile`, `PostCategory` (`"milestone" | "activity" | "announcement"`), display label mapping `POST_CATEGORY_LABELS` (mapping to `"LOGRO"`, `"ACTIVIDAD"`, `"ANUNCIO"`), and styling mappings. Include sample data reflecting Caro Giménez and the 3 mockup posts.
   - Verification: Type check passes.

3. **Build Sidebar Component:**
   - Create `components/sidebar.tsx` with sticky 248px width, OpenDayCare logo, "Sala Soles" subtitle, "+ Nueva publicación" button, navigation links (Feed active state, Niños, Avisos, Mi cuenta), and bottom user profile card with logout icon.
   - Verification: Render component in a test harness or page skeleton; inspect styling against mockup.

4. **Build Feed Post Components:**
   - Create `components/feed/create-post-prompt.tsx` for the "Compartí un momento…" prompt card.
   - Create `components/feed/post-card.tsx` rendering post header (author avatar, name, time, badge displaying Spanish category label via `POST_CATEGORY_LABELS[post.category]`), recipient text, content body, optional photo placeholder box, and footer actions (reactions count, comments count, edit link).
   - Verification: Component accurately renders English category codes as Spanish badge labels (`LOGRO` in green, `ACTIVIDAD` in teal/blue, `ANUNCIO` in purple/indigo).

5. **Assemble Home Route:**
   - Replace default create-next-app template in `app/page.tsx` with the feed container, header ("GUARDERÍA · SALA SOLES", "Buenas, Caro", "12 niños · martes 17 jun"), post prompt, "PUBLICADO HOY" section divider, and mapped list of `FeedPost` cards.
   - Verification: Visual check matches `references/pantallas/feed.dc.html`.

6. **Final Verification and Build Check:**
   - Run `npx tsc --noEmit` and `npm run build` to confirm zero TypeScript and build errors.

---

## Acceptance criteria

- [ ] `app/layout.tsx` loads `Fredoka` and `Nunito` Google fonts, applying `Nunito` as primary body font and `#F6ECDF` background.
- [ ] The desktop sidebar is 248px wide, sticky, with "OpenDayCare", "Sala Soles", "+ Nueva publicación" button, navigation items, and user profile footer.
- [ ] The "Feed" item in the sidebar displays the active highlighted style (`background: #FBE3D8`, `color: #D9583C`).
- [ ] Navigation and action links point to intended routes (`/`, `/ninos`, `/avisos`, `/mi-cuenta`, `/crear-publicacion`, `/login`).
- [ ] The feed header displays "GUARDERÍA · SALA SOLES", "Buenas, Caro", and "12 niños · martes 17 jun".
- [ ] The quick action prompt "Compartí un momento…" renders with camera icon and links to `/crear-publicacion`.
- [ ] The 3 mock posts from `feed.dc.html` use English category states (`milestone`, `activity`, `announcement`) and are displayed in the UI template with their Spanish badges and correct colors:
  - [ ] `milestone` rendered as "LOGRO" with green badge.
  - [ ] `activity` rendered as "ACTIVIDAD" with teal badge and dashed photo placeholder.
  - [ ] `announcement` rendered as "ANUNCIO" with blue/purple badge.
- [ ] `npx tsc --noEmit` passes clean with 0 errors.
- [ ] `npm run build` succeeds without build errors.

---

## Decisions

- **Yes:** English code identifiers for post categories (`"milestone" | "activity" | "announcement"`) mapped to Spanish UI labels (`POST_CATEGORY_LABELS`). Keeps internal codebase conventions in English while preserving user-facing Spanish design copy.
- **Yes:** Configure Google Fonts `Fredoka` and `Nunito` in `app/layout.tsx` using `next/font/google`. Keeps font loading optimized and matches mockup typography accurately.
- **No:** Relying on default Geist fonts. Violates design truth documented in `AGENTS.md`.
- **Yes:** Modular components (`components/sidebar.tsx`, `components/feed/*`) and typed mock data (`lib/mock-data.ts`). Promotes clean structure and allows future specs to reuse sidebar and post cards.
- **No:** Single monolithic `app/page.tsx` with hardcoded JSX. Makes future specs (e.g. creating posts, other pages using the same sidebar) harder to maintain.
- **Yes:** Future route paths for navigation links (`/ninos`, `/avisos`, etc.). Prepares routes for subsequent screen implementations.
- **No:** Backend routes, database models, or authentication. Purely out of scope per user requirements.

---

## Identified risks

| Risk | Mitigation |
| ---- | ---------- |
| Google Fonts network loading during offline builds or testing | `next/font/google` downloads and self-hosts fonts during Next.js build time. |
| Style regressions or conflicting default styles from create-next-app | Replace default Tailwind styles in `app/globals.css` and `app/page.tsx` entirely with mockup styling rules. |

---

## What is **not** in this spec

- Backend database schemas, ORM models, or API endpoints.
- User authentication, login forms, sessions, or logout logic.
- Post creation modal, photo upload handling, or post editing forms.
- Dynamic interactive liking or commenting.
- Other application screens (`/ninos`, `/avisos`, `/mi-cuenta`, etc.).

Each of those, if implemented, belongs in its own dedicated spec.
