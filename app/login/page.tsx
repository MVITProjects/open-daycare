import type { Metadata } from "next";
import { LoginForm } from "@/components/login/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión · OpenDayCare",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#FBF4EC] lg:grid-cols-[1.05fr_1fr]">
      <div
        className="relative flex flex-col justify-between overflow-hidden px-7 py-9 text-white lg:px-[60px] lg:py-14"
        style={{
          background:
            "linear-gradient(155deg, #F6A98E 0%, #F2937A 45%, #EC7E62 100%)",
        }}
      >
        <div className="pointer-events-none absolute -right-[120px] -top-[140px] h-[420px] w-[420px] rounded-full bg-white/[0.12]" />
        <div className="pointer-events-none absolute -bottom-[110px] -left-[80px] h-[300px] w-[300px] rounded-full bg-white/[0.10]" />

        <div className="relative flex items-center gap-[13px]">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-white/[0.22]">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </div>
          <span className="font-display text-[21px] font-semibold tracking-[.5px]">
            OpenDayCare
          </span>
        </div>

        <div className="relative mt-10 lg:mt-0">
          <h1 className="mb-[18px] font-display text-[32px] font-semibold leading-[1.12] lg:text-[42px]">
            El día de cada niño,
            <br />
            compartido con su familia.
          </h1>
          <p className="m-0 max-w-[430px] text-[17px] leading-[1.6] text-white/[0.92]">
            Publicá momentos, gestioná las salas y mantené a las familias cerca,
            desde un solo lugar.
          </p>
        </div>

        <div className="relative mt-10 text-[14px] text-white/[0.90] lg:mt-0">
          🌿 Guardería Sala Soles
        </div>
      </div>

      <div className="flex items-center justify-center px-7 py-12 sm:p-10">
        <div className="w-full max-w-[392px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
