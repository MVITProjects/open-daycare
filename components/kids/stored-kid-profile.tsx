"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KidProfileView } from "@/components/kids/kid-profile-view";
import { getStoredKids } from "@/lib/kids-store";
import type { KidProfile } from "@/lib/mock-data";

interface StoredKidProfileProps {
  slug: string;
}

/**
 * Client fallback for profiles created at runtime and persisted in
 * `localStorage`. Static profiles are resolved on the server; this component
 * only mounts when the slug is not part of `mockKids`.
 */
export function StoredKidProfile({ slug }: StoredKidProfileProps) {
  // `undefined` means "not looked up yet", `null` means "not found".
  const [kid, setKid] = useState<KidProfile | null | undefined>(undefined);

  useEffect(() => {
    const load = () => {
      const storedKid =
        getStoredKids().find((candidate) => candidate.slug === slug) ?? null;
      setKid(storedKid);
    };

    load();
  }, [slug]);

  if (kid === undefined) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mx-auto w-full max-w-[820px] px-10 pb-20 pt-[34px]"
      >
        <span className="sr-only">Cargando perfil…</span>
        <div className="mb-5 h-5 w-28 animate-pulse rounded-full bg-[#EADFD0]" />
        <div className="flex items-center gap-[18px]">
          <div className="h-[84px] w-[84px] animate-pulse rounded-full bg-[#EADFD0]" />
          <div className="flex-1">
            <div className="mb-2.5 h-6 w-52 max-w-full animate-pulse rounded-full bg-[#EADFD0]" />
            <div className="h-4 w-36 max-w-full animate-pulse rounded-full bg-[#EADFD0]" />
          </div>
        </div>
      </div>
    );
  }

  if (kid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center px-10 py-20">
        <div
          className="flex w-full max-w-[440px] flex-col items-center rounded-[20px] border border-[#ECE0D0] bg-[#FFFDF9] px-8 py-10 text-center"
          style={{ boxShadow: "0 4px 16px -12px rgba(120,90,60,.5)" }}
        >
          <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FBE3D8] font-display text-[26px] font-semibold text-[#D9583C]">
            ?
          </span>
          <h1 className="m-0 font-display text-[24px] font-semibold text-[#3F362E]">
            No encontramos a este niño
          </h1>
          <p className="mb-6 mt-2 text-[14.5px] leading-[1.5] text-[#94887B]">
            Puede que el perfil ya no exista o que el enlace sea incorrecto.
          </p>
          <Link
            href="/kids"
            className="flex items-center gap-2 rounded-[14px] px-5 py-3 text-[14.5px] font-extrabold text-white"
            style={{
              background: "linear-gradient(180deg, #F4977E, #EE8164)",
              boxShadow: "0 8px 18px -8px rgba(238,129,100,.7)",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Volver a Niños
          </Link>
        </div>
      </div>
    );
  }

  return <KidProfileView kid={kid} />;
}
