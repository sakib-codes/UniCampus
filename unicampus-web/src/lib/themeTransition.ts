/**
 * UniCampus Circular Reveal (Radial Wipe) Theme Transition Engine
 * 
 * Implements the Vite / VitePress & Material Design CircularReveal View Transition:
 * - Powered by W3C View Transitions API (document.startViewTransition)
 * - CSS clip-path: circle(r at x y)
 * - Web Animations API on ::view-transition-new(root) at 60fps on GPU
 * - Graceful fallback for browsers without View Transitions or with prefers-reduced-motion
 */

export interface ThemeTransitionOptions {
  theme: "dark" | "light" | "system";
  event?: React.MouseEvent | MouseEvent | { clientX: number; clientY: number } | null;
  setTheme: (theme: string) => void;
  currentTheme?: string;
  duration?: number;
}

let isTransitioning = false;

export function executeThemeTransition({
  theme,
  event,
  setTheme,
  currentTheme,
  duration = 750,
}: ThemeTransitionOptions) {
  // If target theme is already active or a transition is in-flight, safely guard against flicker
  if (isTransitioning) {
    return;
  }
  if (currentTheme && currentTheme === theme) {
    return;
  }

  // Check support and accessibility preferences
  const isReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const doc = typeof document !== "undefined" ? document : null;
  const hasViewTransition =
    doc !== null &&
    "startViewTransition" in doc &&
    typeof (doc as unknown as { startViewTransition?: unknown }).startViewTransition === "function";

  if (!hasViewTransition || isReducedMotion || !doc) {
    setTheme(theme);
    return;
  }

  // Determine origin coordinates (x, y)
  let x = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  let y = typeof window !== "undefined" ? window.innerHeight / 2 : 0;

  if (event) {
    if (typeof event.clientX === "number" && (event.clientX > 0 || event.clientY > 0)) {
      x = event.clientX;
      y = event.clientY;
    } else if ("currentTarget" in event && event.currentTarget instanceof HTMLElement) {
      const rect = event.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else if ("target" in event && event.target instanceof HTMLElement) {
      const rect = event.target.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
  }

  // Calculate maximum distance to the furthest screen corner
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  isTransitioning = true;
  try {
    const transition = (
      doc as unknown as {
        startViewTransition: (cb: () => Promise<void>) => {
          ready: Promise<void>;
          finished?: Promise<void>;
        };
      }
    ).startViewTransition(async () => {
      setTheme(theme);
      // Allow next-themes & React DOM commit tick
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        const anim = document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)", // Smooth ease-in-out expansion curve
            pseudoElement: "::view-transition-new(root)",
          } as KeyframeAnimationOptions
        );

        anim.onfinish = () => {
          isTransitioning = false;
        };
        anim.oncancel = () => {
          isTransitioning = false;
        };
      })
      .catch(() => {
        isTransitioning = false;
      });

    if (transition.finished) {
      transition.finished.finally(() => {
        isTransitioning = false;
      });
    }
  } catch {
    isTransitioning = false;
    // Fallback if startViewTransition throws
    setTheme(theme);
  }
}

