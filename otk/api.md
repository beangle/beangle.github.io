# Beangle Otk API 调用说明

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Captcha | `org.beangle.otk.captcha` | 验证码 |
| Code | `org.beangle.otk.code` | 二维码和条形码 |
| Doc | `org.beangle.otk.doc` | 文档处理 |
| Net | `org.beangle.otk.net` | 网络工具 |
| Security | `org.beangle.otk.security` | 安全工具 |
| Lang | `org.beangle.otk.lang` | 语言工具 |
| Sys | `org.beangle.otk.sys` | 系统工具 |
| Sns | `org.beangle.otk.sns` | 社交工具 |

---

## Captcha 模块

`org.beangle.otk.captcha` - 提供验证码生成功能。

**功能说明**
提供图形验证码的生成和验证功能，支持自定义样式和验证逻辑。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `CaptchaService` | 验证码服务 | `new CaptchaService()` |
| `Captcha` | 验证码 | `new Captcha()` |
| `CaptchaEngine` | 验证码引擎 | `new GmailEngine()` |
| `CaptchaStore` | 验证码存储 | `new MyCaptchaStore()` |

**常用场景示例**

### 生成验证码

```scala
import org.beangle.otk.captcha.core.service.CaptchaService

val service = new CaptchaService()
val captcha = service.generate()

val image = captcha.image
val code = captcha.code
```

### 验证验证码

```scala
val isValid = service.validate(sessionId, userInput)
if (isValid) {
  println("验证码正确")
} else {
  println("验证码错误")
}
```

### 自定义验证码引擎

```scala
import org.beangle.otk.captcha.core.image.GmailEngine

val engine = new GmailEngine()
engine.width = 120
engine.height = 40
engine.wordLength = 4

val service = new CaptchaService()
service.engine = engine
```

---

## Code 模块

`org.beangle.otk.code` - 提供二维码和条形码生成功能。

**功能说明**
提供二维码和条形码的生成功能，支持多种格式和自定义样式。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `QrWS` | 二维码 Web 服务 | `QrWS.generate(text)` |
| `BarWS` | 条形码 Web 服务 | `BarWS.generate(text)` |

**常用场景示例**

### 生成二维码

```scala
import org.beangle.otk.code.web.action.QrWS

val qrCode = QrWS.generate("https://example.com")
```

### 生成条形码

```scala
import org.beangle.otk.code.web.action.BarWS

val barCode = BarWS.generate("123456789")
```

---

## Doc 模块

`org.beangle.otk.doc` - 提供文档处理功能。

**功能说明**
提供 PDF、Excel 等文档的处理功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `PdfWS` | PDF Web 服务 | `PdfWS.generate(data)` |
| `ExcelWS` | Excel Web 服务 | `ExcelWS.generate(data)` |

**常用场景示例**

### 生成 PDF

```scala
import org.beangle.otk.doc.web.action.PdfWS

val pdf = PdfWS.generate(data)
```

### 生成 Excel

```scala
import org.beangle.otk.doc.web.action.ExcelWS

val excel = ExcelWS.generate(data)
```

---

## Net 模块

`org.beangle.otk.net` - 提供网络工具功能。

**功能说明**
提供短链接生成等网络工具功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ShortURLGenerator` | 短链接生成器 | `new ShortURLGenerator()` |
| `UrlWS` | URL Web 服务 | `UrlWS.shorten(url)` |

**常用场景示例**

### 生成短链接

```scala
import org.beangle.otk.net.service.ShortURLGenerator

val generator = new ShortURLGenerator()
val shortUrl = generator.generate("https://example.com/very/long/url")
```

### 解析短链接

```scala
val originalUrl = generator.resolve(shortUrl)
```

---

## Security 模块

`org.beangle.otk.security` - 提供安全工具功能。

**功能说明**
提供密码加密、验证等安全工具功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `PasswordService` | 密码服务 | `new PasswordService()` |
| `PasswordWS` | 密码 Web 服务 | `PasswordWS.encrypt(password)` |

**常用场景示例**

### 密码加密

```scala
import org.beangle.otk.security.service.PasswordService

val service = new PasswordService()
val encrypted = service.encrypt("password123")
```

### 密码验证

```scala
val isValid = service.verify("password123", encrypted)
```

---

## Lang 模块

`org.beangle.otk.lang` - 提供语言工具功能。

**功能说明**
提供中文拼音转换等语言工具功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `EnNameChecker` | 英文名检查器 | `new EnNameChecker()` |
| `EnWS` | 英文 Web 服务 | `EnWS.check(name)` |

**常用场景示例**

### 检查英文名

```scala
import org.beangle.otk.lang.service.EnNameChecker

val checker = new EnNameChecker()
val isValid = checker.check("John")
```

---

## Sys 模块

`org.beangle.otk.sys` - 提供系统工具功能。

**功能说明**
提供时间服务等系统工具功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `TimeWS` | 时间 Web 服务 | `TimeWS.now()` |

**常用场景示例**

### 获取当前时间

```scala
import org.beangle.otk.sys.web.action.TimeWS

val time = TimeWS.now()
```

---

## Sns 模块

`org.beangle.otk.sns` - 提供社交工具功能。

**功能说明**
提供社交网络相关的工具功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `PersonWS` | 人员 Web 服务 | `PersonWS.info(id)` |

**常用场景示例**

### 获取人员信息

```scala
import org.beangle.otk.sns.web.action.PersonWS

val info = PersonWS.info("user123")
```

---

## 最佳实践

### 验证码使用

- 合理设置验证码过期时间
- 使用复杂的验证码样式
- 验证后及时清除验证码
- 记录验证失败次数

### 二维码使用

- 选择合适的二维码大小
- 设置容错级别
- 添加 Logo 时保持可读性
- 测试二维码的可扫描性

### 短链接使用

- 实现短链接的持久化存储
- 处理短链接的重复生成
- 提供短链接的统计分析
- 实现短链接的过期机制

### 密码安全

- 使用强加密算法
- 实现密码强度检查
- 防止密码暴力破解
- 定期提醒用户修改密码
