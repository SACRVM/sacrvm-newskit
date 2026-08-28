/**
 * <sac-provenance researched="2026-08-24" method="multi-source review"
 *                 sources="3" claims="2"></sac-provenance>
 *
 * The under-title strip of a researched piece: how and when it was made,
 * at a glance. Renders one <span><b>Label</b> value</span> per present
 * attribute, in fixed order, into the light DOM (newskit.css styles it).
 *
 * Hand-authored fallback: write the spans yourself inside
 * <div class="sac-provenance">…</div> — identical look. An element that
 * has children but NO known attributes is left untouched.
 *
 * Attributes (all optional; labels localised via sac.t when loaded):
 *   researched — date the research was done
 *   method     — how (e.g. "multi-source review")
 *   sources    — source count
 *   claims     — claim count
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

class SacProvenance extends HTMLElement {
    static get observedAttributes() { return FIELDS.map(([name]) => name); }

    connectedCallback()        { this.render(); }
    attributeChangedCallback() { this.render(); }

    render() {
        const present = FIELDS.filter(([name]) => this.hasAttribute(name));
        if (!present.length) return;    // hand-authored content stays
        // Escape: values may come from article metadata assembled by a tool.
        const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
        this.innerHTML = present.map(([name, label]) =>
            `<span><b>${esc(label())}</b> ${esc(this.getAttribute(name))}</span>`
        ).join("");
    }
}

customElements.define("sac-provenance", SacProvenance);

})();
