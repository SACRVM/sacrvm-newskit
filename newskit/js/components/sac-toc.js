/**
 * <sac-toc brand="Newskit" label="Contents"></sac-toc>
 *
 * The persistent left chapter rail: always visible beside the article
 * (inside a .news-shell grid), it lists the chapters as a numbered rail
 * and tracks the reading position — done chapters fill, the current one
 * lights up and carries aria-current="location". Under 60rem the shell
 * collapses to one column and the same list sits above the article behind
 * a "Contents" button (collapsed by default).
 *
 * Builds its list (in the light DOM — newskit.css owns the look, and a
 * fully hand-written <nav class="sac-toc"> renders identically, its list
 * always open) from the document's chapter anchors after DOMContentLoaded:
 *
 * - Targets default to every <sac-section-head> / .sac-section-head.
 * - A target without an id gets one, slugged from its title.
 * - Link text = the target's <h2> (or its own text).
 * - The element becomes a navigation landmark named after its label.
 *
 * Position tracking (same maths as the approved design template): active =
 * the last chapter whose top has crossed the 28% reading line; at the page
 * bottom the final chapter is forced active so the last item lights up.
 * A click scrolls smoothly (honouring prefers-reduced-motion), moves focus
 * to the chapter's heading so the next Tab continues inside that chapter,
 * and adds a history entry, so Back returns to where the reader was.
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

    let uid = 0;

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
        const listId = this._listId || (this._listId = `sac-toc-list-${++uid}`);
        // Compact layouts start collapsed; a rebuild keeps the reader's choice.
        const open = this.querySelector(".toc-toggle")?.getAttribute("aria-expanded") === "true";

        this.setAttribute("role", "navigation");
        this.setAttribute("aria-label", label);
        this.innerHTML =
            (brand ? `<p class="brand">${esc(brand)}</p>` : "") +
            `<p class="rail-label" aria-hidden="true">${esc(label)}</p>` +
            `<button type="button" class="btn toc-toggle" aria-expanded="${open}" aria-controls="${listId}">${esc(label)}</button>` +
            `<ol id="${listId}">` + this._targets.map((el, i) => {
                const title = (el.querySelector("h2, h3")?.textContent || el.textContent).trim();
                return `<li><a href="#${esc(el.id)}">` +
                       `<span class="n">${String(i + 1).padStart(2, "0")}</span> ${esc(title)}</a></li>`;
            }).join("") + `</ol>`;
        this._links = [...this.querySelectorAll("ol a")];

        const toggle = this.querySelector(".toc-toggle");
        toggle.addEventListener("click", () => {
            toggle.setAttribute("aria-expanded", String(toggle.getAttribute("aria-expanded") !== "true"));
        });

        // Explicit smooth scroll — reliable for every link including the
        // last one, which a native anchor jump can't reach when the page
        // bottom is closer than the scroll line. Then the reader follows
        // the view: focus lands on the chapter heading, and the jump gets
        // its own history entry.
        const reduce = matchMedia("(prefers-reduced-motion: reduce)");
        this._links.forEach((a, i) => a.addEventListener("click", (e) => {
            e.preventDefault();
            const target = this._targets[i];
            const top = target.getBoundingClientRect().top + window.scrollY - 16;
            const hash = a.getAttribute("href");
            if (location.hash !== hash) history.pushState(null, "", hash);
            window.scrollTo({ top, behavior: reduce.matches ? "auto" : "smooth" });
            const heading = target.querySelector("h2, h3") || target;
            if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
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
                if (i === idx) a.setAttribute("aria-current", "location");
                else a.removeAttribute("aria-current");
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
