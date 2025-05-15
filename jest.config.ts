import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  //ModuleFileExtensions is a different order than the default options, to improve performance
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'mjs',
    'cjs',
    'json',
    'node',
  ],
  // All our .ts files are ESM (Not CommonJS), thus they should be treated as such
  extensionsToTreatAsEsm: ['.ts'],
  // We need to disable transform since we're using ESM (Not CommonJS)
  transform: {},
  // We use ts-jest to allow for typescript compatibility.
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};

export default config;
