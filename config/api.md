# Beangle Config API 调用说明

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Core | `org.beangle.config` | 核心配置接口和实现 |
| Web | `org.beangle.config.web` | Web 应用配置支持 |

---

## Core 模块

`org.beangle.config` - 提供核心配置接口和实现。

**功能说明**
提供核心配置接口和实现，包括配置初始化、配置访问、环境管理等功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `AppConfig` | 应用配置初始化 | `AppConfig.init("classpath:app.conf")` |
| `AppEnviroment` | 应用环境实现 | `AppEnviroment.build(location)` |
| `TypesafeConfig` | Typesafe 配置支持 | `new TypesafeConfig(config)` |

**常用场景示例**

```scala
import org.beangle.config.AppConfig

AppConfig.init("classpath:application.conf")
```

### 访问配置

```scala
import org.beangle.commons.config.Enviroment

val env = Enviroment.Default

val dbUrl = env.get("database.url")
val dbUrlOrDefault = env.get("database.url", "jdbc:h2:mem:test")

val maxConnections = env.getInt("database.maxConnections", 10)
val timeout = env.getLong("database.timeout", 30000L)

val enabled = env.getBoolean("features.enabled", false)
val features = env.getList("features.enabled")

val nestedConfig = env.get("database")
val url = nestedConfig.get("url")
val username = nestedConfig.get("username")
```

### 环境变量覆盖

```scala
val env = Enviroment.Default
val port = env.get("server.port", "8080")

// 可以通过环境变量覆盖
// export SERVER_PORT=9090
```

---

## Web 模块

`org.beangle.config.web` - 提供 Web 应用配置支持。

**功能说明**
提供 Web 应用的配置初始化支持，包括 Servlet 容器集成和配置加载。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ConfigInitializer` | 配置初始化器 | `new ConfigInitializer()` |

**常用场景示例**

```scala
import org.beangle.config.web.ConfigInitializer

class WebAppInitializer extends ConfigInitializer {
  override def onStartup(servletContext: ServletContext): Unit = {
    AppConfig.init("classpath:web.conf")
    super.onStartup(servletContext)
  }
}
```

---

## 配置格式

### HOCON 格式

```hocon
database {
  url = "jdbc:postgresql://localhost:5432/mydb"
  username = "user"
  password = "password"
  maxConnections = 10
  timeout = 30s
}

server {
  host = "0.0.0.0"
  port = 8080
  ssl {
    enabled = false
    keyStore = "/path/to/keystore"
  }
}

features {
  enabled = ["feature1", "feature2", "feature3"]
}
```

### 环境特定配置

```hocon
include "base.conf"

database {
  url = "jdbc:postgresql://prod-db:5432/mydb"
  maxConnections = 50
}

logging {
  level = "WARN"
}
```

### 配置引用

```hocon
base {
  timeout = 30s
  retry = 3
}

api {
  timeout = ${base.timeout}
  retry = ${base.retry}
  url = "https://api.example.com"
}
```

---

## 最佳实践

### 配置组织

- 使用嵌套结构组织相关配置
- 为不同环境创建独立的配置文件
- 使用 include 复用通用配置
- 提供合理的默认值

### 配置管理

- 将配置文件放在类路径根目录
- 使用环境变量覆盖敏感信息
- 对敏感配置进行加密
- 定期备份配置文件

### 配置验证

- 在应用启动时验证配置
- 提供配置错误提示
- 记录配置加载日志
- 监控配置变更

### 性能优化

- 缓存配置值，避免重复读取
- 使用懒加载初始化配置
- 避免频繁的配置查询
- 合理设置配置缓存时间
