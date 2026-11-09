---
name: spec-verifier
description: Verifies acceptance criteria of a spec. Audits code, tests Next.js best practices with Context7, and inspects UI rendering with Playwright MCP and vision models, checking off items in the spec.
disable-model-invocation: true
argument-hint: <NN-spec-name>
allowed-tools: Read, Glob, Grep, Edit, Write, AskUserQuestion, Bash(npx tsc:*), Bash(npm run build:*), Bash(cat:*), Bash(ls:*)
---

# /spec-verifier — Verifier of Spec Acceptance Criteria

## Session context

Current branch:
!`git branch --show-current`

Specs available in this folder:
!`ls specs/ 2>/dev/null || echo "The specs/ folder does not exist"`

Screenshots in .playwright-mcp/:
!`ls .playwright-mcp/ 2>/dev/null || echo "No screenshots captured yet"`

---

## Instructions

Follow these five phases to verify the spec's acceptance criteria:

---

### Phase 1 — Locate the Spec

The received argument is: `$ARGUMENTS`

If `$ARGUMENTS` is empty:
- List the available specs from `specs/`.
- Ask the user which spec to verify.
- Stop and wait for the response.

If `$ARGUMENTS` has a value:
- Look for the matching file in `specs/` (accepting full file name, number prefix `01`, or slug `home-feed-template`).
- Once located, read the spec contents.

---

### Phase 2 — Extract Acceptance Criteria

Extract all items under the `## Acceptance criteria` (or `## Criterios de aceptación`) section:
- List total criteria and currently unchecked (`[ ]`) items.
- If all items are already checked (`[x]`), inform the user that the spec is already fully verified.

---

### Phase 3 — Audit Code & Next.js Best Practices

1. **Build & Type Check**:
   - Run `npx tsc --noEmit` to confirm type-check passes.
   - Run `npm run build` if full build is required by the criteria.

2. **Next.js Best Practices via Context7**:
   - For relevant framework APIs (Next.js 16 font loading, layout props, cache configuration), consult Context7 MCP docs to ensure compliance with modern standards.

---

### Phase 4 — Visual & UI Verification with Playwright MCP & Vision

For visual and user-interface criteria:
1. Ensure the application is accessible on `http://localhost:3000`.
2. Use Playwright MCP to navigate to the target route.
3. Take screenshots saving them to `.playwright-mcp/<spec-name>-<criterion>.png`.
4. Inspect the resulting image with vision analysis against `references/pantallas/*.dc.html` and `references/screenshots/*.png`:
   - Fonts (`Fredoka`, `Nunito`).
   - Palette colors (`#F6ECDF`, `#3F362E`, coral gradients).
   - Component dimensions and alignment.

---

### Phase 5 — Check Off Criteria & Finalize

1. For each passing criterion, update the spec file (`specs/NN-slug.md`) replacing `- [ ]` with `- [x]`.
2. If minor discrepancies are found, fix them in the code, re-verify, and mark `- [x]`.
3. If any criteria cannot be satisfied due to scope gaps or major issues, leave `- [ ]` unchecked and report the exact blocker.
4. When all criteria are checked off (`[x]`), recommend updating the spec state to `Implemented` / `Implementado`.
