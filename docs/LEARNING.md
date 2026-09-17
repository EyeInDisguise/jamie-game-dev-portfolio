# Understanding this portfolio

This is a guide to the code that is actually in this repository. Work through one section at a time. You can use the documentation and ask for help; the goal is to explain and change the behaviour yourself.

The September 2026 interactive homepage was implemented with AI assistance. Reading this guide or changing a few values does not make that earlier implementation independently authored. Your own changes, explanations and experiments can become part of the development history from here.

## Start the local website

Open a terminal in the repository folder and run:

```text
node preview.cjs
```

Visit http://127.0.0.1:4173. Leave that terminal running while you work. Refresh the browser after saving a file; this small server does not automatically reload the page. Stop the server with Ctrl+C when finished. Local edits do not change the published website.

Before an exercise, save a working revision in Git or copy the file somewhere outside `dist`. Keep experiments small enough that you can explain the diff.

## 1. Find the parts of the page

Open [index.html](../dist/index.html). Search for `id="playground"`. That section contains the canvas, buttons, instructions and gravity slider.

HTML describes the content and controls. CSS determines their appearance and layout. JavaScript reads input and updates the interface. A `<button>` has native keyboard behaviour; a plain `<div>` does not become a proper button just because it looks like one.

The homepage loads three stylesheets in order:

1. `style.css` contains shared styling used by the homepage and case study.
2. `case.css` contains case-study styles and some shared rules.
3. `experience.css` contains the interactive homepage additions.

Later CSS rules can override earlier ones when their specificity allows it. If changing a colour appears to do nothing, use the browser's element inspector to find which rule is winning.

**Try:** Rewrite one introductory sentence in your own words. Change only its text, keeping the surrounding tags. Refresh and check the page.

**Explain:** Why can changing `style.css` affect the case study, while changing `experience.css` currently does not?

Reference: [MDN web development lessons](https://developer.mozilla.org/en-US/docs/Learn_web_development).

## 2. Read the player state

Open [playground.js](../dist/playground.js). Near the top, `p` stores the player's current state:

| Property | Meaning |
| --- | --- |
| `x`, `y` | Top-left position in the canvas's internal coordinates |
| `w`, `h` | Width and height |
| `vx`, `vy` | Horizontal and vertical velocity, in canvas units per second |
| `facing` | Last direction of movement: `1` right, `-1` left |

The canvas is internally 720 by 300. CSS scales its display to fit the page. Its coordinate origin is the top-left, and positive Y points down. That differs from the usual positive-up world coordinates you work with in Unity.

The `blocks` array defines the two solid obstacles. `checkpoints` stores the three collectible positions. `collected` is a Set, so the same checkpoint index cannot be counted twice.

**Try:** Change the player's starting X from `45` to `65`. There are two places: the initial `p` object and `reset()`. Update both. Check the initial position and then press Reset.

**Explain:** What happens if you change only the initial object? As a later improvement, how could you define the starting position once?

## 3. Separate input, movement and drawing

Follow these functions in order:

| Function | Responsibility |
| --- | --- |
| `play()` | Starts or pauses the experiment; focuses the canvas for keyboard input |
| `action(name)` | Requests gravity inversion or a dash, subject to cooldowns |
| `update(dt)` | Advances velocity, position, collisions and checkpoint collection |
| `draw()` | Draws the current state without advancing physics |
| `tick(now)` | Calculates elapsed time, calls the updates, draws, then schedules another frame |
| `stop()` | Stops scheduling frames and clears held input |
| `reset()` | Returns the player, abilities and checkpoint progress to their starting state |

Keyboard events store movement keys in a Set. `update` reads that Set repeatedly while the game runs. This lets holding a key move the player continuously without relying on the operating system's key-repeat rate.

Pointer events use a Map keyed by pointer ID, so separate touch inputs can be tracked. Losing focus clears keyboard input; hiding the page or scrolling the canvas out of view pauses the experiment.

**Try:** Play, hold a movement key and switch to another window. Come back and resume. The character should not keep moving from a stale held key.

**Explain:** Why should `draw()` not change the player's position? What would happen if opening the physics checkbox advanced the simulation?

## 4. Understand time and gravity

In `update(dt)`, this expression changes vertical velocity:

```js
p.vy + Number(gravity.value) * direction * dt
```

`dt` is elapsed time in seconds. If gravity is 1,000, direction is `1`, and `dt` is 0.01, the velocity increases by 10 units per second during that step. The following position update multiplies velocity by `dt` again to obtain a distance.

Flipping gravity multiplies `direction` by `-1`. It does not reverse `vy` immediately. A falling player first slows, then starts moving upward. Vertical velocity is clamped between -650 and 650.

The animation loop uses `requestAnimationFrame`. It caps elapsed time at 0.05 seconds after a long interruption and divides each frame into steps no larger than 1/120 second. These are bounded substeps, not a full fixed-timestep accumulator like an engine might use. Capping time avoids a huge jump after a stall, but means this experiment can slow down under heavy load.

**Try:** Compare gravity at 400 and 1,800. Flip while already falling. Observe `VY` with Inspect physics enabled.

**Explain:** Why doesn't an upward gravity direction guarantee that vertical velocity is already negative?

Reference: [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).

## 5. Tune movement deliberately

Find the horizontal target velocity:

```js
const target = dashTime > 0 ? p.facing * 680 : axis * 210;
```

`axis` is -1, 0 or 1. Normal speed targets 210 units per second. A dash targets 680 in the facing direction. The next line moves velocity toward that target instead of snapping instantly. The normal response factor is `16`; larger values make velocity respond more quickly. This interpolation is simple and approximately consistent across small time steps, not mathematically identical at every frame rate.

**Try:** Change normal speed from 210 to 160. Play the course. Restore it, then change only the normal response factor from 16 to 8. Compare how quickly the character accelerates and stops.

Write two sentences about the difference. Avoid just saying one is better; describe whether it feels heavier, more precise, slower to stop, or easier to overshoot.

**Explain:** Why is a target velocity different from acceleration? Why is changing one value at a time useful?

## 6. Understand collisions and checkpoints

`overlaps(a, b)` checks whether two axis-aligned rectangles overlap. `update` moves horizontally and resolves obstacle overlap, then moves vertically and resolves it again. On impact it places the player against the obstacle and zeroes the relevant velocity.

Small substeps reduce tunnelling for this level's speeds and obstacle sizes. This is not a universal collision solver. Much higher speeds or very thin obstacles would need additional care.

The checkpoint collision area is 26 by 26, slightly larger than its visible 20 by 20 outline. A forgiving pickup area makes checkpoints easier to collect. Winning depends on `checkpoints.length`, but the displayed totals currently contain hard-coded threes.

**Try:** Add a fourth reachable checkpoint. Search for `3` in the score/status strings and update the HTML's initial score and instructions too. Do not blindly replace every number 3 in the file.

**Better follow-up:** Derive the displayed total from `checkpoints.length` in JavaScript. Keep the HTML fallback wording accurate as well.

**Check:** All checkpoints can be collected, each counts once, completion stops the simulation, and Reset clears the score.

## 7. Understand the RFID explainer

Open [script.js](../dist/script.js). The `abilities` object maps each token button to a key number, title and explanation. Clicking updates text with `textContent` and sets `aria-pressed` on the selected button.

This is an explanation of the Unity project's input mapping. It does not read RFID hardware, send Bluetooth input or activate the Unity game. The browser playground is also a separate implementation, with its own tuning.

**Try:** Write a clearer description of one ability using your actual experience building it. Keep the distinction between selecting and activating an ability.

**Explain:** What would be misleading about calling this a live hardware connection?

## Before sharing a change

- Read every changed line and explain why it is there.
- Try keyboard and touch controls, pause, reset and completion.
- Check that the projects and links remain accessible without playing.
- Check a narrow browser window and enlarged text.
- Keep the reduced-motion behaviour and optional start.
- Record the real help you used when describing your development process.

Start with section 1. Bring back your edited sentence and explain which file you changed. The next lesson can build on your attempt rather than giving you a finished replacement.
