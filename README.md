# GradientBorderBox — Flowing Gradient Border Web Component

A lightweight, zero-dependency Web Component for creating cards with **animated flowing gradient borders**.

![status](https://img.shields.io/badge/status-stable-brightgreen)
![browsers](https://img.shields.io/badge/browsers-Chrome%20%7C%20Firefox%20%7C%20Safari%20%7C%20Edge-blue)
![license](https://img.shields.io/badge/license-MIT-green)

---

## Features

- **Flowing gradient border** — powered by CSS `conic-gradient` + rotation animation; no images or canvas needed
- **Fully configurable** — border width, border radius, animation speed, and gradient colors are all customizable
- **Shadow DOM encapsulation** — component styles are isolated; no style leakage in either direction
- **Responsive** — adapts to content width automatically; accepts any HTML content
- **Zero dependencies** — pure vanilla JavaScript, no external libraries required
- **Rich JS API** — `pause()` / `play()` / `toggle()` / `setColors()` methods plus custom events

## Quick Start

```html
<script src="gradient-border-box.js"></script>

<gradient-border-box>
  <h3>Your Title</h3>
  <p>Your content here...</p>
</gradient-border-box>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `border-width` | `number` | `8` | Border thickness in px |
| `corner-size` | `number` | `100` | Corner piece size in px |
| `border-radius` | `number` | `8` | Border radius in px |
| `animation-speed` | `number` | `1` | Animation duration in seconds per full rotation |
| `gradient-colors` | `string` | `["#ff3333","#ffdd22","#3399ff","#ff3333"]` | Gradient colors as JSON array |
| `paused` | `boolean` | `false` | Start with animation paused (add the attribute) |
| `content-padding` | `number` | `20` | Inner content padding in px |

### Examples

```html
<!-- Custom border width and radius -->
<gradient-border-box border-width="12" border-radius="24" corner-size="80">
  <h3>Custom Border</h3>
</gradient-border-box>

<!-- Custom gradient colors -->
<gradient-border-box gradient-colors='["#667eea","#764ba2","#f093fb","#667eea"]'>
  <h3>Custom Colors</h3>
</gradient-border-box>

<!-- Start paused -->
<gradient-border-box paused>
  <h3>Animation Paused</h3>
</gradient-border-box>
```

## CSS Variables

```css
gradient-border-box {
  --gradient-border-bg: #fff;  /* Content area background, defaults to white */
}
```

## JavaScript API

### Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `pause()` | Pause the animation | — |
| `play()` | Resume the animation | — |
| `toggle()` | Toggle pause/resume | — |
| `setColors(colors)` | Set gradient colors | `colors: string[]` (at least 2) |
| `getState()` | Get full current state | — |

### Properties

| Property | Description |
|----------|-------------|
| `paused` | Get/set paused state (`boolean`) |
| `colors` | Get/set gradient colors (`string[]`) |

### Events

| Event | Description | `event.detail` |
|-------|-------------|----------------|
| `animation-pause` | Fired when animation is paused | — |
| `animation-play` | Fired when animation is resumed | — |
| `colors-change` | Fired when colors change | `{ colors: string[] }` |

### Example

```javascript
const box = document.querySelector('gradient-border-box');

box.pause();                        // pause
box.play();                         // resume
box.toggle();                       // toggle
box.setColors(['#ff6b6b','#c44dff','#6b5bff','#ff6b6b']);  // change colors

box.addEventListener('animation-pause', () => console.log('paused'));
```

## Browser Support

| Chrome | Firefox | Safari | Edge |
|--------|---------|--------|------|
| 54+ | 63+ | 10.1+ | 15+ |

## File Structure

```
├── gradient-border-box.js    # Component source
├── example.html              # Demo & sandbox (Chinese)
├── example.en.html           # Demo & sandbox (English)
├── verify.js                 # Validation script
└── README.en.md              # This file
```

## Local Validation

```bash
node verify.js
```

Open `example.html` or `example.en.html` in a browser to preview all demos.

## License

MIT
