/**
 * <sg-specimen><template>…article HTML…</template></sg-specimen>
 *
 * Styleguide-only: renders a newskit specimen exactly as an article gets
 * it. The page itself wears appkit's showcase layer, whose .sg-page rules
 * (p, h2, h3, code …) would otherwise bleed into the specimen. So the
 * template is cloned into a shadow root that links ONLY ui.css and
 * newskit.css (the same files the page links), inside a bare
 * <sac-article>. Tokens still inherit from :root, so the theme toggle
 * re-themes every specimen; fonts come from the page's @font-face.
 *
 * Attributes:
 *   bare — no <sac-article> wrapper (for a specimen that is a whole article
 *          or a .news-shell of its own).
 *
 * sg.demo(html) builds the usual pair: the live box, then its source as a
 * code block (one string, so the shown code can never drift from the demo).
 */
(function () {
    const SHEETS = ["ui.css", "newskit.css"];

    class SgSpecimen extends HTMLElement {
        connectedCallback() {
            if (this.shadowRoot) return;
            const tpl = this.querySelector(":scope > template");
            if (!tpl) return;
            const root = this.attachShadow({ mode: "open" });
            for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
                if (SHEETS.some((name) => link.href.endsWith("/" + name))) {
                    root.appendChild(link.cloneNode());
                }
            }
            const style = document.createElement("style");
            style.textContent = ":host { display: block; }"
                + " sac-article { max-width: none; margin: 0; padding: 0; }"
                + " sac-article > :first-child { margin-top: 0; }"
                + " sac-article > :last-child { margin-bottom: 0; }";
            root.appendChild(style);
            const host = this.hasAttribute("bare") ? root : root.appendChild(document.createElement("sac-article"));
            host.appendChild(tpl.content.cloneNode(true));
        }
    }
    customElements.define("sg-specimen", SgSpecimen);

    // Strip the common indent so a demo written inside an indented template
    // literal shows as clean source.
    const dedent = (s) => {
        const lines = s.replace(/^\n+|\s+$/g, "").split("\n");
        const pad = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
        return lines.map((l) => l.slice(pad)).join("\n");
    };

    window.sg = {
        dedent,
        demo: (html, { bare = false } = {}) => `
            <div class="sg-demo on-bg"><sg-specimen${bare ? " bare" : ""}><template>${html}</template></sg-specimen></div>
            ${sac.showcase.code(dedent(html))}`,
    };
})();
