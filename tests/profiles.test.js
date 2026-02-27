import { describe, it, expect } from 'vitest';
import { PROFILES, PRESETS, getPreset, ROOM_COLORS } from '../src/models/profiles.js';

// ── PROFILES ──

describe('PROFILES', () => {
  it('has habitat, protection, and custom profiles', () => {
    expect(PROFILES).toHaveProperty('habitat');
    expect(PROFILES).toHaveProperty('protection');
    expect(PROFILES).toHaveProperty('custom');
  });

  it('each profile has label, icon, badge, badgeColor', () => {
    for (const profile of Object.values(PROFILES)) {
      expect(profile.label).toHaveProperty('en');
      expect(profile.label).toHaveProperty('fr');
      expect(profile.icon).toMatch(/^mdi:/);
      expect(profile.badge).toHaveProperty('en');
      expect(profile.badgeColor).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

// ── PRESETS ──

describe('PRESETS', () => {
  it('ASHRAE55 has max, target, min but no trigger', () => {
    expect(PRESETS.ashrae55.max).toBeDefined();
    expect(PRESETS.ashrae55.target).toBeDefined();
    expect(PRESETS.ashrae55.min).toBeDefined();
    expect(PRESETS.ashrae55.trigger).toBeUndefined();
  });

  it('BS5250 has max, target, min, and trigger', () => {
    expect(PRESETS.bs5250.max).toBeDefined();
    expect(PRESETS.bs5250.target).toBeDefined();
    expect(PRESETS.bs5250.min).toBeDefined();
    expect(PRESETS.bs5250.trigger).toBeDefined();
  });

  it('calibration points are sorted by temperature ascending', () => {
    for (const preset of Object.values(PRESETS)) {
      for (const key of ['max', 'target', 'min']) {
        const temps = preset[key].map(p => p[0]);
        for (let i = 1; i < temps.length; i++) {
          expect(temps[i]).toBeGreaterThanOrEqual(temps[i - 1]);
        }
      }
    }
  });

  it('thresholds are ordered: min < target < max at each temp', () => {
    for (const preset of Object.values(PRESETS)) {
      for (const point of preset.min) {
        const temp = point[0];
        const minVal = point[1];
        const targetVal = preset.target.find(p => p[0] === temp)?.[1];
        const maxVal = preset.max.find(p => p[0] === temp)?.[1];
        if (targetVal !== undefined && maxVal !== undefined) {
          expect(minVal).toBeLessThan(targetVal);
          expect(targetVal).toBeLessThan(maxVal);
        }
      }
    }
  });
});

// ── getPreset() ──

describe('getPreset', () => {
  it('returns ASHRAE55 for default habitat profile', () => {
    const preset = getPreset({ profile: 'habitat' });
    expect(preset).toBe(PRESETS.ashrae55);
  });

  it('returns ASHRAE55 when no profile specified', () => {
    const preset = getPreset({});
    expect(preset).toBe(PRESETS.ashrae55);
  });

  it('returns BS5250 for protection profile', () => {
    const preset = getPreset({ profile: 'protection' });
    expect(preset).toBe(PRESETS.bs5250);
  });

  it('returns named preset when explicitly set', () => {
    const preset = getPreset({ preset: 'bs5250' });
    expect(preset).toBe(PRESETS.bs5250);
  });

  it('returns custom thresholds when preset is custom', () => {
    const custom = {
      max: [[10, 80]],
      target: [[10, 70]],
      min: [[10, 60]],
    };
    const preset = getPreset({ preset: 'custom', thresholds: custom });
    expect(preset.max).toEqual(custom.max);
    expect(preset.target).toEqual(custom.target);
    expect(preset.min).toEqual(custom.min);
    expect(preset.profile).toBe('custom');
  });

  it('falls back to ASHRAE55 for unknown preset name', () => {
    const preset = getPreset({ preset: 'nonexistent' });
    expect(preset).toBe(PRESETS.ashrae55);
  });
});

// ── ROOM_COLORS ──

describe('ROOM_COLORS', () => {
  it('has at least 10 colors', () => {
    expect(ROOM_COLORS.length).toBeGreaterThanOrEqual(10);
  });

  it('all entries are valid hex colors', () => {
    for (const color of ROOM_COLORS) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
