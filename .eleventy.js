module.exports = function (eleventyConfig) {
  // Static files copied as-is into the output
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/css/style.css");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  // Universal Links (AASA) — must be extensionless JSON at both paths
  eleventyConfig.addPassthroughCopy("src/.well-known");
  eleventyConfig.addPassthroughCopy("src/apple-app-site-association");

  eleventyConfig.addCollection("betaDocs", (api) =>
    api
      .getFilteredByGlob("src/beta/**/*.md")
      .filter((page) => page.url !== "/beta/")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  eleventyConfig.addCollection("supportDocs", (api) =>
    api
      .getFilteredByGlob("src/support/**/*.md")
      .filter((page) => page.url !== "/support/")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  const neighborsFor = (hubUrl) => (order, docs = []) => {
    const hub = { data: { order: 1, title: "Quick Start" }, url: hubUrl };
    const all = [hub, ...docs].sort(
      (a, b) => (a.data.order || 0) - (b.data.order || 0)
    );
    const idx = all.findIndex((doc) => doc.data.order === order);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? all[idx - 1] : null,
      next: idx < all.length - 1 ? all[idx + 1] : null,
    };
  };

  eleventyConfig.addFilter("betaNeighbors", neighborsFor("/beta/"));
  eleventyConfig.addFilter("supportNeighbors", neighborsFor("/support/"));

  const escHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  // Clickable doc screenshot → Alpine lightbox (openLightbox on body)
  eleventyConfig.addShortcode("docShot", (filename, alt, caption = "") => {
    const url = eleventyConfig.getFilter("url");
    const src = url(`/assets/images/docs/${filename}`);
    const safeAlt = escHtml(alt);
    const captionHtml = caption
      ? `\n  <figcaption class="beta-docs__figcaption">${escHtml(caption)}</figcaption>`
      : "";
    return `<figure class="beta-docs__figure">
  <button
    type="button"
    class="beta-docs__shot"
    aria-label="Enlarge screenshot: ${safeAlt}"
    x-on:click="openLightbox($event.currentTarget.querySelector('img'))"
  >
    <img
      src="${src}"
      alt="${safeAlt}"
      width="900"
      height="1840"
      loading="lazy"
      decoding="async"
    />
  </button>${captionHtml}
</figure>`;
  });

  // Placeholder for screenshots that still need to be captured
  eleventyConfig.addShortcode("docShotTodo", (description, caption = "") => {
    const safeDesc = escHtml(description);
    const captionHtml = caption
      ? `\n  <figcaption class="beta-docs__figcaption">${escHtml(caption)}</figcaption>`
      : "";
    return `<figure class="beta-docs__figure beta-docs__figure--todo">
  <div class="beta-docs__shot-todo" role="img" aria-label="Screenshot needed: ${safeDesc}">
    <span class="beta-docs__shot-todo-label">Screenshot needed</span>
    <span class="beta-docs__shot-todo-desc">${safeDesc}</span>
  </div>${captionHtml}
</figure>`;
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
