import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import istanbul from 'vite-plugin-istanbul'
// Through the entry, not the bare `.js` sub-plugin: `vite/index.d.ts` is the
// only typed surface here, so a deep import lands on an untyped module.
import { lucideIcons } from './vite/index.js'

const coverageEnabled = process.env.COVERAGE === 'true'

export default defineConfig({
  plugins: [
    vue(),
    lucideIcons({
      componentGlobs: [
        'src/components/**/*.vue',
        '!src/components/**/stories/*.vue',
      ],
    }),
    coverageEnabled &&
      istanbul({
        include: 'src/**/*',
        exclude: [
          'node_modules',
          'src/**/*.cy.ts',
          'src/**/*.spec.ts',
          'src/**/*.test.ts',
          'src/**/stories/**',
        ],
        extension: ['.js', '.ts', '.vue'],
        cypress: true,
        requireEnv: false,
      }),
  ],
  resolve: {
    alias: {
      'tailwind.config.js': path.resolve(__dirname, 'tailwind.config.js'),
      // The demo playground imports the library the way an app does, so demo
      // code is copy-pastable. Deepest specifier first — Vite matches in order.
      'frappe-ui/list': path.resolve(__dirname, 'src/molecules/list/index.ts'),
      'frappe-ui': path.resolve(__dirname, 'src/index.ts'),
    },
  },
  optimizeDeps: {
    include: ['tailwind.config.js'],
  },
})
