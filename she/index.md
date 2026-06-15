# Beangle She

Beangle She（Shell Extension）是一个基于 Scala 的 Shell 扩展框架，提供 Web MVC 支持、Hibernate 集成、系统检查等功能。

## 核心能力

Beangle She 提供以下核心能力：

- **Web MVC 支持**：提供 RESTful API 和实体操作支持
- **Hibernate 集成**：提供 Hibernate 配置和会话管理
- **系统检查**：提供系统组件和配置的检查功能
- **数据导入导出**：提供数据的导入导出支持
- **查询助手**：提供查询构建和执行功能
- **Spring 集成**：提供 Spring 容器初始化支持

## 文档组织

* [API 调用说明](/she/api.html) 详细的 API 使用指南，包含所有模块的功能说明和使用示例

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| WebMVC | `org.beangle.she.webmvc` | Web MVC 支持 |
| Hibernate | `org.beangle.she.hibernate` | Hibernate 集成 |
| Inspect | `org.beangle.she.inspect` | 系统检查 |
| Spring | `org.beangle.she.spring` | Spring 集成 |

## 快速开始

### RESTful API

```scala
import org.beangle.she.webmvc.RestfulAction

class UserAction extends RestfulAction {
  def index(): Seq[User] = {
    entityDao.getAll(classOf[User])
  }
}
```

### 实体操作

```scala
import org.beangle.she.webmvc.EntityAction

class UserAction extends EntityAction {
  def save(): String = {
    val user = new User()
    user.name = "John"
    entityDao.saveOrUpdate(user)
    "success"
  }
}
```

### 系统检查

```scala
import org.beangle.she.inspect.ContainerAction

class MyCheckAction extends ContainerAction {
  def check(): String = {
    checkComponents()
    "checked"
  }
}
```

## 最佳实践

- 使用 RESTful 风格设计 API
- 合理使用实体操作简化代码
- 实现系统检查确保应用健康
- 使用查询助手构建复杂查询
- 正确管理 Hibernate 会话
