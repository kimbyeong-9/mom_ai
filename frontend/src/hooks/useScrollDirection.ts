import { useEffect, useRef, useState } from "react";

const TOP_THRESHOLD = 24;
const DELTA_THRESHOLD = 4;

/** Returns true while the page is being scrolled down (past the top), false
 * while scrolling up or near the top — meant for hiding/showing fixed nav
 * bars as the user scrolls. Ignores window scroll's natural jitter with a
 * small delta threshold, and always shows the bars near the very top. */
export function useScrollDirection(): boolean {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY < TOP_THRESHOLD) {
        setIsHidden(false);
      } else if (Math.abs(delta) > DELTA_THRESHOLD) {
        setIsHidden(delta > 0);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isHidden;
}
