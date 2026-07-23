import { Bell } from "lucide-react";

import { cn } from "@/lib/utils";

type MobileTopNavProps = {
  isHidden: boolean;
};

// Shared across every page (Home + everything under AppLayout) so the mobile
// top bar looks identical everywhere — centered wordmark, notification bell
// on the right. Self-contained (sm:hidden baked in), so pages don't need
// their own responsive branching for this piece. Fixed to the viewport top
// so it can slide out of view on scroll-down and back in on scroll-up —
// pages using this must add top padding on mobile to compensate for it no
// longer taking up flow space (see AppLayout/HomePage).
export default function MobileTopNav({ isHidden }: MobileTopNavProps) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 flex h-[60px] shrink-0 items-center justify-end border-b border-[#1F3D2E]/8 bg-white px-5 transition-transform duration-300 ease-in-out sm:hidden",
        isHidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1F3D2E]">
          <span className="text-[13px] font-bold text-white">L</span>
        </div>
        <span className="whitespace-nowrap text-[15px] font-extrabold tracking-tight text-[#1F3D2E]">
          LifeFlow AI
        </span>
      </div>

      <button
        type="button"
        aria-label="알림"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#1F3D2E] shadow-[0_2px_10px_rgba(31,61,46,0.08)] transition-colors hover:bg-[#1F3D2E]/5"
      >
        <Bell size={18} strokeWidth={2.25} />
      </button>
    </header>
  );
}
