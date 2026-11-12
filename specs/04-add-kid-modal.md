# SPEC 04 — Add kid modal

> **Status:** Implemented  
> **Depends on:** SPEC 02  
> **Date:** 2026-11-11  
> **Objective:** Implement the "Agregar niño" modal dialog on the `/kids` directory page matching `references/pantallas/agregar-nino.dc.html` with form validation, client-side persistence, and a success feedback toast.

---

## Why this spec exists

SPEC 02 established the `/kids` classroom directory and individual kid profile pages with mock data. In that view, the top header features an "Agregar niño" button that was non-functional (`type="button"` with no click handler). To allow daycare staff and educators to register new children into their classroom, this spec defines the interactive creation dialog based on the visual mockup `references/pantallas/agregar-nino.dc.html`, integrating it as a responsive modal overlay with client-side persistence.

---

## Scope

**In:**

- **Interactive modal dialog on `/kids`:**
  - Clicking "Agregar niño" in `components/kids/kids-directory.tsx` opens the modal.
  - Backdrop overlay with soft darkening/blur (`bg-black/35` or `bg-[#3F362E]/40`) that closes the modal when clicked outside.
  - Escape key listener to cancel and dismiss the dialog.
  - Accessible dialog semantics (`role="dialog"`, `aria-modal="true"`, focus management).
- **Modal visual layout & typography (matching `references/pantallas/agregar-nino.dc.html`):**
  - Centered card container (max-w-[520px], background `#FBF4EC`, border `1px solid #ECE0D0`, border radius `24px`, soft shadow).
  - Header with border bottom (`#ECE0D0`):
    - Left action: "Cancelar" button/link (`#94887B`, font-bold, 15px) that discards changes and closes the modal.
    - Center title: "Agregar niño" (font `Fredoka`, font-semibold, 18px, `#3F362E`).
    - Right action: "Guardar" button (`#D9583C`, font-extrabold, 15px) that submits the form.
- **Form fields & validation:**
  - **NOMBRE COMPLETO (Required):** Text input with placeholder `Ej. Martina López`. Required field; shows an inline error state if empty or whitespace only when attempting to submit.
  - **FECHA DE NACIMIENTO (Required):** Text input with auto-masking for format `DD-MM-YYYY` (e.g. `01-10-2020`, placeholder `dd-mm-aaaa`). The mask automatically formats digits with hyphens as typed (max 10 characters). This mask is purely for user entry and display; in the background the component parses and validates it into a native JavaScript `Date` object (ensuring valid day, month, and non-future year) used to compute `ageYears` and format `birthDateText`.
  - **SALA (Required):** Styled `<select>` dropdown with classroom options: `"Soles"`, `"Lunas"`, `"Estrellas"`. Required field (defaults to `"Soles"`; must have a selected room).
  - **ALERGIAS (ETIQUETAS) (Optional):** Text input with placeholder `Ej. Maní, Lactosa`. Optional field; if left blank, no allergy badge is assigned. When filled, comma-separated values are parsed into allergy badges.
  - **NOTAS MÉDICAS (Optional):** Multi-line textarea with placeholder `Indicaciones, medicación, contactos…` (min height 90px). Optional field for health and care instructions.
- **Client-side persistence:**
  - Storage helper (`lib/kids-store.ts`) that initializes the kids list from `mockKids` in `lib/mock-data.ts` and syncs new entries with `localStorage` (key: `opendaycare:kids:v1`).
  - Generates unique id, URL slug (e.g. `martina-lopez`), avatar initials (e.g. "ML"), and pastel avatar color for each newly created child.
  - Updates the directory list in `components/kids/kids-directory.tsx` in real time.
  - Profile resolution fallback in `/kids/[slug]` to read newly created kids from client storage if not present in initial static `mockKids`.
- **Success notification feedback:**
  - Upon clicking "Guardar" with valid data, the modal closes and a toast/banner appears (e.g., "Niño agregado correctamente") with an auto-dismiss timer.

**Out of scope (for future specs):**

- Server-side database integration, Prisma/SQL schemas, or backend REST/tRPC endpoints.
- Photo / avatar file upload (avatar uses computed initials and background color).
- Parent invitation / linking flow during child creation (linking parents is handled in a dedicated spec).
- Editing an existing child profile ("Editar" button in profile view).

---

## Data model

The form submission introduces the following interface and persistence model:

```ts
// Form values collected by AddKidModal
export interface AddKidFormData {
  fullName: string;
  birthDate: Date; // Background native Date object parsed from masked input (DD-MM-YYYY)
  birthDateText: string; // Formatted date string (e.g. "1 oct 2020") derived from birthDate
  roomName: string; // e.g. "Soles", "Lunas", "Estrellas"
  allergiesText: string; // e.g. "Maní, Lactosa"
  medicalNotes: string;
}

// Local component state for the masked input field
export interface DateInputState {
  displayValue: string; // Masked string displayed to user, e.g. "01-10-2020"
  dateObject: Date | null; // Parsed background Date instance (null if incomplete or invalid)
}
}

// Stored child profile adhering to SPEC 02 KidProfile
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

Storage helper conventions in `lib/kids-store.ts`:
- Storage key: `opendaycare:kids:v1`.
- Reading initializes with `mockKids` if no stored entries exist.
- Writing appends the newly created `KidProfile` and serializes to JSON.

---

## Implementation plan

1. **Create the kids storage and state utility (`lib/kids-store.ts`):**
   - Implement functions `getStoredKids(): KidProfile[]`, `saveKid(data: AddKidFormData): KidProfile`, and a React hook `useKidsStore()` for reactive directory rendering.
   - Implement date helper functions:
     - `parseMaskedDate(masked: string): Date | null`: Parses a `DD-MM-YYYY` string (e.g. `01-10-2020`) into a valid JavaScript `Date` instance, validating day, month, year, and ensuring it represents a non-future date.
     - `formatDateToDisplay(date: Date): string`: Formats a `Date` object into the Spanish UI format (e.g. `"1 oct 2020"`).
     - `calculateAgeYears(date: Date): number`: Calculates whole years between the birth date and today.
   - Helper to derive slug (kebab-case from name, ensuring uniqueness against collisions), initials (first letters of first and last name), and pastel avatar color from a predefined palette (`#FCEAE5`, `#EBF5FA`, `#FFF4E5`, `#F3E8F9`).
   - Helper to parse comma-separated allergies into `KidBadge` (type: `"allergy"`, coral badge styling).
   - Manual test: Call storage helpers in a quick unit test or console to verify serializing, deserializing, and fallback to `mockKids`.

2. **Build the `AddKidModal` component (`components/kids/add-kid-modal.tsx`):**
   - Create the modal dialog markup adhering strictly to `references/pantallas/agregar-nino.dc.html`.
   - Setup fixed viewport overlay with backdrop blur and centered card container (`max-w-[520px]`).
   - Implement header bar with "Cancelar" button, "Agregar niño" title (font Fredoka), and "Guardar" submit button.
   - Implement "FECHA DE NACIMIENTO" input mask:
     - As user types digits, automatically formats to `DD-MM-YYYY` pattern (e.g., `01-10-2020`) with placeholder `dd-mm-aaaa`.
     - In background, computes and stores the corresponding `Date` object.
   - Add inputs for "NOMBRE COMPLETO", "SALA" (select with Soles, Lunas, Estrellas), "ALERGIAS (ETIQUETAS)", and "NOTAS MÉDICAS" textarea.
   - Include validation and inline error indicators if any required field ("NOMBRE COMPLETO", "FECHA DE NACIMIENTO", or "SALA") is missing, incomplete, or invalid when "Guardar" is pressed.
   - Ensure optional fields ("ALERGIAS" and "NOTAS MÉDICAS") do not trigger validation errors if left empty.
   - Attach keyboard listener (`Escape` to close) and click-outside handler.
   - Manual test: Mount modal in storybook or temporary state; verify pixel-perfect styling against mockup and test typing masked dates.

3. **Wire modal into `KidsDirectory` and add success toast:**
   - Update `components/kids/kids-directory.tsx` to use `useKidsStore()` instead of static props for the active list.
   - Connect the "Agregar niño" header button to set `isAddModalOpen = true`.
   - On successful save from modal: close modal, trigger toast notification ("Niño agregado con éxito"), and verify the new child card immediately appears in the grid.
   - Manual test: Click "Agregar niño", enter child details, click "Guardar", verify modal closes, toast appears, and card is visible in the directory.

4. **Support newly added kids in dynamic profile route (`app/kids/[slug]/page.tsx`):**
   - Add a client-side wrapper or fallback query for dynamic profiles so navigating to `/kids/[new-slug]` reads from stored kids if not present in the static `mockKids` array.
   - Manual test: Click on the newly added child's card in the directory; verify the profile loads with child name, room, allergy badge, and medical notes.

5. **Visual review, responsive testing, and code quality:**
   - Verify modal behavior on mobile viewport (scales to `w-full`, padding adjusts without clipping).
   - Run type checks (`npx tsc --noEmit`) and linter (`npm run lint`).

---

## Acceptance criteria

- [x] Clicking "Agregar niño" in `/kids` opens the modal with backdrop overlay and smooth appearance.
- [x] Clicking "Cancelar" or the backdrop closes the modal without creating a child or altering the list.
- [x] Pressing the `Escape` key closes the modal.
- [x] Modal visual presentation matches `references/pantallas/agregar-nino.dc.html` (card background `#FBF4EC`, border `#ECE0D0`, border-radius 24px, Fredoka title).
- [x] Header includes "Cancelar" (`#94887B`), "Agregar niño" title, and "Guardar" (`#D9583C`).
- [x] Form contains inputs:
  - "NOMBRE COMPLETO" (required, placeholder `Ej. Martina López`).
  - "FECHA DE NACIMIENTO" (required, masked placeholder `dd-mm-aaaa`, formats input as `DD-MM-YYYY` and manages a background `Date` object).
  - "SALA" (required, dropdown with options: Soles, Lunas, Estrellas; defaults to Soles).
  - "ALERGIAS (ETIQUETAS)" (optional, placeholder `Ej. Maní, Lactosa`).
  - "NOTAS MÉDICAS" (optional, textarea, placeholder `Indicaciones, medicación, contactos…`).
- [x] Typing digits into "FECHA DE NACIMIENTO" applies the `DD-MM-YYYY` mask automatically (e.g. typing `01102020` results in `01-10-2020`).
- [x] In background, the date is represented and validated as a native JavaScript `Date` object; entering an invalid calendar date (e.g. `31-02-2021` or a future date) triggers a validation error.
- [x] Attempting to save when any required field ("NOMBRE COMPLETO", "FECHA DE NACIMIENTO", or "SALA") is missing or invalid displays clear validation error styling and prevents submission.
- [x] Leaving optional fields ("ALERGIAS", "NOTAS MÉDICAS") empty permits successful submission without errors.
- [x] Saving with valid required data closes the modal and displays a success notification/toast.
- [x] The newly created child immediately appears in the `/kids` grid with correct avatar initials, room, age calculated from the `Date` object, and allergy badge.
- [x] The newly created child persists after refreshing the browser (`localStorage`).
- [x] Clicking on the newly created child's card navigates to `/kids/[slug]` and displays their profile correctly.
- [x] TypeScript check (`npx tsc --noEmit`) passes without errors.

---

## Decisions taken and discarded

- **Decision:** Implement "Agregar niño" as a modal overlay on `/kids` rather than a standalone `/kids/new` page.
  - *Rationale:* User confirmed preference in Phase 2. Keeps educator workflow fast and contextual without full-page navigation context loss.
- **Decision:** Client-side persistence using `localStorage` synced with `mockKids`.
  - *Rationale:* Avoids premature backend complexity while providing realistic stateful behavior where newly created children remain visible and navigable across browser refreshes.
- **Decision:** Close modal and display a success toast banner upon saving instead of redirecting away.
  - *Rationale:* User confirmed requirement. Users can immediately see their new entry in the directory and receive positive feedback.
- **Decision:** Standard styled `<select>` for "SALA" and comma-delimited text input for "ALERGIAS".
  - *Rationale:* User confirmed requirement. Balances simplicity, accessibility, and high visual fidelity to the mockup without overengineering custom dropdown primitives.
- **Decision:** Explicit required fields policy ("Nombre completo", "Fecha Nacimiento", and "Sala" required; "Alergias" and "Notas médicas" optional).
  - *Rationale:* User requirement. Ensures a child always has essential enrollment data while allowing medical notes and allergy tags to remain optional when not applicable.
- **Decision:** Input masking (`DD-MM-YYYY`) for "FECHA DE NACIMIENTO" paired with a background `Date` object.
  - *Rationale:* User requirement. Provides a guided, consistent keystroke experience (e.g. typing `01102020` yields `01-10-2020`) without relying on inconsistent native browser date picker controls, while maintaining strongly-typed `Date` validation and accurate age calculations internally.

---

## Identified risks

| Risk | Mitigation |
| --- | --- |
| Next.js SSR hydration mismatch with `localStorage` | Use an `isMounted` flag or `useEffect` hook in `useKidsStore` to ensure initial server render matches static HTML before hydrating stored items. |
| Server-rendered `/kids/[slug]` returning 404 for client-stored kids | Include a client fallback component on `/kids/[slug]` that checks `localStorage` if the static `mockKids.find(...)` lookup returns undefined. |
| Duplicate slug generation if two children share the same name | Append a numerical suffix or timestamp (e.g. `martina-lopez-2`) if the slug already exists. |

---

## What is **not** in this spec

- Backend API endpoints, database schemas, or Prisma integration.
- Photo file upload for child avatars.
- Inviting or linking parents to the new child during creation.
- Editing or deleting existing child records.
