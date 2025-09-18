import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import javascriptObfuscator from 'rollup-plugin-javascript-obfuscator';

export default defineConfig({
  plugins: [
    react(),
    javascriptObfuscator({
      // Opciones de ofuscación
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      debugProtection: true,
      disableConsoleOutput: true,
      rotateStringArray: true,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      stringArrayThreshold: 0.75,
    }),
  ],
  base: '/',
});
