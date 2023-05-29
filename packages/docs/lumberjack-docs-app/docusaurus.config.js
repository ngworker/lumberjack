const title = 'Lumberjack';

const organizationName = 'ngworker';
const projectName = 'lumberjack';

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

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
        // TODO: Enable blog when we have content
        // { to: '/blog', label: 'Blog', position: 'left' },
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
              label: 'Discord',
              href: 'https://discord.gg/UDUa8MA6Ef',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/lumberjack',
            },
          ],
        },
        {
          title: 'More',
          items: [
            // TODO: Enable blog when we have content
            // {
            //   label: 'Blog',
            //   to: '/blog',
            // },
            {
              label: 'GitHub',
              href: 'https://github.com/ngworker/lumberjack',
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
        // TODO: Enable blog when we have content
        // blog: {
        //   blogTitle: 'Lumberjack blog!',
        //   blogDescription: 'The Lumberjack blog contains all the news and knwoledge bits about Lumberjack',
        //   postsPerPage: 15,
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
