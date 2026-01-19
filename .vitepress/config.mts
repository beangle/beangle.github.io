import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "⚒️Beangle Software",
  description: "Beangle provides agile development scaffold and toolkits",
  markdown:{
    toc:{
      level :[1,2,3],
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
          { text: '🧰Commons', link: '/commons/core' },
          { text: '📈Data', link: '/data' },
          { text: '✳️Micdn', link: '/micdn' },
          { text: '🎡Sas', link: '/sas' },
          { text: '🚀Boot', link: '/boot' },
          { text: '⚙️Spring', link: '/cdi' },
          { text: '✨WebMVC', link: '/webmvc' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/beangle' }
    ]
  }
})
