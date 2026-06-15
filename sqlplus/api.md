## API 参考

### Transport 模块

#### Config
```scala
case class Config(
  source: DataSourceConfig,
  target: DataSourceConfig,
  tables: List[String],
  batchSize: Int = 1000,
  parallel: Boolean = false
)
```

#### DataSourceConfig
```scala
case class DataSourceConfig(
  url: String,
  driver: String,
  username: String,
  password: String
)
```

#### Reactor
```scala
class Reactor(config: Config) {
  def start(): Unit
  def stop(): Unit
  def getProgress: Progress
}
```

#### Progress
```scala
case class Progress(
  totalTables: Int,
  completedTables: Int,
  totalRows: Long,
  transferredRows: Long,
  startTime: Long,
  currentTable: String
)
```

---

### Report 模块

#### Reporter
```scala
trait Reporter {
  def generate(schema: Schema): Report
  def export(report: Report, format: String): Array[Byte]
}
```

#### Schema
```scala
class Schema {
  var name: String
  var tables: List[Table]
  var sequences: List[Sequence]
}
```

#### Table
```scala
class Table {
  var name: String
  var comment: String
  var columns: List[Column]
  var primaryKey: PrimaryKey
  var indexes: List[Index]
  var foreignKeys: List[ForeignKey]
}
```

#### Column
```scala
class Column {
  var name: String
  var typeName: String
  var nullable: Boolean
  var length: Int
  var precision: Int
  var scale: Int
  var comment: String
}
```

---

### Lint 模块

#### SchemaValidator
```scala
class SchemaValidator {
  def validate(schema: Schema): List[Violation]
}
```

#### Violation
```scala
case class Violation(
  level: ViolationLevel,
  rule: String,
  message: String,
  location: String
)
```

#### ViolationLevel
```scala
object ViolationLevel extends Enumeration {
  val INFO, WARNING, ERROR = Value
}
```

#### SequenceChecker
```scala
class SequenceChecker {
  def check(schema: Schema): List[Violation]
  def suggestFix(violation: Violation): String
}
```

---

### Converter 模块

#### TableConverter
```scala
trait TableConverter {
  def convert(source: Table): Table
  def supports(sourceType: String, targetType: String): Boolean
}
```

#### DefaultTableStore
```scala
class DefaultTableStore extends TableStore {
  def save(table: Table, connection: Connection): Unit
  def load(connection: Connection, tableName: String): Table
}
```

#### ConstraintConverter
```scala
class ConstraintConverter {
  def convert(constraints: List[Constraint], targetDialect: Dialect): List[Constraint]
}
```

---

### 工具类

#### EncryptDataSourceUtils
```scala
object EncryptDataSourceUtils {
  def encrypt(password: String): String
  def decrypt(encrypted: String): String
  def createDataSource(config: DataSourceConfig): DataSource
}
```

---

### 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| transport.batchSize | Int | 1000 | 批量处理大小 |
| transport.parallel | Boolean | false | 是否并行处理 |
| transport.timeout | Int | 300 | 超时时间(秒) |
| report.format | String | html | 报告格式：html/md/pdf |
| lint.rules | List[String] | all | 检查规则列表 |
| shell.prompt | String | sqlplus> | 命令行提示符 |