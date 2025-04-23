console.log("✅ craco.config.js is loaded");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Remove source-map-loader to prevent source map warnings
      webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
        if (Array.isArray(rule.oneOf)) {
          rule.oneOf = rule.oneOf.filter(
            (loader) =>
              !(loader.loader && loader.loader.includes("source-map-loader"))
          );
        }
        return rule;
      });

      // Suppress specific warnings (if still any remain)
      webpackConfig.ignoreWarnings = [
        (warning) =>
          typeof warning.message === "string" &&
          warning.message.includes("Failed to parse source map"),
      ];

      return webpackConfig;
    },
  },
  devServer: {
    allowedHosts: "all",
  },
};
