## API 参考

### 签名请求

#### SignRequest
```scala
case class SignRequest(
  data: Array[Byte],           // 待签名数据
  certPath: String,            // 证书路径
  certPassword: String,        // 证书密码
  algorithm: String = "SHA256withRSA",  // 签名算法
  reason: Option[String] = None,         // 签名原因
  location: Option[String] = None,       // 签名位置
  contactInfo: Option[String] = None     // 联系信息
)
```

#### VerifyRequest
```scala
case class VerifyRequest(
  data: Array[Byte],           // 原始数据
  signature: Array[Byte],      // 签名数据
  cert: Certificate            // 验证证书
)
```

#### Response
```scala
case class Response(
  success: Boolean,            // 是否成功
  signData: Option[Array[Byte]], // 签名后的数据
  message: Option[String]      // 错误信息
)
```

---

### 签名服务

#### SignerFactory
```scala
object SignerFactory {
  def getSigner(caType: String): DocSigner
  def getSigner(config: SignerConfig): DocSigner
}
```

#### DocSigner
```scala
trait DocSigner {
  def sign(request: SignRequest): Response
  def verify(request: VerifyRequest): Boolean
  def signAsync(request: SignRequest): Future[Response]
}
```

---

### 电子印章

#### SealStyle
```scala
object SealStyle extends Enumeration {
  val Default, Round, Square, Oval = Value
}
```

#### Position
```scala
case class Position(
  page: Int = 1,               // 页码
  x: Float,                    // X坐标
  y: Float,                    // Y坐标
  width: Float,                // 宽度
  height: Float                // 高度
)
```

#### Seal
```scala
class Seal {
  def create(
    name: String,
    cert: Certificate,
    style: SealStyle = SealStyle.Default,
    borderColor: Color = Color.RED,
    textColor: Color = Color.RED
  ): Array[Byte]
  
  def apply(
    document: Array[Byte],
    sealData: Array[Byte],
    position: Position,
    opacity: Float = 0.8f
  ): Array[Byte]
  
  def extract(
    document: Array[Byte]
  ): List[SealInfo]
}
```

---

### BJCA 客户端

#### BjcaPdfSigner
```scala
class BjcaPdfSigner(config: BjcaConfig) extends DocSigner {
  def sign(request: SignRequest): Response
  def uploadCert(certData: Array[Byte], password: String): String
  def revokeCert(certId: String): Boolean
}
```

#### BjcaConfig
```scala
case class BjcaConfig(
  serverUrl: String,           // BJCA 服务器地址
  port: Int,                   // 端口
  appId: String,               // 应用ID
  appKey: String,              // 应用密钥
  timeout: Int = 30000         // 超时时间(毫秒)
)
```

---

### 签名算法

| 算法 | 描述 | 推荐使用 |
|------|------|----------|
| SHA1withRSA | SHA-1 哈希 + RSA 签名 | 不推荐 |
| SHA256withRSA | SHA-256 哈希 + RSA 签名 | 推荐 |
| SHA384withRSA | SHA-384 哈希 + RSA 签名 | 推荐 |
| SHA512withRSA | SHA-512 哈希 + RSA 签名 | 推荐 |
| SM2withSM3 | 国密 SM2 + SM3 | 推荐（国密） |

---

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ca.type | String | local | CA 类型：local/bjca |
| ca.cert.path | String | - | 证书路径 |
| ca.cert.password | String | - | 证书密码 |
| ca.algorithm | String | SHA256withRSA | 签名算法 |
| ca.bjca.server | String | - | BJCA 服务器地址 |
| ca.bjca.port | Int | 8080 | BJCA 端口 |
| ca.timeout | Int | 30000 | 超时时间(毫秒) |