import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import nextJs from 'eslint-config-next';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'], // Limitar a la carpeta sr
    languageOptions: { globals: globals.browser },
    rules: {
      // Configuración de tabulación y formato
      indent: ['error', 2], // Tabulación de 2 espacios
      'max-len': ['error', { code: 82 }], // Límite de caract(80 es el estándar)
      quotes: ['error', 'single'], // Uso de comillas simples
      semi: ['error', 'always'], // Siempre usar punto y coma
      'no-unused-vars': 'warn', // Variables no usadas se marcan como advertencia mkghcghckcgh ghgjhgfhfjhgfgj ghfh
      eqeqeq: ['error', 'always'], // Usar siempre === en lugar de ==
      curly: ['error', 'all'], // Siempre usar llaves en bloques
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReactHooks.configs.recommended,
  nextJs,
  // prettier,
];
