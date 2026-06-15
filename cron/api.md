# Beangle Cron API 调用说明

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Core | `org.beangle.cron` | 核心调度器和任务管理 |
| Shell | `org.beangle.cron.shell` | Shell 命令执行支持 |

---

## Core 模块

`org.beangle.cron` - 提供核心调度器和任务管理功能。

**功能说明**
提供轻量级任务调度功能，基于 JDK 的 ScheduledExecutorService，支持虚拟线程和 Cron 表达式。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Scheduler` | 任务调度器 | `val scheduler = new Scheduler()` |
| `CronExpr` | Cron 表达式 | `CronExpr.everyDay.at(2, 0)` |
| `CronTask` | 定时任务 | `new CronTask(id, expr, runnable, executor)` |

**常用场景示例**

### 基本调度

```scala
import org.beangle.cron.{Scheduler, CronExpr}

val scheduler = new Scheduler()

// 使用 Cron 表达式
scheduler.schedule("0 0 2 * * *") {
  println("每天凌晨 2 点执行")
}

// 使用 CronExpr 构建器
scheduler.schedule(CronExpr.everyDay.at(2, 0)) {
  println("每天凌晨 2 点执行")
}

// 多时间点调度
scheduler.schedule(CronExpr.everyDay.atHours(7, 9, 11).atMinutes(20, 40)) {
  println("在 7:20, 7:40, 9:20, 9:40, 11:20, 11:40 执行")
}
```

### 使用 Runnable

```scala
val task = new Runnable {
  override def run(): Unit = {
    println("执行定时任务")
  }
}

scheduler.schedule("0 */5 * * * *", task)
```

### 任务管理

```scala
val scheduler = new Scheduler()

// 调度任务并获取任务 ID
val taskId = scheduler.schedule("0 */10 * * * *") {
  println("每 10 分钟执行一次")
}

// 取消任务
scheduler.cancel(taskId)

// 关闭调度器
scheduler.shutdown()
```

### Cron 表达式示例

```scala
// 每分钟执行
scheduler.schedule("0 * * * * *") { ... }

// 每小时执行
scheduler.schedule("0 0 * * * *") { ... }

// 每天凌晨 2 点执行
scheduler.schedule("0 0 2 * * *") { ... }

// 每周一早上 8 点执行
scheduler.schedule("0 0 8 ? * MON") { ... }

// 每月 1 号凌晨 3 点执行
scheduler.schedule("0 0 3 1 * ?") { ... }

// 每 5 分钟执行一次
scheduler.schedule("0 */5 * * * *") { ... }

// 工作日早上 9 点执行
scheduler.schedule("0 0 9 ? * MON-FRI") { ... }
```

---

## Shell 模块

`org.beangle.cron.shell` - 提供 Shell 命令执行支持。

**功能说明**
提供 Shell 命令执行功能，支持本地和远程命令执行。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ShellCmdRunner` | Shell 命令执行器 | `new ShellCmdRunner()` |
| `LocalShellRunner` | 本地 Shell 执行器 | `new LocalShellRunner()` |
| `RemoteShellRunner` | 远程 Shell 执行器 | `new RemoteShellRunner(host, port)` |

**常用场景示例**

### 本地命令执行

```scala
import org.beangle.cron.shell.LocalShellRunner

val runner = new LocalShellRunner()
val result = runner.execute("ls -la")
println(result.output)
```

### 定时执行 Shell 命令

```scala
import org.beangle.cron.{Scheduler, CronExpr}
import org.beangle.cron.shell.LocalShellRunner

val scheduler = new Scheduler()
val runner = new LocalShellRunner()

scheduler.schedule("0 0 3 * * *") {
  val result = runner.execute("/path/to/backup.sh")
  println(s"备份完成: ${result.output}")
}
```

---

## Cron 表达式语法

### 格式说明

Cron 表达式由 6 或 7 个字段组成，用空格分隔：

```
秒 分 时 日 月 周 [年]
```

### 字段说明

| 字段 | 允许值 | 允许特殊字符 |
|------|--------|-------------|
| 秒 | 0-59 | `, - * /` |
| 分 | 0-59 | `, - * /` |
| 时 | 0-23 | `, - * /` |
| 日 | 1-31 | `, - * / ? L W` |
| 月 | 1-12 或 JAN-DEC | `, - * /` |
| 周 | 1-7 或 SUN-SAT | `, - * / ? L #` |
| 年（可选） | 1970-2099 | `, - * /` |

### 特殊字符说明

| 字符 | 说明 | 示例 |
|------|------|------|
| `*` | 匹配所有值 | `* * * * * *` (每秒) |
| `?` | 不指定值（仅用于日和周） | `0 0 12 ? * *` (每天中午 12 点) |
| `-` | 指定范围 | `0 0 9-17 * * *` (每天 9 点到 17 点) |
| `,` | 指定多个值 | `0 0 9,12,18 * * *` (每天 9 点、12 点、18 点) |
| `/` | 指定间隔 | `0 */5 * * * *` (每 5 分钟) |
| `L` | 最后一天（仅用于日和周） | `0 0 0 L * *` (每月最后一天) |
| `W` | 最近工作日（仅用于日） | `0 0 0 15W * *` (每月 15 号最近的工作日) |
| `#` | 第几个星期几（仅用于周） | `0 0 0 ? * 6#3` (每月第三个星期五) |

---

## 最佳实践

### 任务设计

- 保持任务简洁，避免长时间运行
- 处理任务异常，避免影响调度器
- 使用幂等设计，支持任务重试
- 记录任务执行日志，便于问题排查

### 资源管理

- 合理设置任务执行间隔
- 使用虚拟线程提高并发性能
- 及时释放任务占用的资源
- 避免任务间的资源竞争

### 错误处理

- 捕获任务执行异常
- 提供任务重试机制
- 记录任务失败日志
- 设置任务超时时间

### 监控告警

- 监控任务执行状态
- 统计任务执行时间
- 设置任务失败告警
- 定期检查任务健康度

### 性能优化

- 避免任务并发执行
- 使用异步处理耗时操作
- 合理设置任务优先级
- 优化任务执行逻辑
