/// <reference types="astro/client" />

declare module 'virtual:starlight/components/Search' {
  const Search: typeof import('@astrojs/starlight/components').Search;
  export default Search;
}

declare module 'virtual:starlight/components/SocialIcons' {
  const SocialIcons: typeof import('@astrojs/starlight/components').SocialIcons;
  export default SocialIcons;
}

declare module 'virtual:starlight/components/ThemeSelect' {
  const ThemeSelect: typeof import('@astrojs/starlight/components').ThemeSelect;
  export default ThemeSelect;
}
