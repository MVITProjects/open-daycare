"use client";

import Link from "next/link";
import { useState } from "react";
import { mockUserProfile, type KidProfile } from "@/lib/mock-data";

interface KidsDirectoryProps {
  kids: KidProfile[];
}

function parentsSummary(kid: KidProfile): string {
  if (kid.parents.length === 0) {
    return "sin padres vinculados";
  }

  return kid.parents.length === 1
    ? "1 padre vinculado"
    : `${kid.parents.length} padres vinculados`;
}

export function KidsDirectory({ kids }: KidsDirectoryProps) {
  const [query, setQuery] = useState("");

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const normalizedQuery = normalizeText(query.trim());
  const filteredKids = normalizedQuery
    ? kids.filter((kid) => normalizeText(kid.name).includes(normalizedQuery))
    : kids;

  return (
    <div className="mx-auto w-full max-w-[880px] px-10 pb-20 pt-[34px]">
      <div className="mb-[22px] flex items-end justify-between gap-4">
        <div>
          <div className="mb-1 text-[12.5px] font-extrabold tracking-[.8px] text-[#D9583C]">
            GESTIÓN
          </div>
          <h1 className="m-0 font-display text-[30px] font-semibold text-[#3F362E]">
            Niños
          </h1>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-[14px] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white"
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
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Agregar niño
        </button>
      </div>

      <div className="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-[#ECE0D0] bg-[#FFFDF9] px-4 py-3">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B0A290"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar niño…"
          aria-label="Buscar niño"
          className="flex-1 border-none bg-transparent text-[15px] text-[#3F362E] outline-none placeholder:text-[#B6A99B]"
        />
      </div>

      <div className="mb-3.5 flex items-center gap-3">
        <span className="text-[12.5px] font-extrabold tracking-[.8px] text-[#3F362E]">
          {mockUserProfile.roomName.toUpperCase()}
        </span>
        <span className="text-[13px] text-[#A89A8B]">
          {filteredKids.length}{" "}
          {filteredKids.length === 1 ? "niño" : "niños"}
        </span>
        <span className="h-px flex-1 bg-[#E7DAC8]" />
      </div>

      {filteredKids.length === 0 ? (
        <p className="rounded-[18px] border border-dashed border-[#DBCDBA] bg-[#F4ECE1] px-4 py-6 text-center text-[14px] text-[#94887B]">
          No encontramos niños con ese nombre.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {filteredKids.map((kid) => (
            <Link
              key={kid.id}
              href={`/kids/${kid.slug}`}
              className="flex min-w-0 items-center gap-3.5 rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] p-4 transition-[border-color,transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:border-[#F2A78E] hover:shadow-[0_8px_18px_-12px_rgba(120,90,60,.5)]"
              style={{ boxShadow: "0 4px 14px -12px rgba(120,90,60,.5)" }}
            >
              <span
                className="flex h-12 w-12 flex-none items-center justify-center rounded-full font-display text-[19px] font-semibold"
                style={{ background: kid.avatarBg, color: kid.avatarColor }}
              >
                {kid.avatarInitial}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[16px] font-semibold text-[#3F362E]">
                  {kid.name}
                </span>
                <span className="block text-[13px] text-[#A89A8B]">
                  {kid.ageYears} años · {parentsSummary(kid)}
                </span>
              </span>
              {kid.badge ? (
                <span
                  className="flex-none rounded-full px-[9px] py-[5px] text-[11px] font-extrabold"
                  style={{ background: kid.badge.bg, color: kid.badge.color }}
                >
                  {kid.badge.label}
                </span>
              ) : (
                <svg
                  className="flex-none"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#CBB89F"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
