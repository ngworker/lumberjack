import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ngworker.github.io',
  base: '/lumberjack',
  output: 'static',
  outDir: '../../../dist/packages/docs/lumberjack-docs-app',
  markdown: {
    gfm: true,
  },
  redirects: {
    // Destinations include base explicitly — Astro does not auto-prepend base on redirect targets.
    '/docs/installation': '/lumberjack/getting-started/installation/',
    '/docs/compatibility': '/lumberjack/getting-started/compatibility/',
    '/docs/usage': '/lumberjack/guides/usage/',
    '/docs/best-practices': '/lumberjack/guides/best-practices/',
    '/docs/log-drivers': '/lumberjack/log-drivers/overview/',
    '/docs/log-drivers/http-driver': '/lumberjack/log-drivers/http-driver/',
    '/docs/community-drivers': '/lumberjack/log-drivers/community-drivers/',
    '/blog': '/lumberjack/whats-new/announcing-lumberjack-v22/',
    '/blog/announcing-lumberjack-v15': '/lumberjack/whats-new/announcing-lumberjack-v15/',
    '/blog/announcing-lumberjack-v16': '/lumberjack/whats-new/announcing-lumberjack-v16/',
    '/blog/announcing-lumberjack-v17': '/lumberjack/whats-new/announcing-lumberjack-v17/',
    '/blog/announcing-lumberjack-v18': '/lumberjack/whats-new/announcing-lumberjack-v18/',
    '/blog/announcing-lumberjack-v19': '/lumberjack/whats-new/announcing-lumberjack-v19/',
    '/blog/announcing-lumberjack-v20': '/lumberjack/whats-new/announcing-lumberjack-v20/',
    '/blog/announcing-lumberjack-v21': '/lumberjack/whats-new/announcing-lumberjack-v21/',
    '/blog/announcing-lumberjack-v22': '/lumberjack/whats-new/announcing-lumberjack-v22/',
  },
  integrations: [
    starlight({
      title: 'Lumberjack',
      description: 'Chop and cut Angular logs like a professional lumberjack',
      favicon: '/favicon.ico',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/ngworker/lumberjack',
        },
        {
          icon: 'discord',
          label: 'Discord',
          href: 'https://discord.gg/UDUa8MA6Ef',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/ngworker/lumberjack/edit/main/packages/docs/lumberjack-docs-app/',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { slug: 'getting-started/introduction' },
            { slug: 'getting-started/installation' },
            { slug: 'getting-started/compatibility' },
          ],
        },
        {
          label: 'Guides',
          items: [{ slug: 'guides/usage' }, { slug: 'guides/best-practices' }],
        },
        {
          label: 'Log Drivers',
          items: [
            { slug: 'log-drivers/overview' },
            { slug: 'log-drivers/http-driver' },
            { slug: 'log-drivers/community-drivers' },
          ],
        },
        {
          label: "What's New",
          collapsed: true,
          items: [
            { slug: 'whats-new/announcing-lumberjack-v22' },
            { slug: 'whats-new/announcing-lumberjack-v21' },
            { slug: 'whats-new/announcing-lumberjack-v20' },
            { slug: 'whats-new/announcing-lumberjack-v19' },
            { slug: 'whats-new/announcing-lumberjack-v18' },
            { slug: 'whats-new/announcing-lumberjack-v17' },
            { slug: 'whats-new/announcing-lumberjack-v16' },
            { slug: 'whats-new/announcing-lumberjack-v15' },
          ],
        },
      ],
      lastUpdated: true,
      pagination: true,
    }),
    sitemap(),
  ],
});
