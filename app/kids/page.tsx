import { Sidebar } from "@/components/sidebar";
import { KidsDirectory } from "@/components/kids/kids-directory";

export default function KidsPage() {
  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <Sidebar activeItem="ninos" />
      <main className="min-w-0 flex-1">
        <KidsDirectory />
      </main>
    </div>
  );
}
