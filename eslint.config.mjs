// // eslint.config.js

// import typescriptParser from "@typescript-eslint/parser";
// import globals from "globals";

// export default [
//   {
//     files: ["**/*.ts", "**/*.tsx"], // Include TypeScript files
//     languageOptions: {
//       parser: typescriptParser,
//       globals: {
//         ...globals.browser,
//         ...globals.node,
//       },
//     },
//     rules: {
//       // semi: ["error", "always"],
//       // "no-unused-vars": ["warn"],
//       // "no-console": ["warn"],
//       // indent: ["error", 2],
//       // quotes: ["error", "single"],
//     },
//   },
// ];

// eslint.config.js

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
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error',
      semi: ['error', 'always'],
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
    },
  },
];
