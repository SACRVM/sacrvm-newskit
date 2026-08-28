/**
 * <sac-section-head marker="Part 01|What exists">
 *   <h2>The section title</h2>
 *   <p class="note">One-line dek under the title.</p>
 * </sac-section-head>
 *
 * Accent marker + H2 + note — and the chapter anchor sac-toc scans for.
 * Layout and look are newskit.css (light DOM; class fallback
 * .sac-section-head). Behaviour here is structure sugar only:
 *
 * - Bare text content (<sac-section-head>What exists</sac-section-head>)
 *   is wrapped into an <h2>.
 * - The `marker` attribute renders the left-column eyebrow; "|" breaks
 *   lines ("Part 01|What exists" → two stacked lines). A hand-written
 *   <p class="marker"> wins over the attribute.
 *
 * Attributes:
 *   marker — eyebrow text for the 5rem left column; "|" = line break.
 *   id     — chapter anchor; assigned by sac-toc from the title if absent.
 */
class SacSectionHead extends HTMLElement {
    connectedCallback() {
        // Text-only authoring → wrap everything into the h2.
        if (!this.querySelector("h2") && this.textContent.trim()) {
            const h2 = document.createElement("h2");
            while (this.firstChild) h2.appendChild(this.firstChild);
            this.appendChild(h2);
        }
        const marker = this.getAttribute("marker");
        if (marker && !this.querySelector(".marker")) {
            const p = document.createElement("p");
            p.className = "marker";
            marker.split("|").forEach((line, i) => {
                if (i) p.appendChild(document.createElement("br"));
                p.appendChild(document.createTextNode(line.trim()));
            });
            this.prepend(p);
        }
    }
}

customElements.define("sac-section-head", SacSectionHead);
