## Beangle CA

Beangle CA（Certificate Authority）是一个数字证书签名组件，提供文档签名、时间戳服务和证书管理功能。

### 核心功能

| 模块 | 描述 |
|------|------|
| **DocSigner** | 文档签名服务，支持 PDF 等文档格式 |
| **Seal** | 电子印章生成和管理 |
| **SignerFactory** | 签名器工厂，支持多种签名方式 |
| **BJCA Integration** | 集成北京 CA 等第三方 CA 服务 |

### 支持的签名类型

- **PDF 文档签名**：对 PDF 文件进行数字签名
- **时间戳签名**：添加可信时间戳
- **电子印章**：生成和应用电子印章
- **批量签名**：支持批量文档签名

### 架构特点

- **多 CA 支持**：支持多种 CA 服务提供商
- **灵活配置**：支持多种签名算法和证书格式
- **高性能**：支持异步签名和批量处理
- **安全可靠**：符合国家密码管理要求

### 核心组件

#### SignRequest
```scala
case class SignRequest(
  data: Array[Byte],
  certPath: String,
  certPassword: String,
  algorithm: String = "SHA256withRSA"
)
```

#### Response
```scala
case class Response(
  success: Boolean,
  signData: Option[Array[Byte]],
  message: Option[String]
)
```

#### DocSigner
```scala
trait DocSigner {
  def sign(request: SignRequest): Response
  def verify(data: Array[Byte], signature: Array[Byte]): Boolean
}
```

### 电子印章

#### Seal 类
```scala
class Seal {
  def create(
    name: String,
    cert: Certificate,
    style: SealStyle = SealStyle.Default
  ): Array[Byte]
  
  def apply(
    document: Array[Byte],
    sealData: Array[Byte],
    position: Position
  ): Array[Byte]
}
```

### BJCA 集成

支持与北京 CA 的集成：

| 功能 | 描述 |
|------|------|
| **证书申请** | 在线申请数字证书 |
| **证书更新** | 证书到期更新 |
| **证书吊销** | 吊销证书 |
| **文档签名** | 通过 BJCA 进行远程签名 |

### 依赖关系

- **Commons**：核心工具库
- **Doc**：文档处理支持（PDF 处理）

### 典型使用场景

1. **合同签署**：对电子合同进行数字签名
2. **公文盖章**：政府机关电子公文盖章
3. **文档认证**：对重要文档进行时间戳认证
4. **批量处理**：批量签署大量文档

### 签名流程

```
1. 准备待签名文档
       ↓
2. 构建签名请求（证书、密码、算法）
       ↓
3. 调用签名服务
       ↓
4. 获取签名结果
       ↓
5. 验证签名有效性
```