# Beangle Security API 调用说明

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Context | `org.beangle.security.context` | 安全上下文管理 |
| Session | `org.beangle.security.session` | 会话管理 |
| Realm | `org.beangle.security.realm` | 认证领域 |
| Web | `org.beangle.security.web` | Web 安全支持 |

---

## Context 模块

`org.beangle.security.context` - 提供安全上下文管理功能。

**功能说明**
提供安全上下文的获取、设置和清除功能，用于在应用中访问当前用户的安全信息。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `SecurityContext` | 安全上下文 | `SecurityContext.get` |
| `SecurityContext.set` | 设置安全上下文 | `SecurityContext.set(ctx)` |
| `SecurityContext.clear` | 清除安全上下文 | `SecurityContext.clear()` |

**常用场景示例**

### 获取安全上下文

```scala
import org.beangle.security.context.SecurityContext

val ctx = SecurityContext.get
if (ctx.isValid) {
  val session = ctx.session.get
  println(s"User: ${session.id}")
  println(s"Request: ${ctx.request}")
}
```

### 设置安全上下文

```scala
import org.beangle.security.context.SecurityContext
import org.beangle.security.session.DefaultSession

val session = new DefaultSession("user123", Map("name" -> "John"))
val ctx = new SecurityContext(Some(session), request, root = false, None)
SecurityContext.set(ctx)
```

### 清除安全上下文

```scala
SecurityContext.clear()
```

---

## Session 模块

`org.beangle.security.session` - 提供会话管理功能。

**功能说明**
提供会话的创建、更新、删除和查询功能，支持多种会话存储方式。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Session` | 会话接口 | `session.id` |
| `DefaultSession` | 默认会话实现 | `new DefaultSession(id, info)` |
| `SessionRepo` | 会话仓库接口 | `repo.create(id, info)` |
| `CacheSessionRepo` | 缓存会话仓库 | `new CacheSessionRepo(cacheManager)` |
| `HttpSessionRepo` | HTTP 会话仓库 | `new HttpSessionRepo()` |
| `DBSessionRegistry` | 数据库会话注册表 | `new DBSessionRegistry(dataSource)` |
| `DBSessionCleaner` | 数据库会话清理器 | `new DBSessionCleaner(dataSource)` |

**常用场景示例**

### 创建会话

```scala
import org.beangle.security.session.cache.CacheSessionRepo

val sessionRepo = new CacheSessionRepo(cacheManager)
val session = sessionRepo.create("user123", Map(
  "name" -> "John",
  "email" -> "john@example.com"
))
```

### 获取会话

```scala
val session = sessionRepo.get("session123")
session.foreach { s =>
  println(s"User: ${s.id}")
  println(s"Info: ${s.info}")
}
```

### 更新会话

```scala
session.foreach { s =>
  val updated = s.copy(info = s.info + ("lastAccess" -> System.currentTimeMillis()))
  sessionRepo.update(updated)
}
```

### 删除会话

```scala
sessionRepo.remove("session123")
```

### 查询用户会话

```scala
val sessions = sessionRepo.getByKey("user123")
sessions.foreach { s =>
  println(s"Session: ${s.id}")
}
```

### 使用数据库会话

```scala
import org.beangle.security.session.jdbc.DBSessionRegistry

val registry = new DBSessionRegistry(dataSource)
val session = registry.create("user123", Map("name" -> "John"))
registry.update(session)
```

### 清理过期会话

```scala
import org.beangle.security.session.jdbc.DBSessionCleaner

val cleaner = new DBSessionCleaner(dataSource)
cleaner.clean()
```

---

## Realm 模块

`org.beangle.security.realm` - 提供认证领域功能。

**功能说明**
提供多种认证方式，包括 JWT、OAuth、LTPA 等。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Jwts` | JWT 工具类 | `Jwts.builder()` |
| `JwtDigest` | JWT 摘要 | `new JwtDigest(key)` |
| `Claims` | JWT 声明 | `new Claims()` |
| `OAuthHelper` | OAuth 辅助类 | `OAuthHelper.buildUrl()` |
| `OAuthConfig` | OAuth 配置 | `new OAuthConfig()` |
| `LtpaToken` | LTPA 令牌 | `new LtpaToken()` |
| `LtpaTokenGenerator` | LTPA 令牌生成器 | `new LtpaTokenGenerator()` |

**常用场景示例**

### JWT 生成和验证

```scala
import org.beangle.security.realm.jwt.Jwts
import javax.crypto.SecretKey

val key = Jwts.SIG.HS256.key.build()

val token = Jwts.builder()
  .subject("user123")
  .claim("name", "John")
  .claim("email", "john@example.com")
  .signWith(key)
  .compact()

val claims = Jwts.parser()
  .verifyWith(key)
  .build()
  .parseSignedClaims(token)
  .getPayload()

println(s"Subject: ${claims.getSubject}")
println(s"Name: ${claims.get("name")}")
```

### OAuth 认证

```scala
import org.beangle.security.realm.oauth.{OAuthHelper, OAuthConfig}

val config = OAuthConfig(
  clientId = "client_id",
  clientSecret = "client_secret",
  redirectUri = "http://localhost:8080/callback",
  scope = "openid profile email"
)

val authUrl = OAuthHelper.buildUrl(config)
```

### LTPA 令牌生成

```scala
import org.beangle.security.realm.ltpa.{LtpaTokenGenerator, LtpaConfig}

val config = LtpaConfig(
  sharedKey = "shared_key",
  expiration = 3600
)

val generator = new LtpaTokenGenerator(config)
val token = generator.generate("user123")
```

---

## Web 模块

`org.beangle.security.web` - 提供 Web 安全支持。

**功能说明**
提供 Web 应用的安全过滤器和拦截器，支持认证和授权。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `WebSecurityManager` | Web 安全管理器 | `new WebSecurityManager()` |
| `SecurityFilter` | 安全过滤器 | `new SecurityFilter()` |
| `SecurityInterceptor` | 安全拦截器 | `new SecurityInterceptor()` |
| `AuthorizationFilter` | 授权过滤器 | `new AuthorizationFilter()` |
| `AccessDeniedHandler` | 访问拒绝处理器 | `new AccessDeniedHandler()` |
| `EntryPoint` | 认证入口点 | `new EntryPoint()` |
| `SessionIdPolicy` | 会话 ID 策略 | `new CookieSessionIdPolicy()` |
| `SessionId` | 会话 ID | `SessionId(request)` |

**常用场景示例**

### 配置安全过滤器

```scala
import org.beangle.security.web.SecurityFilter

val filter = new SecurityFilter()
filter.setSecurityManager(securityManager)
filter.setEntryPoint(entryPoint)
filter.setAccessDeniedHandler(accessDeniedHandler)
```

### 会话 ID 管理

```scala
import org.beangle.security.web.session.{SessionId, CookieSessionIdPolicy}

val policy = new CookieSessionIdPolicy()
val sessionId = SessionId(request)
val id = policy.read(request)
```

### 访问控制

```scala
import org.beangle.security.web.access.SecurityInterceptor

val interceptor = new SecurityInterceptor()
interceptor.setSecurityManager(securityManager)

if (interceptor.preHandle(request, response)) {
  // 继续处理请求
} else {
  // 访问被拒绝
}
```

---

## 最佳实践

### 会话管理

- 合理设置会话过期时间
- 使用安全的会话 ID 生成策略
- 定期清理过期会话
- 监控会话使用情况

### 认证安全

- 使用强密码策略
- 实现密码加密存储
- 支持多因素认证
- 定期更新认证令牌

### 授权控制

- 实现最小权限原则
- 使用基于角色的访问控制
- 定期审计权限分配
- 记录授权决策

### Web 安全

- 使用 HTTPS 保护通信
- 实现 CSRF 防护
- 设置安全响应头
- 防止 XSS 攻击

### 令牌管理

- 使用安全的密钥管理
- 设置合理的令牌过期时间
- 实现令牌刷新机制
- 监控令牌使用情况
