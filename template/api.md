# Beangle Template API 调用说明

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| API | `org.beangle.template.api` | 核心 API 接口 |
| Freemarker | `org.beangle.template.freemarker` | FreeMarker 实现 |

---

## API 模块

`org.beangle.template.api` - 提供核心 API 接口。

**功能说明**
提供模板引擎、模板渲染、组件管理等核心接口。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `TemplateEngine` | 模板引擎接口 | `new DefaultTemplateEngine()` |
| `TemplateRender` | 模板渲染接口 | `engine.forTemplate(name)` |
| `Component` | 组件接口 | `class MyComponent extends Component` |
| `ComponentContext` | 组件上下文 | `new ComponentContext()` |
| `Tag` | 标签接口 | `class MyTag extends Tag` |
| `Theme` | 主题接口 | `new Theme(name)` |
| `ThemeStack` | 主题栈 | `new ThemeStack()` |
| `ModelBuilder` | 模型构建器 | `new ModelBuilder()` |

**常用场景示例**

### 模板引擎

```scala
import org.beangle.template.api.TemplateEngine

val engine: TemplateEngine = new DefaultTemplateEngine()
val result = engine.render("template.ftl", Map("name" -> "John"))
```

### 模板渲染

```scala
import org.beangle.template.api.TemplateRender

val render = engine.forTemplate("template.ftl")
render.renderTo(Map("name" -> "John"), writer)
```

### 字符串模板

```scala
val result = engine.forString("Hello, ${name}!").render(Map("name" -> "John"))
```

### 组件上下文

```scala
import org.beangle.template.api.ComponentContext

val context = new ComponentContext()
context.put("name", "John")
context.put("age", 30)
```

### 主题管理

```scala
import org.beangle.template.api.{Theme, ThemeStack}

val theme = new Theme("default")
val stack = new ThemeStack()
stack.push(theme)
```

---

## Freemarker 模块

`org.beangle.template.freemarker` - 提供 FreeMarker 实现。

**功能说明**
基于 FreeMarker 的模板引擎实现，提供完整的模板渲染功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `DefaultTemplateEngine` | 默认模板引擎 | `new DefaultTemplateEngine()` |
| `DefaultTemplateRender` | 默认模板渲染 | `new DefaultTemplateRender()` |
| `Configurator` | FreeMarker 配置器 | `new Configurator()` |
| `BeangleObjectWrapper` | Beangle 对象包装器 | `new BeangleObjectWrapper()` |
| `BeangleBeanModel` | Beangle Bean 模型 | `new BeangleBeanModel()` |
| `SeqModel` | Seq 模型 | `new SeqModel()` |
| `TagModel` | 标签模型 | `new TagModel()` |

**常用场景示例**

### 创建模板引擎

```scala
import org.beangle.template.freemarker.{DefaultTemplateEngine, Configurator}

val configurator = new Configurator()
configurator.setTemplateLoader(new ClassTemplateLoader(getClass))
configurator.setDefaultEncoding("UTF-8")

val engine = new DefaultTemplateEngine()
engine.configurator = configurator
```

### 渲染模板

```scala
import org.beangle.template.freemarker.DefaultTemplateEngine

val engine = new DefaultTemplateEngine()
val model = Map(
  "name" -> "John",
  "age" -> 30,
  "users" -> Seq(
    Map("name" -> "Alice", "age" -> 25),
    Map("name" -> "Bob", "age" -> 28)
  )
)

val result = engine.render("users.ftl", model)
```

### 使用模板加载器

```scala
import org.beangle.template.freemarker.{ClassTemplateLoader, HttpTemplateLoader}

val classLoader = new ClassTemplateLoader(getClass)
val httpLoader = new HttpTemplateLoader("http://example.com/templates/")

val engine = new DefaultTemplateEngine()
engine.templateLoader = classLoader
```

### 自定义标签

```scala
import org.beangle.template.api.{Tag, ComponentContext}

class MyTag extends Tag {
  def render(context: ComponentContext): Unit = {
    val name = context.get[String]("name").getOrElse("World")
    context.writer.write(s"<h1>Hello, $name!</h1>")
  }
}
```

### 主题支持

```scala
import org.beangle.template.freemarker.{ThemeTemplateLoader, DefaultTemplateEngine}

val themeLoader = new ThemeTemplateLoader()
themeLoader.addTheme("default", "/templates/default/")
themeLoader.addTheme("dark", "/templates/dark/")

val engine = new DefaultTemplateEngine()
engine.templateLoader = themeLoader
```

---

## 模板语法

### 变量输出

```freemarker
Hello, ${name}!
```

### 条件判断

```freemarker
<#if user.active>
  User is active
<#else>
  User is inactive
</#if>
```

### 循环

```freemarker
<#list users as user>
  ${user.name} - ${user.age}
</#list>
```

### 宏定义

```freemarker
<#macro greet name>
  Hello, ${name}!
</#macro>

<@greet name="John"/>
```

### 包含

```freemarker
<#include "header.ftl">

<div class="content">
  Main content
</div>

<#include "footer.ftl">
```

---

## 最佳实践

### 模板组织

- 按功能模块组织模板文件
- 使用合理的目录结构
- 提供模板注释
- 保持模板简洁

### 性能优化

- 使用模板缓存
- 避免复杂的模板逻辑
- 优化模板加载
- 使用预编译模板

### 组件复用

- 创建可复用的组件
- 使用标签库
- 实现主题切换
- 提供组件文档

### 错误处理

- 捕获模板异常
- 提供友好的错误信息
- 记录模板错误日志
- 实现模板验证

### 安全考虑

- 避免模板注入
- 转义用户输入
- 限制模板访问
- 验证模板来源
