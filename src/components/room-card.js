/**
 * room-card.js — Individual room status card
 */
import { LitElement, html, css } from 'lit';
import { STATUS_CONFIG } from '../models/interpolation.js';
import { PROFILES } from '../models/profiles.js';

export class RoomCard extends LitElement {
  static properties = {
    room: { type: Object },
    hass: { type: Object },
    lang: { type: String },
    localize: { type: Function },
  };

  static styles = css`
    :host {
      display: block;
    }
    .room-card {
      background: var(--card-background-color, #1e293b);
      border-radius: 12px;
      padding: 14px;
      cursor: pointer;
      transition:
        transform 0.15s,
        box-shadow 0.15s;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    }
    .room-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .room-icon {
      font-size: 20px;
    }
    .room-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--primary-text-color, #fff);
      flex: 1;
    }
    .badge {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      color: #fff;
    }
    .metrics {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-bottom: 10px;
    }
    .metric {
      text-align: center;
      padding: 6px 4px;
      border-radius: 8px;
      background: var(--ha-card-background, rgba(255, 255, 255, 0.04));
    }
    .metric-label {
      font-size: 10px;
      color: var(--secondary-text-color, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .metric-value {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary-text-color, #fff);
      margin-top: 2px;
    }
    .progress-bar {
      height: 6px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.1);
      margin-bottom: 8px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.5s ease;
    }
    .status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .status {
      font-size: 12px;
      font-weight: 600;
    }
    .dehumidifier {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--secondary-text-color, #94a3b8);
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
    }
    .dehumidifier.on {
      color: #22c55e;
      background: rgba(34, 197, 94, 0.15);
    }
  `;

  render() {
    const r = this.room;
    if (!r) return html``;

    const l = this.lang || 'en';
    const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.optimal;
    const profile = PROFILES[r.profile] || PROFILES.habitat;
    const loc = this.localize;

    // Progress: position of humidity relative to min..trigger/max range
    const rangeMax = r.thresholds?.trigger || r.thresholds?.max || 70;
    const rangeMin = r.thresholds?.min || 30;
    const pct = Math.max(0, Math.min(100, ((r.humidity - rangeMin) / (rangeMax - rangeMin)) * 100));

    return html`
      <div class="room-card" @click=${this._openMoreInfo}>
        <div class="header">
          <span class="room-icon">${r.icon || '🏠'}</span>
          <span class="room-name">${r.name}</span>
          <span class="badge" style="background:${profile.badgeColor}">
            ${profile.badge[l] || profile.badge.en}
          </span>
        </div>

        <div class="metrics">
          <div class="metric">
            <div class="metric-label">${loc?.('card.temp') || 'Temp'}</div>
            <div class="metric-value">${r.temp?.toFixed(1) ?? '—'}°</div>
          </div>
          <div class="metric">
            <div class="metric-label">${loc?.('card.humidity') || 'Humidity'}</div>
            <div class="metric-value" style="color:${sc.color}">
              ${r.humidity?.toFixed(1) ?? '—'}%
            </div>
          </div>
          <div class="metric">
            <div class="metric-label">${loc?.('card.target') || 'Target'}</div>
            <div class="metric-value">${r.thresholds?.target?.toFixed(1) ?? '—'}%</div>
          </div>
          <div class="metric">
            <div class="metric-label">${loc?.('card.deviation') || 'Gap'}</div>
            <div class="metric-value" style="color:${sc.color}">
              ${r.deviation > 0 ? '+' : ''}${r.deviation?.toFixed(1) ?? '—'}%
            </div>
          </div>
        </div>

        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%; background:${sc.color}"></div>
        </div>

        <div class="status-row">
          <span class="status" style="color:${sc.color}"> ${sc.emoji} ${sc[l] || sc.en} </span>
          ${r.dehumidifierEntity ? this._renderDehumidifier(r) : ''}
        </div>
      </div>
    `;
  }

  _renderDehumidifier(r) {
    const isOn = this.hass?.states[r.dehumidifierEntity]?.state === 'on';
    const loc = this.localize;
    return html`
      <span class="dehumidifier ${isOn ? 'on' : ''}" @click=${e => this._toggleDehumidifier(e, r)}>
        💨 ${isOn ? loc?.('card.on') || 'ON' : loc?.('card.off') || 'OFF'}
      </span>
    `;
  }

  _openMoreInfo() {
    if (!this.room?.humidityEntity || !this.hass) return;
    const event = new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId: this.room.humidityEntity },
    });
    this.dispatchEvent(event);
  }

  _toggleDehumidifier(e, room) {
    e.stopPropagation();
    if (!room.dehumidifierEntity || !this.hass) return;
    this.hass.callService('homeassistant', 'toggle', {
      entity_id: room.dehumidifierEntity,
    });
  }
}

customElements.define('room-card', RoomCard);
