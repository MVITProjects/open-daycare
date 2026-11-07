import Link from "next/link";
import { mockUserProfile } from "@/lib/mock-data";

export function CreatePostPrompt() {
  return (
    <Link
      href="/crear-publicacion"
      className="mb-6 flex items-center gap-3.5 rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] px-[18px] py-3.5"
      style={{ boxShadow: "0 4px 14px -10px rgba(120,90,60,.4)" }}
    >
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#F2937A] font-display text-base font-semibold text-white">
        {mockUserProfile.avatarInitial}
      </span>
      <span className="flex-1 text-[15px] text-[#A89A8B]">
        Compartí un momento…
      </span>
      <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-[#FBE3D8] text-[#E0654A]">
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </span>
    </Link>
  );
}
