import Link from "next/link";
import { mockUserProfile } from "@/lib/mock-data";

export type SidebarItem = "feed" | "ninos" | "avisos" | "mi-cuenta";

interface SidebarProps {
  activeItem?: SidebarItem;
}

const NAV_ITEMS: {
  key: SidebarItem;
  label: string;
  href: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "feed",
    label: "Feed",
    href: "/",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    key: "ninos",
    label: "Niños",
    href: "/kids",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="7" r="3" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 20a5 5 0 0 1 5.5-4.9" />
      </svg>
    ),
  },
  {
    key: "avisos",
    label: "Avisos",
    href: "/avisos",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
    ),
  },
  {
    key: "mi-cuenta",
    label: "Mi cuenta",
    href: "/mi-cuenta",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export function Sidebar({ activeItem = "feed" }: SidebarProps) {
  return (
    <aside className="sticky top-0 flex h-screen w-[248px] flex-none flex-col border-r border-[#ECE0D0] bg-[#FFFDF9] px-4 py-6">
      <Link
        href="/"
        className="flex items-center gap-[11px] px-2 pb-[22px] pt-1"
      >
        <span
          className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl"
          style={{
            background: "linear-gradient(155deg, #F8C3A8, #F2937A)",
          }}
        >
          <svg
            width="21"
            height="21"
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
        </span>
        <span>
          <span className="block font-display text-[17px] font-semibold leading-none text-[#3F362E]">
            OpenDayCare
          </span>
          <span className="mt-0.5 block text-[11.5px] text-[#A89A8B]">
            {mockUserProfile.roomName}
          </span>
        </span>
      </Link>

      <Link
        href="/crear-publicacion"
        className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-[14px] px-3 py-3 text-[14.5px] font-extrabold text-white"
        style={{
          background: "linear-gradient(180deg, #F4977E, #EE8164)",
          boxShadow: "0 8px 18px -8px rgba(238,129,100,.75)",
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
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Nueva publicación
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === activeItem;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px] ${
                isActive
                  ? "bg-[#FBE3D8] font-extrabold text-[#D9583C]"
                  : "bg-transparent font-semibold text-[#6E6359]"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-2.5 border-t border-[#ECE0D0] pt-3.5">
        <div className="flex items-center gap-[11px] px-2 py-1.5">
          <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-[#F2937A] font-display text-base font-semibold text-white">
            {mockUserProfile.avatarInitial}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold text-[#3F362E]">
              {mockUserProfile.name}
            </span>
            <span className="block text-xs text-[#A89A8B]">
              {mockUserProfile.role}
            </span>
          </span>
          <Link
            href="/login"
            title="Cerrar sesión"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-[#F6ECDF] text-[#94887B]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
}
