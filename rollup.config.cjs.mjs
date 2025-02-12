/**
 * NOTE: There is currently an open issue for adding 'use client' directive
 * https://github.com/rollup/rollup/issues/4699
 */

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import analyze from 'rollup-plugin-analyzer';
import preserveDirectives from 'rollup-plugin-preserve-directives';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

/**
 * Used for generating external dependencies
 * Credit: Mateusz Burzyński (https://github.com/Andarist)
 * Source: https://github.com/rollup/rollup-plugin-babel/issues/148#issuecomment-399696316
 */
const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return (id) => pattern.test(id);
};

const outputOptions = {
  exports: 'named',
  preserveModules: true,
  // Ensures that CJS default exports are imported properly (based on __esModule)
  // If needed, can switch to 'compat' which checks for .default prop on the default export instead
  // see https://rollupjs.org/configuration-options/#output-interop
  interop: 'auto',
  banner: `/*
 * Rollup Library Starter
 * {@link https://github.com/mryechkin/rollup-library-starter}
 * @copyright Mykhaylo Ryechkin (@mryechkin)
 * @license MIT
 */`,
};

const config = {
  input: 'src/index.tsx',
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      ...outputOptions,
    },
  ],
  external: makeExternalPredicate([
    // Handles both dependencies and peer dependencies so we don't have to manually maintain a list
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]),
  plugins: [
    alias({
      entries: {
        src: fileURLToPath(new URL('src', import.meta.url)),
      },
    }),
    nodeResolve(),
    commonjs({ include: ['node_modules/**'] }),
    typescript({ tsconfig: './tsconfig.cjs.json' }),

    preserveDirectives(),
    terser(),
    analyze({
      hideDeps: true,
      limit: 0,
      summaryOnly: true,
    }),
  ],
  // Ignore warnings when using "use client" directive
  onwarn(warning, warn) {
    if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') {
      warn(warning);
    }
  },
};

export default config;
