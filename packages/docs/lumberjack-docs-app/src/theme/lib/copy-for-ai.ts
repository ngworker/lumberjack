/** Convert a DOM element's content to a markdown string. */
export function domToMarkdown(root: Element): string {
  const lines: string[] = [];

  root
    .querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, pre code, blockquote')
    .forEach((el) => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'code' && el.parentElement?.tagName === 'PRE') {
        const lang = el.className?.match(/language-(\w+)/)?.[1] || '';
        lines.push('```' + lang, el.textContent?.trim() || '', '```', '');
      } else if (tag.startsWith('h')) {
        const level = '#'.repeat(parseInt(tag[1]));
        lines.push(`${level} ${el.textContent?.trim()}`, '');
      } else if (tag === 'li') {
        lines.push(`- ${el.textContent?.trim()}`);
      } else if (tag === 'blockquote') {
        lines.push(`> ${el.textContent?.trim()}`, '');
      } else {
        lines.push(el.textContent?.trim() || '', '');
      }
    });

  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

const BOUND_ATTR = 'data-copy-for-ai-bound';

/** Attach click handlers to all `.copy-for-ai-btn` elements on the page. Idempotent. */
export function initCopyForAi(): void {
  document.querySelectorAll('.copy-for-ai-btn').forEach((btn) => {
    if (btn.hasAttribute(BOUND_ATTR)) return;
    btn.setAttribute(BOUND_ATTR, '');

    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    btn.addEventListener('click', async () => {
      const content = document.querySelector('.sl-markdown-content');
      if (!content) return;

      const title = document.querySelector('h1')?.textContent?.trim() || '';
      const url = window.location.href;

      const markdown = `# ${title}\nSource: ${url}\n\n${domToMarkdown(
        content
      )}`;

      clearTimeout(resetTimer);
      const original = btn.innerHTML;
      try {
        await navigator.clipboard.writeText(markdown);
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      } catch {
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Copy failed`;
      }
      resetTimer = setTimeout(() => {
        btn.innerHTML = original;
      }, 2000);
    });
  });
}
