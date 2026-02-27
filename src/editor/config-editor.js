/**
 * config-editor.js — Visual editor for HA dashboard UI
 */
import { LitElement, html, css } from 'lit';

const DISPLAY_MODES = [
  { value: 'full', label: 'Full (Heatmap + Cards)' },
  { value: 'map', label: 'Map only' },
  { value: 'cards', label: 'Cards only' },
];

const PROFILES = [
  { value: 'habitat', label: 'Living Space (Habitat)' },
  { value: 'protection', label: 'Building Protection' },
  { value: 'custom', label: 'Custom' },
];

const PRESET_OPTIONS = [
  { value: 'ashrae55', label: 'ASHRAE 55 (Comfort)' },
  { value: 'bs5250', label: 'BS 5250 (Building)' },
  { value: 'custom', label: 'Custom thresholds' },
];

export class HumidityHeatmapCardEditor extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }
    .editor {
      padding: 16px;
    }
    .section {
      margin-bottom: 16px;
    }
    .section-title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--primary-text-color);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .row > * {
      flex: 1;
    }
    .room-block {
      background: var(--card-background-color, #f5f5f5);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
    }
    .room-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .room-number {
      font-weight: 600;
      font-size: 13px;
    }
    .remove-btn {
      cursor: pointer;
      color: var(--error-color, #ef4444);
      background: none;
      border: none;
      font-size: 18px;
    }
    .add-btn {
      cursor: pointer;
      background: var(--primary-color, #3b82f6);
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      width: 100%;
    }
    ha-entity-picker,
    ha-textfield,
    ha-select,
    ha-switch {
      width: 100%;
    }
  `;

  setConfig(config) {
    this._config = { ...config };
  }

  render() {
    if (!this.hass || !this._config) return html``;

    return html`
      <div class="editor">
        <!-- General settings -->
        <div class="section">
          <div class="section-title">General</div>
          <div class="row">
            <ha-textfield
              label="Title"
              .value=${this._config.title || ''}
              @change=${e => this._updateConfig('title', e.target.value)}
            ></ha-textfield>
          </div>
          <div class="row">
            <ha-select
              label="Display Mode"
              .value=${this._config.display || 'full'}
              @selected=${e => this._updateConfig('display', e.target.value)}
            >
              ${DISPLAY_MODES.map(
                m => html` <mwc-list-item .value=${m.value}>${m.label}</mwc-list-item> `,
              )}
            </ha-select>
          </div>
          <div class="row">
            <ha-switch
              .checked=${this._config.show_tabs !== false}
              @change=${e => this._updateConfig('show_tabs', e.target.checked)}
            ></ha-switch>
            <span>Show profile tabs</span>
          </div>
          <div class="row">
            <ha-switch
              .checked=${this._config.show_graph || false}
              @change=${e => this._updateConfig('show_graph', e.target.checked)}
            ></ha-switch>
            <span>Show history graph</span>
          </div>
          ${this._config.show_graph
            ? html`
                <div class="row">
                  <ha-textfield
                    label="Graph hours"
                    type="number"
                    .value=${String(this._config.graph_hours || 24)}
                    @change=${e => this._updateConfig('graph_hours', parseInt(e.target.value))}
                  ></ha-textfield>
                </div>
              `
            : ''}
        </div>

        <!-- Rooms -->
        <div class="section">
          <div class="section-title">Rooms</div>
          ${(this._config.rooms || []).map((room, i) => this._renderRoom(room, i))}
          <button class="add-btn" @click=${this._addRoom}>+ Add Room</button>
        </div>
      </div>
    `;
  }

  _renderRoom(room, index) {
    return html`
      <div class="room-block">
        <div class="room-header">
          <span class="room-number">Room ${index + 1}: ${room.name || 'New'}</span>
          <button class="remove-btn" @click=${() => this._removeRoom(index)}>✕</button>
        </div>
        <div class="row">
          <ha-textfield
            label="Name"
            .value=${room.name || ''}
            @change=${e => this._updateRoom(index, 'name', e.target.value)}
          ></ha-textfield>
          <ha-textfield
            label="Icon (mdi:...)"
            .value=${room.icon || ''}
            @change=${e => this._updateRoom(index, 'icon', e.target.value)}
          ></ha-textfield>
        </div>
        <div class="row">
          <ha-entity-picker
            .hass=${this.hass}
            label="Temperature sensor"
            .value=${room.temperature || ''}
            .includeDomains=${['sensor']}
            @value-changed=${e => this._updateRoom(index, 'temperature', e.detail.value)}
          ></ha-entity-picker>
        </div>
        <div class="row">
          <ha-entity-picker
            .hass=${this.hass}
            label="Humidity sensor"
            .value=${room.humidity || ''}
            .includeDomains=${['sensor']}
            @value-changed=${e => this._updateRoom(index, 'humidity', e.detail.value)}
          ></ha-entity-picker>
        </div>
        <div class="row">
          <ha-select
            label="Profile"
            .value=${room.profile || 'habitat'}
            @selected=${e => this._updateRoom(index, 'profile', e.target.value)}
          >
            ${PROFILES.map(
              p => html` <mwc-list-item .value=${p.value}>${p.label}</mwc-list-item> `,
            )}
          </ha-select>
          <ha-select
            label="Preset"
            .value=${room.preset || 'ashrae55'}
            @selected=${e => this._updateRoom(index, 'preset', e.target.value)}
          >
            ${PRESET_OPTIONS.map(
              p => html` <mwc-list-item .value=${p.value}>${p.label}</mwc-list-item> `,
            )}
          </ha-select>
        </div>
        <div class="row">
          <ha-entity-picker
            .hass=${this.hass}
            label="Dehumidifier (optional)"
            .value=${room.dehumidifier || ''}
            .includeDomains=${['switch', 'fan', 'humidifier']}
            @value-changed=${e => this._updateRoom(index, 'dehumidifier', e.detail.value)}
          ></ha-entity-picker>
        </div>
      </div>
    `;
  }

  _updateConfig(key, value) {
    this._config = { ...this._config, [key]: value };
    this._fireConfigChanged();
  }

  _updateRoom(index, key, value) {
    const rooms = [...(this._config.rooms || [])];
    rooms[index] = { ...rooms[index], [key]: value };
    this._config = { ...this._config, rooms };
    this._fireConfigChanged();
  }

  _addRoom() {
    const rooms = [...(this._config.rooms || [])];
    rooms.push({ name: '', profile: 'habitat', preset: 'ashrae55' });
    this._config = { ...this._config, rooms };
    this._fireConfigChanged();
  }

  _removeRoom(index) {
    const rooms = [...(this._config.rooms || [])];
    rooms.splice(index, 1);
    this._config = { ...this._config, rooms };
    this._fireConfigChanged();
  }

  _fireConfigChanged() {
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: this._config },
      }),
    );
  }
}

customElements.define('humidity-heatmap-card-editor', HumidityHeatmapCardEditor);
