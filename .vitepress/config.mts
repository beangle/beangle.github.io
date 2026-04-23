import { defineConfig } from 'vitepress'

function tablePlugin(md: any) {
  const defaultRender = md.renderer.rules.table_open || function (tokens: any, idx: any, options: any, env: any, self: any) {
    return self.renderToken(tokens, idx, options)
  }
  md.renderer.rules.table_open = function (tokens: any, idx: any, options: any, env: any, self: any) {
    return '<table class="table-api">'
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "⚒️Beangle Software",
  description: "Beangle provides agile development scaffold and toolkits",
  markdown:{
    toc:{
      level :[1,2,3],
    },
    config: (md) => {
      md.use(tablePlugin)
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '🏠Home', link: '/' },
      { text: '📚Documents', link: '/projects' }
    ],
    outline: {
      label: '页面导航',
      level: [2, 6] // 显示h1到h6所有级别的标题
    },
    sidebar: [
      {
        text: 'Projects',
        items: [
          { text: '🧰Commons', link: '/commons' },
          { text: '🌐Web', link: '/web' },
          { text: '📈Data', link: '/data' },
          { text: '✳️Micdn', link: '/micdn' },
          { text: '🎡Sas', link: '/sas' },
          { text: '🚀Boot', link: '/boot' },
          { text: '⚙️Spring', link: '/cdi' },
          { text: '✨WebMVC', link: '/webmvc' },
          { text: '🎨BUI', link: '/bui' },
          { text: '🔔Notify', link: '/notify' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/beangle' }
    ]
  }
})
