# Beangle Cron

Beangle Cron 是一个基于 Scala 的轻量级任务调度框架，提供简单易用的定时任务调度功能，基于 JDK 的 ScheduledExecutorService 实现，支持虚拟线程。

## 核心能力

Beangle Cron 提供以下核心能力：

- **轻量级调度**：基于 JDK 的 ScheduledExecutorService，不依赖 Spring 或 Quartz
- **Cron 表达式**：支持标准的 Cron 表达式语法
- **虚拟线程**：使用 JDK 21 虚拟线程执行任务，提高并发性能
- **程序式 API**：提供简洁的程序式 API，无需注解
- **任务管理**：支持任务的调度、取消和管理
- **灵活调度**：支持一次性任务、周期性任务等多种调度方式

## 文档组织

* [API 调用说明](/cron/api.html) 详细的 API 使用指南，包含所有模块的功能说明和使用示例

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Core | `org.beangle.cron` | 核心调度器和任务管理 |
| Shell | `org.beangle.cron.shell` | Shell 命令执行支持 |

## 快速开始

### 基本使用

```scala
import org.beangle.cron.{Scheduler, CronExpr}

val scheduler = new Scheduler()

scheduler.schedule("0 0 2 * * *") {
  println("每天凌晨 2 点执行")
}

scheduler.schedule(CronExpr.everyDay.at(2, 0)) {
  println("每天凌晨 2 点执行")
}
```

### 取消任务

```scala
val taskId = scheduler.schedule("0 */5 * * * *") {
  println("每 5 分钟执行一次")
}

scheduler.cancel(taskId)
```

### 关闭调度器

```scala
scheduler.shutdown()
```

## 最佳实践

- 使用虚拟线程提高任务执行效率
- 合理设置任务执行间隔，避免资源浪费
- 及时取消不再需要的任务
- 在应用关闭时正确关闭调度器
- 处理任务执行异常，避免影响其他任务
