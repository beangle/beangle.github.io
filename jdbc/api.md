# Beangle JDBC API 调用说明

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Core | `org.beangle.jdbc` | 核心接口和类型定义 |
| Query | `org.beangle.jdbc.query` | SQL 查询和执行 |
| Meta | `org.beangle.jdbc.meta` | 数据库元数据 |
| Engine | `org.beangle.jdbc.engine` | 数据库引擎和方言 |
| DS | `org.beangle.jdbc.ds` | 数据源管理 |
| Script | `org.beangle.jdbc.script` | SQL 脚本处理 |

---

## Query 模块

`org.beangle.jdbc.query` - 提供 SQL 查询和执行功能。

**功能说明**
提供 SQL 查询、更新、批量操作等功能，支持参数化查询和结果集处理。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `JdbcExecutor` | JDBC 执行器 | `new JdbcExecutor(dataSource)` |
| `Statement` | SQL 语句构建器 | `executor.statement(sql)` |
| `ResultSetIterator` | 结果集迭代器 | `new ResultSetIterator(rs, engine)` |
| `ParamSetter` | 参数设置器 | `ParamSetter.setParam(engine, stmt, index, value, type)` |
| `ParamValue` | 参数值包装 | `new ParamValue(value, sqlType)` |

**常用场景示例**

### 基本查询

```scala
import org.beangle.jdbc.query.JdbcExecutor

val executor = new JdbcExecutor(dataSource)

val users = executor.query("SELECT id, name FROM users")
users.foreach { row =>
  val id = row(0).asInstanceOf[Int]
  val name = row(1).asInstanceOf[String]
  println(s"User: $id - $name")
}
```

### 参数化查询

```scala
val user = executor.query("SELECT * FROM users WHERE id = ?", 1)
val usersByName = executor.query("SELECT * FROM users WHERE name LIKE ?", "%John%")
```

### 唯一结果查询

```scala
val user = executor.unique[User]("SELECT * FROM users WHERE id = ?", 1)
val userName = executor.unique[String]("SELECT name FROM users WHERE id = ?", 1)
```

### 查询单个值

```scala
val count = executor.queryForInt("SELECT COUNT(*) FROM users")
val maxId = executor.queryForLong("SELECT MAX(id) FROM users")
```

### 分页查询

```scala
import org.beangle.commons.collection.page.PageLimit

val limit = PageLimit(1, 10)
val users = executor.fetch("SELECT * FROM users ORDER BY id", limit)
```

### 更新操作

```scala
val rows = executor.update("UPDATE users SET name = ? WHERE id = ?", "John", 1)
val deleted = executor.update("DELETE FROM users WHERE id = ?", 1)
```

### 批量操作

```scala
val datas = Seq(
  Array(1, "Alice", 25),
  Array(2, "Bob", 30),
  Array(3, "Charlie", 28)
)
val types = Seq(Types.INTEGER, Types.VARCHAR, Types.INTEGER)
executor.batchInsert("INSERT INTO users (id, name, age) VALUES (?, ?, ?)", datas, types)
```

### 使用 Statement 构建器

```scala
val stmt = executor.statement("SELECT * FROM users WHERE name = :name AND age > :age")
stmt.params(Map("name" -> "John", "age" -> 25))
val users = stmt.list()
```

### 流式查询

```scala
val iterator = executor.iterate("SELECT * FROM large_table")
iterator.foreach { row =>
  processRow(row)
}
iterator.close()
```

---

## Meta 模块

`org.beangle.jdbc.meta` - 提供数据库元数据查询功能。

**功能说明**
提供数据库元数据的查询、导出和比较功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Database` | 数据库元数据 | `new Database(name, schema)` |
| `Schema` | 模式元数据 | `new Schema(name)` |
| `Table` | 表元数据 | `new Table(name, schema)` |
| `Column` | 列元数据 | `new Column(name, sqlType)` |
| `PrimaryKey` | 主键元数据 | `new PrimaryKey(name, columns)` |
| `ForeignKey` | 外键元数据 | `new ForeignKey(name, columns, refTable, refColumns)` |
| `Index` | 索引元数据 | `new Index(name, columns)` |
| `Sequence` | 序列元数据 | `new Sequence(name)` |
| `MetadataLoader` | 元数据加载器 | `new MetadataLoader(dataSource)` |
| `Serializer` | 元数据序列化器 | `new Serializer()` |

**常用场景示例**

### 加载数据库元数据

```scala
import org.beangle.jdbc.meta.MetadataLoader

val loader = new MetadataLoader(dataSource)
val database = loader.load()

println(s"Database: ${database.name}")
database.schemas.foreach { schema =>
  println(s"Schema: ${schema.name}")
  schema.tables.foreach { table =>
    println(s"  Table: ${table.name}")
  }
}
```

### 查询表结构

```scala
val table = database.getTable("users")
table.columns.foreach { column =>
  println(s"  Column: ${column.name} - ${column.sqlType.typeName}")
}
```

### 查询主键

```scala
val table = database.getTable("users")
table.primaryKey.foreach { pk =>
  println(s"Primary Key: ${pk.name}")
  pk.columns.foreach { column =>
    println(s"  Column: ${column.name}")
  }
}
```

### 查询外键

```scala
val table = database.getTable("orders")
table.foreignKeys.foreach { fk =>
  println(s"Foreign Key: ${fk.name}")
  println(s"  References: ${fk.refTable.name}")
}
```

### 查询索引

```scala
val table = database.getTable("users")
table.indexes.foreach { index =>
  println(s"Index: ${index.name}")
  index.columns.foreach { column =>
    println(s"  Column: ${column.name}")
  }
}
```

### 导出元数据

```scala
import org.beangle.jdbc.meta.Serializer

val serializer = new Serializer()
val xml = serializer.toXml(database)
println(xml)
```

### 比较数据库结构

```scala
val db1 = loader1.load()
val db2 = loader2.load()

val diff = Diff.compare(db1, db2)
diff.changes.foreach { change =>
  println(s"Change: ${change.description}")
}
```

---

## Engine 模块

`org.beangle.jdbc.engine` - 提供数据库引擎和方言支持。

**功能说明**
提供多种数据库的方言支持，包括类型映射、SQL 语法转换等。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Engine` | 数据库引擎接口 | `Engines.forDataSource(dataSource)` |
| `Dialect` | 数据库方言 | `engine.dialect` |
| `AbstractEngine` | 抽象数据库引擎 | `class MyEngine extends AbstractEngine` |
| `Engines` | 引擎工厂 | `Engines.forDataSource(dataSource)` |

**支持的数据库**

| 数据库 | 引擎类 | 方言类 |
|--------|--------|--------|
| MySQL | `MySQL` | `MySQLDialect` |
| PostgreSQL | `PostgreSQL` | `PostgreSQLDialect` |
| Oracle | `Oracle` | `OracleDialect` |
| SQL Server | `SQLServer` | `SQLServerDialect` |
| H2 | `H2` | `H2Dialect` |
| DB2 | `DB2` | `DB2Dialect` |
| Derby | `Derby` | `DerbyDialect` |

**常用场景示例**

### 获取数据库引擎

```scala
import org.beangle.jdbc.engine.Engines

val engine = Engines.forDataSource(dataSource)
println(s"Database: ${engine.name}")
println(s"Version: ${engine.version}")
```

### 使用方言功能

```scala
val dialect = engine.dialect

val limitSql = dialect.limit("SELECT * FROM users", 0, 10)
val quotedName = dialect.quote("user_name")
val sequenceSql = dialect.sequenceSql("user_seq")
```

### 类型映射

```scala
val sqlType = engine.resolveCode(Types.VARCHAR, Some(255), None, None)
println(s"SQL Type: ${sqlType.typeName}")
```

---

## DS 模块

`org.beangle.jdbc.ds` - 提供数据源管理功能。

**功能说明**
提供数据源的创建、配置和加密功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `DataSourceFactory` | 数据源工厂 | `DataSourceFactory.build(config)` |
| `DataSourceUtils` | 数据源工具 | `DataSourceUtils.getDataSource(config)` |
| `DatasourceConfig` | 数据源配置 | `new DatasourceConfig()` |
| `DatasourceEncryptor` | 数据源加密器 | `new AesEncryptor(key)` |

**常用场景示例**

### 创建数据源

```scala
import org.beangle.jdbc.ds.DataSourceFactory

val config = Map(
  "driver" -> "org.postgresql.Driver",
  "url" -> "jdbc:postgresql://localhost:5432/mydb",
  "username" -> "user",
  "password" -> "password",
  "maxPoolSize" -> "10"
)

val dataSource = DataSourceFactory.build(config)
```

### 使用加密数据源

```scala
import org.beangle.jdbc.ds.AesEncryptor

val encryptor = new AesEncryptor("my-secret-key")
val encryptedPassword = encryptor.encrypt("password")

val config = Map(
  "driver" -> "org.postgresql.Driver",
  "url" -> "jdbc:postgresql://localhost:5432/mydb",
  "username" -> "user",
  "password" -> encryptedPassword,
  "passwordEncrypted" -> "true"
)

val dataSource = DataSourceFactory.build(config)
```

---

## Script 模块

`org.beangle.jdbc.script` - 提供 SQL 脚本处理功能。

**功能说明**
提供 SQL 脚本的解析、执行和管理功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Sql` | SQL 脚本 | `new Sql(content)` |
| `runner` | SQL 脚本执行器 | `runner.execute(dataSource, script)` |
| `parser` | SQL 脚本解析器 | `parser.parse(content)` |

**常用场景示例**

### 执行 SQL 脚本

```scala
import org.beangle.jdbc.script.runner

val script = """
  CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    age INT
  );
  
  INSERT INTO users VALUES (1, 'John', 30);
"""

runner.execute(dataSource, script)
```

---

## 最佳实践

### 连接管理

- 使用连接池提高性能
- 合理设置连接池大小
- 及时释放连接
- 监控连接池状态

### SQL 执行

- 使用参数化查询防止 SQL 注入
- 合理设置 fetchSize
- 使用批量操作提高性能
- 及时关闭结果集

### 事务管理

- 使用事务保证数据一致性
- 合理设置事务隔离级别
- 及时提交或回滚事务
- 避免长事务

### 错误处理

- 捕获 SQL 异常
- 记录错误日志
- 提供友好的错误信息
- 实现重试机制

### 性能优化

- 使用预编译语句
- 合理使用索引
- 避免 SELECT *
- 使用分页查询
