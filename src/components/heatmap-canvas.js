/**
 * heatmap-canvas.js — Canvas-based heatmap rendering
 * Draws the temperature/humidity heatmap with room markers
 */
import { LitElement, html, css } from 'lit';
import { interpolate, statusColorRGB } from '../models/interpolation.js';
import { PRESETS } from '../models/profiles.js';

const RESOLUTION = 3; // pixels per heatmap cell

// MDI icon names → emoji for canvas rendering
const MDI_TO_EMOJI = {
  'mdi:sofa': '🛋',
  'mdi:bed': '🛏',
  'mdi:desk': '💻',
  'mdi:shower': '🚿',
  'mdi:washing-machine': '🧺',
  'mdi:garage': '🚗',
  'mdi:cellar': '🍷',
  'mdi:home': '🏠',
  'mdi:thermometer': '🌡',
  'mdi:water': '💧',
  'mdi:office-building': '🏢',
  'mdi:baby-carriage': '👶',
  'mdi:pool': '🏊',
  'mdi:flower': '🌸',
  'mdi:tree': '🌳',
};

export class HeatmapCanvas extends LitElement {
  static properties = {
    rooms: { type: Array },
    activeTab: { type: String },
    hass: { type: Object },
    config: { type: Object },
    localize: { type: Function },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    .heatmap-container {
      position: relative;
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
    }
    canvas {
      width: 100%;
      display: block;
    }
    .tooltip {
      position: absolute;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 1.4;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.15s;
      z-index: 10;
    }
    .tooltip.visible {
      opacity: 1;
    }
    .color-scale {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-top: 12px;
    }
    .cs-bar {
      height: 8px;
      flex: 1;
      max-width: 80px;
    }
    .cs-label {
      font-size: 0.65rem;
      color: #4b5563;
      padding: 0 6px;
      white-space: nowrap;
    }
    .cs-mid {
      color: #64748b;
    }
  `;

  constructor() {
    super();
    this.rooms = [];
    this.activeTab = 'all';
    this._tooltip = { visible: false, x: 0, y: 0, content: '' };
  }

  get _ranges() {
    const ranges = {
      all: { tempMin: 8, tempMax: 32, humMin: 25, humMax: 80 },
      habitat: { tempMin: 14, tempMax: 28, humMin: 28, humMax: 65 },
      protection: { tempMin: 8, tempMax: 32, humMin: 35, humMax: 80 },
    };
    return ranges[this.activeTab] || ranges.all;
  }

  render() {
    const loc = this.localize;
    return html`
      <div class="heatmap-container">
        <canvas></canvas>
        <div
          class="tooltip ${this._tooltip.visible ? 'visible' : ''}"
          style="left:${this._tooltip.x}px; top:${this._tooltip.y}px"
        >
          ${this._tooltip.content}
        </div>
      </div>
      <div class="color-scale">
        <span class="cs-label">${loc?.('heatmap.dry') || 'Trop sec'}</span>
        <div
          class="cs-bar"
          style="background:linear-gradient(90deg,#1e3a5f,#1a3354);border-radius:4px 0 0 4px"
        ></div>
        <div class="cs-bar" style="background:linear-gradient(90deg,#14352a,#163a2d)"></div>
        <span class="cs-label cs-mid">${loc?.('heatmap.optimal') || 'Optimal'}</span>
        <div class="cs-bar" style="background:linear-gradient(90deg,#3a3010,#4a3a10)"></div>
        <div
          class="cs-bar"
          style="background:linear-gradient(90deg,#3f1f1f,#4a2020);border-radius:0 4px 4px 0"
        ></div>
        <span class="cs-label">${loc?.('heatmap.critical') || 'Critique'}</span>
      </div>
    `;
  }

  firstUpdated() {
    this._canvas = this.shadowRoot.querySelector('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._canvas.addEventListener('mousemove', e => this._onMouseMove(e));
    this._canvas.addEventListener('mouseleave', () => this._hideTooltip());
    this._canvas.addEventListener('click', e => this._onClick(e));
    this._resizeObserver = new ResizeObserver(() => this._draw());
    this._resizeObserver.observe(this._canvas.parentElement);
    this._draw();
  }

  updated(changed) {
    if (changed.has('rooms') || changed.has('activeTab')) {
      this._draw();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
  }

  _draw() {
    if (!this._canvas || !this._ctx) return;

    const container = this._canvas.parentElement;
    const w = container.clientWidth;
    const h = Math.round(w * 0.5); // aspect ratio (slightly less tall)
    const dpr = window.devicePixelRatio || 1;

    this._canvas.width = w * dpr;
    this._canvas.height = h * dpr;
    this._canvas.style.height = `${h}px`;
    this._ctx.scale(dpr, dpr);

    this._w = w;
    this._h = h;

    const { tempMin, tempMax, humMin, humMax } = this._ranges;
    const pad = { top: 30, right: 20, bottom: 40, left: 50 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    // Store for hit-testing
    this._pad = pad;
    this._plotW = plotW;
    this._plotH = plotH;

    const ctx = this._ctx;
    ctx.clearRect(0, 0, w, h);

    // Draw heatmap background
    const presets = { habitat: PRESETS.ashrae55, protection: PRESETS.bs5250 };
    const imgData = ctx.createImageData(
      Math.ceil(plotW / RESOLUTION),
      Math.ceil(plotH / RESOLUTION),
    );

    for (let py = 0; py < imgData.height; py++) {
      for (let px = 0; px < imgData.width; px++) {
        const temp = tempMin + (px / imgData.width) * (tempMax - tempMin);
        const hum = humMax - (py / imgData.height) * (humMax - humMin);
        const rgb = statusColorRGB(temp, hum, this.activeTab, presets);
        const idx = (py * imgData.width + px) * 4;
        imgData.data[idx] = rgb[0];
        imgData.data[idx + 1] = rgb[1];
        imgData.data[idx + 2] = rgb[2];
        imgData.data[idx + 3] = 200;
      }
    }

    // Draw scaled heatmap with clipped corners
    const offscreen = new OffscreenCanvas(imgData.width, imgData.height);
    offscreen.getContext('2d').putImageData(imgData, 0, 0);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(pad.left, pad.top, plotW, plotH, 4);
    ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(offscreen, pad.left, pad.top, plotW, plotH);
    ctx.restore();

    // Grid
    this._drawGrid(ctx, pad, plotW, plotH, tempMin, tempMax, humMin, humMax);

    // Reference lines
    this._drawRefLines(ctx, pad, plotW, plotH, tempMin, tempMax, humMin, humMax, presets);

    // Axes
    this._drawAxes(ctx, pad, plotW, plotH, tempMin, tempMax, humMin, humMax);

    // Room markers
    this._drawMarkers(ctx, pad, plotW, plotH, tempMin, tempMax, humMin, humMax);
  }

  _drawGrid(ctx, pad, plotW, plotH, tMin, tMax, hMin, hMax) {
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;

    for (let t = Math.ceil(tMin); t <= tMax; t += 2) {
      const x = pad.left + ((t - tMin) / (tMax - tMin)) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + plotH);
      ctx.stroke();
    }

    for (let h = Math.ceil(hMin / 5) * 5; h <= hMax; h += 5) {
      const y = pad.top + ((hMax - h) / (hMax - hMin)) * plotH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + plotW, y);
      ctx.stroke();
    }
  }

  _drawRefLines(ctx, pad, plotW, plotH, tMin, tMax, hMin, hMax, presets) {
    // Clip to plot area
    ctx.save();
    ctx.beginPath();
    ctx.rect(pad.left, pad.top, plotW, plotH);
    ctx.clip();

    const drawCurve = (points, color, dash = []) => {
      if (!points) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash(dash);
      // Smooth curve with 0.5° steps
      for (let t = tMin; t <= tMax; t += 0.5) {
        const x = pad.left + ((t - tMin) / (tMax - tMin)) * plotW;
        const h = interpolate(points, t);
        const y = pad.top + ((hMax - h) / (hMax - hMin)) * plotH;
        t === tMin ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const tab = this.activeTab;
    if (tab === 'all' || tab === 'protection') {
      drawCurve(presets.protection.trigger, 'rgba(255,255,255,0.25)', [4, 3]);
      drawCurve(presets.protection.target, 'rgba(255,255,255,0.35)');
    }
    if (tab === 'all' || tab === 'habitat') {
      drawCurve(presets.habitat.target, 'rgba(255,255,255,0.35)');
      drawCurve(presets.habitat.max, 'rgba(255,255,255,0.15)', [3, 3]);
    }

    ctx.restore();

    // Curve labels at right edge
    this._drawCurveLabels(ctx, pad, plotW, plotH, tMin, tMax, hMin, hMax, presets);
  }

  _drawCurveLabels(ctx, pad, plotW, plotH, tMin, tMax, hMin, hMax, presets) {
    ctx.font = '500 9px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';

    const tEdge = tMax - 1;
    const yForH = h => pad.top + ((hMax - h) / (hMax - hMin)) * plotH;

    const tab = this.activeTab;
    if (tab === 'all' || tab === 'protection') {
      if (presets.protection.trigger) {
        const h = interpolate(presets.protection.trigger, tEdge);
        ctx.fillText('trigger ↑', pad.left + plotW - 6, yForH(h) - 5);
      }
      const hTarget = interpolate(presets.protection.target, tEdge);
      ctx.fillText('cible protection', pad.left + plotW - 6, yForH(hTarget) + 12);
    }
    if (tab === 'all' || tab === 'habitat') {
      const hTarget = interpolate(presets.habitat.target, tEdge);
      ctx.fillText('cible habitat', pad.left + plotW - 6, yForH(hTarget) + 12);
    }
  }

  _drawAxes(ctx, pad, plotW, plotH, tMin, tMax, hMin, hMax) {
    const textColor = '#374151';
    ctx.fillStyle = textColor;
    ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // X axis tick labels
    for (let t = Math.ceil(tMin); t <= tMax; t += 2) {
      const x = pad.left + ((t - tMin) / (tMax - tMin)) * plotW;
      ctx.fillText(`${t}°`, x, pad.top + plotH + 16);
    }

    // X axis title
    const loc = this.localize;
    ctx.fillText(
      loc?.('heatmap.x_axis') || 'Température (°C)',
      pad.left + plotW / 2,
      pad.top + plotH + 34,
    );

    // Y axis tick labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let h = Math.ceil(hMin / 5) * 5; h <= hMax; h += 5) {
      const y = pad.top + ((hMax - h) / (hMax - hMin)) * plotH;
      ctx.fillText(`${h}%`, pad.left - 6, y);
    }

    // Y axis title (rotated)
    ctx.save();
    ctx.translate(12, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(loc?.('heatmap.y_axis') || 'Humidité relative (%)', 0, 0);
    ctx.restore();
  }

  _drawMarkers(ctx, pad, plotW, plotH, tMin, tMax, hMin, hMax) {
    if (!this.rooms?.length) return;

    const filteredRooms = this._getFilteredRooms();

    filteredRooms.forEach(room => {
      const x = pad.left + ((room.temp - tMin) / (tMax - tMin)) * plotW;
      const y = pad.top + ((hMax - room.humidity) / (hMax - hMin)) * plotH;

      // Clamp to plot area
      const cx = Math.max(pad.left + 5, Math.min(x, pad.left + plotW - 5));
      const cy = Math.max(pad.top + 5, Math.min(y, pad.top + plotH - 5));

      // Store position for hit-testing
      room._x = cx;
      room._y = cy;

      // Glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
      grad.addColorStop(0, 'rgba(255,255,255,0.12)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring (status color)
      ctx.beginPath();
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.strokeStyle = room.statusColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dark ring between outer ring and inner dot
      ctx.beginPath();
      ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0d0f15';
      ctx.fill();

      // Inner dot (profile color)
      ctx.beginPath();
      ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = room.color;
      ctx.fill();

      // Label pill
      const icon = MDI_TO_EMOJI[room.icon] || room.icon || '';
      const label = `${icon} ${room.name}`;
      ctx.font = '600 10px -apple-system, BlinkMacSystemFont, sans-serif';
      const tw = ctx.measureText(label).width;
      const lx = cx;
      const ly = cy - 24;

      // Pill background
      ctx.fillStyle = '#0d0f15cc';
      ctx.beginPath();
      ctx.roundRect(lx - tw / 2 - 8, ly - 9, tw + 16, 18, 6);
      ctx.fill();
      ctx.strokeStyle = room.statusColor + '80';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pill text
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, lx, ly);

      // Connector line (dashed, from pill bottom to ring top)
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(cx, ly + 9);
      ctx.lineTo(cx, cy - 12);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  _getFilteredRooms() {
    if (this.activeTab === 'all') return this.rooms;
    return this.rooms.filter(r => r.profile === this.activeTab);
  }

  _onMouseMove(e) {
    const rect = this._canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const room = this._getFilteredRooms().find(r => r._x && Math.hypot(mx - r._x, my - r._y) < 18);

    if (room) {
      this._tooltip = {
        visible: true,
        x: room._x + 15,
        y: room._y - 10,
        content: html`
          <strong>${room.name}</strong><br />
          🌡 ${room.temp?.toFixed(1)}°C &nbsp; 💧 ${room.humidity?.toFixed(1)}%<br />
          🎯 ${room.thresholds?.target?.toFixed(1)}% &nbsp; Δ
          ${room.deviation > 0 ? '+' : ''}${room.deviation?.toFixed(1)}%
        `,
      };
    } else {
      this._tooltip = { ...this._tooltip, visible: false };
    }
    this.requestUpdate();
  }

  _hideTooltip() {
    this._tooltip = { ...this._tooltip, visible: false };
    this.requestUpdate();
  }

  _onClick(e) {
    const rect = this._canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const room = this._getFilteredRooms().find(r => r._x && Math.hypot(mx - r._x, my - r._y) < 18);

    if (room && this.hass) {
      const event = new CustomEvent('hass-more-info', {
        bubbles: true,
        composed: true,
        detail: { entityId: room.humidityEntity },
      });
      this.dispatchEvent(event);
    }
  }
}

customElements.define('heatmap-canvas', HeatmapCanvas);
