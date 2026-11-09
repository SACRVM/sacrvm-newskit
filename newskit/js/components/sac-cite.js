/**
 * <sac-cite href="#s1">1</sac-cite>
 *
 * Inline citation marker — a claim carries its evidence. Renders (in the
 * light DOM, so newskit.css styles it) an anchor to the record's source
 * chip. The hand-authored fallback is <a class="sac-cite" href="#s1">1</a>;
 * a hand-written <a> inside the element keeps its text and href.
 *
 * Light DOM on purpose: every newskit primitive must look identical when
 * written as plain HTML with the fallback class — behaviour-only JS.
 *
 * What the script adds on top of the plain anchor:
 * - A real name. A bare "1" tells a screen-reader user nothing, so the
 *   anchor is named after its chip: "Source 1: example.org, 1992".
 * - An id (cite-<chip id>-<n>), so the way back can point at it.
 * - The way back. The chip it points at gets a "Back to text" link right
 *   after it, shown only while that chip is the page's :target (newskit.css).
 *   It returns to the marker the reader came from. Without the script, the
 *   browser's Back button does the same job.
 * - A console warning when the marker's number is not the chip's position
 *   in its sac-sources (the number the chip shows).
 *
 * Attributes:
 *   href — the citation target (typically a #fragment of a source chip).
 */
(function () {

    const t = (key, fallback) =>
        (window.sac && window.sac.t) ? window.sac.t(key, fallback) : fallback;

    const chipsOf = (list) => [...list.querySelectorAll("a:not(.sac-back)")];

class SacCite extends HTMLElement {
    connectedCallback() {
        let a = this.querySelector("a");
        if (!a) {
            a = document.createElement("a");
            a.href = this.getAttribute("href") || "#";
            while (this.firstChild) a.appendChild(this.firstChild);
            this.appendChild(a);
        }
        this._a = a;
        // The chip may not be parsed yet when the script runs undeferred.
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this._link(), { once: true });
        } else {
            this._link();
        }
    }

    _link() {
        const a = this._a;
        const num = a.textContent.trim();
        const href = a.getAttribute("href") || "";
        const root = this.getRootNode();
        const chip = href.startsWith("#") && href.length > 1 && root.getElementById
            ? root.getElementById(decodeURIComponent(href.slice(1))) : null;
        const word = t("newskit.cite.source", "Source");

        if (!chip) {
            if (!a.hasAttribute("aria-label")) a.setAttribute("aria-label", `${word} ${num}`);
            return;
        }

        if (!a.hasAttribute("aria-label")) {
            const what = chip.textContent.replace(/\s+/g, " ").trim().replace(/ · /g, ", ");
            a.setAttribute("aria-label", `${word} ${num}: ${what}`);
        }

        if (!a.id) {
            let n = 1, id;
            do { id = `cite-${chip.id}-${n++}`; } while (root.getElementById(id));
            a.id = id;
        }

        const list = chip.closest("sac-sources, .sac-sources");
        if (list) {
            const pos = chipsOf(list).indexOf(chip) + 1;
            if (pos && String(pos) !== num) {
                console.warn(`sac-cite: marker "${num}" points at source ${pos} (#${chip.id}).`, a);
            }
        }

        // The way back: one link per chip, after it. The first marker that
        // cites the chip is the default; a click re-aims it at the marker
        // actually followed.
        let back = chip.nextElementSibling;
        if (!back || !back.classList.contains("sac-back")) {
            back = document.createElement("a");
            back.className = "sac-back";
            back.href = `#${a.id}`;
            back.textContent = t("newskit.cite.back", "Back to text");
            chip.after(back);
        }
        a.addEventListener("click", () => { back.href = `#${a.id}`; });
    }
}

customElements.define("sac-cite", SacCite);

})();
