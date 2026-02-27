# Changelog

## [1.0.1] - 2026-02-27

### Changed

- Raised ASHRAE 55 (habitat) thresholds for European homes without AC
  - At 20°C: max 55→62%, target 47→52%, min 37→42%
  - Based on BS EN ISO 13788 / DTU standards (60-65% HR acceptable in heated homes)
  - Prevents false "Critical" status in typical French homes (50-62% HR)

## [1.0.0] - 2026-02-27

### Added

- Unified 4-status system: Too Dry, Optimal, Humid, Critical (profile-independent)
- Canvas-based humidity/temperature heatmap visualization
- ASHRAE 55 (comfort) and BS 5250 (building protection) threshold profiles
- Custom threshold presets with linear interpolation
- Multi-room markers with status-colored rings
- Room status cards with temperature, humidity, target, deviation, and progress bar
- History graph via HA recorder API (1h, 6h, 12h, 24h, 48h, 7d)
- Dehumidifier toggle control per room
- Visual editor with entity pickers (no YAML needed)
- Profile tabs: All, Living Space, Building Protection
- Display modes: full (heatmap + cards), map, cards
- Dark and Light theme support via HA CSS variables
- i18n: English and French
