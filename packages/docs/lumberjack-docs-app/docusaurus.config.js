const title = 'Lumberjack';

const organizationName = 'ngworker';
const projectName = 'lumberjack';

module.exports = {
  title,
  tagline: 'Chop and cut Angular logs like a professional lumberjack',
  url: `https://${organizationName}.github.io`,
  baseUrl: `/${projectName}/`,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName,
  projectName,
  themeConfig: {
    navbar: {
      title,
      logo: {
        alt: title,
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/installation',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Installation',
              to: 'docs/installation',
            },
            {
              label: 'Compatibility',
              to: 'docs/compatibility',
            },
            {
              label: 'Usage',
              to: 'docs/usage',
            },
            {
              label: 'Log drivers',
              to: 'docs/log-drivers',
            },
            {
              label: 'Community drivers',
              to: 'docs/community-drivers',
            },
            {
              label: 'Best practices',
              to: 'docs/best-practices',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/lumberjack',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} ngworkers. Licensed under the MIT license.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: `https://github.com/${organizationName}/${projectName}/edit/main/packages/docs/lumberjack-docs-app`,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
