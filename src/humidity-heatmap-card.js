/**
 * humidity-heatmap-card.js — Main LitElement component
 * Custom Lovelace card for Home Assistant
 */
import { LitElement, html, css } from 'lit';
import { computeStatus, STATUS_CONFIG } from './models/interpolation.js';
import { getPreset, ROOM_COLORS } from './models/profiles.js';
import './components/heatmap-canvas.js';
import './components/room-card.js';
import './components/history-graph.js';
import './editor/config-editor.js';
import en from './localize/en.json';
import fr from './localize/fr.json';

const LOCALES = { en, fr };
const CARD_VERSION = typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : '0.0.0-dev';

console.info(
  `%c humidity-heatmap-card %c v${CARD_VERSION} `,
  'color: #fff; background: #3b82f6; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;',
  'color: #3b82f6; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;',
);

class HumidityHeatmapCard extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
    _activeTab: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 16px;
      overflow: hidden;
    }
    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-text-color, #fff);
      margin-bottom: 12px;
    }
    .tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 12px;
    }
    .tab {
      flex: 1;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.06);
      color: var(--secondary-text-color, #94a3b8);
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .tab.active {
      background: var(--primary-color, #3b82f6);
      color: #fff;
      border-color: var(--primary-color, #3b82f6);
    }
    .tab:hover:not(.active) {
      background: rgba(255, 255, 255, 0.1);
    }
    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
      margin-top: 12px;
    }
    .section-gap {
      margin-top: 16px;
    }
  `;

  constructor() {
    super();
    this._activeTab = 'all';
  }

  // ── HA integration ──

  static getConfigElement() {
    return document.createElement('humidity-heatmap-card-editor');
  }

  static getStubConfig() {
    return {
      display: 'full',
      show_tabs: true,
      show_graph: false,
      graph_hours: 24,
      rooms: [{ name: 'Living Room', profile: 'habitat', temperature: '', humidity: '' }],
    };
  }

  setConfig(config) {
    if (!config.rooms || !Array.isArray(config.rooms)) {
      throw new Error('Please define at least one room');
    }
    this._config = {
      display: 'full',
      show_tabs: true,
      show_graph: false,
      graph_hours: 24,
      language: 'auto',
      ...config,
    };
  }

  getCardSize() {
    const mode = this._config?.display || 'full';
    if (mode === 'map') return 5;
    if (mode === 'cards') return Math.ceil((this._config?.rooms?.length || 1) / 3) * 3;
    return 8;
  }

  // ── Localization ──

  get _lang() {
    const cfgLang = this._config?.language;
    if (cfgLang && cfgLang !== 'auto') return cfgLang;
    const haLang = this.hass?.language || 'en';
    return LOCALES[haLang] ? haLang : 'en';
  }

  _localize(key) {
    const parts = key.split('.');
    let obj = LOCALES[this._lang] || LOCALES.en;
    for (const p of parts) {
      obj = obj?.[p];
    }
    return obj || key;
  }

  // ── Compute room data ──

  get _roomsData() {
    if (!this.hass || !this._config?.rooms) return [];

    return this._config.rooms.map((roomCfg, i) => {
      const tempState = this.hass.states[roomCfg.temperature];
      const humState = this.hass.states[roomCfg.humidity];
      const temp = parseFloat(tempState?.state);
      const humidity = parseFloat(humState?.state);
      const preset = getPreset(roomCfg);
      const profile = roomCfg.profile || 'habitat';

      if (isNaN(temp) || isNaN(humidity)) {
        return {
          ...roomCfg,
          temp: null,
          humidity: null,
          status: 'unknown',
          thresholds: {},
          deviation: 0,
          statusColor: '#64748b',
          color: roomCfg.color || ROOM_COLORS[i % ROOM_COLORS.length],
          profile,
          humidityEntity: roomCfg.humidity,
          dehumidifierEntity: roomCfg.dehumidifier,
        };
      }

      const { status, thresholds, deviation } = computeStatus(humidity, temp, preset);
      const statusColor = STATUS_CONFIG[status]?.color || '#64748b';

      return {
        ...roomCfg,
        temp,
        humidity,
        status,
        thresholds,
        deviation,
        statusColor,
        color: roomCfg.color || ROOM_COLORS[i % ROOM_COLORS.length],
        profile,
        humidityEntity: roomCfg.humidity,
        dehumidifierEntity: roomCfg.dehumidifier,
      };
    });
  }

  // ── Render ──

  render() {
    if (!this._config) return html``;

    const mode = this._config.display || 'full';
    const rooms = this._roomsData;
    const showTabs = this._config.show_tabs !== false;
    const showGraph = this._config.show_graph;
    const loc = k => this._localize(k);

    return html`
      <ha-card>
        ${this._config.title ? html`<div class="card-title">${this._config.title}</div>` : ''}
        ${showTabs ? this._renderTabs(loc) : ''}
        ${mode === 'full' || mode === 'map'
          ? html` <heatmap-canvas
              .rooms=${rooms}
              .activeTab=${this._activeTab}
              .hass=${this.hass}
              .config=${this._config}
              .localize=${loc}
            ></heatmap-canvas>`
          : ''}
        ${mode === 'full' || mode === 'cards'
          ? html` <div class="rooms-grid ${mode === 'full' ? 'section-gap' : ''}">
              ${this._getFilteredRooms(rooms).map(
                room => html`
                  <room-card
                    .room=${room}
                    .hass=${this.hass}
                    .lang=${this._lang}
                    .localize=${loc}
                  ></room-card>
                `,
              )}
            </div>`
          : ''}
        ${showGraph
          ? html` <div class="section-gap">
              <history-graph
                .hass=${this.hass}
                .rooms=${rooms}
                .hours=${this._config.graph_hours || 24}
                .localize=${loc}
              ></history-graph>
            </div>`
          : ''}
      </ha-card>
    `;
  }

  _renderTabs(loc) {
    const tabs = [
      { id: 'all', label: loc('common.all') },
      { id: 'habitat', label: loc('common.habitat') },
      { id: 'protection', label: loc('common.protection') },
    ];
    return html`
      <div class="tabs">
        ${tabs.map(
          t => html`
            <div
              class="tab ${this._activeTab === t.id ? 'active' : ''}"
              @click=${() => {
                this._activeTab = t.id;
              }}
            >
              ${t.label}
            </div>
          `,
        )}
      </div>
    `;
  }

  _getFilteredRooms(rooms) {
    if (this._activeTab === 'all') return rooms;
    return rooms.filter(r => r.profile === this._activeTab);
  }
}

customElements.define('humidity-heatmap-card', HumidityHeatmapCard);

// Register card in HA
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'humidity-heatmap-card',
  name: 'Humidity Heatmap Card',
  description: 'Multi-room humidity heatmap with adaptive thresholds',
  preview: true,
  documentationURL: 'https://github.com/wilsto/humidity-heatmap-card',
});
