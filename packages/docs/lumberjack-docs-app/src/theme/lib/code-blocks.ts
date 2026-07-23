const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const ERROR_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

/** Enhance all `.astro-code` blocks with copy buttons and optional title bars. Idempotent. */
export function enhanceCodeBlocks(root: ParentNode = document): void {
  root.querySelectorAll('.astro-code').forEach((block) => {
    if (block.parentElement?.classList.contains('code-block')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';

    const title = block.getAttribute('data-title') || '';
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
    copyBtn.innerHTML = COPY_ICON;
    copyBtn.addEventListener('click', async () => {
      const code =
        block.querySelector('code')?.textContent || block.textContent || '';
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.innerHTML = CHECK_ICON;
        setTimeout(() => {
          copyBtn.innerHTML = COPY_ICON;
        }, 2000);
      } catch {
        copyBtn.innerHTML = ERROR_ICON;
        copyBtn.setAttribute(
          'aria-label',
          'Copy failed — try selecting text manually'
        );
        setTimeout(() => {
          copyBtn.innerHTML = COPY_ICON;
          copyBtn.setAttribute('aria-label', 'Copy to clipboard');
        }, 2000);
      }
    });

    block.parentNode!.insertBefore(wrapper, block);
    wrapper.appendChild(block);
    wrapper.appendChild(copyBtn);
  });
}
