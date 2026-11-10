# SPEC 02 — Kids directory and profiles

> **Status:** Implemented  
> **Depends on:** SPEC 01  
> **Date:** 2026-11-09  
> **Objective:** Implement the `/kids` directory page and dynamic `/kids/[slug]` kid profile page matching the visual design, typography, and structure of `references/pantallas/ninos.dc.html` and `references/pantallas/perfil-nino.dc.html`.

---

## Why this spec exists

SPEC 01 implemented the core layout foundations and home feed screen (`/`). Educators and day care staff need to view all enrolled children in their classroom, filter them quickly, and inspect individual child profiles (allergies, medical notes, birthdate, classroom, and connected parents). This spec builds both the classroom directory view (`/kids`) and the individual kid profile view (`/kids/[slug]`) with structured mock data and client-side filtering.

---

## Scope

**In:**

- **Sidebar update & redirect:**
  - Update `NAV_ITEMS` in `components/sidebar.tsx` so the "Niños" navigation entry points to `/kids` instead of `/ninos`.
  - Add a redirect in `next.config.ts` from `/ninos` to `/kids`.
- **Kids directory page (`/kids`):**
  - Header with title "Niños", section kicker "GESTIÓN", and "Agregar niño" action button.
  - Interactive search input ("Buscar niño…") that filters children in real time by name.
  - Section count indicator ("SALA SOLES · N niños").
  - Responsive 2-column grid of kid cards (`references/pantallas/ninos.dc.html`) with hover elevation and border transition.
  - Cards show avatar initials, full name, age, connected parents count, and special badge (e.g., `MANÍ`, `LACTOSA`, `VINCULAR`) or chevron indicator.
  - Clicking any card navigates to `/kids/[slug]`.
- **Kid profile page (`/kids/[slug]`):**
  - Back navigation link ("← Volver a Niños") returning to `/kids`.
  - Child profile header: 84px avatar circle, child's full name, age + room subtitle, and "Editar" action button.
  - Allergies & medical notes alert banner with warning icon when notes exist.
  - Personal info card: birth date, classroom name ("Sala"), and admission date ("Ingreso").
  - Right sidebar column:
    - "Resumen del día" action CTA button.
    - "PADRES VINCULADOS" card listing linked guardians with status pill badges (`ACTIVA`, `PENDIENTE`).
    - "Vincular otro padre" action link.
  - Not-found handling: trigger Next.js `notFound()` if an unknown slug is requested.
- **Typed mock data in `lib/mock-data.ts`:**
  - TypeScript types: `KidBadge`, `ConnectedParent`, `KidProfile`.
  - Array `mockKids` containing complete profile data for all 8 children from the mockup:
    1. Mateo Fernández (`mateo-fernandez`)
    2. Sofía Méndez (`sofia-mendez`)
    3. Benjamín Ruiz (`benjamin-ruiz`)
    4. Valentina Soto (`valentina-soto`)
    5. Tomás Díaz (`tomas-diaz`)
    6. Emma Castro (`emma-castro`)
    7. Lucas Romero (`lucas-romero`)
    8. Olivia Vega (`olivia-vega`)

**Out of scope (deferred to future specs):**

- Form submission or modal flow for "Agregar niño".
- Form submission or modal flow for "Editar" profile.
- Daily summary flow ("Resumen del día", `references/pantallas/resumen-dia.dc.html`).
- Parent invitation flow ("Vincular otro padre", `references/pantallas/vincular-padre.dc.html`).
- Backend persistence or database integration.

---

## Data model

Add to `lib/mock-data.ts`:

```ts
export type KidBadgeType = "allergy" | "action";

export interface KidBadge {
  label: string;
  type: KidBadgeType;
  bg: string;
  color: string;
}

export type ParentStatus = "ACTIVA" | "PENDIENTE";

export interface ConnectedParent {
  id: string;
  name: string;
  relationship: string; // e.g. "Mamá", "Papá"
  status: ParentStatus;
  avatarInitial: string;
  avatarBg: string;
}

export interface KidProfile {
  id: string;
  slug: string;
  name: string;
  ageYears: number;
  roomName: string;
  birthDateText: string;
  enrollmentDateText: string;
  avatarInitial: string;
  avatarBg: string;
  avatarColor: string;
  badge?: KidBadge;
  allergyNotes?: string;
  parents: ConnectedParent[];
}
```

### Mock Kids Data Set

```ts
export const mockKids: KidProfile[] = [
  {
    id: "kid-1",
    slug: "mateo-fernandez",
    name: "Mateo Fernández",
    ageYears: 3,
    roomName: "Soles",
    birthDateText: "12 mar 2022",
    enrollmentDateText: "feb 2025",
    avatarInitial: "M",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    badge: { label: "MANÍ", type: "allergy", bg: "#FBD8CC", color: "#D9684A" },
    allergyNotes: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    parents: [
      {
        id: "parent-1",
        name: "Lucía Fernández",
        relationship: "Mamá",
        status: "ACTIVA",
        avatarInitial: "L",
        avatarBg: "#C9B6E8",
      },
      {
        id: "parent-2",
        name: "Diego Fernández",
        relationship: "Papá",
        status: "PENDIENTE",
        avatarInitial: "D",
        avatarBg: "#A9C7E8",
      },
    ],
  },
  {
    id: "kid-2",
    slug: "sofia-mendez",
    name: "Sofía Méndez",
    ageYears: 2,
    roomName: "Soles",
    birthDateText: "24 ago 2023",
    enrollmentDateText: "mar 2025",
    avatarInitial: "S",
    avatarBg: "#F4B8CC",
    avatarColor: "#C44A7A",
    parents: [
      {
        id: "parent-3",
        name: "Camila Méndez",
        relationship: "Mamá",
        status: "ACTIVA",
        avatarInitial: "C",
        avatarBg: "#F4B8CC",
      },
    ],
  },
  {
    id: "kid-3",
    slug: "benjamin-ruiz",
    name: "Benjamín Ruiz",
    ageYears: 3,
    roomName: "Soles",
    birthDateText: "05 nov 2022",
    enrollmentDateText: "feb 2025",
    avatarInitial: "B",
    avatarBg: "#B9DEC4",
    avatarColor: "#3E8B62",
    parents: [
      {
        id: "parent-4",
        name: "Valeria Ruiz",
        relationship: "Mamá",
        status: "ACTIVA",
        avatarInitial: "V",
        avatarBg: "#B9DEC4",
      },
      {
        id: "parent-5",
        name: "Martín Ruiz",
        relationship: "Papá",
        status: "ACTIVA",
        avatarInitial: "M",
        avatarBg: "#A9D9E8",
      },
    ],
  },
  {
    id: "kid-4",
    slug: "valentina-soto",
    name: "Valentina Soto",
    ageYears: 2,
    roomName: "Soles",
    birthDateText: "18 may 2023",
    enrollmentDateText: "abr 2025",
    avatarInitial: "V",
    avatarBg: "#F4DC8E",
    avatarColor: "#9A7B1E",
    badge: { label: "VINCULAR", type: "action", bg: "#F9D2DE", color: "#C56486" },
    parents: [],
  },
  {
    id: "kid-5",
    slug: "tomas-diaz",
    name: "Tomás Díaz",
    ageYears: 3,
    roomName: "Soles",
    birthDateText: "30 ene 2022",
    enrollmentDateText: "feb 2025",
    avatarInitial: "T",
    avatarBg: "#C9B6E8",
    avatarColor: "#7B5FC0",
    badge: { label: "LACTOSA", type: "allergy", bg: "#FBD8CC", color: "#D9684A" },
    allergyNotes: "Intolerancia a la lactosa. Proporcionar merienda sin lácteos.",
    parents: [
      {
        id: "parent-6",
        name: "Esteban Díaz",
        relationship: "Papá",
        status: "ACTIVA",
        avatarInitial: "E",
        avatarBg: "#C9B6E8",
      },
    ],
  },
  {
    id: "kid-6",
    slug: "emma-castro",
    name: "Emma Castro",
    ageYears: 2,
    roomName: "Soles",
    birthDateText: "14 jul 2023",
    enrollmentDateText: "mar 2025",
    avatarInitial: "E",
    avatarBg: "#F4B8CC",
    avatarColor: "#C44A7A",
    parents: [
      {
        id: "parent-7",
        name: "Marina Castro",
        relationship: "Mamá",
        status: "ACTIVA",
        avatarInitial: "M",
        avatarBg: "#F4B8CC",
      },
    ],
  },
  {
    id: "kid-7",
    slug: "lucas-romero",
    name: "Lucas Romero",
    ageYears: 3,
    roomName: "Soles",
    birthDateText: "22 sep 2022",
    enrollmentDateText: "feb 2025",
    avatarInitial: "L",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    parents: [
      {
        id: "parent-8",
        name: "Paula Romero",
        relationship: "Mamá",
        status: "ACTIVA",
        avatarInitial: "P",
        avatarBg: "#A9D9E8",
      },
    ],
  },
  {
    id: "kid-8",
    slug: "olivia-vega",
    name: "Olivia Vega",
    ageYears: 2,
    roomName: "Soles",
    birthDateText: "08 dic 2023",
    enrollmentDateText: "mar 2025",
    avatarInitial: "O",
    avatarBg: "#B9DEC4",
    avatarColor: "#3E8B62",
    parents: [
      {
        id: "parent-9",
        name: "Gonzalo Vega",
        relationship: "Papá",
        status: "ACTIVA",
        avatarInitial: "G",
        avatarBg: "#B9DEC4",
      },
    ],
  },
];
```

---

## Implementation plan

1. **Update Data Models and Sidebar Navigation:**
   - Add `KidBadge`, `ConnectedParent`, `KidProfile`, and `mockKids` into `lib/mock-data.ts`.
   - Update `NAV_ITEMS` in `components/sidebar.tsx` so the "Niños" route is `/kids`.
   - Add `redirects` config in `next.config.ts` mapping `/ninos` -> `/kids` (permanent: false).
   - Verification: `npx tsc --noEmit` passes.

2. **Create Kids Directory View (`app/kids/page.tsx`):**
   - Create client search component `components/kids/kids-directory.tsx` (or direct client component) that holds search state and renders:
     - Header ("GESTIÓN", "Niños", and "Agregar niño" button).
     - Search input with search icon.
     - Group label ("SALA SOLES · N niños").
     - 2-column grid rendering cards with hover styles (`.kid:hover` equivalent using Tailwind `hover:border-[#F2A78E] hover:-translate-y-0.5 transition-transform duration-150`).
     - Badges or chevron icon depending on kid record.
   - Assemble `app/kids/page.tsx` using `<Sidebar activeItem="ninos" />` and the directory component.
   - Verification: Navigating to `/kids` renders all 8 kids; typing into search input filters the list; clicking a kid navigates to `/kids/[slug]`.

3. **Create Kid Profile View (`app/kids/[slug]/page.tsx`):**
   - Implement dynamic page extracting `params.slug`.
   - Retrieve kid from `mockKids` by slug; call Next.js `notFound()` if not found.
   - Render page structure inside `<Sidebar activeItem="ninos" />`:
     - Top breadcrumb / back link: "← Volver a Niños" pointing to `/kids`.
     - Left column:
       - Header with large avatar (84px), kid name in Fredoka 28px, subtitle ("N años · Sala Soles"), and "Editar" button.
       - Allergies / medical notes banner (rendered when `allergyNotes` exists) with pink background `#FBDAD6` and warning icon `#F4A8A0`.
       - Personal details box: birth date, room, and enrollment date.
     - Right column (300px):
       - "Resumen del día" CTA button.
       - "PADRES VINCULADOS" card listing linked parents with initial circle, relationship, and status badge (`ACTIVA` in `#CFEBD8` / `#3E9B6C`, `PENDIENTE` in `#F7E7A6` / `#9A7B1E`).
       - "Vincular otro padre" dashed icon button link.
   - Create `app/kids/[slug]/not-found.tsx` fallback view displaying a friendly child not found message and a link back to `/kids`.
   - Verification: Visiting `/kids/mateo-fernandez` displays Mateo's full profile matching `perfil-nino.dc.html`. Visiting `/kids/unknown-slug` triggers the not-found view.

---

## Acceptance criteria

- [x] `components/sidebar.tsx` points "Niños" to `/kids`.
- [x] Accessing `/ninos` automatically redirects to `/kids`.
- [x] `/kids` renders with the sticky sidebar (`activeItem="ninos"`), header "Niños", and "Agregar niño" button.
- [x] `/kids` displays all 8 children in a 2-column grid matching `references/pantallas/ninos.dc.html`.
- [x] Real-time search input on `/kids` filters the displayed children by name (case-insensitive) and updates the count badge.
- [x] Hovering over a kid card applies elevation and border highlight transitions matching the mockup.
- [x] Clicking any child card navigates to `/kids/[slug]`.
- [x] `/kids/[slug]` renders the full profile matching `references/pantallas/perfil-nino.dc.html`:
  - [x] "Volver a Niños" links back to `/kids`.
  - [x] Header displays large avatar, child name, age, room, and "Editar" button.
  - [x] Allergy alert box displays for children with `allergyNotes` (e.g. Mateo Fernández, Tomás Díaz) and gracefully omits for children without allergies.
  - [x] Data table correctly displays birth date, room, and enrollment date.
  - [x] "Resumen del día" CTA button is visible in the right column.
  - [x] Connected parents list displays avatars, relation descriptions, and status badges (`ACTIVA` / `PENDIENTE`).
  - [x] "Vincular otro padre" link is rendered.
- [x] Navigating to a non-existent slug (e.g. `/kids/non-existent`) invokes `notFound()` and shows the 404 view.
- [x] `npx tsc --noEmit` passes without errors.

---

## Decisions taken and discarded

- **Decision:** Use kebab-case slugs based on kid full names (e.g. `mateo-fernandez`) for `/kids/[slug]` instead of opaque numeric or database IDs.  
  *Justification:* Provides clean, human-readable URLs consistent with Next.js conventions and static mock routing.
- **Decision:** Update the sidebar "Niños" link to `/kids` directly and configure a Next.js redirect from `/ninos` to `/kids`.  
  *Justification:* Honors the explicit user requirement to use `/kids` while preserving backward compatibility for existing references to `/ninos`.
- **Decision:** Provide complete, unique mock profiles for all 8 children in `lib/mock-data.ts`.  
  *Justification:* Ensures every card on the directory page leads to a valid, distinct profile page without broken links or placeholder mock data.
- **Decision:** Implement real-time client-side search filtering on `/kids`.  
  *Justification:* Enhances user experience while maintaining zero backend dependencies.

---

## Identified risks

- **Next.js 16 Dynamic Route Params:** In Next.js 15+, dynamic route `params` in Page components is a `Promise`. The implementation must `await params` or use React's `use()` hook when reading `slug` in server components.
