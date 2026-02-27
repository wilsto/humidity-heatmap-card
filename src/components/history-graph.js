/**
 * history-graph.js — History graph using HA recorder API
 */
import { LitElement, html, css } from 'lit';

export class HistoryGraph extends LitElement {
  static properties = {
    hass: { type: Object },
    rooms: { type: Array },
    hours: { type: Number },
    localize: { type: Function },
  };

  static styles = css`
    :host {
      display: block;
    }
    .history-container {
      background: var(--card-background-color, #1e293b);
      border-radius: 12px;
      padding: 14px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    }
    .history-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .history-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--primary-text-color, #fff);
    }
    .period-tabs {
      display: flex;
      gap: 4px;
    }
    .period-tab {
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.06);
      color: var(--secondary-text-color, #94a3b8);
      border: none;
      transition: all 0.15s;
    }
    .period-tab.active {
      background: var(--primary-color, #3b82f6);
      color: #fff;
    }
    canvas {
      width: 100%;
      height: 120px;
      display: block;
    }
    .loading {
      text-align: center;
      color: var(--secondary-text-color, #94a3b8);
      font-size: 12px;
      padding: 20px;
    }
  `;

  constructor() {
    super();
    this.hours = 24;
    this._selectedHours = 24;
    this._historyData = null;
    this._loading = false;
  }

  get _periods() {
    return [
      { hours: 1, label: '1h' },
      { hours: 6, label: '6h' },
      { hours: 12, label: '12h' },
      { hours: 24, label: '24h' },
      { hours: 48, label: '48h' },
      { hours: 168, label: '7d' },
    ];
  }

  render() {
    const loc = this.localize;
    return html`
      <div class="history-container">
        <div class="history-header">
          <span class="history-title">${loc?.('history.title') || 'History'}</span>
          <div class="period-tabs">
            ${this._periods.map(
              p => html`
                <button
                  class="period-tab ${this._selectedHours === p.hours ? 'active' : ''}"
                  @click=${() => this._selectPeriod(p.hours)}
                >
                  ${p.label}
                </button>
              `,
            )}
          </div>
        </div>
        ${this._loading ? html`<div class="loading">Loading...</div>` : html`<canvas></canvas>`}
      </div>
    `;
  }

  firstUpdated() {
    this._canvas = this.shadowRoot.querySelector('canvas');
    this._ctx = this._canvas?.getContext('2d');
    this._fetchHistory();
  }

  updated(changed) {
    if (changed.has('rooms') || changed.has('hass')) {
      this._fetchHistory();
    }
  }

  _selectPeriod(hours) {
    this._selectedHours = hours;
    this._fetchHistory();
    this.requestUpdate();
  }

  async _fetchHistory() {
    if (!this.hass || !this.rooms?.length) return;

    const entities = this.rooms.map(r => r.humidityEntity).filter(Boolean);
    if (!entities.length) return;

    this._loading = true;
    this.requestUpdate();

    try {
      const end = new Date();
      const start = new Date(end.getTime() - this._selectedHours * 3600000);
      const entityFilter = entities.join(',');

      const url = `history/period/${start.toISOString()}?filter_entity_id=${entityFilter}&end_time=${end.toISOString()}&minimal_response&no_attributes`;

      const response = await this.hass.callApi('GET', url);
      this._historyData = response;
      this._loading = false;
      this.requestUpdate();

      // Wait for render then draw
      await this.updateComplete;
      this._drawGraph();
    } catch (err) {
      console.warn('humidity-heatmap-card: history fetch failed', err);
      this._loading = false;
      this.requestUpdate();
    }
  }

  _drawGraph() {
    if (!this._canvas || !this._ctx || !this._historyData) return;

    const canvas = this._canvas;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = this._ctx;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const pad = { top: 10, right: 10, bottom: 20, left: 35 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const endTime = Date.now();
    const startTime = endTime - this._selectedHours * 3600000;

    // Find global min/max humidity
    let hMin = 100,
      hMax = 0;
    (this._historyData || []).forEach(entityHistory => {
      (entityHistory || []).forEach(point => {
        const v = parseFloat(point.s ?? point.state);
        if (!isNaN(v)) {
          hMin = Math.min(hMin, v);
          hMax = Math.max(hMax, v);
        }
      });
    });
    hMin = Math.max(0, Math.floor(hMin - 5));
    hMax = Math.min(100, Math.ceil(hMax + 5));

    // Grid lines
    const textColor =
      getComputedStyle(this).getPropertyValue('--secondary-text-color') || '#64748b';
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let v = Math.ceil(hMin / 10) * 10; v <= hMax; v += 10) {
      const y = pad.top + ((hMax - v) / (hMax - hMin)) * plotH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + plotW, y);
      ctx.stroke();
      ctx.fillStyle = textColor;
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${v}%`, pad.left - 4, y + 3);
    }

    // Draw each room line
    this.rooms.forEach((room, roomIdx) => {
      const entityData = (this._historyData || []).find(
        eh => eh?.[0]?.entity_id === room.humidityEntity,
      );
      if (!entityData) return;

      ctx.beginPath();
      ctx.strokeStyle = room.color || '#3b82f6';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';

      let first = true;
      entityData.forEach(point => {
        const v = parseFloat(point.s ?? point.state);
        const t = new Date(point.lu ?? point.last_updated).getTime();
        if (isNaN(v) || t < startTime) return;

        const x = pad.left + ((t - startTime) / (endTime - startTime)) * plotW;
        const y = pad.top + ((hMax - v) / (hMax - hMin)) * plotH;

        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    // Time labels
    ctx.fillStyle = textColor;
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    const ticks = Math.min(6, this._selectedHours);
    for (let i = 0; i <= ticks; i++) {
      const t = startTime + (i / ticks) * (endTime - startTime);
      const x = pad.left + (i / ticks) * plotW;
      const d = new Date(t);
      const label = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
      ctx.fillText(label, x, pad.top + plotH + 14);
    }
  }
}

customElements.define('history-graph', HistoryGraph);
