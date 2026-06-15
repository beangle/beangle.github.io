# Beangle Otk

Beangle Otk（Online Toolkit）是一个基于 Scala 的在线工具包，提供验证码、二维码、条形码、PDF 处理、短链接、密码加密等常用工具功能。

## 核心能力

Beangle Otk 提供以下核心能力：

- **验证码生成**：支持图形验证码生成和验证
- **二维码生成**：支持二维码的生成和解析
- **条形码生成**：支持多种条形码格式的生成
- **PDF 处理**：支持 PDF 的生成和处理
- **短链接服务**：支持短链接的生成和解析
- **密码加密**：支持密码的加密和验证
- **拼音转换**：支持中文到拼音的转换
- **时间服务**：提供标准时间服务

## 文档组织

* [API 调用说明](/otk/api.html) 详细的 API 使用指南，包含所有模块的功能说明和使用示例

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

## 快速开始

### 生成验证码

```scala
import org.beangle.otk.captcha.core.service.CaptchaService

val service = new CaptchaService()
val captcha = service.generate()
```

### 生成二维码

```scala
import org.beangle.otk.code.web.action.QrWS

val qrCode = QrWS.generate("https://example.com")
```

### 生成短链接

```scala
import org.beangle.otk.net.service.ShortURLGenerator

val generator = new ShortURLGenerator()
val shortUrl = generator.generate("https://example.com/very/long/url")
```

## 最佳实践

- 合理设置验证码过期时间
- 使用安全的密码加密算法
- 优化二维码和条形码的生成性能
- 处理短链接的重复生成
- 验证用户输入的数据
