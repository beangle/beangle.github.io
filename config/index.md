# Beangle Config

Beangle Config 是一个基于 Scala 的配置管理框架，提供统一的配置加载和管理功能，支持多种配置源和配置格式。

## 核心能力

Beangle Config 提供以下核心能力：

- **统一配置接口**：提供标准化的配置 API，支持多种配置源的无缝切换
- **多配置源支持**：支持文件、类路径、环境变量等多种配置源
- **类型安全配置**：提供类型安全的配置访问，避免类型转换错误
- **嵌套配置**：支持嵌套配置结构，便于组织复杂配置
- **环境隔离**：支持多环境配置，便于开发、测试、生产环境切换
- **日志配置**：集成日志配置管理，支持动态日志级别调整
- **热重载**：支持配置热重载，无需重启应用

## 文档组织

* [API 调用说明](/config/api.html) 详细的 API 使用指南，包含所有模块的功能说明和使用示例

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Core | `org.beangle.config` | 核心配置接口和实现 |
| Web | `org.beangle.config.web` | Web 应用配置支持 |

## 快速开始

### 初始化配置

```scala
import org.beangle.config.AppConfig

AppConfig.init("classpath:application.conf")
```

### 访问配置

```scala
import org.beangle.commons.config.Enviroment

val env = Enviroment.Default
val dbUrl = env.get("database.url")
val maxConnections = env.getInt("database.maxConnections", 10)
val features = env.getList("features.enabled")
```

### 嵌套配置

```scala
val dbConfig = env.get("database")
val url = dbConfig.get("url")
val username = dbConfig.get("username")
```

## 最佳实践

- 使用环境变量覆盖配置，便于不同环境部署
- 合理组织配置结构，使用嵌套配置提高可读性
- 为配置提供默认值，避免配置缺失导致的错误
- 使用配置验证，确保配置的正确性
- 敏感信息使用加密存储，避免明文配置
