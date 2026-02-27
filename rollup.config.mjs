import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
  input: 'src/humidity-heatmap-card.js',
  output: {
    file: 'dist/humidity-heatmap-card.js',
    format: 'es',
    inlineDynamicImports: true,
  },
  plugins: [
    replace({
      __BUILD_VERSION__: JSON.stringify(pkg.version),
      preventAssignment: true,
    }),
    resolve(),
    json(),
    terser({
      output: { comments: false },
    }),
  ],
};
