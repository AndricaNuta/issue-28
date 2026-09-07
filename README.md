# issue-28

A birthday reveal, built as an issue of a magazine. Three checkpoints, then two
gifts: a bag and a massage voucher.

Live (once the repo exists): https://andricanuta.github.io/issue-28/

## Editing it

Everything personal lives in [`src/config.js`](src/config.js). Anything marked
`TODO` is a placeholder and looks like one on screen. Nothing else needs
touching for the basics.

The parts that need real content from you and the sixteen:

| What | Where |
| --- | --- |
| Her name, age, occupation, cover lines | `CONFIG` |
| The sixteen wishes (name + one line each) | `WISHES` |
| The 28-day plan lines | `PLAN` |
| The three predictions | `YEAR` |
| Spa name, treatment, validity, code | `CONFIG.voucher` |

## Photos

Drop these in `public/photos/`:

- `her.jpg` — her, waist up, one shoulder clearly visible. Used on the cover,
  the pass, and the final page where the bag lands on her arm.
- `bag.png` — the bag, cut out on transparency. Already done.
- `bag-open.png` — the bag open from above. Already done. This is what she packs
  the wishes into.

`bag-alt.jpg` is a spare product shot, unused.

## Placing the bag on her arm

Once `her.jpg` is in, run `npm run dev`, open `?p=bag`, and drag the bag around:
a readout under it prints its coordinates. Put those numbers into
`CONFIG.bagTarget.x` / `.y`, and adjust `size` and `tolerance` to taste
(`tolerance` is how close counts as correct, in percent of the frame width).

## Running it

```bash
npm install
npm run dev
```

Dev-only shortcuts, stripped from production builds:

- `?p=<page>` opens a page directly. Pages: `cover`, `pass`, `hub`, `pack`,
  `plan`, `year`, `bag`, `spa`, `close`.
- `?done=1` pretends the checklist is finished, so the gifts are unlocked.

## Deploying

The site is served from the `gh-pages` branch, which holds the built output
only. To publish a change:

```bash
npm run build
# then copy dist/ onto the gh-pages branch and push it
```

Two things that branch must never carry:

- **`voucher.pdf`**. Vite copies everything in `public/` into `dist/`
  regardless of gitignore, so it has to be deleted from the build output
  before publishing. The gift code is live and the certificate is
  transferable, and the repo is public.
- Anything else with the full code in it. The page shows `47C39` and five
  dots on purpose; the real code stays on the card.

`vite.config.js` sets the base path to `/issue-28/`, so if the repo is renamed,
change it there too.

### Why not GitHub Actions

There was a workflow for this, but pushing `.github/workflows/` needs a token
with the `workflow` scope and this one does not have it. To switch over:

```bash
gh auth refresh -s workflow
```

Then the workflow can be restored (it is in this repo's history) and every
push to `main` will build and deploy on its own.
