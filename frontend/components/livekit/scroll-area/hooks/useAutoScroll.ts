import { useEffect, useRef } from 'react';

// Increased threshold to ensure auto-scroll continues working during longer conversations
const AUTO_SCROLL_THRESHOLD_PX = 300;

export function useAutoScroll(scrollContentContainer?: Element | null) {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function scrollToBottom() {
      if (!scrollContentContainer) return;

      const distanceFromBottom =
        scrollContentContainer.scrollHeight -
        scrollContentContainer.clientHeight -
        scrollContentContainer.scrollTop;

      // Always scroll if we're within threshold or if content is growing
      if (distanceFromBottom < AUTO_SCROLL_THRESHOLD_PX) {
        // Clear any pending scroll timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Use requestAnimationFrame for smooth scrolling
        requestAnimationFrame(() => {
          if (scrollContentContainer) {
            scrollContentContainer.scrollTop = scrollContentContainer.scrollHeight;
          }
        });
      }
    }

    if (scrollContentContainer && scrollContentContainer.firstElementChild) {
      const resizeObserver = new ResizeObserver(() => {
        // Debounce scroll updates to prevent jank
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(scrollToBottom, 10);
      });

      resizeObserver.observe(scrollContentContainer.firstElementChild);
      scrollToBottom();

      return () => {
        resizeObserver.disconnect();
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [scrollContentContainer]);
}
