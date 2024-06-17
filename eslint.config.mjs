import prettierPlugin from 'eslint-plugin-prettier';
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
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      semi: ['error', 'always'],
      'no-unused-vars': ['warn'],
      'no-console': ['warn'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
      // Prettier rules
      ...prettierPlugin.configs.recommended.rules,
    },
  },
];
