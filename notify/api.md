# Beangle Notify API 调用说明

Beangle Notify 是一个基于 Scala 的通知框架，提供了邮件、短信等多种通知方式。本文档介绍了 Notify 的核心 API，帮助开发者快速上手和使用。

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| 核心接口 | `org.beangle.notify` | 提供通知的核心接口和基础类 |
| 邮件通知 | `org.beangle.notify.mail` | 提供邮件发送功能 |
| 短信通知 | `org.beangle.notify.sms` | 提供短信发送功能 |
| 通知服务 | `org.beangle.notify.service` | 提供通知服务和消息队列 |

## 1. 核心接口 (`org.beangle.notify`)

**功能说明**
提供通知的核心接口和基础类，定义了通知系统的基本架构。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Message` | 消息接口 | `val message = new SimpleMessage("标题", "内容")` |
| `Notifier` | 通知器接口 | `val notifier = new DefaultMailNotifier(sender)` |
| `MessageQueue` | 消息队列 | `val queue = new DefaultMessageQueue` |
| `AbstractMessage` | 消息抽象类 | `class MyMessage extends AbstractMessage` |
| `SimpleMessage` | 简单消息实现 | `val message = new SimpleMessage("标题", "内容")` |
| `SendingObserver` | 发送观察者 | `val observer = new SendingObserver { ... }` |
| `NotifyException` | 通知异常 | `throw new NotifyException("发送失败")` |
| `NotifyLogger` | 通知日志 | `NotifyLogger.info("发送成功")` |

**常用场景示例**

```scala
// 创建简单消息
val message = new SimpleMessage("通知标题", "通知内容")

// 创建自定义消息
class OrderMessage(val orderId: Long, title: String, content: String) extends AbstractMessage(title, content)

// 使用消息队列
val queue = new DefaultMessageQueue
queue.offer(message)

// 处理队列中的消息
while (!queue.isEmpty) {
  val msg = queue.poll()
  notifier.send(msg)
}
```

## 2. 邮件通知 (`org.beangle.notify.mail`)

**功能说明**
提供邮件发送功能，支持文本和 HTML 邮件，支持附件。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `MailMessage` | 邮件消息 | `val mail = new MailMessage("from@example.com", "to@example.com", "主题", "内容")` |
| `MailSender` | 邮件发送器 | `val sender = new JavaMailSender(props)` |
| `MailNotifier` | 邮件通知器 | `val notifier = new DefaultMailNotifier(sender)` |
| `MimeUtils` | MIME 工具 | `val mimeMessage = MimeUtils.createMimeMessage(session, mail)` |
| `JavaMailSender` | JavaMail 实现 | `val sender = new JavaMailSender(props)` |

**常用场景示例**

```scala
// 配置邮件发送器
val props = new Properties
props.put("mail.smtp.host", "smtp.example.com")
props.put("mail.smtp.port", "25")
props.put("mail.smtp.auth", "true")

val sender = new JavaMailSender(props, "username", "password")

// 创建邮件消息
val mail = new MailMessage(
  "sender@example.com",
  "recipient@example.com",
  "测试邮件",
  "这是一封测试邮件"
)

// 添加抄送和密送
mail.addCc("cc@example.com")
mail.addBcc("bcc@example.com")

// 添加附件
mail.addAttachment("file.txt", new File("/path/to/file.txt"))

// 发送邮件
val notifier = new DefaultMailNotifier(sender)
notifier.send(mail)

// 发送 HTML 邮件
val htmlMail = new MailMessage(
  "sender@example.com",
  "recipient@example.com",
  "HTML 测试邮件",
  "<h1>Hello</h1><p>这是一封 HTML 邮件</p>"
)
htmlMail.isHtml = true
notifier.send(htmlMail)
```

## 3. 短信通知 (`org.beangle.notify.sms`)

**功能说明**
提供短信发送功能，支持多种短信服务商，提供验证码服务。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `SmsSender` | 短信发送器 | `val sender = new LixinSmsSender(url, account, password)` |
| `Receiver` | 短信接收者 | `val receiver = new Receiver("13800138000")` |
| `SmsCodeService` | 验证码服务 | `val codeService = new DefaultSmsCodeService(sender)` |
| `SmsSenderFactory` | 短信发送器工厂 | `val sender = SmsSenderFactory.create("lixin", config)` |
| `AbstractSmsSender` | 短信发送器抽象类 | `class MySmsSender extends AbstractSmsSender` |

**常用场景示例**

```scala
// 创建短信发送器（以Lixin为例）
val sender = new LixinSmsSender(
  "http://sms.example.com/send",
  "account",
  "password"
)

// 创建接收者
val receiver = new Receiver("13800138000")

// 发送短信
val result = sender.send(receiver, "您的验证码是：123456")
println(s"发送结果：${result}")

// 使用验证码服务
val codeService = new DefaultSmsCodeService(sender)

// 发送验证码
val code = codeService.sendCode("13800138000", "注册验证")
println(s"发送的验证码：${code}")

// 验证验证码
val valid = codeService.validate("13800138000", "123456")
println(s"验证码是否有效：${valid}")

// 使用发送器工厂
val config = Map(
  "url" -> "http://sms.example.com/send",
  "account" -> "account",
  "password" -> "password"
)
val factorySender = SmsSenderFactory.create("lixin", config)
```

## 4. 通知服务 (`org.beangle.notify.service`)

**功能说明**
提供通知服务和消息队列，支持异步发送和批量处理。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `NotifierService` | 通知服务 | `val service = new DefaultNotifierService(queue, task)` |
| `NotificationTask` | 通知任务 | `val task = new DefaultNotificationTask(notifiers)` |
| `DefaultMessageQueue` | 消息队列实现 | `val queue = new DefaultMessageQueue` |

**常用场景示例**

```scala
// 创建消息队列
val queue = new DefaultMessageQueue

// 创建邮件通知器
val mailSender = new JavaMailSender(props, "username", "password")
val mailNotifier = new DefaultMailNotifier(mailSender)

// 创建短信通知器
val smsSender = new LixinSmsSender(url, account, password)
val smsNotifier = new SmsNotifier(smsSender)

// 创建通知任务
val task = new DefaultNotificationTask(Map(
  "mail" -> mailNotifier,
  "sms" -> smsNotifier
))

// 创建通知服务
val service = new DefaultNotifierService(queue, task)

// 启动通知服务
service.start()

// 发送邮件通知
val mail = new MailMessage("from@example.com", "to@example.com", "主题", "内容")
service.notify("mail", mail)

// 发送短信通知
val sms = new SmsMessage("13800138000", "短信内容")
service.notify("sms", sms)

// 停止通知服务
service.stop()
```

## 5. 短信服务商实现 (`org.beangle.notify.sms.vendor`)

**功能说明**
提供多种短信服务商的实现，包括Lixin、B2M、ECUPL 等。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `LixinSmsSender` | Lixin短信发送器 | `val sender = new LixinSmsSender(url, account, password)` |
| `B2mSmsSender` | B2M短信发送器 | `val sender = new B2mSmsSender(url, account, password)` |
| `EcuplSmsSender` | ECUPL短信发送器 | `val sender = new EcuplSmsSender(url, account, password)` |

**常用场景示例**

```scala
// 使用Lixin短信服务商
val lixinSender = new LixinSmsSender(
  "http://sms.lixin.com/send",
  "your_account",
  "your_password"
)
val lixinResult = lixinSender.send(new Receiver("13800138000"), "测试短信")

// 使用B2M短信服务商
val b2mSender = new B2mSmsSender(
  "http://sms.b2m.com/send",
  "your_account",
  "your_password"
)
val b2mResult = b2mSender.send(new Receiver("13800138000"), "测试短信")

// 使用ECUPL短信服务商
val ecuplSender = new EcuplSmsSender(
  "http://sms.ecupl.edu.cn/send",
  "your_account",
  "your_password"
)
val ecuplResult = ecuplSender.send(new Receiver("13800138000"), "测试短信")
```

## 最佳实践

1. **使用通知服务**：优先使用 `NotifierService` 进行通知，它提供了统一的接口和异步处理
2. **配置管理**：将邮件和短信的配置信息放在配置文件中，便于管理和修改
3. **异常处理**：捕获并处理 `NotifyException`，确保通知失败不会影响主业务流程
4. **消息队列**：对于批量通知，使用消息队列进行异步处理，提高系统性能
5. **验证码安全**：使用 `SmsCodeService` 生成和验证验证码，确保验证码的安全性
6. **服务商选择**：根据实际需求选择合适的短信服务商，考虑稳定性、价格等因素
7. **日志记录**：使用 `NotifyLogger` 记录通知的发送状态，便于问题排查
8. **测试**：在正式环境之前，进行充分的测试，确保通知功能正常
9. **监控**：对通知服务进行监控，及时发现和处理发送失败的情况
10. **可扩展性**：设计时考虑未来可能的通知方式扩展，保持接口的一致性