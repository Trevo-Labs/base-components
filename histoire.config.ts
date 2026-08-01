import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import type { Plugin } from 'vite'

/**
 * Histoire solo autoselecciona la variante si la story tiene una sola; con varias
 * se queda en la rejilla. No hay opción de config para cambiarlo, así que
 * parcheamos el check en la app cliente para abrir siempre la primera variante
 * (el Playground en todas nuestras stories).
 */
function autoSelectFirstVariant(): Plugin {
  const search = 'currentStory?.variants.length === 1'

  return {
    name: 'histoire-auto-select-first-variant',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('StoryView.vue2.js')) return
      if (!code.includes(search)) {
        this.warn('No se encontró el check de variantes en StoryView: revisa el parche tras actualizar histoire')
        return
      }
      return code.replace(search, 'currentStory?.variants.length >= 1')
    },
  }
}

export default defineConfig({
  plugins: [HstVue()],
  vite: {
    plugins: [autoSelectFirstVariant()],
  },
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
