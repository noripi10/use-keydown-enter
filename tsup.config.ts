import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
  ...options,

  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react'],
  treeshake: true,
  target: 'ES2020',
  tsconfig: './tsconfig.build.json',
}));
