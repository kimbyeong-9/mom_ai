// Shared soft-circle background, rendered ONCE at the app root (main.tsx) —
// not per-page. `fixed` anchors the circles to the viewport instead of each
// page's own content box, so they look identical everywhere regardless of
// how tall a given page's content is (an earlier per-page `absolute`
// version got clipped/repositioned differently on short-content pages).
// `fixed` elements don't add to document scroll size, so no overflow-hidden
// wrapper is needed. Rendered before the router in the DOM, with no
// z-index, so normal stacking order already paints all real page content
// above it — no z-10 needed on page content either.
export default function DecorativeBackground() {
  return (
    <>
      <div className="pointer-events-none fixed -right-10 -top-10 size-40 rounded-full bg-[#B7CBAE]/[0.18] sm:size-52" />
      <div className="pointer-events-none fixed -bottom-16 -left-14 size-32 rounded-full bg-[#F0D6C4]/[0.22] sm:size-44" />
      <div className="pointer-events-none fixed right-6 top-1/2 size-24 rounded-full bg-[#1F3D2E]/[0.05] sm:size-32" />
    </>
  );
}
