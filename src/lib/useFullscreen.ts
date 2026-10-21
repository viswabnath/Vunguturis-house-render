"use client";

import { RefObject, useCallback, useEffect, useState } from "react";

type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenEnabled?: boolean;
};

const FALLBACK_CLASS = "is-pseudo-fullscreen";

/**
 * Full screen for one element. Uses the Fullscreen API where the browser allows it,
 * and otherwise (iPhone Safari only supports it for video) pins the element over the page with CSS.
 */
export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pseudo, setPseudo] = useState(false);

  useEffect(() => {
    const doc = document as FsDocument;
    const sync = () => {
      const current = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      setIsFullscreen(current !== null && current === ref.current);
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, [ref]);

  // CSS fallback: lock page scroll and let Escape close it, like the real thing
  useEffect(() => {
    const el = ref.current;
    if (!pseudo || !el) return;
    el.classList.add(FALLBACK_CLASS);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPseudo(false);
    window.addEventListener("keydown", onKey);
    return () => {
      el.classList.remove(FALLBACK_CLASS);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [pseudo, ref]);

  const toggle = useCallback(async () => {
    const el = ref.current as FsElement | null;
    const doc = document as FsDocument;
    if (!el) return;

    if (pseudo) {
      setPseudo(false);
      return;
    }
    if (isFullscreen) {
      await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
      return;
    }
    try {
      if (el.requestFullscreen && doc.fullscreenEnabled !== false) {
        await el.requestFullscreen();
        return;
      }
      if (el.webkitRequestFullscreen && doc.webkitFullscreenEnabled !== false) {
        await el.webkitRequestFullscreen();
        return;
      }
    } catch {
      // fall through to the CSS version
    }
    setPseudo(true);
  }, [isFullscreen, pseudo, ref]);

  return { isFullscreen: isFullscreen || pseudo, toggle };
}
