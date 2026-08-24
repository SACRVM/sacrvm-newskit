# Newskit — Roadmap

The full plan (with rationale and the Fable + Grok design review) is the project-plan
artifact: https://claude.ai/code/artifact/44c9a845-c11a-40a9-ae5c-2fe7cc6495dc

## Locked decisions
- Sister repo that **vendors appkit**; specialisation lives outside appkit's lean core.
- **Identity:** appkit's look + condensed UPPERCASE **Oswald** headlines. No warm-paper/serif skin.
- **Authoring:** hand-written HTML with `sac-*` primitives. No markdown parser, no CMS.
- **Scope:** articles + a Medium-like **hub** + article **metadata** (OG / schema.org Article +
  reading-time). Feed (RSS/Atom) + tags/series are a documented later extension.
- **Credibility is the kit's job:** `sac-sources` (chips), inline `sac-cite`, `sac-provenance`,
  `method`/`disclosure` callout, claim↔evidence. The AI authoring pipeline is a separate project.
- Prefix stays `sac-*`. Reset is `*,*::before,*::after{box-sizing:border-box}`.

## Build order
1. **Reading layer** — `newskit.css` on appkit's tokens: ~40rem prose measure, reading rhythm,
   article type scale, per-scheme AA contrast, self-hosted Oswald. Proves the look in light/dark.
2. **Core primitives + trust layer** — sac-article, sac-masthead, sac-section-head, sac-record,
   sac-sources, sac-cite, sac-provenance, sac-callout, sac-pullquote, sac-figure, sac-colophon, sac-toc.
3. **The demo article** — the reference piece re-typeset; end-to-end proof + copy-to-start.
4. **Styleguide** — every primitive live, appkit-style, with attribute/slot tables.
5. **Hub + metadata** — publication index, OG / schema.org Article, reading-time, source counts.
6. **Release plumbing** — `newskit/VERSION`, the Action (present), CONSUMING.md, the two-kit
   vendoring recipe.
7. **Documented extensions** — feed (RSS/Atom), tags/series, source access-dates.

Each phase is usable on its own; smallest first.

## The two-kit model
A publication vendors **both** kits: appkit under `kit/`, newskit under `newskit/`, kept on
aligned versions. Newskit itself re-vendors appkit on each appkit release (appkit's release
policy sends a re-vendor "update now" note). Full recipe lands in `CONSUMING.md` at phase 6.
