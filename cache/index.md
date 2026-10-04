# Beangle Cache

Beangle Cache 是一个基于 Scala 的缓存管理框架，提供统一的缓存接口和多种缓存实现，支持本地缓存、分布式缓存和缓存集群。

## 核心能力

Beangle Cache 提供以下核心能力：

- **统一缓存接口**：提供标准化的缓存 API，支持多种缓存实现的无缝切换
- **多种缓存实现**：支持 Caffeine、Ehcache、Redis、ConcurrentMap 等多种缓存后端
- **缓存管理器**：提供缓存管理器接口，支持缓存的创建、获取和管理
- **缓存链**：支持多级缓存链，实现缓存分层和缓存穿透保护
- **缓存广播**：支持缓存变更的广播通知，实现分布式缓存同步
- **集群支持**：支持 Ehcache 集群和 JGroups 集群，实现分布式缓存
- **线程安全**：提供读写锁保护，确保缓存的线程安全访问

## 文档组织

* [API 调用说明](/cache/api.html) 详细的 API 使用指南，包含所有模块的功能说明和使用示例

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Core | `org.beangle.cache` | 核心缓存接口和抽象类 |
| Caffeine | `org.beangle.cache.caffeine` | Caffeine 缓存实现 |
| Ehcache | `org.beangle.cache.ehcache` | Ehcache 缓存实现 |
| Redis | `org.beangle.cache.redis` | Redis 缓存实现 |
| Concurrent | `org.beangle.cache.concurrent` | ConcurrentMap 缓存实现 |
| Chain | `org.beangle.cache.chain` | 缓存链实现 |
| Broadcaster | `org.beangle.cache` | 缓存广播接口 |
| JGroups | `org.beangle.cache.jgroups` | JGroups 集群广播实现 |

## 快速开始

### 使用 Caffeine 缓存

```scala
import org.beangle.cache.caffeine.CaffeineCacheManager

val cacheManager = new CaffeineCacheManager(autoCreate = true)
val cache = cacheManager.getCache[String, User]("users", classOf[String], classOf[User])

cache.put("user1", User("John", 30))
val user = cache.get("user1")
```

### 使用 Redis 缓存

```scala
import org.beangle.cache.redis.RedisCacheManager

val cacheManager = new RedisCacheManager("localhost", 6379)
val cache = cacheManager.getCache[String, String]("session", classOf[String], classOf[String])

cache.put("session123", "user_data")
val sessionData = cache.get("session123")
```

### 使用缓存链

```scala
import org.beangle.cache.chain.ChainedManager

val l1Cache = new CaffeineCacheManager(autoCreate = true)
val l2Cache = new RedisCacheManager("localhost", 6379)

val chainedManager = new ChainedManager(Seq(l1Cache, l2Cache))
val cache = chainedManager.getCache[String, String]("data", classOf[String], classOf[String])
```

## 最佳实践

- 根据业务场景选择合适的缓存实现
- 使用缓存链实现多级缓存，提高缓存命中率
- 合理设置缓存过期时间，避免数据过期
- 在分布式环境中使用缓存广播，保持缓存一致性
- 监控缓存命中率，优化缓存策略
