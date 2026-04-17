# Beangle Web

Beangle Web 是一个基于 Scala 的 Web 开发工具库，提供 Servlet 容器集成、HTTP 处理、静态资源管理等核心功能，为 Web 应用开发提供基础支持。

## 核心能力

Beangle Web 提供以下核心能力：

- **Servlet 容器集成**：提供 Servlet 容器的初始化、上下文管理和过滤器链，简化 Web 应用的启动和配置
- **HTTP 处理**：支持内容协商、用户代理识别、请求处理等，提供全面的 HTTP 协议支持
- **静态资源管理**：提供静态资源的处理、缓存和路径解析，优化静态资源的加载性能
- **安全机制**：支持请求转换和安全处理，增强 Web 应用的安全性
- **SSE 支持**：提供服务器发送事件（Server-Sent Events）功能，支持服务器向客户端推送数据
- **网络 IO**：提供网络传输工具，支持文件下载和范围请求
- **文件上传**：支持 multipart/form-data 请求，处理文件上传功能
- **URL 构建**：提供 URL 构建和渲染功能，简化 URL 的生成和管理
- **工具类**：包含 Cookie、请求处理、重定向等常用 Web 工具，提高开发效率

## 文档组织

* [API 调用说明](/web/api.html) 详细的 API 使用指南，包含所有模块的功能说明和使用示例

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
