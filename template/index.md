# Beangle Template

Beangle Template 是一个基于 Scala 的模板引擎框架，提供模板渲染、组件管理和主题支持等功能，基于 FreeMarker 实现。

## 核心能力

Beangle Template 提供以下核心能力：

- **模板渲染**：支持 FreeMarker 模板的渲染和执行
- **组件管理**：提供可复用的 UI 组件
- **主题支持**：支持多主题切换和主题栈
- **标签库**：提供丰富的标签库支持
- **模型构建**：提供灵活的模型构建器
- **上下文管理**：提供组件上下文和模板上下文

## 文档组织

* [API 调用说明](/template/api.html) 详细的 API 使用指南，包含所有模块的功能说明和使用示例

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| API | `org.beangle.template.api` | 核心 API 接口 |
| Freemarker | `org.beangle.template.freemarker` | FreeMarker 实现 |

## 快速开始

### 基本渲染

```scala
import org.beangle.template.freemarker.DefaultTemplateEngine

val engine = new DefaultTemplateEngine()
val result = engine.render("template.ftl", Map("name" -> "John"))
```

### 使用模板渲染

```scala
val render = engine.forTemplate("template.ftl")
render.renderTo(Map("name" -> "John"), writer)
```

### 字符串模板

```scala
val result = engine.forString("Hello, ${name}!").render(Map("name" -> "John"))
```

## 最佳实践

- 合理组织模板文件结构
- 使用组件提高模板复用性
- 实现主题切换功能
- 优化模板性能
- 处理模板异常
