# Jamie Williams — Gameplay Programming Portfolio

Source for [jamiegamedev.me](https://jamiegamedev.me), a static portfolio focused on gameplay programming, movement systems, and physical input projects.

## Where everything lives

| Path | What to edit |
| --- | --- |
| `dist/index.html` | Homepage text, project summaries, navigation, and links |
| `dist/projects/rfid-platformer/index.html` | RFID platformer case study |
| `dist/style.css` | Main layout, colours, typography, and responsive styles |
| `dist/case.css` | Case-study-specific styles |
| `dist/script.js` | Small interactive behaviour |
| `dist/404.html` | Not-found page |
| `preview.cjs` | Local preview server |

## Make a small edit on GitHub

1. Open the file you want to change.
2. Select the pencil icon (**Edit this file**).
3. Make the change and use the **Preview changes** tab to review it.
4. Commit to a new branch and open a pull request when the change affects layout or code. A direct commit to `main` is fine for a small typo.
5. Review the change locally and publish it to the live site when it is ready.

Committing here keeps the source current, but it does not by itself update the existing Sites deployment at `jamiegamedev.me`.

## Preview on your PC

Install Node.js, open a terminal in this repository, and run:

```powershell
node preview.cjs
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173). Stop the preview with `Ctrl+C`.

## Before publishing

- Check the homepage and case-study page on desktop and mobile widths.
- Test every external link.
- Keep project claims specific and verifiable.
- Do not add private contact details, confidential material, or unapproved team assets.
- Leave the hosting configuration in place; it connects this checkout to the existing Sites project.

## Publishing updates

When a commit or pull request is ready, review the diff, run the local checks, deploy the approved source through Sites, and confirm the production URL afterward.

The website content and visual design are © Jamie Williams. No reuse license is granted by this repository.
