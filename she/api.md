# Beangle She API 调用说明

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| WebMVC | `org.beangle.she.webmvc` | Web MVC 支持 |
| Hibernate | `org.beangle.she.hibernate` | Hibernate 集成 |
| Inspect | `org.beangle.she.inspect` | 系统检查 |
| Spring | `org.beangle.she.spring` | Spring 集成 |

---

## WebMVC 模块

`org.beangle.she.webmvc` - 提供 Web MVC 支持功能。

**功能说明**
提供 RESTful API、实体操作、数据导入导出等功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `RestfulAction` | RESTful 操作基类 | `class MyAction extends RestfulAction` |
| `EntityAction` | 实体操作基类 | `class MyAction extends EntityAction` |
| `RestfulService` | RESTful 服务 | `new RestfulService()` |
| `QueryHelper` | 查询助手 | `new QueryHelper()` |
| `PopulateHelper` | 数据填充助手 | `new PopulateHelper()` |
| `ImportHelper` | 导入助手 | `new ImportHelper()` |
| `ExportHelper` | 导出助手 | `new ExportHelper()` |

**常用场景示例**

### RESTful API

```scala
import org.beangle.she.webmvc.RestfulAction

class UserAction extends RestfulAction {
  def index(): Seq[User] = {
    entityDao.getAll(classOf[User])
  }
  
  def show(id: String): Option[User] = {
    entityDao.get(classOf[User], id.toLong)
  }
  
  def create(): User = {
    val user = new User()
    user.name = get("name", "Unknown")
    entityDao.saveOrUpdate(user)
    user
  }
  
  def update(id: String): User = {
    val user = entityDao.get(classOf[User], id.toLong).get
    user.name = get("name", user.name)
    entityDao.saveOrUpdate(user)
    user
  }
  
  def delete(id: String): String = {
    val user = entityDao.get(classOf[User], id.toLong).get
    entityDao.remove(user)
    "success"
  }
}
```

### 实体操作

```scala
import org.beangle.she.webmvc.EntityAction

class UserAction extends EntityAction {
  def save(): String = {
    val user = new User()
    user.name = get("name", "Unknown")
    user.age = getInt("age", 0)
    entityDao.saveOrUpdate(user)
    "success"
  }
  
  def remove(): String = {
    val ids = getIds("user")
    entityDao.remove(entityDao.get(classOf[User], ids))
    "success"
  }
}
```

### 查询助手

```scala
import org.beangle.she.webmvc.QueryHelper

val helper = new QueryHelper(entityDao)
val users = helper.from(classOf[User])
  .where("name like :name")
  .param("name", "%John%")
  .limit(10)
  .list()
```

### 数据导入

```scala
import org.beangle.she.webmvc.ImportSupport

class UserAction extends EntityAction with ImportSupport {
  def importData(): String = {
    val file = getFile("file")
    val result = importExcel(file, classOf[User])
    s"导入成功: ${result.successCount}, 失败: ${result.failCount}"
  }
}
```

### 数据导出

```scala
import org.beangle.she.webmvc.ExportSupport

class UserAction extends EntityAction with ExportSupport {
  def exportData(): View = {
    val users = entityDao.getAll(classOf[User])
    exportExcel(users, "users.xlsx")
  }
}
```

---

## Hibernate 模块

`org.beangle.she.hibernate` - 提供 Hibernate 集成功能。

**功能说明**
提供 Hibernate 配置、会话管理和拦截器等功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `OrmModule` | ORM 模块 | `new OrmModule()` |
| `CloseSessionInterceptor` | 关闭会话拦截器 | `new CloseSessionInterceptor()` |

**常用场景示例**

### ORM 模块配置

```scala
import org.beangle.she.hibernate.OrmModule

val module = new OrmModule()
module.addPackage("com.example.model")
module.addResource("hibernate.cfg.xml")
```

### 会话拦截器

```scala
import org.beangle.she.hibernate.CloseSessionInterceptor

val interceptor = new CloseSessionInterceptor()
interceptor.sessionFactory = sessionFactory
```

---

## Inspect 模块

`org.beangle.she.inspect` - 提供系统检查功能。

**功能说明**
提供系统组件、配置、依赖等检查功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ContainerAction` | 容器检查操作 | `class MyAction extends ContainerAction` |
| `DependencyAction` | 依赖检查操作 | `class MyAction extends DependencyAction` |
| `IndexAction` | 索引检查操作 | `class MyAction extends IndexAction` |
| `ConfigAction` | 配置检查操作 | `class MyAction extends ConfigAction` |
| `StatAction` | 统计检查操作 | `class MyAction extends StatAction` |
| `DefaultModule` | 默认检查模块 | `new DefaultModule()` |

**常用场景示例**

### 容器检查

```scala
import org.beangle.she.inspect.ContainerAction

class MyCheckAction extends ContainerAction {
  def check(): String = {
    val beans = checkComponents()
    beans.foreach { bean =>
      println(s"Bean: ${bean.name}")
    }
    "checked"
  }
}
```

### 依赖检查

```scala
import org.beangle.she.inspect.DependencyAction

class MyDependencyAction extends DependencyAction {
  def check(): String = {
    val dependencies = checkDependencies()
    dependencies.foreach { dep =>
      println(s"Dependency: ${dep.name}")
    }
    "checked"
  }
}
```

### 配置检查

```scala
import org.beangle.she.inspect.ConfigAction

class MyConfigAction extends ConfigAction {
  def check(): String = {
    val configs = checkConfigs()
    configs.foreach { config =>
      println(s"Config: ${config.key} = ${config.value}")
    }
    "checked"
  }
}
```

---

## Spring 模块

`org.beangle.she.spring` - 提供 Spring 集成功能。

**功能说明**
提供 Spring 容器初始化和集成功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ContainerInitializer` | 容器初始化器 | `new ContainerInitializer()` |

**常用场景示例**

### Spring 容器初始化

```scala
import org.beangle.she.spring.ContainerInitializer

class MyInitializer extends ContainerInitializer {
  def onStartup(servletContext: ServletContext): Unit = {
    val context = new AnnotationConfigWebApplicationContext()
    context.register(classOf[AppConfig])
    context.refresh()
    
    servletContext.setAttribute("springContext", context)
  }
}
```

---

## 最佳实践

### RESTful API 设计

- 使用标准的 HTTP 方法（GET、POST、PUT、DELETE）
- 提供清晰的资源路径
- 返回合适的 HTTP 状态码
- 使用 JSON 格式交换数据

### 实体操作

- 使用 EntityAction 简化实体操作
- 实现数据验证
- 处理并发冲突
- 记录操作日志

### 查询优化

- 使用 QueryHelper 构建查询
- 合理使用分页
- 避免 N+1 查询
- 使用缓存提高性能

### 数据导入导出

- 验证导入数据
- 处理导入异常
- 提供导入进度
- 优化大文件处理

### 系统检查

- 定期执行系统检查
- 监控系统健康状态
- 记录检查结果
- 及时处理异常
