# Beangle Cache API 调用说明

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

---

## Core 模块

`org.beangle.cache` - 提供核心缓存接口和抽象类。

**功能说明**
提供核心缓存接口和抽象类，包括 CacheManager、Cache、Broadcaster 等核心组件。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `CacheManager` | 缓存管理器接口 | `val manager = new CaffeineCacheManager(true)` |
| `Cache` | 缓存接口 | `cache.get(key)` |
| `Broadcaster` | 缓存广播接口 | `broadcaster.broadcast(eviction)` |
| `AbstractCacheManager` | 抽象缓存管理器 | `class MyCacheManager extends AbstractCacheManager` |

**常用场景示例**

```scala
import org.beangle.cache.AbstractCacheManager

class MyCacheManager(autoCreate: Boolean) extends AbstractCacheManager(autoCreate) {
  protected def newCache[K, V](name: String, keyType: Class[K], valueType: Class[V]): Cache[K, V] = {
    new CaffeineCache(name)
  }
  
  protected def findCache[K, V](name: String, keyType: Class[K], valueType: Class[V]): Cache[K, V] = {
    null
  }
}

val manager = new MyCacheManager(true)
val cache = manager.getCache[String, String]("myCache", classOf[String], classOf[String])
```

---

## Caffeine 模块

`org.beangle.cache.caffeine` - 提供 Caffeine 缓存实现。

**功能说明**
基于 Caffeine 的高性能本地缓存实现，支持自动过期、自动加载、大小限制等功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `CaffeineCacheManager` | Caffeine 缓存管理器 | `new CaffeineCacheManager(true)` |
| `CaffeineCache` | Caffeine 缓存实现 | `new CaffeineCache(name)` |

**常用场景示例**

```scala
import org.beangle.cache.caffeine.CaffeineCacheManager

val manager = new CaffeineCacheManager(autoCreate = true)
val cache = manager.getCache[String, User]("users", classOf[String], classOf[User])

cache.put("user1", User("John", 30))
val user = cache.get("user1")

cache.evict("user1")
cache.clear()
```

---

## Ehcache 模块

`org.beangle.cache.ehcache` - 提供 Ehcache 缓存实现。

**功能说明**
基于 Ehcache 的缓存实现，支持磁盘持久化、集群缓存等功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `EhCacheManager` | Ehcache 缓存管理器 | `new EhCacheManager(configPath)` |
| `EhCache` | Ehcache 缓存实现 | `new EhCache(ehcache)` |
| `EhCacheClusterManager` | Ehcache 集群管理器 | `new EhCacheClusterManager()` |
| `Listener` | 缓存监听器 | `new MyListener()` |

**常用场景示例**

```scala
import org.beangle.cache.ehcache.EhCacheManager

val manager = new EhCacheManager("ehcache.xml")
val cache = manager.getCache[String, String]("data", classOf[String], classOf[String])

cache.put("key1", "value1")
val value = cache.get("key1")

cache.remove("key1")
cache.removeAll()
```

---

## Redis 模块

`org.beangle.cache.redis` - 提供 Redis 缓存实现。

**功能说明**
基于 Redis 的分布式缓存实现，支持缓存持久化、集群模式等功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `RedisCacheManager` | Redis 缓存管理器 | `new RedisCacheManager(host, port)` |
| `RedisCache` | Redis 缓存实现 | `new RedisCache(name, client)` |
| `RedisClientFactory` | Redis 客户端工厂 | `RedisClientFactory.create(host, port)` |
| `RedisBroadcaster` | Redis 广播器 | `new RedisBroadcaster(channel)` |

**常用场景示例**

```scala
import org.beangle.cache.redis.RedisCacheManager

val manager = new RedisCacheManager("localhost", 6379)
val cache = manager.getCache[String, String]("session", classOf[String], classOf[String])

cache.put("session123", "user_data")
val sessionData = cache.get("session123")

cache.delete("session123")
cache.clear()
```

---

## Concurrent 模块

`org.beangle.cache.concurrent` - 提供 ConcurrentMap 缓存实现。

**功能说明**
基于 Java ConcurrentMap 的简单缓存实现，适合轻量级缓存需求。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ConcurrentMapCacheManager` | ConcurrentMap 缓存管理器 | `new ConcurrentMapCacheManager(true)` |
| `ConcurrentMapCache` | ConcurrentMap 缓存实现 | `new ConcurrentMapCache(name)` |

**常用场景示例**

```scala
import org.beangle.cache.concurrent.ConcurrentMapCacheManager

val manager = new ConcurrentMapCacheManager(autoCreate = true)
val cache = manager.getCache[String, String]("simple", classOf[String], classOf[String])

cache.put("key", "value")
val value = cache.get("key")
```

---

## Chain 模块

`org.beangle.cache.chain` - 提供缓存链实现。

**功能说明**
支持多级缓存链，实现缓存分层和缓存穿透保护。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ChainedManager` | 缓存链管理器 | `new ChainedManager(managers)` |
| `ChainedCache` | 缓存链实现 | `new ChainedCache(caches)` |

**常用场景示例**

```scala
import org.beangle.cache.chain.ChainedManager

val l1Cache = new CaffeineCacheManager(autoCreate = true)
val l2Cache = new RedisCacheManager("localhost", 6379)

val chainedManager = new ChainedManager(Seq(l1Cache, l2Cache))
val cache = chainedManager.getCache[String, String]("data", classOf[String], classOf[String])

cache.put("key", "value")
val value = cache.get("key")
```

---

## Broadcaster 模块

`org.beangle.cache` - 提供缓存广播接口。

**功能说明**
提供缓存变更的广播通知接口，支持分布式缓存同步。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Broadcaster` | 缓存广播接口 | `broadcaster.broadcast(eviction)` |
| `JGroupsBroadcaster` | JGroups 广播器 | `new JGroupsBroadcaster(config)` |

**常用场景示例**

```scala
import org.beangle.cache.jgroups.JGroupsBroadcaster

val broadcaster = new JGroupsBroadcaster("jgroups.xml")
broadcaster.start()

val eviction = Eviction("myCache", "key1")
broadcaster.broadcast(eviction)
```

---

## 最佳实践

### 缓存选择

- **Caffeine**：适合高性能本地缓存，支持自动过期和自动加载
- **Redis**：适合分布式缓存，支持持久化和集群
- **Ehcache**：适合需要磁盘持久化的场景，支持集群
- **ConcurrentMap**：适合简单的内存缓存，轻量级

### 缓存链使用

- 使用 L1 缓存（Caffeine）提供快速访问
- 使用 L2 缓存（Redis）提供分布式共享
- 合理设置各级缓存的过期时间

### 缓存同步

- 在分布式环境中使用广播器同步缓存
- 使用 JGroups 实现集群缓存同步
- 监听缓存变更事件，及时更新

### 性能优化

- 合理设置缓存大小限制
- 使用异步加载避免缓存雪崩
- 监控缓存命中率，优化缓存策略
- 定期清理过期缓存，避免内存泄漏
