import Link from "next/link";
import { Sidebar } from "@/components/sidebar";

export default function KidNotFound() {
  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <Sidebar activeItem="ninos" />
      <main className="flex min-w-0 flex-1 items-center justify-center px-10 py-20">
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
      </main>
    </div>
  );
}
