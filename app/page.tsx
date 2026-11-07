import { Sidebar } from "@/components/sidebar";
import { CreatePostPrompt } from "@/components/feed/create-post-prompt";
import { PostCard } from "@/components/feed/post-card";
import { mockFeedPosts, mockUserProfile } from "@/lib/mock-data";

export default function Home() {
  const firstName = mockUserProfile.name.split(" ")[0];

  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <Sidebar activeItem="feed" />
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[760px] px-10 pb-20 pt-[34px]">
          <div className="mb-6">
            <div className="mb-1 text-[12.5px] font-extrabold tracking-[.8px] text-[#D9583C]">
              GUARDERÍA · {mockUserProfile.roomName.toUpperCase()}
            </div>
            <h1 className="m-0 font-display text-[30px] font-semibold text-[#3F362E]">
              Buenas, {firstName}
            </h1>
            <p className="mt-[5px] text-[14.5px] text-[#94887B]">
              12 niños · martes 17 jun
            </p>
          </div>

          <CreatePostPrompt />

          <div className="mb-3.5 flex items-center gap-3.5">
            <span className="text-[12.5px] font-extrabold tracking-[.8px] text-[#8A7C6D]">
              PUBLICADO HOY
            </span>
            <span className="h-px flex-1 bg-[#E7DAC8]" />
          </div>

          <div className="flex flex-col gap-4">
            {mockFeedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
