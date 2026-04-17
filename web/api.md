# Beangle Web API 调用说明

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Context | `org.beangle.web.servlet.context` | Servlet 容器上下文管理 |
| Filter | `org.beangle.web.servlet.filter` | 各种过滤器实现 |
| HTTP | `org.beangle.web.servlet.http` | HTTP 处理相关功能 |
| Init | `org.beangle.web.servlet.init` | 初始化相关类 |
| Intercept | `org.beangle.web.servlet.intercept` | 拦截器接口 |
| IO | `org.beangle.web.servlet.io` | 网络 IO 相关功能 |
| Multipart | `org.beangle.web.servlet.multipart` | 文件上传处理 |
| Resource | `org.beangle.web.servlet.resource` | 静态资源处理 |
| Security | `org.beangle.web.servlet.security` | 安全相关功能 |
| Servlet | `org.beangle.web.servlet.servlet` | Servlet 代理 |
| SSE | `org.beangle.web.servlet.sse` | 服务器发送事件 |
| URL | `org.beangle.web.servlet.url` | URL 构建和渲染 |
| Util | `org.beangle.web.servlet.util` | Web 工具类 |
| Socket | `org.beangle.web.socket` | Socket 初始化 |

---

## Context 模块

`org.beangle.web.servlet.context` - 提供 Servlet 容器的上下文管理功能。

**功能说明**
提供 Servlet 容器的上下文管理功能，包括 ServletContext 持有和容器清理。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ServletContextHolder` | ServletContext 持有器 | `val context = ServletContextHolder.getContext` |
| `ContainerCleanup` | 容器清理工具 | `ContainerCleanup.registerCallback(() => cleanup())` |

**常用场景示例**

```scala
// 获取 ServletContext
val context = ServletContextHolder.getContext
val realPath = context.getRealPath("/WEB-INF")

// 注册容器清理回调
ContainerCleanup.registerCallback(() => {
  // 执行清理操作
  println("Container is being cleaned up")
})
```

---

## Filter 模块

`org.beangle.web.servlet.filter` - 提供各种过滤器实现，支持请求处理和过滤链管理。

**功能说明**
提供各种过滤器实现，支持请求处理和过滤链管理。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `GenericHttpFilter` | 通用 HTTP 过滤器 | `class MyFilter extends GenericHttpFilter` |
| `OncePerRequestFilter` | 每个请求只执行一次的过滤器 | `class MyFilter extends OncePerRequestFilter` |
| `CharacterEncodingFilter` | 字符编码过滤器 | `new CharacterEncodingFilter("UTF-8")` |
| `CompositeFilter` | 复合过滤器 | `val filter = new CompositeFilter(filters)` |
| `DelegatingFilterProxy` | 委托过滤器代理 | `new DelegatingFilterProxy("filterBean")` |
| `RequestMatcher` | 请求匹配器 | `val matcher = RequestMatcher.path("/api/**")` |
| `VirtualFilterChain` | 虚拟过滤链 | `new VirtualFilterChain(chain, filters, 0)` |

**常用场景示例**

```scala
// 创建字符编码过滤器
val encodingFilter = new CharacterEncodingFilter("UTF-8")

// 创建请求匹配器
val apiMatcher = RequestMatcher.path("/api/**")
val staticMatcher = RequestMatcher.path("/static/**")

// 创建复合过滤器
val filters = Seq(encodingFilter, authFilter, loggingFilter)
val compositeFilter = new CompositeFilter(filters)

// 实现自定义过滤器
class AuthFilter extends OncePerRequestFilter {
  def doFilterInternal(req: HttpServletRequest, res: HttpServletResponse, chain: FilterChain): Unit = {
    if (isAuthenticated(req)) {
      chain.doFilter(req, res)
    } else {
      res.sendRedirect("/login")
    }
  }
}
```

---

## HTTP 模块

`org.beangle.web.servlet.http` - 提供 HTTP 处理相关功能，包括内容协商和用户代理识别。

**功能说明**
提供 HTTP 处理相关功能，包括内容协商和用户代理识别。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ContentNegotiationManager` | 内容协商管理器 | `new ContentNegotiationManager()` |
| `ContentTypeResolver` | 内容类型解析器 | `new PathExtensionContentResolver()` |
| `Useragent` | 用户代理解析器 | `Useragent.parse(request.getHeader("User-Agent"))` |
| `Browser` | 浏览器信息 | `useragent.getBrowser` |
| `Os` | 操作系统信息 | `useragent.getOs` |

**常用场景示例**

```scala
// 内容协商
val contentNegotiation = new ContentNegotiationManager()
val mediaTypes = contentNegotiation.resolveMediaTypes(request)

// 解析用户代理
val userAgent = request.getHeader("User-Agent")
val parsedUseragent = Useragent.parse(userAgent)

// 获取浏览器信息
val browser = parsedUseragent.getBrowser
val browserName = browser.name

// 获取操作系统信息
val os = parsedUseragent.getOs
val osName = os.name

// 基于浏览器类型的处理
if (browser.category == BrowserCategory.MOBILE) {
  // 移动设备处理
} else {
  // 桌面设备处理
}
```

---

## Init 模块

`org.beangle.web.servlet.init` - 提供 Servlet 容器初始化相关功能。

**功能说明**
提供 Servlet 容器初始化相关功能，支持应用启动和初始化。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Initializer` | 初始化器接口 | `class MyInitializer extends Initializer` |
| `BootstrapInitializer` | 引导初始化器 | `new BootstrapInitializer()` |
| `BootstrapListener` | 引导监听器 | `new BootstrapListener()` |

**常用场景示例**

```scala
// 实现自定义初始化器
class AppInitializer extends Initializer {
  def onStartup(servletContext: ServletContext): Unit = {
    // 初始化应用
    val context = new AnnotationConfigWebApplicationContext()
    context.register(classOf[AppConfig])
    
    // 注册 DispatcherServlet
    val servlet = new DispatcherServlet(context)
    val registration = servletContext.addServlet("dispatcher", servlet)
    registration.setLoadOnStartup(1)
    registration.addMapping("/")
  }
}

// 在 META-INF/services/jakarta.servlet.ServletContainerInitializer 中注册
// org.beangle.web.servlet.init.BootstrapInitializer
```

---

## IO 模块

`org.beangle.web.servlet.io` - 提供网络 IO 相关功能，支持文件下载和范围请求。

**功能说明**
提供网络 IO 相关功能，支持文件下载和范围请求。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Wagon` | 网络传输工具接口 | `val wagon = new DefaultWagon()` |
| `DefaultWagon` | 默认网络传输工具 | `new DefaultWagon()` |
| `RangedWagon` | 支持范围请求的网络传输工具 | `new RangedWagon()` |

**常用场景示例**

```scala
// 创建网络传输工具
val wagon = new DefaultWagon()

// 下载文件
val url = new URL("https://example.com/file.zip")
val outputFile = new File("/path/to/save/file.zip")
wagon.get(url, outputFile)

// 支持范围请求的传输
val rangedWagon = new RangedWagon()
val range = Range.create(0, 1024) // 下载前1KB
rangedWagon.get(url, outputFile, range)
```

---

## Multipart 模块

`org.beangle.web.servlet.multipart` - 提供文件上传处理功能。

**功能说明**
提供文件上传处理功能，支持 multipart/form-data 请求。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `MultipartResolver` | 文件上传解析器接口 | `val resolver = new StandardMultipartResolver()` |
| `StandardMultipartResolver` | 标准文件上传解析器 | `new StandardMultipartResolver()` |

**常用场景示例**

```scala
// 创建文件上传解析器
val resolver = new StandardMultipartResolver()

// 检查请求是否包含文件
if (resolver.isMultipart(request)) {
  // 解析文件上传
  val multipartRequest = resolver.resolveMultipart(request)
  
  // 获取文件
  val file = multipartRequest.getFile("file")
  if (file != null) {
    // 处理文件
    val fileName = file.getOriginalFilename
    val tempFile = File.createTempFile("upload", ".tmp")
    file.transferTo(tempFile)
  }
  
  // 清理资源
  resolver.cleanupMultipart(multipartRequest)
}
```

---

## Resource 模块

`org.beangle.web.servlet.resource` - 提供静态资源处理功能。

**功能说明**
提供静态资源处理功能，支持资源路径解析、处理链和过滤器。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `StaticResourceServlet` | 静态资源 Servlet | `new StaticResourceServlet()` |
| `PathResolver` | 路径解析器 | `new PathResolver()` |
| `ResourceProcessor` | 资源处理器 | `new ResourceProcessor()` |
| `ResourceFilter` | 资源过滤器 | `new HeaderFilter()` |

**常用场景示例**

```scala
// 配置静态资源 Servlet
val servlet = new StaticResourceServlet()
val registration = servletContext.addServlet("static", servlet)
registration.addMapping("/static/*")

// 路径解析
val pathResolver = new PathResolver()
val resolvedPath = pathResolver.resolve("/static/js/app.js")

// 资源处理链
val filters = Seq(new HeaderFilter())
val processor = new ResourceProcessor(filters)
val processedResource = processor.process(resource, context)
```

---

## SSE 模块

`org.beangle.web.servlet.sse` - 提供服务器发送事件（Server-Sent Events）功能。

**功能说明**
提供服务器发送事件（Server-Sent Events）功能，支持服务器向客户端推送数据。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `SseWriter` | SSE 写入器 | `val writer = new SseWriter(response)` |
| `SseEvent` | SSE 事件 | `SseEvent(data, event, id, retry)` |

**常用场景示例**

```scala
// 创建 SSE 写入器
response.setContentType("text/event-stream")
response.setCharacterEncoding("UTF-8")
response.setHeader("Cache-Control", "no-cache")
response.setHeader("Connection", "keep-alive")

val writer = new SseWriter(response.getWriter)

// 发送事件
writer.write(SseEvent("Hello, world!"))
writer.write(SseEvent("Update", "message"))
writer.write(SseEvent("100", "progress", "1"))

// 关闭写入器
writer.close()
```

---

## URL 模块

`org.beangle.web.servlet.url` - 提供 URL 构建和渲染功能。

**功能说明**
提供 URL 构建和渲染功能，支持生成和处理 URL。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `UrlBuilder` | URL 构建器 | `val builder = new UrlBuilder(request)` |
| `UrlRender` | URL 渲染器 | `val render = new UrlRender()` |

**常用场景示例**

```scala
// 构建 URL
val builder = new UrlBuilder(request)
builder.setPath("/api/users")
builder.addParameter("page", "1")
builder.addParameter("size", "10")
val url = builder.build()

// 渲染 URL
val render = new UrlRender()
val renderedUrl = render.render("/api/users", Map("id" -> 1))
```

---

## Util 模块

`org.beangle.web.servlet.util` - 提供 Web 相关的工具类。

**功能说明**
提供 Web 相关的工具类，包括 Cookie 处理、请求工具和重定向工具。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `CookieGenerator` | Cookie 生成器 | `val generator = new CookieGenerator("sessionId")` |
| `CookieUtils` | Cookie 工具类 | `val value = CookieUtils.getCookieValue(request, "sessionId")` |
| `RequestUtils` | 请求工具类 | `val contextPath = RequestUtils.getContextPath(request)` |
| `RedirectUtils` | 重定向工具类 | `val redirectUrl = RedirectUtils.calculateRedirectUrl(request, "/home")` |

**常用场景示例**

```scala
// Cookie 处理
val generator = new CookieGenerator("sessionId")
generator.setCookieMaxAge(86400) // 24小时
generator.addCookie(response, "session123")

// 获取 Cookie 值
val sessionId = CookieUtils.getCookieValue(request, "sessionId")

// 请求工具
val contextPath = RequestUtils.getContextPath(request)
val requestUri = RequestUtils.getRequestUri(request)

// 重定向
val redirectUrl = RedirectUtils.calculateRedirectUrl(request, "/home")
response.sendRedirect(redirectUrl)
```

---

## Socket 模块

`org.beangle.web.socket` - 提供 Socket 初始化功能。

**功能说明**
提供 Socket 初始化功能，支持 WebSocket 集成。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `SocketInitializer` | Socket 初始化器 | `class MySocketInitializer extends SocketInitializer` |

**常用场景示例**

```scala
// 实现 Socket 初始化器
class AppSocketInitializer extends SocketInitializer {
  def onStartup(servletContext: ServletContext): Unit = {
    // 配置 WebSocket 端点
    val serverContainer = servletContext.getAttribute("javax.websocket.server.ServerContainer").asInstanceOf[ServerContainer]
    serverContainer.addEndpoint(classOf[ChatEndpoint])
  }
}
```

---

## 最佳实践

### 过滤器配置

- 使用 `OncePerRequestFilter` 确保过滤器只执行一次
- 使用 `CompositeFilter` 组合多个过滤器
- 合理使用 `RequestMatcher` 限制过滤器的应用范围

### 内容协商

- 配置 `ContentNegotiationManager` 支持多种媒体类型
- 优先使用路径扩展名和请求头进行内容协商

### 静态资源处理

- 使用 `StaticResourceServlet` 处理静态资源
- 配置适当的缓存策略
- 启用 gzip 压缩

### SSE 使用

- 设置正确的响应头
- 定期发送心跳事件保持连接
- 处理连接关闭和异常情况

### URL 构建

- 使用 `UrlBuilder` 构建 URL，确保参数正确编码
- 考虑使用相对路径，增强应用的可移植性
