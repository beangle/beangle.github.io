# Beangle WebMVC API 调用说明

Beangle WebMVC 是一个基于 Scala 的 MVC 框架，提供了丰富的 API 用于 Web 应用开发。本文档介绍了 WebMVC 的核心 API，帮助开发者快速上手和使用。

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| 注解 | `org.beangle.webmvc.annotation` | 提供 Action、参数、视图等注解 |
| 配置 | `org.beangle.webmvc.config` | 提供 Action 配置和映射功能 |
| 上下文 | `org.beangle.webmvc.context` | 提供 Action 上下文和参数处理 |
| 分发 | `org.beangle.webmvc.dispatch` | 提供请求分发和路由功能 |
| 执行 | `org.beangle.webmvc.execution` | 提供 Action 执行和结果处理 |
| 国际化 | `org.beangle.webmvc.i18n` | 提供国际化和文本资源功能 |
| 支持 | `org.beangle.webmvc.support` | 提供 Action 支持类和工具 |
| 工具 | `org.beangle.webmvc.util` | 提供 CORS、缓存控制等工具 |
| 视图 | `org.beangle.webmvc.view` | 提供视图管理和渲染功能 |

## 1. 注解模块 (`org.beangle.webmvc.annotation`)

**功能说明**
提供 Action、参数绑定、视图等注解，用于配置控制器行为。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `@action` | 标记方法为 Action | `@action("index")` |
| `@param` | 标记参数绑定 | `@param("id")` |
| `@view` | 标记视图 | `@view("index")` |
| `@body` | 标记请求体 | `@body` |
| `@header` | 标记请求头 | `@header("User-Agent")` |
| `@cookie` | 标记 Cookie | `@cookie("sessionId")` |
| `@response` | 标记响应 | `@response` |
| `@mapping` | 标记路径映射 | `@mapping("/user/{id}")` |

**常用场景示例**

```scala
// 基本 Action 定义
@action("index")
def index(): Any = {
  "index"
}

// 带参数的 Action
@action("show")
def show(@param("id") id: Long): Any = {
  val user = userService.get(id)
  "show" -> Map("user" -> user)
}

// REST 风格的路径映射
@mapping("/users/{id}")
@action("get")
def get(@param("id") id: Long): Any = {
  userService.get(id)
}
```

## 2. 配置模块 (`org.beangle.webmvc.config`)

**功能说明**
提供 Action 配置、映射和路由功能，用于管理控制器的行为和路径。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ActionMapping` | Action 映射 | `val mapping = new ActionMapping` |
| `ActionMappingBuilder` | Action 映射构建器 | `val builder = new ActionMappingBuilder` |
| `RouteMapping` | 路由映射 | `val routeMapping = new RouteMapping` |
| `Path` | 路径处理 | `val path = Path.parse("/user/{id}")` |
| `Profile` | 配置文件 | `val profile = Profile.load("webmvc")` |

**常用场景示例**

```scala
// 构建 Action 映射
val builder = new ActionMappingBuilder
val mapping = builder.build(actions)

// 配置路由
val routeMapping = new RouteMapping
routeMapping.add("/users", classOf[UserAction], "index")

// 解析路径
val path = Path.parse("/user/{id}")
val params = path.match("/user/123")
```

## 3. 上下文模块 (`org.beangle.webmvc.context`)

**功能说明**
提供 Action 上下文、参数处理和请求信息管理。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ActionContext` | Action 上下文 | `val context = ActionContext.current` |
| `Params` | 参数处理 | `val params = Params.current` |
| `Flash` | Flash 参数 | `val flash = Flash.current` |
| `ActionMessages` | 消息管理 | `val messages = ActionMessages.current` |

**常用场景示例**

```scala
// 获取当前上下文
val context = ActionContext.current
val request = context.request
val response = context.response

// 获取参数
val params = Params.current
val id = params.get("id").toLong

// 使用 Flash 参数
Flash.current.put("message", "操作成功")

// 添加消息
ActionMessages.current.add("success", "操作成功")
```

## 4. 分发模块 (`org.beangle.webmvc.dispatch`)

**功能说明**
提供请求分发、路由和处理功能，负责将请求映射到相应的 Action。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Dispatcher` | 请求分发器 | `val dispatcher = new Dispatcher` |
| `Route` | 路由定义 | `val route = Route("/user", classOf[UserAction])` |
| `RequestMapper` | 请求映射器 | `val mapper = new HierarchicalUrlMapper` |
| `ActionUriRender` | Action URI 渲染 | `val render = new ActionUriRender` |

**常用场景示例**

```scala
// 创建路由
val route = Route("/users", classOf[UserAction])

// 渲染 Action URI
val uri = ActionUriRender.render("user", "index", Map("id" -> 123))

// 处理请求
val dispatcher = new Dispatcher
val result = dispatcher.dispatch(request, response)
```

## 5. 执行模块 (`org.beangle.webmvc.execution`)

**功能说明**
提供 Action 执行、方法调用和结果处理功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Invoker` | Action 调用器 | `val invoker = new DynaMethodInvoker` |
| `Handler` | 请求处理器 | `val handler = new DefaultMappingHandler` |
| `CacheResult` | 结果缓存 | `@CacheResult` |
| `ResponseCache` | 响应缓存 | `ResponseCache.setCacheControl(response, "max-age=3600")` |

**常用场景示例**

```scala
// 调用 Action 方法
val invoker = new DynaMethodInvoker
val result = invoker.invoke(action, method, args)

// 缓存结果
@CacheResult
@action("list")
def list(): Any = {
  userService.findAll()
}

// 设置响应缓存
ResponseCache.setCacheControl(response, "max-age=3600")
```

## 6. 国际化模块 (`org.beangle.webmvc.i18n`)

**功能说明**
提供国际化、文本资源和本地化功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ActionTextResource` | Action 文本资源 | `val resource = ActionTextResource.current` |
| `ActionTextCache` | 文本缓存 | `val cache = ActionTextCache.current` |

**常用场景示例**

```scala
// 获取文本资源
val resource = ActionTextResource.current
val message = resource.get("user.not.found")

// 使用文本缓存
val cache = ActionTextCache.current
val messages = cache.get(classOf[UserAction])
```

## 7. 支持模块 (`org.beangle.webmvc.support`)

**功能说明**
提供 Action 支持类和工具，简化控制器开发。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ActionSupport` | Action 支持类 | `class UserAction extends ActionSupport` |
| `JsonAPISupport` | JSON API 支持 | `class ApiAction extends JsonAPISupport` |
| `EntitySupport` | 实体支持 | `class UserAction extends EntitySupport[User]` |
| `RouteSupport` | 路由支持 | `class UserAction extends RouteSupport` |

**常用场景示例**

```scala
// 基本 Action 支持
class UserAction extends ActionSupport {
  @action("index")
  def index(): Any = {
    "index"
  }
}

// JSON API 支持
class ApiAction extends JsonAPISupport {
  @action("list")
  def list(): Any = {
    userService.findAll()
  }
}

// 实体支持
class UserAction extends EntitySupport[User] {
  @action("show")
  def show(id: Long): Any = {
    entityService.get(id)
  }
}
```

## 8. 工具模块 (`org.beangle.webmvc.util`)

**功能说明**
提供 CORS、缓存控制等 Web 相关工具。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `CORS` | CORS 工具 | `CORS.setHeaders(response, "*")` |
| `CacheControl` | 缓存控制 | `CacheControl.setMaxAge(response, 3600)` |
| `Resources` | 资源工具 | `Resources.getResource("/css/style.css")` |

**常用场景示例**

```scala
// 设置 CORS 头
CORS.setHeaders(response, "*")

// 设置缓存控制
CacheControl.setMaxAge(response, 3600)

// 获取资源
val resource = Resources.getResource("/css/style.css")
```

## 9. 视图模块 (`org.beangle.webmvc.view`)

**功能说明**
提供视图管理、渲染和解析功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ViewManager` | 视图管理器 | `val manager = ViewManager.current` |
| `ViewRender` | 视图渲染器 | `val render = new FreemarkerViewRender` |
| `ViewBuilder` | 视图构建器 | `val builder = new TypeViewBuilder` |
| `ViewResolver` | 视图解析器 | `val resolver = new FreemarkerViewResolver` |

**常用场景示例**

```scala
// 构建视图
val view = TypeViewBuilder.build("index", Map("user" -> user))

// 渲染视图
val render = new FreemarkerViewRender
render.render(view, request, response)

// 解析视图
val resolver = new FreemarkerViewResolver
val template = resolver.resolve("index")
```

## 最佳实践

1. **使用 ActionSupport**：继承 ActionSupport 类可以获得更多便捷方法
2. **合理使用注解**：使用注解配置 Action 和参数，减少配置文件
3. **RESTful 设计**：使用 `@mapping` 注解实现 RESTful 风格的 API
4. **参数绑定**：使用 `@param` 注解进行参数绑定，简化代码
5. **视图管理**：合理使用不同类型的视图，如 Freemarker、JSON 等
6. **国际化**：使用 ActionTextResource 管理多语言资源
7. **缓存策略**：合理使用缓存注解和缓存控制，提高性能
8. **异常处理**：实现统一的异常处理机制
9. **模块组织**：按照功能模块组织 Action，提高代码可维护性
10. **测试**：编写单元测试和集成测试，确保代码质量