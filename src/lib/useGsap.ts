import { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

type Q = (selector: string) => Element[];

/**
 * Builds a paused GSAP timeline once and seeks it to the current Remotion frame.
 * The timeline is never played by GSAP's ticker, so every frame is deterministic.
 */
export const useGsap = <T extends Element>(
  build: (tl: gsap.core.Timeline, q: Q) => void,
) => {
  const scope = useRef<T>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useLayoutEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true });
      build(t, gsap.utils.selector(scope.current));
      tl.current = t;
    }, scope.current);
    return () => {
      ctx.revert();
      tl.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    tl.current?.seek(frame / fps, false);
  }, [frame, fps]);

  return scope;
};

export { gsap };

/**
 * Stroke draw-on tween (GSAP). Normalises the path length to 1 and animates the dash offset.
 * Used instead of DrawSVGPlugin because its 999999px dash gap makes Chrome paint the
 * element's bounding box while a stroke is hidden.
 */
export const drawIn = (targets: Element[], vars: gsap.TweenVars) => {
  targets.forEach((t) => t.setAttribute("pathLength", "1"));
  return gsap.fromTo(
    targets,
    { strokeDasharray: "1 3", strokeDashoffset: 1.06 },
    { strokeDashoffset: 0, ...vars },
  );
};

export const drawOut = (targets: Element[], vars: gsap.TweenVars) =>
  gsap.to(targets, { strokeDashoffset: -1.06, ...vars });
