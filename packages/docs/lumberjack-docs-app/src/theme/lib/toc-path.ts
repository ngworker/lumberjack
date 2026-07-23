export interface Point {
  x: number;
  y: number;
}

/** Build an SVG path string with cubic bezier curves connecting points. */
export function buildSerpentinePath(points: Point[]): string {
  if (points.length === 0) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x},${midY} ${curr.x},${midY} ${curr.x},${curr.y}`;
  }
  return d;
}

/**
 * Given heading positions (as getBoundingClientRect().top values) and scroll
 * metrics, return the index of the active heading.
 *
 * Near the bottom of the page, the activation offset smoothly expands from
 * baseOffset to viewportHeight/2 so headings that can't physically reach the
 * base offset still get their turn.
 */
export function resolveActiveIndex(
  headingTops: number[],
  scrollY: number,
  scrollHeight: number,
  viewportHeight: number,
  baseOffset = 100,
  nearBottomRatio = 0.6
): number {
  if (headingTops.length === 0) return 0;

  const maxScroll = scrollHeight - viewportHeight;
  const distToBottom = Math.max(0, maxScroll - scrollY);
  const nearBottomZone = viewportHeight * nearBottomRatio;

  const offset =
    distToBottom < nearBottomZone
      ? baseOffset +
        (1 - distToBottom / nearBottomZone) * (viewportHeight / 2 - baseOffset)
      : baseOffset;

  let active = 0;
  for (let i = 0; i < headingTops.length; i++) {
    if (headingTops[i] <= offset) active = i;
  }
  return active;
}

// ── DOM orchestration ─────────────────────────────────────────────

let cleanup: (() => void) | null = null;

/** Initialize the ToC SVG serpentine indicator and scroll tracking. */
export function initTocPath(): void {
  cleanup?.();
  cleanup = null;

  const toc = document.querySelector<HTMLElement>('starlight-toc nav > ul');
  if (!toc) return;

  const links = [...toc.querySelectorAll<HTMLAnchorElement>('a')];
  if (links.length < 2) return;

  if (toc.parentElement?.classList.contains('toc-items-wrapper')) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'toc-items-wrapper';
  toc.parentNode!.insertBefore(wrapper, toc);
  wrapper.appendChild(toc);

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.classList.add('toc-path-svg');
  svg.setAttribute('aria-hidden', 'true');

  const bgPath = document.createElementNS(ns, 'path');
  bgPath.classList.add('toc-path-bg');
  const activePath = document.createElementNS(ns, 'path');
  activePath.classList.add('toc-path-active');
  svg.append(bgPath, activePath);
  wrapper.prepend(svg);

  let points: Point[] = [];

  function buildPath() {
    const wRect = wrapper.getBoundingClientRect();

    points = links.map((link) => {
      const rect = link.getBoundingClientRect();
      return {
        x: Math.max(2, rect.left - wRect.left - 8),
        y: rect.top - wRect.top + rect.height / 2,
      };
    });

    const svgW = Math.max(16, ...points.map((p) => p.x + 4));
    const svgH = wRect.height;
    svg.setAttribute('width', String(svgW));
    svg.setAttribute('height', String(svgH));
    svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);

    const d = buildSerpentinePath(points);
    bgPath.setAttribute('d', d);
    activePath.setAttribute('d', d);
  }

  buildPath();

  function getActiveLink(): HTMLAnchorElement {
    const headingTops = links.map((link) => {
      const id = decodeURIComponent(link.hash.slice(1));
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top : Infinity;
    });

    const idx = resolveActiveIndex(
      headingTops,
      window.scrollY,
      document.documentElement.scrollHeight,
      window.innerHeight
    );
    return links[idx];
  }

  function update() {
    const activeLink = getActiveLink();

    links.forEach((l) => l.classList.remove('toc-active'));
    activeLink.classList.add('toc-active');

    const idx = links.indexOf(activeLink);
    if (idx >= 0 && points[idx]) {
      const clipY = points[idx].y + 4;
      activePath.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipY}px, 0 ${clipY}px)`;
    }
  }

  update();

  const ro = new ResizeObserver(() => {
    buildPath();
    update();
  });
  ro.observe(wrapper);

  // Use window.AbortController so the signal is owned by the same Window
  // object that owns the event target — required for jsdom compatibility.
  const ac = new window.AbortController();
  let scrollTimer: ReturnType<typeof setTimeout> | undefined;
  window.addEventListener(
    'scroll',
    () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(update, 30);
    },
    { passive: true, signal: ac.signal }
  );

  cleanup = () => {
    clearTimeout(scrollTimer);
    ac.abort();
    ro.disconnect();
  };
}

/** Tear down scroll listener and ResizeObserver. Safe to call when not initialized. */
export function cleanupTocPath(): void {
  cleanup?.();
  cleanup = null;
}
