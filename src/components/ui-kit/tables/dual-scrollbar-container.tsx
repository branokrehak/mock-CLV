import React, { useEffect, useRef, useState } from "react";

export function DualScrollbarContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const topScrollerRef = useRef<HTMLDivElement>(null);
  const bottomScrollerRef = useRef<HTMLDivElement>(null);
  const scrollSpacerRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    const top = topScrollerRef.current;
    const bottom = bottomScrollerRef.current;
    const spacer = scrollSpacerRef.current;

    if (!top || !bottom || !spacer) return;

    const updateSpacerWidth = () => {
      const contentWidth = bottom.scrollWidth;
      const containerWidth = bottom.clientWidth;
      spacer.style.width = `${contentWidth}px`;
      setNeedsScroll(contentWidth > containerWidth);
    };

    updateSpacerWidth();

    let resizeAnimationFrame: number | null = null;
    const resizeObserver = new ResizeObserver(() => {
      if (resizeAnimationFrame !== null) {
        cancelAnimationFrame(resizeAnimationFrame);
      }
      resizeAnimationFrame = requestAnimationFrame(() => {
        updateSpacerWidth();
        resizeAnimationFrame = null;
      });
    });
    resizeObserver.observe(bottom);

    let isTopScrolling = false;
    let isBottomScrolling = false;

    const topScrollHandler = () => {
      if (!isBottomScrolling) {
        isTopScrolling = true;
        bottom.scrollLeft = top.scrollLeft;
        requestAnimationFrame(() => {
          isTopScrolling = false;
        });
      }
    };

    const bottomScrollHandler = () => {
      if (!isTopScrolling) {
        isBottomScrolling = true;
        top.scrollLeft = bottom.scrollLeft;
        requestAnimationFrame(() => {
          isBottomScrolling = false;
        });
      }
    };

    top.addEventListener("scroll", topScrollHandler);
    bottom.addEventListener("scroll", bottomScrollHandler);

    return () => {
      top.removeEventListener("scroll", topScrollHandler);
      bottom.removeEventListener("scroll", bottomScrollHandler);
      resizeObserver.disconnect();
      if (resizeAnimationFrame !== null) {
        cancelAnimationFrame(resizeAnimationFrame);
      }
    };
  }, []);

  return (
    <div className={className}>
      <div
        ref={topScrollerRef}
        className={`overflow-x-auto overflow-y-hidden mb-1 ${!needsScroll ? "hidden" : ""}`}
        style={{ height: "17px" }}
      >
        <div ref={scrollSpacerRef} style={{ height: "1px" }} />
      </div>

      <div ref={bottomScrollerRef} className="overflow-x-auto w-full">
        {children}
      </div>
    </div>
  );
}
