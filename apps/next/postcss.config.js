module.exports = {
  plugins: [
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    ],
    // [
    //   '@fullhuman/postcss-purgecss',
    //   {
    //     content: [
    //       './pages/**/*.{js,jsx,ts,tsx}',
    //       './../../packages/app/**/*.{js,jsx,ts,tsx}',
    //       './../../packages/ui/**/*.{js,jsx,ts,tsx}',
    //     ],
    //     defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    //     safelist: ['html', 'body'],
    //   },
    // ],
  ],
}
