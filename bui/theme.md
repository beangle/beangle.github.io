# Beangle BUI 主题定制

Beangle BUI 支持主题定制，允许开发者根据项目需求调整界面风格。本文档详细介绍了主题的结构、配置和定制方法。

## 主题结构

Beangle BUI 的主题文件位于以下目录结构中：

```
static/themes/
      themename/           # 主题名称
        icons/             # 图标目录
          16x16/          # 16x16 图标
            actions/       # 动作图标
            browsers/      # 浏览器图标
            places/        # 位置图标
            status/        # 状态图标
            tree/          # 树节点图标
          48x48/          # 48x48 图标
        html/             # HTML 模板
          actionerror.ftl  # 错误消息模板
          actionmessage.ftl # 成功消息模板
          anchor.ftl       # 锚点模板
          boxcol.ftl       # 带边框的列模板
          card.ftl         # 卡片模板
          form.ftl         # 表单模板
          grid.ftl         # 表格模板
          nav.ftl          # 导航模板
          ...              # 其他模板文件
        list/             # 列表模板
        mini/             # 迷你模板
        search/           # 搜索模板
        theme.properties  # 主题配置文件
```

## 主题配置

主题配置文件 `theme.properties` 用于定义主题的基本信息和配置项：

```properties
# 主题名称
theme.name=bootstrap

# 主题版本
theme.version=1.0.0

# 主题描述
theme.description=Bootstrap 主题

# 主题作者
theme.author=Beangle

# CSS 文件
css.files=beangle-ui.css

# JavaScript 文件
js.files=beangle-ui.js

# 图标目录
icon.path=icons

# 默认图标大小
default.icon.size=16

# 支持的图标大小
supported.icon.sizes=16,48
```

## 定制主题

### 1. 创建新主题

1. 在 `static/themes/` 目录下创建新的主题目录，例如 `mytheme`
2. 复制默认主题（如 bootstrap）的文件结构到新目录
3. 修改 `theme.properties` 文件，设置主题名称和其他配置
4. 修改模板文件和资源文件，实现自定义风格

### 2. 修改模板文件

模板文件位于 `html/`、`list/`、`mini/` 和 `search/` 目录中，使用 Freemarker 语法编写。例如，修改 `form.ftl` 文件可以自定义表单的样式：

```ftl
<#-- 自定义表单模板 -->
<form id="${id!}" name="${name!}" action="${action!}" method="${method!post}" class="${class!form-horizontal}" enctype="${enctype!application/x-www-form-urlencoded}">
  <#if hidden?has_content>
    <#list hidden as field>
      <input type="hidden" name="${field.name}" value="${field.value}" />
    </#list>
  </#if>
  <#nested/>
</form>
```

### 3. 自定义 CSS

在主题目录下创建或修改 CSS 文件，定义自定义样式：

```css
/* 自定义表单样式 */
.form-horizontal .form-group {
  margin-bottom: 15px;
}

.form-horizontal .control-label {
  font-weight: bold;
  color: #333;
}

/* 自定义按钮样式 */
.btn-primary {
  background-color: #0066cc;
  border-color: #0052a3;
}

.btn-primary:hover {
  background-color: #0052a3;
  border-color: #004080;
}
```

### 4. 添加自定义图标

在 `icons/` 目录下添加自定义图标，例如：

- `icons/16x16/actions/custom.png`
- `icons/48x48/actions/custom-large.png`

### 5. 应用主题

在应用配置文件中设置默认主题：

```xml
<web>
  <theme name="mytheme" />
</web>
```

或者在代码中动态设置主题：

```scala
// 设置当前主题
ThemeManager.setCurrentTheme("mytheme")
```

## 主题切换

Beangle BUI 支持运行时主题切换，通过以下方式实现：

### 1. URL 参数切换

在 URL 中添加 `theme` 参数：

```
http://localhost:8080/app?theme=mytheme
```

### 2. 代码切换

```scala
// 切换主题
ThemeManager.setCurrentTheme("mytheme")

// 获取当前主题
val currentTheme = ThemeManager.getCurrentTheme
```

### 3. 会话级别切换

```scala
// 在会话中设置主题
ActionContext.current.session.setAttribute("theme", "mytheme")
```

## 主题继承

Beangle BUI 支持主题继承，允许新主题继承现有主题的配置和模板，只修改需要自定义的部分。

### 1. 配置继承

在 `theme.properties` 文件中设置父主题：

```properties
# 父主题
parent.theme=bootstrap

# 其他配置...
theme.name=mytheme
theme.description=My Custom Theme
```

### 2. 模板继承

在模板文件中使用 Freemarker 的继承功能：

```ftl
<#-- 继承父主题的表单模板 -->
<#include "${parentTheme}/html/form.ftl" />

<#-- 自定义部分 -->
<#macro customForm>
  <!-- 自定义表单内容 -->
</#macro>
```

## 最佳实践

1. **保持一致性**：在整个应用中使用统一的主题，确保视觉一致性
2. **模块化**：将主题相关的样式和模板组织成模块化结构
3. **响应式设计**：确保主题在不同设备上都能正常显示
4. **性能优化**：压缩 CSS 和 JavaScript 文件，减少资源加载时间
5. **兼容性**：确保主题在主流浏览器中都能正常工作
6. **可维护性**：使用清晰的命名和组织结构，便于后续维护
7. **测试**：在不同环境下测试主题的显示效果
8. **文档**：为自定义主题编写文档，说明其特点和使用方法