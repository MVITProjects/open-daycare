"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export interface LoginFormState {
  email: string;
  password: string;
  isLoading: boolean;
  errorMessage?: string;
}

const INITIAL_STATE: LoginFormState = {
  email: "",
  password: "",
  isLoading: false,
};

export function LoginForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<LoginFormState>(INITIAL_STATE);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState((state) => ({ ...state, isLoading: true }));
    router.push("/");
  }

  return (
    <>
      <h2 className="m-0 mb-[6px] font-display text-[30px] font-semibold text-[#3F362E]">
        Iniciar sesión
      </h2>
      <p className="m-0 mb-7 text-[15px] text-[#94887B]">
        Ingresá para ver el día de hoy.
      </p>

      <form onSubmit={handleSubmit}>
        <label
          htmlFor="login-email"
          className="mb-2 block text-[12px] font-bold tracking-[.7px] text-[#94887B]"
        >
          EMAIL
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={formState.email}
          onChange={(event) =>
            setFormState((state) => ({ ...state, email: event.target.value }))
          }
          className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:border-[#F2937A] focus:outline-none focus:ring-4 focus:ring-[#F2937A]/15"
        />

        <label
          htmlFor="login-password"
          className="mb-2 block text-[12px] font-bold tracking-[.7px] text-[#94887B]"
        >
          CONTRASEÑA
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={formState.password}
          onChange={(event) =>
            setFormState((state) => ({ ...state, password: event.target.value }))
          }
          className="mb-[10px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:border-[#F2937A] focus:outline-none focus:ring-4 focus:ring-[#F2937A]/15"
        />

        <div className="mb-5 text-right">
          <a
            href="#"
            className="text-[13.5px] font-bold text-[#C5503A]"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button
          type="submit"
          disabled={formState.isLoading}
          className="w-full cursor-pointer rounded-[15px] py-[15px] text-center text-[16px] font-extrabold text-white transition hover:brightness-[1.03] disabled:cursor-wait disabled:opacity-90"
          style={{
            background: "linear-gradient(180deg, #F4977E, #EE8164)",
            boxShadow: "0 10px 22px -8px rgba(238,129,100,.7)",
          }}
        >
          Iniciar sesión
        </button>
      </form>

      <p className="m-0 mt-6 text-center text-[14.5px] text-[#94887B]">
        ¿Te invitó la guardería?{" "}
        <a href="#" className="font-extrabold text-[#C5503A]">
          Activá tu cuenta
        </a>
      </p>
    </>
  );
}
