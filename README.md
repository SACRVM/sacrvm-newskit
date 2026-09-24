# SACRVM NEWSKIT

A zero-dependency **editorial kit** for publishing long-form, source-backed articles —
the sister of [SACRVM APPKIT](https://github.com/SACRVM/sacrvm-appkit).

Newskit wears appkit's own look (same tokens, same theming, light / dark / auto) and
specialises it for *reading*: a condensed news-headline treatment, article primitives, a
publication hub, and — the point — **sources and provenance as first-class citizens**,
because that is what a researched article stands on.

- **Zero dependencies, no build.** Pure vanilla Custom Elements + plain CSS, served as-is
  (`npx serve .`).
- **Built on appkit.** Vendors the appkit `kit/` and consumes its tokens; a retheme of
  appkit rethemes newskit.
- **Hand-authored articles.** An article is an HTML file using the `sac-*` primitives — no
  markdown parser, no CMS.

## Status

Phases 1–3 done: the reading layer (`newskit/newskit.css` + self-hosted Oswald), the article
primitives with the trust layer, and the demo article (`demo/project-greek-island.html`). Live
proof in `styleguide/`. The build order is in [`ROADMAP.md`](ROADMAP.md); the full plan (with the design
decisions and the Fable + Grok design review) is the project-plan artifact linked there.

## Development

```
npx serve .    # http://localhost:3000
```

No build step. No tests — verify manually in the browser.

## Licence

MIT — see [`LICENSE`](LICENSE). The copyright line names the contributor collective, not a
person; who holds the rights is established by the commit history.
