/**
 * interpolation.js — Linear interpolation for humidity thresholds
 * and status computation
 */

/**
 * Linear interpolation between calibration points
 * @param {Array<[number, number]>} points - [[temp, humidity], ...]
 * @param {number} temp - current temperature
 * @returns {number} interpolated humidity threshold
 */
export function interpolate(points, temp) {
  if (!points || points.length === 0) return 50;
  if (points.length === 1) return points[0][1];

  // Clamp to range
  if (temp <= points[0][0]) return points[0][1];
  if (temp >= points[points.length - 1][0]) return points[points.length - 1][1];

  // Find surrounding points
  for (let i = 0; i < points.length - 1; i++) {
    const [t0, h0] = points[i];
    const [t1, h1] = points[i + 1];
    if (temp >= t0 && temp <= t1) {
      const ratio = (temp - t0) / (t1 - t0);
      return h0 + ratio * (h1 - h0);
    }
  }
  return points[points.length - 1][1];
}

/**
 * Compute all thresholds for a given temperature and preset
 * @param {number} temp
 * @param {object} preset - { max, target, min, trigger? }
 * @returns {object} { max, target, min, trigger? }
 */
export function getThresholds(temp, preset) {
  const result = {
    max: interpolate(preset.max, temp),
    target: interpolate(preset.target, temp),
    min: interpolate(preset.min, temp),
  };
  if (preset.trigger) {
    result.trigger = interpolate(preset.trigger, temp);
  }
  return result;
}

/**
 * Status codes
 */
export const STATUS = {
  TOO_DRY: 'too_dry',
  OPTIMAL: 'optimal',
  HUMID: 'humid',
  CRITICAL: 'critical',
};

/**
 * Status display config
 */
export const STATUS_CONFIG = {
  [STATUS.TOO_DRY]: { emoji: '💧', color: '#60a5fa', en: 'Too Dry', fr: 'Trop Sec' },
  [STATUS.OPTIMAL]: { emoji: '✅', color: '#22c55e', en: 'Optimal', fr: 'Optimal' },
  [STATUS.HUMID]: { emoji: '🟡', color: '#f59e0b', en: 'Humid', fr: 'Humide' },
  [STATUS.CRITICAL]: { emoji: '🔴', color: '#ef4444', en: 'Critical', fr: 'Critique' },
};

/**
 * Compute status for a room given its humidity, temperature, and preset
 * @param {number} humidity - current HR%
 * @param {number} temp - current temperature
 * @param {object} preset - threshold preset
 * @returns {object} { status, thresholds, deviation }
 */
export function computeStatus(humidity, temp, preset) {
  const thresholds = getThresholds(temp, preset);
  const deviation = humidity - thresholds.target;

  let status;
  if (humidity < thresholds.min) {
    status = STATUS.TOO_DRY;
  } else if (humidity <= thresholds.target) {
    status = STATUS.OPTIMAL;
  } else if (humidity <= thresholds.max) {
    status = STATUS.HUMID;
  } else {
    status = STATUS.CRITICAL;
  }

  return { status, thresholds, deviation };
}

/**
 * Compute heatmap status color (RGB) for a given temp/humidity
 * Used for the Canvas heatmap background
 * @param {number} temp
 * @param {number} humidity
 * @param {string} profile - 'habitat', 'protection', or 'all'
 * @param {object} presets - { habitat: preset, protection: preset }
 * @returns {[number, number, number]} RGB values
 */
export function statusColorRGB(temp, humidity, profile, presets) {
  const getColor = preset => {
    const t = getThresholds(temp, preset);
    if (humidity < t.min) return [20, 45, 70]; // blue - too dry
    if (humidity <= t.target) return [20, 55, 35]; // green - optimal
    if (humidity <= t.max) return [60, 60, 15]; // yellow - humid
    return [140, 30, 30]; // red - critical
  };

  if (profile === 'all' || !profile) {
    // Blend between habitat and protection based on temperature
    const habitatColor = getColor(presets.habitat);
    const protectionColor = getColor(presets.protection);

    // Blend zone: 14-22°C (transition area)
    if (temp <= 14) return protectionColor;
    if (temp >= 22) return habitatColor;
    const ratio = (temp - 14) / 8;
    return [
      Math.round(protectionColor[0] + ratio * (habitatColor[0] - protectionColor[0])),
      Math.round(protectionColor[1] + ratio * (habitatColor[1] - protectionColor[1])),
      Math.round(protectionColor[2] + ratio * (habitatColor[2] - protectionColor[2])),
    ];
  }

  const preset = profile === 'protection' ? presets.protection : presets.habitat;
  return getColor(preset);
}
