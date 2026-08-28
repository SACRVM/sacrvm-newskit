/**
 * <sac-sources>
 *   <a href="…">example.org · 1992</a>
 *   <a href="…">archive.example · 2017</a>
 * </sac-sources>
 *
 * The credibility spine of a record: its sources as scannable chips
 * (domain · date). Styling is newskit.css (light DOM; class fallback
 * .sac-sources). The only behaviour here: if the author didn't write a
 * leading <span class="label">, one is prepended ("Sources", localised
 * via sac.t when the kit globals are loaded).
 */
(function () {

    const t = (key, fallback) =>
        (window.sac && window.sac.t) ? window.sac.t(key, fallback) : fallback;

class SacSources extends HTMLElement {
    connectedCallback() {
        if (this.querySelector(".label")) return;
        const label = document.createElement("span");
        label.className = "label";
        label.textContent = t("newskit.sources", "Sources");
        this.prepend(label);
    }
}

customElements.define("sac-sources", SacSources);

})();
