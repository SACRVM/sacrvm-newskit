/**
 * Styleguide-only: the newskit pages in <sac-nav>'s panel. Plain multi-page
 * hrefs (no mount), resolved against this script so the paths are right on
 * a local server and on GitHub Pages alike; sac-nav marks the current page
 * by comparing location.pathname.
 */
(function () {
    if (!window.sac?.router) return;
    const base = document.currentScript.src;
    const at = (rel) => new URL(rel, base).pathname;
    sac.router.register(at("../index.html"), null, { label: "Overview", icon: "home" });
    sac.router.register(at("reading.html"), null, { label: "Reading layer", icon: "document" });
    sac.router.register(at("primitives.html"), null, { label: "Article primitives", icon: "layers" });
    sac.router.register(at("../demo/project-greek-island.html"), null, { label: "Demo article", icon: "star" });
})();
