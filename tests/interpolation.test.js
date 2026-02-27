import { describe, it, expect } from 'vitest';
import {
  interpolate,
  getThresholds,
  computeStatus,
  statusColorRGB,
  STATUS,
  STATUS_CONFIG,
} from '../src/models/interpolation.js';
import { PRESETS } from '../src/models/profiles.js';

// ── interpolate() ──

describe('interpolate', () => {
  it('returns 50 for empty points', () => {
    expect(interpolate([], 20)).toBe(50);
    expect(interpolate(null, 20)).toBe(50);
    expect(interpolate(undefined, 20)).toBe(50);
  });

  it('returns the single value for one point', () => {
    expect(interpolate([[15, 60]], 20)).toBe(60);
  });

  it('clamps below range', () => {
    const points = [
      [10, 70],
      [30, 50],
    ];
    expect(interpolate(points, 5)).toBe(70);
  });

  it('clamps above range', () => {
    const points = [
      [10, 70],
      [30, 50],
    ];
    expect(interpolate(points, 35)).toBe(50);
  });

  it('returns exact value at a calibration point', () => {
    const points = [
      [10, 70],
      [20, 60],
      [30, 50],
    ];
    expect(interpolate(points, 20)).toBe(60);
  });

  it('interpolates linearly between points', () => {
    const points = [
      [10, 70],
      [30, 50],
    ];
    // midpoint: temp=20 → humidity=60
    expect(interpolate(points, 20)).toBe(60);
    // quarter: temp=15 → humidity=65
    expect(interpolate(points, 15)).toBe(65);
  });
});

// ── getThresholds() ──

describe('getThresholds', () => {
  it('returns max, target, min for ASHRAE55', () => {
    const t = getThresholds(20, PRESETS.ashrae55);
    expect(t).toHaveProperty('max');
    expect(t).toHaveProperty('target');
    expect(t).toHaveProperty('min');
    expect(t).not.toHaveProperty('trigger');
  });

  it('returns trigger for BS5250', () => {
    const t = getThresholds(20, PRESETS.bs5250);
    expect(t).toHaveProperty('trigger');
    expect(t.trigger).toBeGreaterThan(t.max);
  });

  it('computes correct values at ASHRAE55 calibration points', () => {
    // At temp=15: max=68, target=58, min=48 (European-adjusted)
    const t = getThresholds(15, PRESETS.ashrae55);
    expect(t.max).toBe(68);
    expect(t.target).toBe(58);
    expect(t.min).toBe(48);
  });

  it('computes correct values at BS5250 calibration points', () => {
    // At temp=10: trigger=75, max=70, target=63, min=53
    const t = getThresholds(10, PRESETS.bs5250);
    expect(t.trigger).toBe(75);
    expect(t.max).toBe(70);
    expect(t.target).toBe(63);
    expect(t.min).toBe(53);
  });
});

// ── computeStatus() ──

describe('computeStatus', () => {
  const ashrae = PRESETS.ashrae55;
  const bs5250 = PRESETS.bs5250;

  it('returns too_dry when below min', () => {
    // At 20°C, ASHRAE min=42
    const { status } = computeStatus(30, 20, ashrae);
    expect(status).toBe(STATUS.TOO_DRY);
  });

  it('returns optimal between min and target', () => {
    // At 20°C, ASHRAE min=42, target=52
    const { status } = computeStatus(47, 20, ashrae);
    expect(status).toBe(STATUS.OPTIMAL);
  });

  it('returns humid between target and max', () => {
    // At 20°C, ASHRAE target=52, max=62
    const { status } = computeStatus(55, 20, ashrae);
    expect(status).toBe(STATUS.HUMID);
  });

  it('returns critical above max (no trigger)', () => {
    // At 20°C, ASHRAE max=62 → above max is critical
    const { status } = computeStatus(65, 20, ashrae);
    expect(status).toBe(STATUS.CRITICAL);
  });

  it('returns critical above max (BS5250)', () => {
    // At 20°C, BS5250 max=60 → above max is critical
    const { status } = computeStatus(62, 20, bs5250);
    expect(status).toBe(STATUS.CRITICAL);
  });

  it('returns critical well above max (BS5250)', () => {
    // At 20°C, BS5250 max=60 → humidity 70 is critical
    const { status } = computeStatus(70, 20, bs5250);
    expect(status).toBe(STATUS.CRITICAL);
  });

  it('computes deviation from target', () => {
    // At 20°C, ASHRAE target=52, humidity=55 → deviation=3
    const { deviation } = computeStatus(55, 20, ashrae);
    expect(deviation).toBe(3);
  });

  it('returns thresholds object', () => {
    const { thresholds } = computeStatus(50, 20, ashrae);
    expect(thresholds).toHaveProperty('max');
    expect(thresholds).toHaveProperty('target');
    expect(thresholds).toHaveProperty('min');
  });
});

// ── statusColorRGB() ──

describe('statusColorRGB', () => {
  const presets = {
    habitat: PRESETS.ashrae55,
    protection: PRESETS.bs5250,
  };

  it('returns blue for too dry (habitat)', () => {
    // At 20°C, ASHRAE min=42 → humidity 30 is too dry
    const rgb = statusColorRGB(20, 30, 'habitat', presets);
    expect(rgb).toEqual([20, 45, 70]);
  });

  it('returns green for optimal (habitat)', () => {
    // At 20°C, ASHRAE min=42, target=52 → humidity 47 is optimal
    const rgb = statusColorRGB(20, 47, 'habitat', presets);
    expect(rgb).toEqual([20, 55, 35]);
  });

  it('returns yellow for humid (habitat)', () => {
    // At 20°C, ASHRAE target=52, max=62 → humidity 55 is humid
    const rgb = statusColorRGB(20, 55, 'habitat', presets);
    expect(rgb).toEqual([60, 60, 15]);
  });

  it('returns red for critical (habitat)', () => {
    // At 20°C, ASHRAE max=62 → humidity 65 is critical
    const rgb = statusColorRGB(20, 65, 'habitat', presets);
    expect(rgb).toEqual([140, 30, 30]);
  });

  it('returns red for critical (protection)', () => {
    // At 20°C, BS5250 max=60 → humidity 62 is critical
    const rgb = statusColorRGB(20, 62, 'protection', presets);
    expect(rgb).toEqual([140, 30, 30]);
  });

  it('blends colors in 14-22°C zone for "all" profile', () => {
    // At 18°C (midpoint of 14-22), should be a blend
    const rgb = statusColorRGB(18, 30, 'all', presets);
    expect(rgb).toHaveLength(3);
    // At temp=14, returns protection color; at temp=22, returns habitat color
    const prot = statusColorRGB(14, 30, 'all', presets);
    const hab = statusColorRGB(22, 30, 'all', presets);
    // Midpoint blend: each component should be between protection and habitat
    for (let c = 0; c < 3; c++) {
      expect(rgb[c]).toBeGreaterThanOrEqual(Math.min(prot[c], hab[c]));
      expect(rgb[c]).toBeLessThanOrEqual(Math.max(prot[c], hab[c]));
    }
  });

  it('returns pure protection below 14°C for "all"', () => {
    const rgb = statusColorRGB(10, 30, 'all', presets);
    const prot = statusColorRGB(10, 30, 'protection', presets);
    expect(rgb).toEqual(prot);
  });

  it('returns pure habitat above 22°C for "all"', () => {
    const rgb = statusColorRGB(25, 42, 'all', presets);
    const hab = statusColorRGB(25, 42, 'habitat', presets);
    expect(rgb).toEqual(hab);
  });
});

// ── STATUS_CONFIG ──

describe('STATUS_CONFIG', () => {
  it('has config for all status codes', () => {
    for (const s of Object.values(STATUS)) {
      expect(STATUS_CONFIG[s]).toBeDefined();
      expect(STATUS_CONFIG[s].color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(STATUS_CONFIG[s].emoji).toBeTruthy();
    }
  });
});
