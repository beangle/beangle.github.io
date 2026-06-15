## API 参考

### 用户管理 API

#### UserService
```scala
trait UserService {
  def get(id: Long): Option[User]
  def findByUsername(username: String): Option[User]
  def findByEmail(email: String): Option[User]
  def save(user: User): User
  def update(user: User): User
  def delete(id: Long): Unit
}
```

#### User 模型
```scala
class User {
  var id: Long
  var username: String
  var password: String
  var name: String
  var email: String
  var enabled: Boolean
  var profile: Profile
}
```

---

### 安全管理 API

#### MenuService
```scala
trait MenuService {
  def get(id: Long): Option[Menu]
  def findByProfile(profileId: Long): List[Menu]
  def findByUser(userId: Long): List[Menu]
}
```

#### SessionInfoService
```scala
trait SessionInfoService {
  def get(sessionId: String): Option[SessionInfo]
  def create(user: User): SessionInfo
  def invalidate(sessionId: String): Unit
  def findActiveSessions(userId: Long): List[SessionInfo]
}
```

---

### 配置管理 API

#### DomainService
```scala
trait DomainService {
  def get(id: Long): Option[Domain]
  def findAll(): List[Domain]
  def save(domain: Domain): Domain
}
```

#### AppService
```scala
trait AppService {
  def get(id: Long): Option[App]
  def findByDomain(domainId: Long): List[App]
  def register(app: App): App
}
```

---

### OA 模块 API

#### DocService
```scala
trait DocService {
  def get(id: Long): Option[Doc]
  def findByCategory(categoryId: Long): List[Doc]
  def save(doc: Doc): Doc
  def delete(id: Long): Unit
}
```

#### FlowService
```scala
trait FlowService {
  def start(process: FlowProcess): FlowProcess
  def complete(taskId: Long, comment: String): Unit
  def findTasks(userId: Long): List[FlowTask]
}
```

---

### Web 服务端点

| 模块 | 基础路径 | 主要功能 |
|------|---------|---------|
| User | `/ws/user` | 用户信息、认证、权限 |
| Security | `/ws/security` | 菜单、权限管理 |
| Config | `/ws/config` | 域、应用、数据源配置 |
| OA | `/ws/oa` | 公告、文档、流程 |
| Log | `/ws/log` | 日志查询 |
| OAuth | `/ws/oauth` | OAuth 认证 |