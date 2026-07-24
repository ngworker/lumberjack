const SVG_NS = 'http://www.w3.org/2000/svg';

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

function copyIcon(): SVGSVGElement {
  return iconSvg([
    { tag: 'rect', attrs: { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' } },
    {
      tag: 'path',
      attrs: { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' },
    },
  ]);
}

function checkIcon(): SVGSVGElement {
  return iconSvg([{ tag: 'polyline', attrs: { points: '20 6 9 17 4 12' } }]);
}

function errorIcon(): SVGSVGElement {
  return iconSvg([
    { tag: 'line', attrs: { x1: '18', y1: '6', x2: '6', y2: '18' } },
    { tag: 'line', attrs: { x1: '6', y1: '6', x2: '18', y2: '18' } },
  ]);
}

function setButtonIcon(btn: HTMLElement, icon: SVGSVGElement): void {
  btn.replaceChildren(icon);
}

/** Enhance all `.astro-code` blocks with copy buttons and optional title bars. Idempotent. */
export function enhanceCodeBlocks(root: ParentNode = document): void {
  root.querySelectorAll('.astro-code').forEach((block) => {
    if (block.parentElement?.classList.contains('code-block')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';

    const title = (block as HTMLElement).dataset['title'] || '';
    if (title) {
      const header = document.createElement('div');
      header.className = 'code-block-header';
      const titleSpan = document.createElement('span');
      titleSpan.className = 'code-block-title';
      titleSpan.textContent = title;
      header.appendChild(titleSpan);
      wrapper.appendChild(header);
    }

    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.type = 'button';
    copyBtn.setAttribute('aria-label', 'Copy to clipboard');
    setButtonIcon(copyBtn, copyIcon());
    copyBtn.addEventListener('click', async () => {
      const code = block.querySelector('code')?.textContent || block.textContent || '';
      try {
        await navigator.clipboard.writeText(code);
        setButtonIcon(copyBtn, checkIcon());
        setTimeout(() => {
          setButtonIcon(copyBtn, copyIcon());
        }, 2000);
      } catch {
        setButtonIcon(copyBtn, errorIcon());
        copyBtn.setAttribute('aria-label', 'Copy failed — try selecting text manually');
        setTimeout(() => {
          setButtonIcon(copyBtn, copyIcon());
          copyBtn.setAttribute('aria-label', 'Copy to clipboard');
        }, 2000);
      }
    });

    block.parentNode!.insertBefore(wrapper, block);
    wrapper.appendChild(block);
    wrapper.appendChild(copyBtn);
  });
}
