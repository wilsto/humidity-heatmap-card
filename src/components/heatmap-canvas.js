/**
 * heatmap-canvas.js — Canvas-based heatmap rendering
 * Draws the temperature/humidity heatmap with room markers
 */
import { LitElement, html, css } from 'lit';
import { statusColorRGB, getThresholds } from '../models/interpolation.js';
import { PRESETS } from '../models/profiles.js';

const RESOLUTION = 3; // pixels per heatmap cell

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
    const h = Math.round(w * 0.55); // aspect ratio
    const dpr = window.devicePixelRatio || 1;

    this._canvas.width = w * dpr;
    this._canvas.height = h * dpr;
    this._canvas.style.height = `${h}px`;
    this._ctx.scale(dpr, dpr);

    this._w = w;
    this._h = h;

    const { tempMin, tempMax, humMin, humMax } = this._ranges;
    const pad = { top: 20, right: 60, bottom: 35, left: 50 };
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

    // Draw scaled heatmap
    const offscreen = new OffscreenCanvas(imgData.width, imgData.height);
    offscreen.getContext('2d').putImageData(imgData, 0, 0);
    ctx.drawImage(offscreen, pad.left, pad.top, plotW, plotH);

    // Reference lines
    this._drawRefLines(ctx, pad, plotW, plotH, tempMin, tempMax, humMin, humMax, presets);

    // Axes
    this._drawAxes(ctx, pad, plotW, plotH, tempMin, tempMax, humMin, humMax);

    // Room markers
    this._drawMarkers(ctx, pad, plotW, plotH, tempMin, tempMax, humMin, humMax);
  }

  _drawRefLines(ctx, pad, plotW, plotH, tMin, tMax, hMin, hMax, presets) {
    const drawCurve = (points, color, dash = [6, 4]) => {
      if (!points) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash(dash);
      ctx.globalAlpha = 0.4;
      points.forEach(([t, h], i) => {
        const x = pad.left + ((t - tMin) / (tMax - tMin)) * plotW;
        const y = pad.top + ((hMax - h) / (hMax - hMin)) * plotH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    };

    const tab = this.activeTab;
    if (tab === 'all' || tab === 'habitat') {
      drawCurve(presets.habitat.target, 'rgba(255,255,255,0.7)', [8, 4]);
    }
    if (tab === 'all' || tab === 'protection') {
      drawCurve(presets.protection.target, 'rgba(255,255,255,0.5)', [4, 4]);
      if (presets.protection.trigger) {
        drawCurve(presets.protection.trigger, 'rgba(255,100,100,0.5)', [3, 3]);
      }
    }
  }

  _drawAxes(ctx, pad, plotW, plotH, tMin, tMax, hMin, hMax) {
    const textColor =
      getComputedStyle(this).getPropertyValue('--secondary-text-color') || '#94a3b8';
    ctx.fillStyle = textColor;
    ctx.font = '11px Arial, sans-serif';
    ctx.textAlign = 'center';

    // X axis (temperature)
    for (let t = Math.ceil(tMin); t <= tMax; t += 2) {
      const x = pad.left + ((t - tMin) / (tMax - tMin)) * plotW;
      ctx.fillText(`${t}°`, x, pad.top + plotH + 15);
    }

    // Y axis (humidity)
    ctx.textAlign = 'right';
    for (let h = Math.ceil(hMin / 5) * 5; h <= hMax; h += 5) {
      const y = pad.top + ((hMax - h) / (hMax - hMin)) * plotH;
      ctx.fillText(`${h}%`, pad.left - 8, y + 4);
    }
  }

  _drawMarkers(ctx, pad, plotW, plotH, tMin, tMax, hMin, hMax) {
    if (!this.rooms?.length) return;

    const filteredRooms = this._getFilteredRooms();

    filteredRooms.forEach((room, i) => {
      const x = pad.left + ((room.temp - tMin) / (tMax - tMin)) * plotW;
      const y = pad.top + ((hMax - room.humidity) / (hMax - hMin)) * plotH;

      // Clamp to plot area
      const cx = Math.max(pad.left + 5, Math.min(x, pad.left + plotW - 5));
      const cy = Math.max(pad.top + 5, Math.min(y, pad.top + plotH - 5));

      // Store position for hit-testing
      room._x = cx;
      room._y = cy;

      // Glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
      grad.addColorStop(0, 'rgba(255,255,255,0.25)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring (status color)
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.strokeStyle = room.statusColor;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner dot (room color)
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = room.color;
      ctx.fill();

      // Label pill
      const label = `${room.icon || ''} ${room.name}`;
      ctx.font = 'bold 11px Arial, sans-serif';
      const tw = ctx.measureText(label).width + 16;
      const lx = cx - tw / 2;
      const ly = cy - 28;

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.roundRect(lx, ly, tw, 20, 6);
      ctx.fill();
      ctx.strokeStyle = room.statusColor + '80';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(label, cx, ly + 14);
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
