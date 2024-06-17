import pluginObject from 'eslint-plugin-prettier';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'], // Include TypeScript files
    languageOptions: {
      parser: typescriptParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    // plugins: ['prettier'],

    plugins: {
      prettier: pluginObject,
    },

    rules: {
      semi: ['error', 'always'],
      'no-unused-vars': ['warn'],
      'no-console': ['warn'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
    },
  },
];
