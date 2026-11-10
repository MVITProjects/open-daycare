# SPEC 03 — Login screen

> **Status:** Approved  
> **Depends on:** SPEC 01  
> **Date:** 2026-11-10  
> **Objective:** Implement the `/login` authentication screen matching the visual design, branding, and typography of `references/pantallas/login.dc.html`, excluding the role selector ("Personal" and "Familiar" buttons).

---

## Why this spec exists

The application currently has the primary authenticated views (`/` feed and `/kids` directory/profiles) with navigation links pointing to `/login` (e.g. the "Cerrar sesión" button in `components/sidebar.tsx`). To provide a cohesive visual journey without broken routes, the standalone login view must be implemented. In `references/pantallas/login.dc.html`, a role selector ("Personal" vs "Familia") was present in the mockup; per product direction, that selector is explicitly excluded so users encounter a unified, clean credentials form.

---

## Scope

**In:**

- **Dedicated standalone route (`/login`):**
  - Full-screen split layout (1.05fr / 1fr on desktop; stacked column or prioritized form on mobile) without the sidebar.
  - Page title and metadata ("Iniciar sesión · OpenDayCare").
- **Left branding banner (desktop/tablet):**
  - Warm gradient background (`linear-gradient(155deg, #F6A98E 0%, #F2937A 45%, #EC7E62 100%)`) with decorative translucent circular shapes.
  - OpenDayCare brand icon (sun SVG) and wordmark in font `Fredoka`.
  - Headline: "El día de cada niño,\ncompartido con su familia." in font `Fredoka`.
  - Subtitle: "Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar." in font `Nunito`.
  - Location badge: "🌿 Guardería Sala Soles".
- **Right login form container:**
  - Heading "Iniciar sesión" (Fredoka, 30px) and subtitle "Ingresá para ver el día de hoy." (15px, `#94887B`).
  - **Exclusion of role selector:** The "INGRESO COMO" section with "Personal" and "Familia" toggle buttons from the HTML mockup is intentionally excluded.
  - Email field: Label "EMAIL", text input with placeholder `tu@email.com` or `nombre@ejemplo.com`, styled borders and focus states.
  - Password field: Label "CONTRASEÑA", password input with placeholder `••••••••`, styled borders and focus states.
  - "Olvidaste tu contraseña?" auxiliary link: Right-aligned, colored `#C5503A`, non-navigating placeholder (`href="#"`).
  - "Iniciar sesión" action button: Full-width button with coral gradient (`linear-gradient(180deg, #F4977E, #EE8164)`), soft shadow (`rgba(238,129,100,0.7)`), navigating to `/` (home feed) on submit.
  - Account activation helper: Centered footer copy "¿Te invitó la guardería? Activá tu cuenta" with styled non-navigating link (`href="#"`).
- **Responsive design:**
  - Desktop: 2-column split viewport height (`grid-cols-[1.05fr_1fr]`, min-h-screen).
  - Mobile/small screens: Banner collapses cleanly above the form or adjusts gracefully without layout overflow.

**Out of scope (for future specs):**

- Real backend authentication, session cookies, JWTs, OAuth, or server-side password validation.
- Password recovery flow and screen (`/recuperar-contrasena`).
- Account invitation activation flow and screen (`/activar-cuenta`).
- Role-based routing (e.g. parent feed vs teacher feed).

---

## Data model

This feature introduces no new persistent backend data structures. It uses a lightweight client-side form state model:

```ts
// Local component state for the login form
export interface LoginFormState {
  email: string;
  password: string;
  isLoading: boolean;
  errorMessage?: string;
}
```

---

## Implementation plan

1. **Create the login page skeleton:**
   - Create `app/login/page.tsx` with export metadata `title: "Iniciar sesión · OpenDayCare"`.
   - Setup outer container with `min-h-screen` and background color `#FBF4EC`.
   - Manual test: Navigate to `http://localhost:3000/login` and verify clean blank canvas with correct background.

2. **Build the left branding banner component/section:**
   - Implement the left column banner with coral gradient (`linear-gradient(155deg, #F6A98E 0%, #F2937A 45%, #EC7E62 100%)`).
   - Add absolute positioned decorative circles (`top-[-140px] right-[-120px]`, `bottom-[-110px] left-[-80px]`).
   - Render the OpenDayCare logo, Fredoka typography headers, and footer room badge.
   - Manual test: Verify visual fidelity against `references/pantallas/login.dc.html`.

3. **Build the login form component/section:**
   - Implement the right column container (`max-w-[392px]` centered).
   - Render "Iniciar sesión" header and subtitle.
   - Omit the role toggle buttons ("Personal" / "Familia").
   - Add email and password form inputs with styled borders (`#EADFD0`), rounded corners (`rounded-[14px]`), and focus styles.
   - Add "¿Olvidaste tu contraseña?" link styled with `#C5503A`.
   - Add submit button with coral gradient (`#F4977E` to `#EE8164`) and submit handler calling `router.push("/")`.
   - Add "¿Te invitó la guardería? Activá tu cuenta" footer link.
   - Manual test: Typing into inputs works; clicking "Iniciar sesión" navigates to `/`.

4. **Verify navigation integration & responsive behavior:**
   - Test clicking "Cerrar sesión" from `components/sidebar.tsx` lands on `/login`.
   - Verify layout responsiveness across desktop and mobile widths.
   - Run type checks (`npx tsc --noEmit`) and lint (`npm run lint`).

---

## Acceptance criteria

- [ ] Route `/login` exists and loads without requiring authentication or throwing errors.
- [ ] Left column displays the coral gradient banner with brand logo, "OpenDayCare", headline "El día de cada niño, compartido con su familia.", and footer badge "🌿 Guardería Sala Soles".
- [ ] Right column contains the "Iniciar sesión" title and subtitle "Ingresá para ver el día de hoy.".
- [ ] The "INGRESO COMO" section and role toggle buttons ("Personal" and "Familia") are NOT rendered anywhere on the screen.
- [ ] Email input is present with empty initial state and placeholder.
- [ ] Password input is present with masked input type and placeholder `••••••••`.
- [ ] "¿Olvidaste tu contraseña?" link is displayed right-aligned in red/coral `#C5503A`.
- [ ] "Iniciar sesión" button is styled with coral gradient, rounded corners, and shadow matching the mockup.
- [ ] Submitting the form or clicking "Iniciar sesión" redirects the user to `/` (home feed).
- [ ] Footer copy displays "¿Te invitó la guardería? Activá tu cuenta" with highlighted link.
- [ ] Sidebar is NOT displayed on the `/login` route.
- [ ] Clicking the "Cerrar sesión" button in the sidebar from `/` or `/kids` navigates directly to `/login`.
- [ ] TypeScript check (`npx tsc --noEmit`) passes without errors.

---

## Decisions taken and discarded

- **Decision:** Exclude the "Personal" and "Familia" toggle buttons from the login form.
  - *Rationale:* Explicit requirement from user prompt ("in this screen i need dont include 'Personal' and 'Familiar' fields"). Simplifies login UX into a single unified credentials entry.
- **Decision:** Place the screen at `app/login/page.tsx` as a standalone full-height layout.
  - *Rationale:* The existing `app/layout.tsx` is an application-level root layout without the sidebar (sidebar is imported per-page in `/` and `/kids`). A simple page at `/login` naturally avoids the sidebar without needing route groups or layout splits.
- **Decision:** Mock client-side navigation to `/` upon submitting without strict credential validation.
  - *Rationale:* Consistent with SPEC 01 and SPEC 02 architecture where backend authentication is deferred. Allows seamless manual and automated UI testing.
- **Decision:** Auxiliary links ("¿Olvidaste tu contraseña?", "Activá tu cuenta") styled as non-navigating anchors (`href="#"`).
  - *Rationale:* Account recovery and invitation onboarding screens are separate flows to be specified in future specs.

---

## Identified risks

- **Risk:** Mobile layout overflow if desktop split grid doesn't collapse gracefully.
  - *Mitigation:* Use responsive Tailwind classes (`hidden lg:flex` for the left banner on small screens, or stacked layout) to ensure the login form is always fully visible and comfortable on small mobile viewports.
