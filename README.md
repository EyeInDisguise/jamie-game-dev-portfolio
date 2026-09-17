# Jamie Williams | Gameplay Programming

My portfolio: [jamiegamedev.me](https://jamiegamedev.me)

I'm a computer science student at the University of Queensland, focused on gameplay programming. My current work includes a Unity platformer with a physical RFID controller and an NRL tackle game as part of a team project.

## Start here

- **[Homepage](dist/index.html):** introduction, projects and About text.
- **[Gravity experiment](dist/playground.js):** input, movement, collisions, drawing and reset.

## Featured project

### RFID Abilities Platformer

A speedrun platformer where physical RFID tokens select movement abilities. An ESP32 sends the selected ability to Unity as Bluetooth keyboard input. The game can also be played with a normal keyboard.

- [Play the browser build](https://play.unity.com/en/games/51c4cc8b-b2fc-4f07-a06d-968e66fd5fc3/polished)
- [Read the case study](https://jamiegamedev.me/projects/rfid-platformer/)
- [View the game source](https://github.com/EyeInDisguise/Jamie-Hackathon-2026)

## The website

A static site built with HTML, CSS and JavaScript. It includes an optional gravity playground and an RFID ability explainer. The playground is a separate browser experiment; it does not run the Unity game. The token buttons explain the input mapping and do not connect to physical hardware.

| File | What it does |
| --- | --- |
| `dist/index.html` | Homepage content, navigation and controls |
| `dist/style.css` | Shared typography, colours and layout |
| `dist/experience.css` | Homepage playground and token selector styling |
| `dist/case.css` | Case study styling and some shared rules |
| `dist/script.js` | Ability selector and system explanation |
| `dist/playground.js` | Gravity experiment |
| `dist/projects/rfid-platformer/index.html` | Platformer case study |
| `dist/404.html` | Missing-page response |
| `preview.cjs` | Local preview server |

## Run locally

With Node.js installed, open a terminal in this repository and run:

```text
node preview.cjs
```

Open http://127.0.0.1:4173. Save a change and refresh the browser to see it. Stop the server with Ctrl+C. No package installation or build step is needed for this static source.

## Controls

Select **Play experiment** first. Use A/D or the arrow keys to move, Space to flip gravity, Shift to dash and Escape to pause. On-screen buttons support touch input. **Inspect physics** shows velocity and collision bounds. Open **What changes the feel?** to adjust gravity.

## Development and assistance

AI tools assisted with the website's design, writing and implementation, including the September 2026 gravity playground and RFID explainer. The Unity project's own process and assistance are described separately in its case study and repository.

## Publishing

The live website is hosted through Sites. Pushing to this GitHub repository updates the source; it does not automatically publish to the existing website. Review and check changes locally, then publish the same source through the existing Sites project. The hosting checkout retains its own configuration.

Before publishing, check the homepage and case study at desktop and narrow widths, try the interactions, and verify that project descriptions reflect the work actually done. Add real gameplay/controller footage when available.

Website content and visual design are © Jamie Williams. No reuse license is granted by this repository.
