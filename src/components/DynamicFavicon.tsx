import { useEffect } from 'react';
import { useTheme } from 'next-themes';

/**
 * Dynamically generates a circular favicon with a Chrome Dino silhouette.
 * Background color adapts to the current theme (light/dark).
 */
export function DynamicFavicon() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const currentTheme = resolvedTheme || theme;
    if (!currentTheme) return;

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = currentTheme === 'dark';
    const bgColor = isDark ? '#0a0a0a' : '#fafafa';
    const dinoColor = isDark ? '#f2f2f2' : '#1a1a1a';

    // Draw circular background
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fillStyle = bgColor;
    ctx.fill();

    // Draw pixel-art Chrome Dino T-Rex (simplified but recognizable)
    ctx.fillStyle = dinoColor;

    const px = 2.2; // pixel size for the grid
    const ox = 10;  // offset x — centers the dino
    const oy = 8;   // offset y

    // Dino pixel map — each [x, y] is a filled pixel in the grid
    const pixels: [number, number][] = [
      // Head
      [9,3],[10,3],[11,3],[12,3],[13,3],[14,3],
      [8,4],[9,4],[10,4],[11,4],[12,4],[13,4],[14,4],[15,4],
      [8,5],[9,5],[10,5],[11,5],[12,5],[13,5],[14,5],[15,5],
      [8,6],[9,6],[10,6],[13,6],[14,6],[15,6],
      [8,7],[9,7],[10,7],[11,7],[12,7],[13,7],[14,7],[15,7],
      [8,8],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],
      [8,9],[9,9],[10,9],[11,9],[12,9],[13,9],
      [9,10],[10,10],[11,10],[12,10],
      // Neck + body
      [7,10],[8,10],
      [6,11],[7,11],[8,11],[9,11],[10,11],[11,11],
      [5,12],[6,12],[7,12],[8,12],[9,12],[10,12],[11,12],
      [4,13],[5,13],[6,13],[7,13],[8,13],[9,13],[10,13],[11,13],[12,13],
      // Arms
      [12,11],[13,11],
      [13,12],[14,12],
      // Body
      [3,14],[4,14],[5,14],[6,14],[7,14],[8,14],[9,14],[10,14],[11,14],
      [3,15],[4,15],[5,15],[6,15],[7,15],[8,15],[9,15],[10,15],
      [3,16],[4,16],[5,16],[6,16],[7,16],[8,16],[9,16],[10,16],
      [4,17],[5,17],[6,17],[7,17],[8,17],[9,17],
      // Tail
      [2,13],[1,12],[0,11],
      [1,13],[0,12],
      // Legs
      [5,18],[6,18],[8,18],[9,18],
      [5,19],[6,19],[8,19],[9,19],
      [4,20],[5,20],[9,20],[10,20],
    ];

    pixels.forEach(([x, y]) => {
      ctx.fillRect(ox + x * px, oy + y * px, px, px);
    });

    // Convert canvas to favicon
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (link) {
      link.href = canvas.toDataURL('image/png');
    }
  }, [theme, resolvedTheme]);

  return null;
}
