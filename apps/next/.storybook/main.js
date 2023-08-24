import { dirname, join } from "path";
module.exports = {
  stories: [
    "../../../packages/**/*.stories.mdx",
    "../../../packages/**/*.stories.@(js|jsx|ts|tsx)",
  ],

  addons: [getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-essentials")],

  viteFinal: async (config, { configType }) => {
    const { tamaguiPlugin } = require("@tamagui/vite-plugin");

    config.plugins.push(
      tamaguiPlugin({
        config: "../tamagui.config.ts",
        components: ["tamagui"],
      }),
    );

    return config;
  },

  typescript: {
    reactDocgen: "react-docgen",
  },

  env: (config) => ({
    ...config,
    TAMAGUI_TARGET: "web",
  }),

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {}
  },

  docs: {
    autodocs: true
  }
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}