/**
 * <sac-cite href="#s1">1</sac-cite>
 *
 * Inline citation marker — a claim carries its evidence. Renders (in the
 * light DOM, so newskit.css styles it) an anchor to the record's source
 * list. The hand-authored fallback is <a class="sac-cite" href="#s1">1</a>;
 * a hand-written <a> inside the element is kept untouched.
 *
 * Light DOM on purpose: every newskit primitive must look identical when
 * written as plain HTML with the fallback class — behaviour-only JS.
 *
 * Attributes:
 *   href — the citation target (typically a #fragment of a source chip).
 */
class SacCite extends HTMLElement {
    connectedCallback() {
        if (this.querySelector("a")) return;    // hand-authored anchor wins
        const a = document.createElement("a");
        a.href = this.getAttribute("href") || "#";
        while (this.firstChild) a.appendChild(this.firstChild);
        this.appendChild(a);
    }
}

customElements.define("sac-cite", SacCite);
