# humidity-heatmap-card

[![GitHub release](https://img.shields.io/github/v/release/wilsto/humidity-heatmap-card?style=flat-square)](https://github.com/wilsto/humidity-heatmap-card/releases)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz/docs/faq/custom_repositories/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A **Home Assistant Lovelace** card that displays a **dynamic temperature/humidity heatmap** for multi-room monitoring with **adaptive thresholds** based on scientific standards.

## Features

- **Dynamic heatmap** — Canvas-based visualization where every pixel shows humidity status at that temperature/humidity point
- **Multi-room markers** — Rooms positioned on the heatmap with status-colored rings
- **Dual profiles** — Living space (ASHRAE 55) and building protection (BS 5250) with automatic threshold interpolation
- **Room status cards** — Compact cards with temperature, humidity, target, deviation, and progress bar
- **History graph** — Built-in history using HA recorder API
- **Dehumidifier control** — Optional toggle for dehumidifier switches per room
- **Visual editor** — Full GUI configuration with entity pickers
- **Dark & Light themes** — Automatic adaptation via HA CSS variables
- **i18n** — French and English included

---

## Installation

### HACS (Custom Repository)

1. Open HACS → Frontend → Custom repositories
2. Add: `https://github.com/wilsto/humidity-heatmap-card`
3. Category: Lovelace
4. Install and restart

### Manual

1. Copy `dist/humidity-heatmap-card.js` to `/config/www/`
2. Add resource: Settings → Dashboards → Resources
   - URL: `/local/humidity-heatmap-card.js`
   - Type: Module
3. Hard refresh browser

---

## Quick Start

```yaml
type: custom:humidity-heatmap-card
rooms:
  - name: Living Room
    temperature: sensor.living_room_temperature
    humidity: sensor.living_room_humidity
  - name: Basement
    profile: protection
    temperature: sensor.basement_temperature
    humidity: sensor.basement_humidity
```

---

## Full Configuration

```yaml
type: custom:humidity-heatmap-card
title: Humidity Management
display: full              # full | map | cards
language: auto             # auto | fr | en
show_tabs: true
show_graph: true
graph_hours: 24

rooms:
  - name: Living Room
    icon: mdi:sofa
    profile: habitat        # habitat | protection | custom
    preset: ashrae55        # ashrae55 | bs5250 | custom
    temperature: sensor.living_temp
    humidity: sensor.living_humidity
    color: "#3b82f6"

  - name: Laundry
    icon: mdi:washing-machine
    profile: protection
    preset: bs5250
    temperature: sensor.laundry_temp
    humidity: sensor.laundry_humidity
    dehumidifier: switch.dehumidifier_laundry
    color: "#f59e0b"

  - name: Greenhouse
    profile: custom
    temperature: sensor.greenhouse_temp
    humidity: sensor.greenhouse_humidity
    thresholds:
      max: [[10, 85], [20, 75], [30, 70]]
      target: [[10, 75], [20, 65], [30, 60]]
      min: [[10, 60], [20, 50], [30, 45]]
```

---

## Options

### General

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | — | Card title |
| `display` | string | `full` | Display mode: `full`, `map`, `cards` |
| `language` | string | `auto` | Language: `auto`, `fr`, `en` |
| `show_tabs` | boolean | `true` | Show profile filter tabs |
| `show_graph` | boolean | `false` | Enable history graph |
| `graph_hours` | number | `24` | History window in hours |

### Room Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | string | required | Room display name |
| `icon` | string | auto | MDI icon |
| `profile` | string | `habitat` | `habitat`, `protection`, `custom` |
| `preset` | string | auto | `ashrae55`, `bs5250`, `custom` |
| `temperature` | entity | required | Temperature sensor entity |
| `humidity` | entity | required | Humidity sensor entity |
| `dehumidifier` | entity | — | Dehumidifier switch entity |
| `color` | string | auto | Marker color on heatmap |
| `thresholds` | object | — | Custom thresholds (if preset: custom) |

---

## Profiles

### Living Space (ASHRAE 55)
Optimized for heated living areas (18-25°C). Thresholds based on human thermal comfort standards.

### Building Protection (BS 5250)
Optimized for unheated spaces (10-18°C). Thresholds based on condensation and mold prevention.

---

## Development

```bash
git clone https://github.com/wilsto/humidity-heatmap-card.git
cd humidity-heatmap-card
npm install
npm run build    # Production build
npm run watch    # Dev mode with auto-rebuild
```

Copy `dist/humidity-heatmap-card.js` to your HA `/config/www/` folder and add `?v=dev` to the resource URL for cache busting.

---

## Contributing

1. Fork the repository
2. Create a branch: `feature/my-feature`
3. Submit a Pull Request

Please include: HA version, YAML config, and console logs (F12) for bug reports.

---

## License

MIT — see [LICENSE](LICENSE)
