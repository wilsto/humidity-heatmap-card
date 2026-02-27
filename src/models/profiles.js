/**
 * profiles.js — Humidity threshold presets
 * Based on ASHRAE 55 (habitat) and BS 5250 (building protection)
 */

export const PROFILES = {
  habitat: {
    label: { en: 'Living Space', fr: 'Espace de vie' },
    icon: 'mdi:home-thermometer',
    badge: { en: 'Comfort', fr: 'Confort' },
    badgeColor: '#3b82f6',
  },
  protection: {
    label: { en: 'Building Protection', fr: 'Protection bâti' },
    icon: 'mdi:shield-home',
    badge: { en: 'Prevention', fr: 'Prévention' },
    badgeColor: '#ef4444',
  },
  custom: {
    label: { en: 'Custom', fr: 'Personnalisé' },
    icon: 'mdi:tune-variant',
    badge: { en: 'Custom', fr: 'Custom' },
    badgeColor: '#8b5cf6',
  },
};

export const PRESETS = {
  ashrae55: {
    name: 'ASHRAE 55',
    profile: 'habitat',
    // [temp, humidity%] interpolation points
    max: [
      [15, 60],
      [18, 55],
      [20, 55],
      [22, 52],
      [25, 50],
      [30, 50],
    ],
    target: [
      [15, 50],
      [18, 48],
      [20, 47],
      [22, 45],
      [25, 45],
      [30, 45],
    ],
    min: [
      [15, 40],
      [18, 38],
      [20, 37],
      [22, 35],
      [25, 35],
      [30, 35],
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
