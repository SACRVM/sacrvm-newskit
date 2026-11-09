/**
 * <sac-provenance researched="2026-08-24" method="multi-source review"
 *                 sources claims></sac-provenance>
 *
 * The under-title strip of a researched piece: how and when it was made,
 * at a glance. Renders one <span><b>Label</b> value</span> per present
 * attribute, in fixed order, into the light DOM (newskit.css styles it).
 *
 * The two counts are counted, not typed: a hand-typed number drifts the
 * moment a claim or a source is added. Inside an article (the enclosing
 * sac-article, else the element's document or shadow root) that has cite
 * markers, the strip shows
 *   sources — the distinct source URLs among its sac-sources chips;
 *   claims  — the cited claims: sac-cite markers, where markers that sit
 *             directly next to each other count as one claim.
 * A number written in the attribute is only the fallback for a strip with
 * nothing to count (a styleguide specimen, a teaser). When the article has
 * something to count and the attribute disagrees, the count wins and the
 * console says so. Write the attribute empty (`sources claims`) to just
 * ask for the count.
 *
 * Hand-authored fallback: write the spans yourself inside
 * <div class="sac-provenance">…</div> — identical look. An element that
 * has children but NO known attributes is left untouched.
 *
 * Attributes (all optional; labels localised via sac.t when loaded):
 *   researched — date the research was done
 *   method     — how (e.g. "multi-source review")
 *   sources    — show the source count (value = fallback)
 *   claims     — show the claim count (value = fallback)
 */
(function () {

    const t = (key, fallback) =>
        (window.sac && window.sac.t) ? window.sac.t(key, fallback) : fallback;

    const FIELDS = [
        ["researched", () => t("newskit.provenance.researched", "Researched")],
        ["method",     () => t("newskit.provenance.method", "Method")],
        ["sources",    () => t("newskit.provenance.sources", "Sources")],
        ["claims",     () => t("newskit.provenance.claims", "Claims")],
    ];

    const CITE = "sac-cite, a.sac-cite";
    const isCite = (n) => n && n.nodeType === 1 &&
        (n.localName === "sac-cite" || (n.localName === "a" && n.classList.contains("sac-cite")));

    /** What the article actually carries — null when there is nothing to count. */
    function count(scope) {
        const cites = [...scope.querySelectorAll(CITE)]
            .filter((el) => !(el.localName === "a" && el.closest("sac-cite")));
        if (!cites.length) return null;
        let claims = 0;
        for (const el of cites) {
            let prev = el.previousSibling;
            while (prev && prev.nodeType === 3 && !prev.textContent.trim()) prev = prev.previousSibling;
            if (!isCite(prev)) claims++;
        }
        const urls = new Set([...scope.querySelectorAll("sac-sources a[href], .sac-sources a[href]")]
            .filter((a) => !a.classList.contains("sac-back"))
            .map((a) => a.href));
        return { claims: String(claims), sources: String(urls.size) };
    }

class SacProvenance extends HTMLElement {
    static get observedAttributes() { return FIELDS.map(([name]) => name); }

    connectedCallback() {
        this.render();
        // The cites further down may not be parsed yet when the script runs undeferred.
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.render(), { once: true });
        }
    }
    attributeChangedCallback() { if (this.isConnected) this.render(); }

    render() {
        const present = FIELDS.filter(([name]) => this.hasAttribute(name));
        if (!present.length) return;    // hand-authored content stays
        const counted = count(this.closest("sac-article, .sac-article") || this.getRootNode());
        const value = (name) => {
            const typed = this.getAttribute(name);
            if (!counted || !(name in counted)) return typed;
            if (typed.trim() && typed.trim() !== counted[name]) {
                console.warn(`sac-provenance: ${name}="${typed}", but the article carries ${counted[name]}; showing ${counted[name]}.`, this);
            }
            return counted[name];
        };
        // Escape: values may come from article metadata assembled by a tool.
        const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
        this.innerHTML = present
            .map(([name, label]) => [label, value(name)])
            .filter(([, v]) => String(v).trim())    // an empty count with nothing to count
            .map(([label, v]) => `<span><b>${esc(label())}</b> ${esc(v)}</span>`)
            .join("");
    }
}

customElements.define("sac-provenance", SacProvenance);

})();
