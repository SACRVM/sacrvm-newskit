# CLAUDE.md — SACRVM NEWSKIT

Newskit is the **editorial sister of SACRVM APPKIT** (`D:\repos\sacrvm-appkit`): a
zero-dependency kit for publishing long-form, source-backed articles. It wears appkit's
own look and specialises it for *reading* — a condensed news-headline treatment, article
primitives, a publication hub, and (the point) **sources and provenance as first-class
citizens**, because that is what a researched article stands on.

## The plan (read first)

The full project plan — vision, the locked decisions, the component inventory, the build
order — is the design-review-hardened plan artifact:
https://claude.ai/code/artifact/44c9a845-c11a-40a9-ae5c-2fe7cc6495dc — and `ROADMAP.md` in
this repo. The **owner-approved visual design template** (that page in the target style) is
checked in at `reference/design-template.html` — the source of truth for the look; Phase 1
extracts `newskit.css` from it. Do not re-derive the design; it is decided below.

## Relationship to appkit — two kits, one look

Newskit is a **consumer of appkit** (it vendors appkit's `kit/` autark, like any app) AND
a kit in its own right (publications vendor `newskit/`). It does NOT fork appkit's core:
appkit stays lean and neutral, newskit is the domain (editorial) layer on top — the
"specialisation lives outside core" precedent (appkit's parked md-editor). A retheme of
appkit rethemes newskit, because newskit consumes appkit's tokens directly. Keep the
vendored `kit/` on the appkit version newskit targets; re-vendor on each appkit release
(appkit sends a re-vendor "update now" note per its policy).

## Core philosophy (inherited from appkit — non-negotiable)

1. **Zero dependencies, no build step.** Pure vanilla Custom Elements + plain CSS, served
   as-is (`npx serve .`). Never a bundler, never node_modules in the dev loop.
2. **Drop-in usable.** A publication consumes newskit by vendoring the `newskit/` folder
   (plus appkit's `kit/`) and writing plain HTML.
3. **Hand-authored articles.** An article is an HTML file using the `sac-*` primitives —
   no markdown parser, no CMS, no render layer.
4. **Befehlsgehorsam.** The user decides, Claude executes. Do not second-guess design.

## Decisions (locked with the user, 2026-08-24)

- **Prefix stays `sac-*`** — one component family across both kits.
- **Identity = appkit's look, tuned for a news feeling.** Same seeds/tokens, Inter for
  reading, Outfit for labels, rounded surfaces, hairlines, `--accent`. The one deliberate
  addition is **Oswald** — condensed, UPPERCASE display headlines (the reference's
  signature). The news feeling comes from structure + hierarchy + those headlines, NOT a
  separate palette or a warm-paper/serif skin (explicitly rejected).
- **Authoring = hand-written HTML** with the kit elements/classes. No markdown step.
- **Scope = articles + a hub + article metadata.** Reading layout & components, a Medium-
  like publication index, per-article metadata (OpenGraph / Twitter / schema.org Article +
  reading-time). Feed (RSS/Atom) + tags/series are a documented later extension, not v1.
- **Credibility is the kit's job.** Newskit owns the trust primitives — `sac-sources`
  (chips), inline `sac-cite`, `sac-provenance`, a `method`/`disclosure` callout, the
  claim↔evidence pairing. The AI research/authoring pipeline is a SEPARATE, later project;
  newskit renders and structures, it does not generate.
- **Appkit's design rules apply in full** (we stay in the rounded world): never a thick
  (≥2px) colored border on a rounded surface — accent via eyebrow colour + subtle tint,
  never a stripe. And the CSS reset MUST be `*,*::before,*::after{box-sizing:border-box}` —
  `*` alone does not match pseudo-elements, and a bordered circle/line then mis-centres
  (learned building the plan's chapter rail).

## Deliverables (three parts, one repo)

1. **The kit (`newskit/`)** — the editorial layer: `newskit.css` (reading measure, type
   scale, tokens on appkit's engine) + the article components + self-hosted Oswald.
2. **The style guide (`styleguide/`)** — every primitive live, appkit-style.
3. **The demo (`demo/`)** — one real mini-publication (the reference piece re-typeset).

Plus a vendored `kit/` (appkit) and the launcher/hub template.

## Article primitives (the inventory)

`sac-article` (reading container) · `sac-masthead` (kicker/title/standfirst/dateline) ·
`sac-section-head` · `sac-record` (structured entry) · `sac-sources` (chips) · `sac-cite`
(inline marker) · `sac-provenance` (strip) · `sac-callout` (method/disclosure) ·
`sac-pullquote` · `sac-card-grid`/`sac-card` · `sac-figure` · `sac-colophon` · `sac-toc`
(persistent left chapter rail). Reused from appkit: tokens, `sac-icon`, the caption
utility, `sac-nav`/`sac-footer` for hub chrome.

## Build order

1. Reading layer (`newskit.css` on appkit tokens). 2. Core primitives + the trust layer.
3. The demo article. 4. Styleguide. 5. Hub + metadata. 6. Release plumbing
(`newskit/VERSION`, the Action, CONSUMING.md, the two-kit vendoring recipe). 7. Documented
extensions (feed, tags/series). Smallest first; each phase usable on its own. See
`ROADMAP.md`.

## Development

```bash
npx serve .    # http://localhost:3000 — same workflow as appkit
```

No build step. No tests — verify manually in the browser, in both the style guide and the demo.

## Firepit inbox

At the start of a session, read any pending messages in `.firepit/inbox/*.md` — cross-project notes Firepit routes here. Act on each, then mark it done with the `firepit_inbox_complete` MCP tool, passing the message's filename as the `id`.

## Firepit knowledge

Before researching something that may already be known, query the knowledge base with the `firepit_knowledge_search` MCP tool (scope `both` covers this project plus the global base). Save durable findings with `firepit_knowledge_add` — written in English, per the indexing convention. The created markdown files live under `.firepit/knowledge/` and are committed like any other file.

## Firepit pinned knowledge

@.firepit/knowledge-pinned.md

The import above auto-loads the knowledge docs marked `pin: true` in their frontmatter — always-on rules that apply every session without a search. Firepit regenerates the file from the pinned docs; don't edit it directly. Pin/unpin via the pinned flag on `firepit_knowledge_add` / `firepit_knowledge_update`, and keep the pinned set small — everything else stays reachable through `firepit_knowledge_search`.

## Firepit artifacts

When you produce a file the user will want to open — a report, screenshot, diagram, generated image, log excerpt, build output, or an executable you built for them to run — pin it with the `firepit_artifact_add` MCP tool so it appears in the project's paperclip pane. Do this as you produce it, not at the end of the session; a path buried in scrollback is a path the user has to hunt for. Pinning only links the file — it stays where it is, and `firepit_artifact_remove` never deletes it. Check `firepit_artifact_list` first so you update an existing entry instead of piling up near-duplicates, and unpin what has gone stale.

## Firepit conventions

<!-- claude-firepit-fragments -->

@../.firepit/projects/claude.md
@../.firepit/projects/claude-github-public.md

The two imports above are shared files in the Firepit central repo — edit them there and every project follows. They carry policy; the tools themselves are described by Firepit's MCP server at the handshake, so nothing is duplicated between the two.
