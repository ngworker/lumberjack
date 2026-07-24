const LANGUAGE_CLASS = /language-(\w+)/;
const SVG_NS = 'http://www.w3.org/2000/svg';

function isFencedCode(el: Element, tag: string): boolean {
  return tag === 'code' && el.parentElement?.tagName === 'PRE';
}

function fencedCodeMarkdown(el: Element, text: string): string[] {
  const lang = LANGUAGE_CLASS.exec(el.className ?? '')?.[1] || '';
  return ['```' + lang, text, '```', ''];
}

function headingMarkdown(tag: string, text: string): string[] {
  const level = '#'.repeat(Number.parseInt(tag[1]!, 10));
  return [`${level} ${text}`, ''];
}

const SIMPLE_BLOCK: Record<string, (text: string) => string[]> = {
  li: (text) => [`- ${text}`],
  blockquote: (text) => [`> ${text}`, ''],
};

function elementToMarkdown(el: Element): string[] {
  const tag = el.tagName.toLowerCase();
  const text = el.textContent?.trim() || '';

  if (isFencedCode(el, tag)) return fencedCodeMarkdown(el, text);
  if (tag.startsWith('h')) return headingMarkdown(tag, text);
  return SIMPLE_BLOCK[tag]?.(text) ?? [text, ''];
}

/** Convert a DOM element's content to a markdown string. */
export function domToMarkdown(root: Element): string {
  const lines: string[] = [];

  root.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, pre code, blockquote').forEach((el) => {
    lines.push(...elementToMarkdown(el));
  });

  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

function iconSvg(children: Array<{ tag: string; attrs: Record<string, string> }>): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '14');
  svg.setAttribute('height', '14');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  for (const child of children) {
    const el = document.createElementNS(SVG_NS, child.tag);
    for (const [key, value] of Object.entries(child.attrs)) {
      el.setAttribute(key, value);
    }
    svg.appendChild(el);
  }
  return svg;
}

function setButtonContent(btn: Element, icon: SVGSVGElement, label: string): void {
  btn.replaceChildren(icon, document.createTextNode(` ${label}`));
}

const BOUND_ATTR = 'data-copy-for-ai-bound';

/** Attach click handlers to all `.copy-for-ai-btn` elements on the page. Idempotent. */
export function initCopyForAi(): void {
  document.querySelectorAll('.copy-for-ai-btn').forEach((btn) => {
    if (btn.hasAttribute(BOUND_ATTR)) return;
    btn.setAttribute(BOUND_ATTR, '');

    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    const idleLabel = btn.textContent?.trim() || 'Copy for AI';
    const idleIcon = (): SVGSVGElement =>
      iconSvg([
        {
          tag: 'rect',
          attrs: { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' },
        },
        {
          tag: 'path',
          attrs: { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' },
        },
      ]);

    btn.addEventListener('click', async () => {
      const content = document.querySelector('.sl-markdown-content');
      if (!content) return;

      const title = document.querySelector('h1')?.textContent?.trim() || '';
      const url = window.location.href;

      const markdown = `# ${title}\nSource: ${url}\n\n${domToMarkdown(content)}`;

      clearTimeout(resetTimer);
      try {
        await navigator.clipboard.writeText(markdown);
        setButtonContent(btn, iconSvg([{ tag: 'polyline', attrs: { points: '20 6 9 17 4 12' } }]), 'Copied!');
      } catch {
        setButtonContent(
          btn,
          iconSvg([
            { tag: 'line', attrs: { x1: '18', y1: '6', x2: '6', y2: '18' } },
            { tag: 'line', attrs: { x1: '6', y1: '6', x2: '18', y2: '18' } },
          ]),
          'Copy failed'
        );
      }
      resetTimer = setTimeout(() => {
        setButtonContent(btn, idleIcon(), idleLabel);
      }, 2000);
    });
  });
}
