# Beangle WebMVC

Beangle WebMVC 是一个基于 Scala 的 MVC 框架，提供了简洁有力的 Web 应用开发能力，可替代 Struts 或 SpringMVC 等框架。

## 核心能力

Beangle WebMVC 提供以下核心能力：

- **基于 Command 的 MVC 架构**：采用命令模式，提供清晰的控制器结构
- **注解支持**：通过注解配置 Action、参数绑定、视图等
- **RESTful 支持**：提供 REST 风格的路由和请求处理
- **参数绑定**：支持将请求参数自动绑定到方法参数
- **Flash 参数**：支持跨请求的参数传递
- **视图管理**：支持 Freemarker 等模板引擎，提供多种视图类型
- **国际化**：支持多语言资源和本地化
- **拦截器**：支持请求拦截和处理
- **路由管理**：提供灵活的路由配置和映射
- **静态资源**：支持静态资源的处理和管理
- **CORS 支持**：支持跨域资源共享
- **缓存控制**：支持响应缓存和结果缓存
- **模块集结**：支持将多个模块的 Action、标签等整合在一起
- **异常处理**：提供统一的异常处理机制
- **配置管理**：支持灵活的配置和定制

## 设计理念

Beangle WebMVC 所提倡的惯例和用法包括：

* 框架不应该从底层扫描class文件，这样不仅很慢，开发者也不能控制哪些action不进入框架。
* 框架应提供按照约定，指明符合哪些条件的Action/Controller是Command控制器(同时可以个别剃除)，而不是逐个通过xml定义。struts的struts-config.xml很强大，但是不采用模式匹配的情况下，配置逐个action及其result很繁琐。
* 框架应能在大部分场景下，不侵入用户代码。切换库的代码不能太大。Spring的各种Annotation虽然有助于类扫描，但是这种第三方库的耦合太强了。
* 拥有一定的模块集结能力，可以不用二次配置把各个jar包中的action、tag整合在一起。struts的plugin机制很好，springmvc中针对Controller可以按照模块扫描集结，但是针对非jsp的tag library支持不够。
* 应能提供restful的支持
* Action/Contoller应能支持单例
* 应能支持参数绑定
* 应能支持flash参数闪存

## 文档组织

* [定义Action及其规则](/webmvc/usage.html)
* [WebUI标签](/webmvc/tags.html)
* [BeangleMVC内置标签](/webmvc/tags.html)
* [API 调用说明](/webmvc/api.html) 详细的API使用指南，帮助开发者快速上手Beangle WebMVC框架

