/**
 * <sac-toc brand="Newskit" label="Contents"></sac-toc>
 *
 * The persistent left chapter rail: always visible beside the article
 * (inside a .news-shell grid), it lists the chapters as a numbered rail
 * and tracks the reading position — done chapters fill, the current one
 * lights up. Hidden under 60rem (the shell collapses to one column).
 *
 * Builds its list (in the light DOM — newskit.css owns the look, and a
 * fully hand-written <nav class="sac-toc"> renders identically) from the
 * document's chapter anchors after DOMContentLoaded:
 *
 * - Targets default to every <sac-section-head> / .sac-section-head.
 * - A target without an id gets one, slugged from its title.
 * - Link text = the target's <h2> (or its own text).
 *
 * Position tracking (same maths as the approved design template): active =
 * the last chapter whose top has crossed the 28% reading line; at the page
 * bottom the final chapter is forced active so the last item lights up.
 * Clicks scroll smoothly (honouring prefers-reduced-motion) and update the
 * URL fragment without adding history entries.
 *
 * Attributes:
 *   brand — display-face brand line above the rail (optional).
 *   label — rail heading; defaults to "Contents" (sac.t-localised).
 *   for   — CSS selector for the chapter targets; defaults to
 *           "sac-section-head, .sac-section-head".
 *
 * Methods:
 *   refresh() — re-scan and rebuild (for dynamically assembled pages).
 */
(function () {

    const t = (key, fallback) =>
        (window.sac && window.sac.t) ? window.sac.t(key, fallback) : fallback;

class SacToc extends HTMLElement {
    connectedCallback() {
        const build = () => this.refresh();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", build, { once: true });
        } else {
            build();
        }
    }

    disconnectedCallback() { this._unbind(); }

    refresh() {
        this._unbind();
        const selector = this.getAttribute("for") || "sac-section-head, .sac-section-head";
        this._targets = [...document.querySelectorAll(selector)];
        if (!this._targets.length) return;

        // Every chapter needs an anchor; slug missing ids from the title.
        const used = new Set();
        this._targets.forEach((el, i) => {
            if (!el.id) {
                const title = (el.querySelector("h2, h3")?.textContent || "").trim();
                const base = title.toLowerCase()
                    .replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "")
                    || `part-${i + 1}`;
                let id = base, n = 2;
                while (used.has(id) || document.getElementById(id)) id = `${base}-${n++}`;
                el.id = id;
            }
            used.add(el.id);
        });

        const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        const brand = this.getAttribute("brand");
        const label = this.getAttribute("label") || t("newskit.toc.contents", "Contents");
        this.innerHTML =
            (brand ? `<p class="brand">${esc(brand)}</p>` : "") +
            `<p class="rail-label">${esc(label)}</p>` +
            `<ol>` + this._targets.map((el, i) => {
                const title = (el.querySelector("h2, h3")?.textContent || el.textContent).trim();
                return `<li><a href="#${esc(el.id)}">` +
                       `<span class="n">${String(i + 1).padStart(2, "0")}</span> ${esc(title)}</a></li>`;
            }).join("") + `</ol>`;
        this._links = [...this.querySelectorAll("ol a")];

        // Explicit smooth scroll — reliable for every link including the
        // last one, which a native anchor jump can't reach when the page
        // bottom is closer than the scroll line.
        const reduce = matchMedia("(prefers-reduced-motion: reduce)");
        this._links.forEach((a, i) => a.addEventListener("click", (e) => {
            e.preventDefault();
            const top = this._targets[i].getBoundingClientRect().top + window.scrollY - 16;
            window.scrollTo({ top, behavior: reduce.matches ? "auto" : "smooth" });
            history.replaceState(null, "", a.getAttribute("href"));
        }));

        this._onScroll = () => {
            const line = window.innerHeight * 0.28;
            let idx = 0;
            this._targets.forEach((el, i) => {
                if (el.getBoundingClientRect().top <= line) idx = i;
            });
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
                idx = this._targets.length - 1;
            }
            this._links.forEach((a, i) => {
                a.classList.toggle("active", i === idx);
                a.classList.toggle("done", i < idx);
            });
        };
        window.addEventListener("scroll", this._onScroll, { passive: true });
        window.addEventListener("resize", this._onScroll);
        this._onScroll();
    }

    _unbind() {
        if (!this._onScroll) return;
        window.removeEventListener("scroll", this._onScroll);
        window.removeEventListener("resize", this._onScroll);
        this._onScroll = null;
    }
}

customElements.define("sac-toc", SacToc);

})();
