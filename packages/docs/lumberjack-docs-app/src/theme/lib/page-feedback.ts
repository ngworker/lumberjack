import { safeGetItem, safeSetItem } from './preferences';

class PageFeedback extends HTMLElement {
  #ac!: AbortController;

  connectedCallback() {
    this.#ac = new AbortController();
    const { signal } = this.#ac;
    const pageId = this.dataset.pageId;
    const stored = safeGetItem(`feedback:${pageId}`);

    if (stored) {
      const btn = [...this.querySelectorAll<HTMLElement>('.feedback-btn')].find(
        (b) => b.dataset.value === stored
      );
      if (btn) {
        btn.setAttribute('data-selected', 'true');
        btn.setAttribute('aria-pressed', 'true');
      }
    }

    this.querySelectorAll('.feedback-btn').forEach((btn) => {
      btn.addEventListener(
        'click',
        () => {
          const value = (btn as HTMLElement).dataset.value;
          this.querySelectorAll('.feedback-btn').forEach((b) => {
            b.removeAttribute('data-selected');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.setAttribute('data-selected', 'true');
          btn.setAttribute('aria-pressed', 'true');
          safeSetItem(`feedback:${pageId}`, value || '');
        },
        { signal }
      );
    });
  }

  disconnectedCallback() {
    this.#ac.abort();
  }
}

customElements.define('page-feedback', PageFeedback);
