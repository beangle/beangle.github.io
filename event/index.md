# Beangle Event

Beangle Event 是一个基于 Scala 的事件驱动框架，提供数据事件总线、消息队列和事件订阅功能，支持分布式事件处理。

## 核心能力

Beangle Event 提供以下核心能力：

- **数据事件总线**：提供统一的事件发布和订阅机制
- **消息队列**：支持基于 Redis 和 PostgreSQL 的消息队列
- **事件序列化**：支持事件的序列化和反序列化
- **分布式支持**：支持跨进程的事件传播
- **模块化订阅**：支持按模块订阅事件
- **灵活路由**：支持事件的路由和过滤

## 文档组织

* [API 调用说明](/event/api.html) 详细的 API 使用指南，包含所有模块的功能说明和使用示例

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Bus | `org.beangle.event.bus` | 数据事件总线 |
| MQ | `org.beangle.event.mq` | 消息队列实现 |

## 快速开始

### 发布事件

```scala
import org.beangle.event.bus.{DataEvent, DefaultDataEventBus}

val eventBus = new DefaultDataEventBus()

val event = DataEvent("user", "update", Map("id" -> 1, "name" -> "John"))
eventBus.publish(event)
```

### 订阅事件

```scala
import org.beangle.event.bus.DataEventSubscriber
import org.beangle.event.mq.EventSubscriber

class UserEventSubscriber extends EventSubscriber[DataEvent] {
  def onEvent(event: DataEvent): Unit = {
    println(s"收到事件: ${event.source} - ${event.operation}")
  }
}

eventBus.subscribe("user", new UserEventSubscriber())
```

## 最佳实践

- 使用事件总线解耦模块间的依赖
- 合理设计事件粒度，避免事件过于频繁
- 处理事件订阅异常，避免影响事件传播
- 使用消息队列实现异步事件处理
- 监控事件处理性能，优化事件处理逻辑
