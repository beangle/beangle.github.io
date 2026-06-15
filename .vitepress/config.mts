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
      { text: '📚Projects', link: '/projects' }
    ],
    outline: {
      label: '页面导航',
      level: [2, 6] // 显示h1到h6所有级别的标题
    },
    sidebar: [
      {
        text: '基础库',
        items: [
          { text: '🧰Commons', link: '/commons' },
          { text: '🚀Boot', link: '/boot' },
          { text: '⚙️Config', link: '/config' },
          { text: '🫧CDI', link: '/cdi' },
          { text: '🌐Web', link: '/web' }
        ]
      },
      {
        text: '数据层',
        items: [
          { text: '🗄️JDBC', link: '/jdbc' },
          { text: '📈Data', link: '/data' },
        ]
      },
      {
        text: '工具组件',
        items: [
          { text: '⚡Cache', link: '/cache' },
          { text: '📡Event', link: '/event' },
          { text: '🔔Notify', link: '/notify' },
          { text: '📝Template', link: '/template' },
          { text: '📄Doc', link: '/doc' },
          { text: '🔄Serializer', link: '/serializer' },
          { text: '⏰Cron', link: '/cron' },
          { text: '📤Transfer', link: '/transfer' },
        ]
      },
      {
        text: 'Web框架',
        items: [
          { text: '✨WebMVC', link: '/webmvc' },
          { text: '🎨BUI', link: '/bui' },
          { text: '🐚She', link: '/she' },
        ]
      },
      {
        text: '安全',
        items: [
          { text: '🔐Security', link: '/security' },
          { text: '🪪IDS', link: '/ids' },
          { text: '📜CA', link: '/ca' },
        ]
      },
      {
        text: '独立服务',
        items: [
          { text: '🎡Sas', link: '/sas' },
          { text: '🔧Otk', link: '/otk' },
          { text: '✳️Micdn', link: '/micdn' },
          { text: '🏢EMS', link: '/ems' },
          { text: '📊SQLPlus', link: '/sqlplus' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/beangle' }
    ]
  }
})
