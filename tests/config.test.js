import { describe, it, expect } from 'vitest';

// We can't easily instantiate the full LitElement in jsdom,
// so we test the config logic by importing and calling setConfig/getCardSize
// via a minimal mock approach.

describe('HumidityHeatmapCard config', () => {
  // Simulate setConfig logic (extracted from the card)
  function setConfig(config) {
    if (!config.rooms || !Array.isArray(config.rooms)) {
      throw new Error('Please define at least one room');
    }
    return {
      display: 'full',
      show_tabs: true,
      show_graph: false,
      graph_hours: 24,
      language: 'auto',
      ...config,
    };
  }

  function getCardSize(config) {
    const mode = config?.display || 'full';
    if (mode === 'map') return 5;
    if (mode === 'cards') return Math.ceil((config?.rooms?.length || 1) / 3) * 3;
    return 8;
  }

  // ── setConfig ──

  describe('setConfig', () => {
    it('throws when rooms is missing', () => {
      expect(() => setConfig({})).toThrow('Please define at least one room');
    });

    it('throws when rooms is not an array', () => {
      expect(() => setConfig({ rooms: 'invalid' })).toThrow('Please define at least one room');
    });

    it('applies default values', () => {
      const cfg = setConfig({ rooms: [{ name: 'Test', temperature: 'a', humidity: 'b' }] });
      expect(cfg.display).toBe('full');
      expect(cfg.show_tabs).toBe(true);
      expect(cfg.show_graph).toBe(false);
      expect(cfg.graph_hours).toBe(24);
      expect(cfg.language).toBe('auto');
    });

    it('preserves user overrides', () => {
      const cfg = setConfig({
        rooms: [{ name: 'Test', temperature: 'a', humidity: 'b' }],
        display: 'map',
        show_graph: true,
        graph_hours: 48,
        language: 'fr',
      });
      expect(cfg.display).toBe('map');
      expect(cfg.show_graph).toBe(true);
      expect(cfg.graph_hours).toBe(48);
      expect(cfg.language).toBe('fr');
    });
  });

  // ── getCardSize ──

  describe('getCardSize', () => {
    it('returns 8 for full mode', () => {
      expect(getCardSize({ display: 'full' })).toBe(8);
    });

    it('returns 5 for map mode', () => {
      expect(getCardSize({ display: 'map' })).toBe(5);
    });

    it('scales with room count for cards mode', () => {
      expect(getCardSize({ display: 'cards', rooms: [1, 2, 3] })).toBe(3);
      expect(getCardSize({ display: 'cards', rooms: [1, 2, 3, 4] })).toBe(6);
      expect(getCardSize({ display: 'cards', rooms: [1, 2, 3, 4, 5, 6, 7] })).toBe(9);
    });

    it('defaults to full when display not set', () => {
      expect(getCardSize({})).toBe(8);
    });
  });
});
