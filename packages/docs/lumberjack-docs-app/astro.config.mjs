import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import { createStarlightTypeDocPlugin } from 'starlight-typedoc';

const [coreTypeDoc, coreTypeDocSidebar] = createStarlightTypeDocPlugin();
const [consoleTypeDoc, consoleTypeDocSidebar] = createStarlightTypeDocPlugin();
const [httpTypeDoc, httpTypeDocSidebar] = createStarlightTypeDocPlugin();

const repoRoot = '../../..';
const sourceLinkTemplate = 'https://github.com/ngworker/lumberjack/blob/main/{path}#L{line}';

const typeDocShared = {
  excludeInternal: true,
  disableGit: true,
  basePath: repoRoot,
  sourceLinkTemplate,
  // Angular decorator metadata is not needed for public-API docs.
  skipErrorChecking: true,
};

export default defineConfig({
  site: 'https://ngworker.github.io',
  base: '/lumberjack',
  server: { port: 3000 },
  output: 'static',
  outDir: '../../../dist/packages/docs/lumberjack-docs-app',
  markdown: {
    gfm: true,
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      transformers: [
        {
          name: 'meta-title',
          pre(node) {
            const raw = this.options.meta?.__raw;
            if (!raw) return;
            const match = raw.match(/title="([^"]+)"/);
            if (match) {
              node.properties['data-title'] = match[1];
            }
          },
        },
      ],
    },
  },
  redirects: {
    // Destinations include base explicitly — Astro does not auto-prepend base on redirect targets.
    '/docs/installation': '/lumberjack/getting-started/installation/',
    '/docs/compatibility': '/lumberjack/getting-started/compatibility/',
    '/docs/usage': '/lumberjack/guides/log-with-the-service/',
    '/docs/best-practices': '/lumberjack/guides/write-a-logger/',
    '/docs/log-drivers': '/lumberjack/understanding/log-drivers/',
    '/docs/log-drivers/http-driver': '/lumberjack/guides/send-logs-over-http/',
    '/docs/community-drivers': '/lumberjack/guides/use-community-drivers/',
    // Paths from the first Starlight migration layout
    '/guides/usage': '/lumberjack/guides/log-with-the-service/',
    '/guides/best-practices': '/lumberjack/guides/write-a-logger/',
    '/log-drivers/overview': '/lumberjack/understanding/log-drivers/',
    '/log-drivers/http-driver': '/lumberjack/guides/send-logs-over-http/',
    '/log-drivers/community-drivers': '/lumberjack/guides/use-community-drivers/',
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
          icon: 'npm',
          label: 'npm',
          href: 'https://www.npmjs.com/package/@ngworker/lumberjack',
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
      plugins: [
        coreTypeDoc({
          entryPoints: ['../../ngworker/lumberjack/src/index.ts'],
          tsconfig: '../../ngworker/lumberjack/tsconfig.lib.json',
          output: 'reference/core',
          sidebar: { label: '@ngworker/lumberjack', collapsed: true },
          typeDoc: typeDocShared,
        }),
        consoleTypeDoc({
          entryPoints: ['../../ngworker/lumberjack/console-driver/src/index.ts'],
          tsconfig: '../../ngworker/lumberjack/tsconfig.lib.json',
          output: 'reference/console-driver',
          sidebar: { label: '@ngworker/lumberjack/console-driver', collapsed: true },
          typeDoc: typeDocShared,
        }),
        httpTypeDoc({
          entryPoints: ['../../ngworker/lumberjack/http-driver/src/index.ts'],
          tsconfig: '../../ngworker/lumberjack/tsconfig.lib.json',
          output: 'reference/http-driver',
          sidebar: { label: '@ngworker/lumberjack/http-driver', collapsed: true },
          typeDoc: typeDocShared,
        }),
      ],
      customCss: ['./src/styles/custom.css'],
      expressiveCode: false,
      components: {
        Header: './src/components/Header.astro',
        Sidebar: './src/components/Sidebar.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
        Head: './src/theme/components/Head.astro',
        Pagination: './src/theme/components/Pagination.astro',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { slug: 'getting-started/introduction' },
            { slug: 'getting-started/quick-start' },
            { slug: 'getting-started/installation' },
            { slug: 'getting-started/compatibility' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { slug: 'guides/log-with-the-service' },
            { slug: 'guides/write-a-logger' },
            { slug: 'guides/configure-lumberjack' },
            { slug: 'guides/create-a-custom-driver' },
            { slug: 'guides/send-logs-over-http' },
            { slug: 'guides/use-community-drivers' },
          ],
        },
        {
          label: 'Understanding',
          items: [{ slug: 'understanding/log-drivers' }],
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
        {
          label: 'Reference',
          items: [coreTypeDocSidebar, consoleTypeDocSidebar, httpTypeDocSidebar],
        },
      ],
      lastUpdated: true,
      pagination: true,
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-heading',
      weights: [400, 500, 600, 700],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-code',
      weights: [400, 500],
      fallbacks: ['monospace'],
    },
  ],
});
