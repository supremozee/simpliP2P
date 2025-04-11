import { RefObject, useEffect } from 'react';

/**
 * Hook that handles click outside of the specified element(s)
 * @param ref - Reference to the element to detect clicks outside of
 * @param handler - Function to call when a click outside is detected
 * @param exceptRefs - Array of refs to elements that should not trigger the handler
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  exceptRefs: RefObject<HTMLElement | null>[] = []
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      if (!ref.current || ref.current.contains(target)) {
        return;
      }

      for (const exceptRef of exceptRefs) {
        if (exceptRef?.current && exceptRef.current.contains(target)) {
          return;
        }
      }

      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, exceptRefs]);
};