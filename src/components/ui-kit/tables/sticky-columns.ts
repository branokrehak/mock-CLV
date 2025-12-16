import { useEffect } from "react";

export function useStickyColumns(tableRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    let scrollContainer: HTMLElement | null = table.parentElement;

    const handleScrollAttribute = () => {
      if (scrollContainer) {
        if (scrollContainer.scrollLeft > 0) {
          scrollContainer.setAttribute("data-scrolled", "true");
        } else {
          scrollContainer.removeAttribute("data-scrolled");
        }
      }
    };

    const applyStickyOffsets = () => {
      if (!table) return;
      if (!scrollContainer) {
        scrollContainer = table.parentElement;
      }

      handleScrollAttribute();

      const stickyCells: NodeListOf<HTMLElement> = table.querySelectorAll("[data-sticky='true']");
      const rowAccumulatedWidths: Map<HTMLElement, number> = new Map();

      stickyCells.forEach((cell: HTMLElement) => {
        const row: HTMLElement | null = cell.closest("tr");
        if (!row) return;

        let accumulatedWidth: number = rowAccumulatedWidths.get(row) || 0;

        cell.style.position = "sticky";
        cell.style.zIndex = "1";
        cell.style.left = `${accumulatedWidth}px`;

        accumulatedWidth += cell.offsetWidth;
        rowAccumulatedWidths.set(row, accumulatedWidth);
      });
    };

    applyStickyOffsets();

    const observer = new ResizeObserver(() => {
      applyStickyOffsets();
    });
    observer.observe(table);

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScrollAttribute);
    }
    window.addEventListener("resize", applyStickyOffsets);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applyStickyOffsets);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScrollAttribute);
      }
    };
  }, [tableRef]);
}
