import { Sidebar } from "@/components/sidebar";
import { KidProfileView } from "@/components/kids/kid-profile-view";
import { StoredKidProfile } from "@/components/kids/stored-kid-profile";
import { mockKids } from "@/lib/mock-data";

// The profile is selected from the dynamic `slug` param at request time, so
// this segment is allowed to block instead of shipping a static shell.
export const instant = false;

interface KidProfilePageProps {
  params: Promise<{ slug: string }>;
}

export default async function KidProfilePage({ params }: KidProfilePageProps) {
  const { slug } = await params;
  const kid = mockKids.find((candidate) => candidate.slug === slug);

  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <Sidebar activeItem="ninos" />
      <main className="min-w-0 flex-1">
        {kid ? <KidProfileView kid={kid} /> : <StoredKidProfile slug={slug} />}
      </main>
    </div>
  );
}
