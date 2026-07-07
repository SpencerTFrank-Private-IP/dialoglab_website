module.exports = function (eleventyConfig) {
  // Static files copied as-is into the output
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/css/style.css");
  eleventyConfig.addPassthroughCopy("src/CNAME");

  eleventyConfig.addCollection("betaDocs", (api) =>
    api
      .getFilteredByGlob("src/beta/**/*.md")
      .filter((page) => page.url !== "/beta/")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  eleventyConfig.addFilter("betaNeighbors", (order, betaDocs = []) => {
    const hub = { data: { order: 1, title: "Quick Start" }, url: "/beta/" };
    const all = [hub, ...betaDocs].sort(
      (a, b) => (a.data.order || 0) - (b.data.order || 0)
    );
    const idx = all.findIndex((doc) => doc.data.order === order);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? all[idx - 1] : null,
      next: idx < all.length - 1 ? all[idx + 1] : null,
    };
  });

  eleventyConfig.setServerOptions({
    port: 8080,
  });

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
