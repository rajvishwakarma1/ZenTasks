import { useEffect } from 'react';

export const useKeyboardShortcuts = ({ setShowQuickAdd }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Quick Add: Ctrl/Cmd + Enter
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        setShowQuickAdd(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowQuickAdd]);
};