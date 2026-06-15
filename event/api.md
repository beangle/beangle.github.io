# Beangle Event API 调用说明

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Bus | `org.beangle.event.bus` | 数据事件总线 |
| MQ | `org.beangle.event.mq` | 消息队列实现 |

---

## Bus 模块

`org.beangle.event.bus` - 提供数据事件总线功能。

**功能说明**
提供数据事件总线，支持事件的发布、订阅和路由。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `DataEventBus` | 数据事件总线接口 | `val bus = new DefaultDataEventBus()` |
| `DataEvent` | 数据事件 | `DataEvent("user", "update", data)` |
| `EventSubscriber` | 事件订阅者接口 | `class MySubscriber extends EventSubscriber[DataEvent]` |
| `DataEventSubscriber` | 数据事件订阅者 | `class MySubscriber extends DataEventSubscriber` |
| `DataEventSerializer` | 事件序列化器 | `new DataEventSerializer()` |

**常用场景示例**

### 发布事件

```scala
import org.beangle.event.bus.{DataEvent, DefaultDataEventBus}

val eventBus = new DefaultDataEventBus()

val event = DataEvent(
  source = "user",
  operation = "update",
  data = Map("id" -> 1, "name" -> "John"),
  comment = Some("用户信息更新")
)

eventBus.publish(event)
```

### 批量发布事件

```scala
val events = Seq(
  DataEvent("user", "create", Map("id" -> 1, "name" -> "Alice")),
  DataEvent("user", "create", Map("id" -> 2, "name" -> "Bob")),
  DataEvent("user", "create", Map("id" -> 3, "name" -> "Charlie"))
)

eventBus.publish(events)
```

### 发布更新事件

```scala
eventBus.publishUpdate(
  clazz = classOf[User],
  filters = Map("id" -> "1"),
  comment = Some("用户状态更新")
)
```

### 订阅事件

```scala
import org.beangle.event.mq.EventSubscriber

class UserEventSubscriber extends EventSubscriber[DataEvent] {
  def onEvent(event: DataEvent): Unit = {
    println(s"收到事件: ${event.source} - ${event.operation}")
    println(s"事件数据: ${event.data}")
  }
}

eventBus.subscribe("user", new UserEventSubscriber())
```

---

## MQ 模块

`org.beangle.event.mq` - 提供消息队列实现。

**功能说明**
提供基于 Redis 和 PostgreSQL 的消息队列实现，支持分布式事件处理。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ChannelQueue` | 消息队列接口 | `val queue = new RedisChannelQueue(channel)` |
| `EventSubscriber` | 事件订阅者接口 | `class MySubscriber extends EventSubscriber[T]` |
| `EventSerializer` | 事件序列化器 | `new EventSerializer()` |
| `RedisChannelQueue` | Redis 消息队列 | `new RedisChannelQueue(redis, channel)` |
| `PostgresChannelQueue` | PostgreSQL 消息队列 | `new PostgresChannelQueue(dataSource, channel)` |
| `NullChannelQueue` | 空消息队列（测试用） | `new NullChannelQueue()` |
| `NullEventSubscriber` | 空事件订阅者（测试用） | `new NullEventSubscriber()` |

**常用场景示例**

### Redis 消息队列

```scala
import org.beangle.event.mq.impl.RedisChannelQueue
import redis.clients.jedis.Jedis

val jedis = new Jedis("localhost", 6379)
val queue = new RedisChannelQueue(jedis, "events")

queue.publish(DataEvent("user", "update", Map("id" -> 1)))
```

### PostgreSQL 消息队列

```scala
import org.beangle.event.mq.impl.PostgresChannelQueue
import javax.sql.DataSource

val queue = new PostgresChannelQueue(dataSource, "events")

queue.publish(DataEvent("user", "update", Map("id" -> 1)))
```

### 订阅消息队列

```scala
import org.beangle.event.mq.EventSubscriber

class MySubscriber extends EventSubscriber[DataEvent] {
  def onEvent(event: DataEvent): Unit = {
    println(s"处理事件: ${event.source}")
  }
}

queue.subscribe(new MySubscriber())
```

---

## 事件类型

### DataEvent

```scala
case class DataEvent(
  source: String,        // 事件源
  operation: String,     // 操作类型（create, update, delete）
  data: Map[String, Any], // 事件数据
  comment: Option[String] = None // 事件注释
)
```

### 事件操作类型

- `create`：创建操作
- `update`：更新操作
- `delete`：删除操作
- `query`：查询操作
- `custom`：自定义操作

---

## 最佳实践

### 事件设计

- 使用有意义的事件名称
- 保持事件数据简洁
- 包含必要的上下文信息
- 使用标准化的操作类型

### 事件订阅

- 按模块订阅事件
- 处理订阅异常
- 避免长时间阻塞
- 使用异步处理

### 消息队列

- 根据场景选择合适的消息队列
- Redis：高性能，适合简单场景
- PostgreSQL：可靠性强，适合复杂场景
- 合理设置队列大小

### 错误处理

- 捕获事件处理异常
- 提供事件重试机制
- 记录事件处理日志
- 监控事件处理状态

### 性能优化

- 批量发布事件
- 使用异步处理
- 避免事件循环
- 优化序列化性能
