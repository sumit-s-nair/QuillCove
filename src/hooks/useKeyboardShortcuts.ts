import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: () => void;
  preventDefault?: boolean;
  enableInInput?: boolean;
}

/**
 * Custom hook for handling keyboard shortcuts
 * @param shortcuts - Array of keyboard shortcut configurations
 * 
 * Common shortcuts:
 * - Ctrl/Cmd+N: New note
 * - Ctrl/Cmd+K: Focus search
 * - Ctrl/Cmd+S: Save
 * - Ctrl/Cmd+E: Export
 * - Ctrl/Cmd+/: Toggle theme
 * - Ctrl/Cmd+A: Select all
 * - Escape: Close modals
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.isContentEditable;

      shortcuts.forEach((shortcut) => {
        // Skip if in input field unless explicitly enabled
        if (isInputField && !shortcut.enableInInput) {
          return;
        }

        const ctrlMatch = shortcut.ctrl === undefined || shortcut.ctrl === (event.ctrlKey || event.metaKey);
        const shiftMatch = shortcut.shift === undefined || shortcut.shift === event.shiftKey;
        const altMatch = shortcut.alt === undefined || shortcut.alt === event.altKey;
        const metaMatch = shortcut.meta === undefined || shortcut.meta === event.metaKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && metaMatch && keyMatch) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
