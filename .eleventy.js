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

  // Add id attributes to markdown headings for in-page anchors
  const markdownIt = require("markdown-it");
  const md = markdownIt({ html: true, linkify: true }).use((markdown) => {
    const defaultRender =
      markdown.renderer.rules.heading_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    markdown.renderer.rules.heading_open = function (
      tokens,
      idx,
      options,
      env,
      self
    ) {
      const inline = tokens[idx + 1];
      if (inline && inline.type === "inline") {
        const slug = inline.content
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
        if (slug) tokens[idx].attrSet("id", slug);
      }
      return defaultRender(tokens, idx, options, env, self);
    };
  });
  eleventyConfig.setLibrary("md", md);

  // Strip HTML comments (e.g. <!-- Spencer: ... -->) from rendered pages
  eleventyConfig.addTransform("stripHtmlComments", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
      return content.replace(/<!--[\s\S]*?-->/g, "");
    }
    return content;
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
