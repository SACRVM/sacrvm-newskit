---
description: Cut a versioned release — bump, commit, tag, push, notify consumers (the GitHub Action builds the ZIP)
argument-hint: <version, e.g. 0.1.0>
---
Cut release **$ARGUMENTS** of SACRVM NEWSKIT.

Solo repo, **no PRs**: work lands on `master` directly, and a pushed `vX.Y.Z` tag triggers
`.github/workflows/release.yml`, which writes `newskit/VERSION`, zips `newskit/` + `LICENSE`
into `sacrvm-newskit-X.Y.Z.zip`, and creates a GitHub release with generated notes. A second
job npm-publishes the same plain files **only** if an `NPM_TOKEN` secret exists, and skips
quietly otherwise. Packaging happens **only** server-side — the local workflow stays
build-free by design.

Follow these steps exactly:

1. **Sanity.** Confirm `$ARGUMENTS` is a plain semver `X.Y.Z`. Decide MAJOR/MINOR/PATCH from
   the changes since the last tag — a **breaking** change (renamed/removed API, changed event
   shape, a markup contract) means a MAJOR bump; while < 1.0.0, breaking changes bump MINOR.
   Run `git status`: the tree must be clean (commit or stop if not).

2. **Bump the version.** It lives in these spots (kept few — do NOT scatter it; `newskit/VERSION`
   is written by the Action, not committed):
   - `package.json` → the `"version"` field.
   - `index.html` → any `app-name` / version display and the Download tile/href, once the hub
     exists. (Until then, package.json is the only spot.)
   Also fix any now-stale count in the `package.json` description if components changed.

3. **Commit** on `master`: subject `Stamp $ARGUMENTS`, then a one-paragraph body naming the
   headline changes (say "breaking" plainly when it applies). End with the repo's
   `Co-Authored-By:` trailer naming the model that made the commit (e.g.
   `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`).

4. **Push, then tag.** `git push origin master`, then
   `git tag -a v$ARGUMENTS -m "v$ARGUMENTS — <one-line summary>"` and
   `git push origin v$ARGUMENTS`. The **tag push is the publish** — a public release goes out
   the moment it lands.

5. **Verify.** Poll `gh run list --workflow=release.yml` until the `v$ARGUMENTS` run is
   `completed / success`, then `gh release view v$ARGUMENTS` and confirm the
   `sacrvm-newskit-$ARGUMENTS.zip` asset is attached. Report the release URL. Verify the fix
   from the shipped ZIP (`newskit/VERSION` + the changed files), not just the working tree.

6. **Notify every consumer.** A newskit release reaches a publication only when it re-vendors.
   After the release verifies, send a re-vendor "update now" message to every consumer
   publication via `firepit_send_to` (version + release URL, the one-line re-vendor step, the
   headline changes touching that repo). Current consumers: **(none yet — list them here as
   publications adopt newskit).**

Note: newskit also **re-vendors appkit** on each appkit release — that is the reverse flow,
handled when appkit sends its own re-vendor note.
