import Link from "next/link";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { mockKids, type ParentStatus } from "@/lib/mock-data";

// The profile is selected from the dynamic `slug` param at request time, so
// this segment is allowed to block instead of shipping a static shell.
export const instant = false;

const PARENT_STATUS_STYLES: Record<
  ParentStatus,
  { bg: string; color: string; description: string }
> = {
  ACTIVA: { bg: "#CFEBD8", color: "#3E9B6C", description: "activa" },
  PENDIENTE: {
    bg: "#F7E7A6",
    color: "#9A7B1E",
    description: "invitación enviada",
  },
};

interface KidProfilePageProps {
  params: Promise<{ slug: string }>;
}

export default async function KidProfilePage({ params }: KidProfilePageProps) {
  const { slug } = await params;
  const kid = mockKids.find((candidate) => candidate.slug === slug);

  if (!kid) {
    notFound();
  }

  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <Sidebar activeItem="ninos" />
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[820px] px-10 pb-20 pt-[34px]">
          <Link
            href="/kids"
            className="mb-5 flex items-center gap-[7px] text-[14px] font-bold text-[#94887B]"
          >
            <svg
              width="18"
              height="18"
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

          <div className="flex flex-wrap items-start gap-[26px]">
            <div className="flex min-w-[300px] flex-1 flex-col gap-[18px]">
              <div className="flex items-center gap-[18px]">
                <span
                  className="flex h-[84px] w-[84px] flex-none items-center justify-center rounded-full font-display text-[34px] font-semibold"
                  style={{ background: kid.avatarBg, color: kid.avatarColor }}
                >
                  {kid.avatarInitial}
                </span>
                <div className="flex-1">
                  <h1 className="m-0 font-display text-[28px] font-semibold text-[#3F362E]">
                    {kid.name}
                  </h1>
                  <p className="m-0 mt-[3px] text-[15px] text-[#94887B]">
                    {kid.ageYears} años · Sala {kid.roomName}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-xl border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] px-4 py-[9px] text-[14px] font-bold text-[#6E6359]"
                >
                  Editar
                </button>
              </div>

              {kid.allergyNotes ? (
                <div className="flex gap-3.5 rounded-2xl bg-[#FBDAD6] px-[18px] py-4">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-[#F4A8A0]">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                      <path d="M12 9v4M12 17h.01" />
                    </svg>
                  </span>
                  <div>
                    <div className="mb-0.5 text-[15px] font-extrabold text-[#C5413A]">
                      Alergias y notas
                    </div>
                    <div className="text-[14.5px] leading-[1.5] text-[#B25249]">
                      {kid.allergyNotes}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="overflow-hidden rounded-2xl border border-[#ECE0D0] bg-[#FFFDF9]">
                <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px]">
                  <span className="text-[14.5px] text-[#94887B]">
                    Fecha de nacimiento
                  </span>
                  <span className="text-[14.5px] font-extrabold text-[#3F362E]">
                    {kid.birthDateText}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px]">
                  <span className="text-[14.5px] text-[#94887B]">Sala</span>
                  <span className="text-[14.5px] font-extrabold text-[#3F362E]">
                    {kid.roomName}
                  </span>
                </div>
                <div className="flex justify-between px-[18px] py-[15px]">
                  <span className="text-[14.5px] text-[#94887B]">
                    Ingreso
                  </span>
                  <span className="text-[14.5px] font-extrabold text-[#3F362E]">
                    {kid.enrollmentDateText}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-[300px] flex-none flex-col gap-3.5">
              <Link
                href="/resumen-dia"
                className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-[#3F362E] px-3 py-[13px] text-[15px] font-extrabold text-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
                Resumen del día
              </Link>

              <div className="rounded-2xl border border-[#ECE0D0] bg-[#FFFDF9] px-[18px] py-4">
                <div className="mb-3.5 text-[12.5px] font-extrabold tracking-[.8px] text-[#8A7C6D]">
                  PADRES VINCULADOS
                </div>
                <div className="flex flex-col gap-3.5">
                  {kid.parents.length === 0 ? (
                    <p className="m-0 text-[13.5px] text-[#A89A8B]">
                      Todavía no hay padres vinculados.
                    </p>
                  ) : (
                    kid.parents.map((parent) => {
                      const statusStyle = PARENT_STATUS_STYLES[parent.status];

                      return (
                        <div
                          key={parent.id}
                          className="flex items-center gap-3"
                        >
                          <span
                            className="flex h-10 w-10 flex-none items-center justify-center rounded-full font-display text-base font-semibold text-white"
                            style={{ background: parent.avatarBg }}
                          >
                            {parent.avatarInitial}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-[14.5px] font-extrabold text-[#3F362E]">
                              {parent.name}
                            </div>
                            <div className="text-[12.5px] text-[#A89A8B]">
                              {parent.relationship} · {statusStyle.description}
                            </div>
                          </div>
                          <span
                            className="flex-none rounded-full px-[9px] py-1 text-[10.5px] font-extrabold"
                            style={{
                              background: statusStyle.bg,
                              color: statusStyle.color,
                            }}
                          >
                            {parent.status}
                          </span>
                        </div>
                      );
                    })
                  )}

                  <Link
                    href="/vincular-padre"
                    className="flex items-center gap-3 pt-2"
                  >
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-[#D8CBBA] text-[#B0A290]">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                    <span className="text-[14.5px] font-extrabold text-[#C5503A]">
                      Vincular otro padre
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
