import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Breadcrumbs from './components/Breadcrumbs.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Breadcrumbs', Breadcrumbs)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-before': () => h(Breadcrumbs)
    })
  }
}
