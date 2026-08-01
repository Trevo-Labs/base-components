import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  plugins: [HstVue()],
  setupFile: '/src/histoire.setup.ts',
  storyMatch: ['src/**/*.story.vue'],
  storyIgnored: ['**/node_modules/**', '**/dist/**'],
  theme: {
    title: 'BaseComponents',
    colors: {
      primary: {
        50: '#f2f5fc',
        100: '#e0e7f6',
        200: '#c7d4ee',
        300: '#a9bce0',
        400: '#7f9bd2',
        500: '#5b7cc6',
        600: '#3f63bf',
        700: '#314e99',
        800: '#2a4180',
        900: '#25376a',
      },
    },
  },
  tree: {
    groups: [
      { id: 'base', title: 'Componentes base' },
      { id: 'internal', title: 'Internos' },
    ],
  },
})
