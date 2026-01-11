import { useEffect, RefObject } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;
type KeyOptions = {
  /** Whether to trigger on key down (true) or key up (false) */
  triggerOnKeyDown?: boolean;
  /** Target element to listen for key events on, defaults to window */
  targetRef?: RefObject<HTMLElement>;
  /** Prevent default browser behavior for the key event */
  preventDefault?: boolean;
  /** Only trigger when these modifier keys are pressed */
  modifiers?: {
    alt?: boolean;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
  };
};

/**
 * Hook that executes a callback when a specific key or array of keys is pressed
 * @param keysToWatch - Single key or array of keys to watch
 * @param callback - Function to execute when key is pressed
 * @param options - Additional options for the key press behavior
 */
export function useKeyPress(keysToWatch: string | string[], callback: KeyHandler, options: KeyOptions = {}): void {
  const {
    triggerOnKeyDown = true,
    targetRef = null,
    preventDefault = false,
    modifiers = { alt: false, ctrl: false, meta: false, shift: false },
  } = options;

  // Convert single key to array for consistent handling
  const keys = Array.isArray(keysToWatch) ? keysToWatch : [keysToWatch];

  useEffect(() => {
    // Check if modifiers match the event
    const checkModifiers = (event: KeyboardEvent): boolean => {
      if (modifiers.alt !== undefined && event.altKey !== modifiers.alt) return false;
      if (modifiers.ctrl !== undefined && event.ctrlKey !== modifiers.ctrl) return false;
      if (modifiers.meta !== undefined && event.metaKey !== modifiers.meta) return false;
      if (modifiers.shift !== undefined && event.shiftKey !== modifiers.shift) return false;
      return true;
    };

    // Handler for the keyboard event
    const handler = (event: KeyboardEvent) => {
      // Check if the pressed key is in our list of keys to watch
      if (keys.includes(event.key)) {
        if (checkModifiers(event)) {
          if (preventDefault) {
            event.preventDefault();
          }
          callback(event);
        }
      }
    };

    // Define the target element (default to window if targetRef is null or not attached)
    const targetElement = targetRef?.current || window;

    // Add the appropriate event listener
    const eventType = triggerOnKeyDown ? 'keydown' : 'keyup';
    targetElement.addEventListener(eventType, handler as EventListener);

    // Clean up
    return () => {
      targetElement.removeEventListener(eventType, handler as EventListener);
    };
  }, [keys, callback, triggerOnKeyDown, targetRef, preventDefault, modifiers]);
}

export default useKeyPress;
