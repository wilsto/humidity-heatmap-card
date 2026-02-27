/**
 * profiles.js — Humidity threshold presets
 * Based on ASHRAE 55 (habitat) and BS 5250 (building protection)
 */

export const PROFILES = {
  habitat: {
    label: { en: 'Living Space', fr: 'Espace de vie' },
    icon: 'mdi:home-thermometer',
    badge: { en: 'Comfort', fr: 'Confort' },
    badgeColor: '#14b3b8ff',
    markerColor: '#14b3b8ff',
  },
  protection: {
    label: { en: 'Building Protection', fr: 'Protection bâti' },
    icon: 'mdi:shield-home',
    badge: { en: 'Prevention', fr: 'Prévention' },
    badgeColor: '#8b5cf6',
    markerColor: '#8b5cf6',
  },
  custom: {
    label: { en: 'Custom', fr: 'Personnalisé' },
    icon: 'mdi:tune-variant',
    badge: { en: 'Custom', fr: 'Custom' },
    badgeColor: '#a29fa9ff',
    markerColor: '#a29fa9ff',
  },
};

export const PRESETS = {
  ashrae55: {
    name: 'ASHRAE 55',
    profile: 'habitat',
    // [temp, humidity%] — European-adjusted thresholds (BS EN ISO 13788 / DTU)
    // Original ASHRAE 55 too tight for non-AC European homes (~50-62% HR typical)
    max: [
      [15, 68],
      [18, 65],
      [20, 62],
      [22, 60],
      [25, 58],
      [30, 56],
    ],
    target: [
      [15, 58],
      [18, 55],
      [20, 52],
      [22, 50],
      [25, 48],
      [30, 46],
    ],
    min: [
      [15, 48],
      [18, 45],
      [20, 42],
      [22, 40],
      [25, 38],
      [30, 36],
    ],
  },
  bs5250: {
    name: 'BS 5250',
    profile: 'protection',
    trigger: [
      [10, 75],
      [15, 70],
      [20, 65],
      [25, 63],
      [30, 60],
    ],
    max: [
      [10, 70],
      [15, 65],
      [20, 60],
      [25, 58],
      [30, 55],
    ],
    target: [
      [10, 63],
      [15, 58],
      [20, 53],
      [25, 52],
      [30, 50],
    ],
    min: [
      [10, 53],
      [15, 48],
      [20, 43],
      [25, 42],
      [30, 40],
    ],
  },
};

/**
 * Auto-select preset based on profile
 */
export function getPreset(room) {
  if (room.preset === 'custom' && room.thresholds) {
    return { ...room.thresholds, profile: 'custom' };
  }
  if (room.preset && PRESETS[room.preset]) {
    return PRESETS[room.preset];
  }
  // Auto-select based on profile
  const profile = room.profile || 'habitat';
  if (profile === 'protection') return PRESETS.bs5250;
  return PRESETS.ashrae55;
}

/**
 * Default room colors (auto-assigned)
 */
export const ROOM_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#f59e0b',
  '#22c55e',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6366f1',
  '#06b6d4',
  '#84cc16',
  '#e11d48',
  '#0ea5e9',
  '#a855f7',
  '#10b981',
];
