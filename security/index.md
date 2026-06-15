# Beangle Security

Beangle Security 是一个基于 Scala 的安全框架，提供认证、授权、会话管理等核心安全功能，支持多种认证方式和会话存储。

## 核心能力

Beangle Security 提供以下核心能力：

- **认证管理**：支持用户名密码、OAuth、JWT、LTPA 等多种认证方式
- **授权控制**：基于角色的访问控制和权限管理
- **会话管理**：支持 HTTP 会话、缓存会话、数据库会话等多种会话存储
- **安全上下文**：提供统一的安全上下文管理
- **Web 安全**：提供 Web 应用的安全过滤器和拦截器
- **令牌管理**：支持 JWT、LTPA 等令牌的生成和验证

## 文档组织

* [API 调用说明](/security/api.html) 详细的 API 使用指南，包含所有模块的功能说明和使用示例

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Context | `org.beangle.security.context` | 安全上下文管理 |
| Session | `org.beangle.security.session` | 会话管理 |
| Realm | `org.beangle.security.realm` | 认证领域 |
| Web | `org.beangle.security.web` | Web 安全支持 |

## 快速开始

### 使用安全上下文

```scala
import org.beangle.security.context.SecurityContext

val ctx = SecurityContext.get
if (ctx.isValid) {
  val session = ctx.session.get
  println(s"User: ${session.id}")
}
```

### 会话管理

```scala
import org.beangle.security.session.cache.CacheSessionRepo

val sessionRepo = new CacheSessionRepo(cacheManager)
val session = sessionRepo.create("user123", Map("name" -> "John"))
sessionRepo.update(session)
```

### JWT 认证

```scala
import org.beangle.security.realm.jwt.Jwts

val token = Jwts.builder()
  .setSubject("user123")
  .claim("name", "John")
  .signWith(key)
  .compact()
```

## 最佳实践

- 使用安全上下文获取当前用户信息
- 合理设置会话过期时间
- 使用 HTTPS 保护敏感数据
- 实现密码加密存储
- 定期清理过期会话
- 监控安全事件
