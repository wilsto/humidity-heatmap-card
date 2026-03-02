# humidity-heatmap-card — Product Requirements Document

**Version** : 1.0
**Date** : 27 février 2026
**Auteur** : Will
**Type HACS** : `custom:humidity-heatmap-card`
**Licence** : MIT

---

## 1. Résumé exécutif

humidity-heatmap-card est une carte Lovelace custom pour Home Assistant qui offre une visualisation unique de l'humidité multi-pièces via une **heatmap température/humidité** avec positionnement en temps réel des pièces. Chaque zone de la heatmap est colorée selon le statut (trop sec, optimal, humide, critique), rendant le diagnostic immédiat et intuitif.

La carte supporte deux profils de seuils (**Espace de vie** basé sur ASHRAE 55 et **Protection bâti** basé sur BS 5250 / DIN 4108), des cartes de statut par pièce, un historique intégré, et le déclenchement automatique de déshumidificateurs. Elle est publiée sur HACS avec éditeur visuel, support dark/light, et localisation FR+EN.

### Différenciateurs clés

- **Heatmap dynamique** : fond coloré par statut à chaque point (temp, humidité) — lisibilité instantanée
- **Double profil** : habitat (ASHRAE 55) et protection bâti (BS 5250) avec presets ou seuils custom
- **Multi-pièces illimité** : scatter des pièces sur la heatmap avec code couleur de statut
- **3 modes d'affichage** : full (heatmap + cartes), map (heatmap seule), cards (cartes seules)
- **Contrôle déshumidificateur** : déclenchement automatique basé sur les seuils
- **Éditeur visuel HA** : configuration complète sans YAML 

---

## 2. Contexte et problème

### 2.1 Le problème

La gestion de l'humidité dans une maison est critique pour la santé (allergies, problèmes respiratoires), le confort (sensation de moiteur ou de sécheresse), et la protection du bâtiment (moisissures, condensation, dégradation des structures). Les seuils d'humidité optimaux varient en fonction de la température ambiante — un taux de 60% HR est acceptable à 15°C mais problématique à 25°C.

Aujourd'hui, les utilisateurs Home Assistant n'ont que des gauges statiques montrant un chiffre brut (ex: 65% HR) sans contexte. Ils ne savent pas si ce chiffre est bon ou mauvais pour la température actuelle de la pièce. Les espaces non chauffés (garage, cave, buanderie) ont des seuils très différents des espaces de vie — aucune solution existante ne gère cette distinction.

### 2.2 Pourquoi maintenant

- La communauté HA compte 1M+ d'installations actives avec une croissance de 30%/an
- Les capteurs Sonoff/Aqara/Xiaomi à moins de 10€ démocratisent le monitoring multi-pièces
- Le projet humidity-intelligence (HACS) prouve la demande mais ne fournit qu'un backend sans visualisation heatmap
- Aucune carte existante ne propose de visualisation contextuelle température/humidité

### 2.3 Fondements scientifiques

| Profil | Norme / Source | Plage temp. | HR cible |
|--------|---------------|-------------|----------|
| Espace de vie | ASHRAE Standard 55 | 18–25°C | 40–55% |
| Protection bâti | BS 5250 / DIN 4108 | 10–18°C | 48–63%* |

*Varie selon la température — interpolation linéaire entre points de calibration.*

---

## 3. Analyse concurrentielle

| Projet | Type | Heatmap | Multi-profil | Déshumid. | Visual Editor |
|--------|------|---------|-------------|-----------|--------------|
| thermal_comfort | Integration | Non | Non | Non | Non |
| humidity-intelligence | YAML package | Non | Partiel | Non | Non |
| ha-air-comfort-card | Carte | Non (dial) | Non | Non | Oui |
| mold_risk_index | Integration | Non | Non | Non | Non |
| optimal_humidity | Sensor | Non | Non | Partiel | Non |
| **humidity-heatmap-card** | **Carte** | **Oui ✓** | **Oui ✓** | **Oui ✓** | **Oui ✓** |

### Inspirations

- **Visual Editor intégré** avec composants HA natifs (ha-entity-picker, ha-form)
- **Graphe historique intégré** via l'API history de HA (show_graph, graph_hours)
- **Seuils configurables** pattern good/medium → adapté en presets nommés
- **Config YAML progressive** : minimale 5 lignes → complète avec overrides
- **Build Rollup** : bundle unique .js, standard communauté HACS

---

## 4. Vision produit

### 4.1 Vision statement

> Permettre à tout utilisateur Home Assistant de **comprendre en un coup d'œil** l'état de l'humidité dans toutes ses pièces, avec des recommandations contextuelles basées sur la science, et des **actions automatiques** pour maintenir un environnement sain.

### 4.2 Principes de design

- **Lisibilité immédiate** : le statut d'une pièce doit être compris en < 2 secondes
- **Zéro configuration pour démarrer** : config minimale de 5 lignes YAML
- **Scientifiquement fondé** : chaque seuil est traçable à une norme publiée
- **Adaptatif** : support des thèmes HA (dark/light), responsive, multilingue
- **Actionnable** : ne pas juste montrer un problème, mais déclencher une solution

---

## 5. Personas utilisateur

### Pierre — Le propriétaire vigilant
Propriétaire d'une maison avec cave et buanderie humides. A des capteurs Sonoff partout mais ne sait pas interpréter les chiffres.
**Besoin** : Voir d'un coup d'œil quelles pièces posent problème et pourquoi.

### Marie — L'automaticienne HA
Power user HA avec 200+ entités. Veut intégrer la carte dans son dashboard et déclencher ses déshumidificateurs automatiquement.
**Besoin** : Config flexible, modes d'affichage multiples, intégration automation.

### Thomas — Le contributeur HACS
Développeur qui découvre la carte et veut l'adapter. Cherche un code propre et extensible.
**Besoin** : Code LitElement standard, build Rollup, API claire pour les seuils custom.

---

## 6. Architecture technique

### 6.1 Stack

| Composant | Choix | Justification |
|-----------|-------|---------------|
| Framework UI | LitElement | Standard HA, léger, web components natifs |
| Rendu heatmap | Canvas 2D API | Pas de dépendance, performant, prouvé prototype v6 |
| Build | Rollup + terser | Bundle unique .js, standard HACS |
| Éditeur visuel | ha-form / ha-entity-picker | Composants HA natifs |
| Historique | API HA history (recorder) | Pas de backend custom |
| i18n | JSON embarqués | FR + EN, extensible par PR |
| Thèmes | CSS custom properties HA | Dark/light automatique |

### 6.2 Structure du repository

```
humidity-heatmap-card/
├── dist/
│   └── humidity-heatmap-card.js
├── src/
│   ├── humidity-heatmap-card.js      # Composant principal LitElement
│   ├── components/
│   │   ├── heatmap-canvas.js         # Rendu Canvas heatmap
│   │   ├── room-card.js              # Carte individuelle pièce
│   │   └── history-graph.js          # Graphe historique
│   ├── models/
│   │   ├── profiles.js               # Presets ASHRAE/BS5250/custom
│   │   └── interpolation.js          # Calcul seuils dynamiques
│   ├── editor/
│   │   └── config-editor.js          # Éditeur visuel HA
│   └── localize/
│       ├── fr.json
│       └── en.json
├── docs/
│   └── PRD.md
├── hacs.json
├── package.json
├── rollup.config.mjs
├── README.md
└── LICENSE
```

### 6.3 Flux de données

1. HA pousse les states via `set hass()` à chaque changement d'entité
2. Le composant extrait température + humidité de chaque pièce configurée
3. `interpolation.js` calcule les seuils dynamiques pour le profil de chaque pièce
4. `heatmap-canvas.js` redessine le fond heatmap + markers via Canvas 2D
5. Les `room-cards` se mettent à jour avec les valeurs calculées

---

## 7. Fonctionnalités — MVP (v1.0)

### F1 — Heatmap dynamique

Canvas 2D où chaque pixel est coloré selon le statut à cette position (température, humidité).

- Fond heatmap : bleu (sec) → vert (optimal) → orange (humide) → rouge (critique)
- Lignes de référence subtiles (cible, trigger) en blanc semi-transparent
- Markers pièces : anneau coloré statut + point intérieur couleur pièce + glow
- Labels pill : nom + icône de la pièce
- Zone labels en bord droit
- Tooltip hover : température, humidité, cible, écart, statut

### F2 — Cartes de pièces

Grille de cartes compactes par pièce.

- Header : icône + nom + badge profil (Confort bleu / Prévention rouge)
- 4 métriques en grille 2×2 : Temp, Humidité (colorée), Cible, Écart
- Barre de progression : HR relative au max du profil
- Statut : emoji + label
- Clic → more-info HA du capteur humidité
- Grille responsive : auto-fill minmax(280px, 1fr)

### F3 — Profils et seuils adaptatifs

| Preset | Usage | Courbes |
|--------|-------|---------|
| ashrae55 | Espaces de vie chauffés | Max, Target, Min |
| bs5250 | Espaces non chauffés | Trigger, Max, Target, Min |
| custom | Défini par l'utilisateur | Points libres en YAML |

Interpolation linéaire entre points de calibration.

### F4 — Modes d'affichage

| Mode | Affiche | Usage |
|------|---------|-------|
| full | Heatmap + cartes | Dashboard principal |
| map | Heatmap seule | Widget / vue dédiée |
| cards | Cartes seules | Sidebar / layout existant |

### F5 — Onglets de filtrage par profil

- **Vue complète** : tous profils superposés
- **Espace de vie** : pièces habitat (14-28°C, 28-65% HR)
- **Protection bâti** : pièces bâti (8-32°C, 35-80% HR)

### F6 — Historique intégré

Mini-graphe temporel via API history HA 

- Période configurable : 1h, 6h, 12h, 24h, 48h, 7j
- Lignes de seuils en overlay
- Graphe par pièce ou agrégé multi-pièces
- API recorder HA (pas de backend custom)

### F7 — Alertes et contrôle déshumidificateur

- Badge d'alerte quand statut CRITIQUE ou TROP HUMIDE
- Entité optionnelle `dehumidifier` par pièce
- Indicateur on/off + toggle tap
- Hystérésis : trigger → start, target → stop

### F8 — Éditeur visuel

Via `getConfigElement()` avec composants HA natifs.

- Entity picker pour température/humidité
- Dropdown profil et preset par pièce
- Toggle show_graph, graph_hours, display mode
- Preview live

### F9 — Thèmes et i18n

- CSS custom properties HA pour dark/light automatique
- FR + EN embarqués, détection via `hass.language`
- Extensible par PR communautaire

---

## 8. Configuration YAML

### 8.1 Minimale

```yaml
type: custom:humidity-heatmap-card
rooms:
  - name: Salon
    temperature: sensor.salon_temperature
    humidity: sensor.salon_humidity
  - name: Cave
    profile: protection
    temperature: sensor.cave_temperature
    humidity: sensor.cave_humidity
```

### 8.2 Complète

```yaml
type: custom:humidity-heatmap-card
title: Gestion Humidité
display: full
language: auto
show_tabs: true
show_graph: true
graph_hours: 24

rooms:
  - name: Salon
    icon: mdi:sofa
    profile: habitat
    preset: ashrae55
    temperature: sensor.salon_temp
    humidity: sensor.salon_humidity
    color: "#3b82f6"

  - name: Buanderie
    icon: mdi:washing-machine
    profile: protection
    preset: bs5250
    temperature: sensor.buanderie_temp
    humidity: sensor.buanderie_humidity
    dehumidifier: switch.dehumidifier_buanderie
    color: "#f59e0b"

  - name: Serre
    profile: custom
    temperature: sensor.serre_temp
    humidity: sensor.serre_humidity
    thresholds:
      max: [[10, 85], [20, 75], [30, 70]]
      target: [[10, 75], [20, 65], [30, 60]]
      min: [[10, 60], [20, 50], [30, 45]]
```

### 8.3 Référence options

**Générales** :

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| title | string | — | Titre de la carte |
| display | string | full | full, map, cards |
| language | string | auto | auto, fr, en |
| show_tabs | boolean | true | Onglets filtrage profil |
| show_graph | boolean | false | Graphe historique |
| graph_hours | number | 24 | Fenêtre temporelle (h) |
| rooms | array | requis | Liste des pièces |

**Par pièce (rooms[])** :

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| name | string | requis | Nom affiché |
| icon | string | auto | Icône MDI |
| profile | string | habitat | habitat, protection, custom |
| preset | string | auto | ashrae55, bs5250, custom |
| temperature | entity | requis | Capteur température |
| humidity | entity | requis | Capteur humidité |
| dehumidifier | entity | — | Switch déshumidificateur |
| color | string | auto | Couleur marker heatmap |
| thresholds | object | — | Seuils custom |

---

## 9. Design system

### 9.1 Palette de statuts

| Statut | Couleur | Emoji | Condition |
|--------|---------|-------|-----------|
| TROP SEC | #60a5fa | 💧 | HR < min |
| OPTIMAL | #22c55e | ✅ | min ≤ HR ≤ target |
| HUMIDE | #f59e0b | 🟡 | target < HR ≤ max |
| TROP HUMIDE | #ef4444 | 🔴 | HR > max (habitat) |
| VIGILANCE | #f59e0b | 🟡 | max < HR ≤ trigger (bâti) |
| CRITIQUE | #ef4444 | 🔴 | HR > trigger (bâti) |

### 9.2 Heatmap RGB

- Bleu (20, 45, 70) → sec
- Vert (20, 55, 35) → optimal
- Jaune (60, 60, 15) → humide
- Orange (100, 55, 15) → vigilance
- Rouge (140, 30, 30) → critique

### 9.3 Markers

- Anneau extérieur (r=12px, 3px) : couleur STATUT
- Cercle intérieur (r=6px) : couleur PIÈCE
- Glow radial (r=30px) : halo blanc
- Label pill : fond semi-transparent + bordure statut

### 9.4 CSS HA utilisées

- `--primary-text-color`, `--secondary-text-color`
- `--card-background-color`, `--ha-card-background`
- `--primary-color`, `--divider-color`

---

## 10. Roadmap v2.0+

- **Mode compact/mini** : carte condensée pour sidebars
- **Floor plan overlay** : heatmap sur plan SVG/PNG
- **Notifications push** : service notify HA si CRITIQUE > X min
- **Intégration humidity-intelligence** : import sensors automatique
- **Export CSV / statistiques** : données historiques par pièce
- **Presets communautaires** : galerie via PR (climats, normes locales)
- **Mode comparaison** : deux pièces côte à côte
- **Prédiction IA** : estimation temps avant condensation

---

## 11. Métriques de succès

| Métrique | 3 mois | 6 mois |
|----------|--------|--------|
| Stars GitHub | 50+ | 200+ |
| Installations HACS | 100+ | 500+ |
| Issues ouvertes | < 10 | < 15 |
| Temps d'adoption | < 5 min | < 3 min |
| Contributions PR | 3+ | 10+ |
| Langues | 2 (FR, EN) | 5+ |

---

## 12. Plan de livraison

| Phase | Durée | Livrables | Milestone |
|-------|-------|-----------|-----------|
| 1 | Sem. 1-2 | Scaffold LitElement + heatmap Canvas + profils | Alpha |
| 2 | Sem. 3-4 | Room cards + tabs + config YAML + thèmes | Beta privée |
| 3 | Sem. 5-6 | Visual editor + i18n + historique | Beta publique |
| 4 | Sem. 7-8 | Déshumidificateur + alertes + tests | RC |
| 5 | Sem. 9 | README + screenshots + publication HACS | v1.0 |

---

## 13. Risques et mitigations

| Risque | Impact | Proba. | Mitigation |
|--------|--------|--------|------------|
| Performance Canvas 20+ pièces | Moyen | Faible | Throttle redraw, résolution adaptative, rAF |
| Incompatibilité thèmes custom | Moyen | Moyen | CSS variables HA officielles, test top 5 thèmes |
| API history lente | Faible | Moyen | Fenêtre 24h défaut, lazy-load, cache client |
| Confusion profil habitat/bâti | Moyen | Moyen | Tooltip onboarding, doc claire, preset auto |
| Breaking changes HA | Élevé | Faible | Suivi release notes, CI 3 dernières versions |
| Faible adoption | Élevé | Moyen | README exemplaire, post forum HA, vidéo démo |

---

## 14. Annexes

### A. Points d'interpolation — ASHRAE 55 (Habitat)

| Temp °C | 15 | 18 | 20 | 22 | 25 | 30 |
|---------|----|----|----|----|----|----|
| Max HR% | 60 | 55 | 55 | 52 | 50 | 50 |
| Target HR% | 50 | 48 | 47 | 45 | 45 | 45 |
| Min HR% | 40 | 38 | 37 | 35 | 35 | 35 |

### B. Points d'interpolation — BS 5250 (Protection bâti)

| Temp °C | 10 | 15 | 20 | 25 | 30 |
|---------|----|----|----|----|-----|
| Trigger HR% | 75 | 70 | 65 | 63 | 60 |
| Max HR% | 70 | 65 | 60 | 58 | 55 |
| Target HR% | 63 | 58 | 53 | 52 | 50 |
| Min HR% | 53 | 48 | 43 | 42 | 40 |

### C. Références

- ASHRAE Standard 55-2020 — Thermal Environmental Conditions for Human Occupancy
- BS 5250:2021 — Management of moisture in buildings
- DIN 4108-3 — Thermal protection and energy economy in buildings
- ISO 13788 — Hygrothermal performance of building components
