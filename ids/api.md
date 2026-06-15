## API 参考

### 服务接口

#### CasService
```scala
trait CasService {
  def login(username: String, password: String): Result
  def validate(ticket: String, service: String): Result
  def logout(tgt: String): Unit
  def renew(tgt: String): String
}
```

#### Result 模型
```scala
case class Result(
  success: Boolean,
  user: Option[User],
  ticket: Option[String],
  message: Option[String]
)
```

---

### Ticket 管理

#### TicketRegistry
```scala
trait TicketRegistry {
  def get(ticketId: String): Option[Ticket]
  def add(ticket: Ticket): Unit
  def remove(ticketId: String): Unit
  def update(ticket: Ticket): Unit
}
```

#### Ticket 模型
```scala
class Ticket {
  var id: String
  var principal: String
  var service: String
  var createdAt: Long
  var expiresAt: Long
  var consumed: Boolean
}
```

---

### 凭证验证

#### CredentialChecker
```scala
trait CredentialChecker {
  def check(username: String, password: String): Boolean
  def supports(credentialType: String): Boolean
}
```

#### DBLdapCredentialChecker
```scala
class DBLdapCredentialChecker extends CredentialChecker {
  def check(username: String, password: String): Boolean
}
```

---

### ID 生成器

#### IdGenerator
```scala
trait IdGenerator {
  def generate(): String
}
```

#### ServiceTicketIdGenerator
```scala
trait ServiceTicketIdGenerator extends IdGenerator {
  def generate(service: String): String
}
```

---

### 登录重试服务

#### LoginRetryService
```scala
trait LoginRetryService {
  def recordFailure(username: String, ip: String): Unit
  def isBlocked(username: String, ip: String): Boolean
  def reset(username: String): Unit
}
```

---

### CAS 协议端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/login` | GET/POST | 登录页面和登录处理 |
| `/logout` | GET | 登出 |
| `/validate` | GET | CAS 1.0 验证 |
| `/serviceValidate` | GET | CAS 2.0/3.0 验证 |
| `/proxyValidate` | GET | 代理验证 |
| `/proxy` | GET | 获取代理 Ticket |
| `/p3/serviceValidate` | GET | CAS 3.0 扩展验证 |

---

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `cas.ticket.tgt.timeout` | Int | 7200 | TGT 超时时间（秒） |
| `cas.ticket.st.timeout` | Int | 60 | ST 超时时间（秒） |
| `cas.login.maxRetries` | Int | 5 | 最大登录重试次数 |
| `cas.login.lockDuration` | Int | 300 | 登录锁定时长（秒） |
| `cas.cache.enabled` | Boolean | true | 是否启用缓存 |