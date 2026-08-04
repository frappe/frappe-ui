import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      root: __dirname,
      setupFiles: ['./vitest.setup.ts'],
      // .github/barista/scripts/*.test.ts are bun:test files for the barista
      // GitHub Action scripts, run by `bun test` in a separate CI job — not
      // valid vitest specs (they import from 'bun:test', which vitest can't
      // resolve).
      exclude: [...configDefaults.exclude, '.github/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        reportsDirectory: 'coverage/vitest',
        include: ['src/**/*.{ts,vue}'],
        exclude: [
          'src/**/*.cy.ts',
          'src/**/*.spec.ts',
          'src/**/*.test.ts',
          'src/**/*.story.vue',
          'src/**/stories/**',
          'src/**/types.ts',
          'src/**/types/**',
          'src/**/index.ts',
        ],
      },
    },
  }),
)
