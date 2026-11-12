import { useCallback, useEffect, useState } from "react";
import {
  mockKids,
  type KidBadge,
  type KidProfile,
} from "@/lib/mock-data";

export const KIDS_STORAGE_KEY = "opendaycare:kids:v1";
export const KIDS_STORE_UPDATED_EVENT = "opendaycare:kids-updated";

export interface AddKidFormData {
  fullName: string;
  birthDate: Date;
  birthDateText: string;
  roomName: string;
  allergiesText: string;
  medicalNotes: string;
}

export interface DateInputState {
  displayValue: string;
  dateObject: Date | null;
}

const MONTH_ABBREVIATIONS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
] as const;

const AVATAR_PALETTE = [
  { bg: "#FCEAE5", color: "#B95B44" },
  { bg: "#EBF5FA", color: "#3D7F97" },
  { bg: "#FFF4E5", color: "#9A7B1E" },
  { bg: "#F3E8F9", color: "#7B5FC0" },
] as const;

const ALLERGY_BADGE_STYLE = { bg: "#FBD8CC", color: "#D9684A" } as const;

/**
 * Parses a `DD-MM-YYYY` masked string into a valid local `Date`.
 * Returns `null` when the mask is incomplete, the calendar date does not
 * exist (e.g. `31-02-2021`) or the date is in the future.
 */
export function parseMaskedDate(masked: string): Date | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(masked.trim());

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date.getTime() > today.getTime()) {
    return null;
  }

  return date;
}

/** Formats a date as the Spanish UI string used across the app, e.g. `1 oct 2020`. */
export function formatDateToDisplay(date: Date): string {
  return `${date.getDate()} ${MONTH_ABBREVIATIONS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Calculates whole years elapsed between `date` and today. */
export function calculateAgeYears(date: Date): number {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();

  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  return Math.max(age, 0);
}

/** Builds a unique kebab-case slug from a kid's name. */
export function deriveSlug(
  name: string,
  existingSlugs: Iterable<string> = [],
): string {
  const base =
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "nino";

  const taken = new Set(existingSlugs);

  if (!taken.has(base)) {
    return base;
  }

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) {
    suffix += 1;
  }

  return `${base}-${suffix}`;
}

/** Returns the first letter of the first and last name, e.g. `Martina López` → `ML`. */
export function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

/** Picks a deterministic pastel avatar palette entry from the kid's name. */
export function deriveAvatarColors(name: string): {
  bg: string;
  color: string;
} {
  let hash = 0;

  for (const character of name) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  const paletteEntry = AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
  return { bg: paletteEntry.bg, color: paletteEntry.color };
}

/**
 * Turns the comma-separated allergies field into the first allergy badge.
 * The full text (plus medical notes) is kept as the profile's care notes.
 */
export function parseAllergies(
  allergiesText: string,
): { badge?: KidBadge; allergyNotes?: string } {
  const entries = allergiesText
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (entries.length === 0) {
    return {};
  }

  return {
    badge: {
      label: entries[0].toUpperCase(),
      type: "allergy",
      ...ALLERGY_BADGE_STYLE,
    },
    allergyNotes: entries.join(", "),
  };
}

function formatEnrollmentDate(date: Date): string {
  return `${MONTH_ABBREVIATIONS[date.getMonth()]} ${date.getFullYear()}`;
}

function createKidId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `kid-${crypto.randomUUID()}`;
  }

  return `kid-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildCareNotes(
  allergiesText: string,
  medicalNotes: string,
): string | undefined {
  const parts = [allergiesText, medicalNotes]
    .map((value) => value.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(". ") : undefined;
}

/** Reads the persisted kids list, falling back to the static mock data. */
export function getStoredKids(): KidProfile[] {
  if (typeof window === "undefined") {
    return mockKids;
  }

  try {
    const raw = window.localStorage.getItem(KIDS_STORAGE_KEY);

    if (!raw) {
      return mockKids;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return mockKids;
    }

    return parsed as KidProfile[];
  } catch {
    return mockKids;
  }
}

/** Creates a new kid profile, appends it to storage and returns it. */
export function saveKid(data: AddKidFormData): KidProfile {
  const existingKids = getStoredKids();
  const { badge } = parseAllergies(data.allergiesText);
  const { bg, color } = deriveAvatarColors(data.fullName);
  const careNotes = buildCareNotes(data.allergiesText, data.medicalNotes);

  const kid: KidProfile = {
    id: createKidId(),
    slug: deriveSlug(
      data.fullName,
      existingKids.map((existing) => existing.slug),
    ),
    name: data.fullName.trim(),
    ageYears: calculateAgeYears(data.birthDate),
    roomName: data.roomName,
    birthDateText: data.birthDateText || formatDateToDisplay(data.birthDate),
    enrollmentDateText: formatEnrollmentDate(new Date()),
    avatarInitial: deriveInitials(data.fullName),
    avatarBg: bg,
    avatarColor: color,
    ...(badge ? { badge } : {}),
    ...(careNotes ? { allergyNotes: careNotes } : {}),
    parents: [],
  };

  if (typeof window !== "undefined") {
    const nextKids = [...existingKids, kid];

    try {
      window.localStorage.setItem(KIDS_STORAGE_KEY, JSON.stringify(nextKids));
    } catch {
      // Storage can be unavailable (private mode/quota); keep the in-memory list.
    }

    window.dispatchEvent(new Event(KIDS_STORE_UPDATED_EVENT));
  }

  return kid;
}

export interface KidsStore {
  kids: KidProfile[];
  addKid: (data: AddKidFormData) => KidProfile;
}

/**
 * Reactive view over the stored kids list. The first render matches the server
 * (`mockKids`) and hydrates from `localStorage` inside an effect to avoid
 * hydration mismatches.
 */
export function useKidsStore(): KidsStore {
  const [kids, setKids] = useState<KidProfile[]>(mockKids);

  useEffect(() => {
    const sync = () => {
      setKids(getStoredKids());
    };

    sync();

    window.addEventListener(KIDS_STORE_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(KIDS_STORE_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addKid = useCallback((data: AddKidFormData) => {
    const kid = saveKid(data);
    setKids(getStoredKids());
    return kid;
  }, []);

  return { kids, addKid };
}
