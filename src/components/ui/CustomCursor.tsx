import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on devices with a fine pointer (mouse)
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    setHasFinePointer(mql.matches);

    const onChange = (e: MediaQueryListEvent) => {
      setHasFinePointer(e.matches);
    };

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!hasFinePointer) return;

    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    // Set initial position off-screen to avoid flash on load
    if (cursorRef.current) {
      cursorRef.current.style.transform = 'translate3d(-100px, -100px, 0) translate(-50%, -50%)';
    }

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [hasFinePointer]);

  // Don't render on touch devices
  if (!hasFinePointer) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-3 h-3 bg-foreground rounded-full pointer-events-none z-[9999]"
    />
  );
};

export default CustomCursor;