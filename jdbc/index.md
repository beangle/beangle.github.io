# Beangle JDBC

Beangle JDBC 是一个基于 Scala 的 JDBC 工具库，提供数据库连接管理、SQL 执行、元数据查询等功能，支持多种数据库。

## 核心能力

Beangle JDBC 提供以下核心能力：

- **数据库连接管理**：提供数据源工厂和连接池管理
- **SQL 执行**：支持查询、更新、批量操作等多种 SQL 执行方式
- **结果集处理**：提供流式结果集处理，支持大数据量查询
- **元数据查询**：支持数据库元数据的查询和导出
- **数据库方言**：支持多种数据库的方言和类型映射
- **分页查询**：提供分页查询支持
- **批量操作**：支持批量插入和批量更新

## 文档组织

* [API 调用说明](/jdbc/api.html) 详细的 API 使用指南，包含所有模块的功能说明和使用示例

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Core | `org.beangle.jdbc` | 核心接口和类型定义 |
| Query | `org.beangle.jdbc.query` | SQL 查询和执行 |
| Meta | `org.beangle.jdbc.meta` | 数据库元数据 |
| Engine | `org.beangle.jdbc.engine` | 数据库引擎和方言 |
| DS | `org.beangle.jdbc.ds` | 数据源管理 |
| Script | `org.beangle.jdbc.script` | SQL 脚本处理 |

## 快速开始

### 基本查询

```scala
import org.beangle.jdbc.query.JdbcExecutor
import javax.sql.DataSource

val executor = new JdbcExecutor(dataSource)

val users = executor.query("SELECT id, name FROM users")
val user = executor.unique[User]("SELECT * FROM users WHERE id = ?", 1)
```

### 更新操作

```scala
val rows = executor.update("UPDATE users SET name = ? WHERE id = ?", "John", 1)
```

### 批量操作

```scala
val datas = Seq(
  Array(1, "Alice"),
  Array(2, "Bob"),
  Array(3, "Charlie")
)
val types = Seq(Types.INTEGER, Types.VARCHAR)
executor.batchInsert("INSERT INTO users (id, name) VALUES (?, ?)", datas, types)
```

## 最佳实践

- 使用连接池提高性能
- 合理设置 fetchSize 避免内存溢出
- 使用参数化查询防止 SQL 注入
- 及时关闭资源，避免连接泄漏
- 使用事务保证数据一致性
- 根据数据库选择合适的方言
