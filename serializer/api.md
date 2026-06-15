# Beangle Serializer API 调用说明

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Core | `org.beangle.serializer.text` | 核心序列化接口 |
| JSON | `org.beangle.serializer.json` | JSON 序列化 |
| XML | `org.beangle.serializer.xml` | XML 序列化 |
| CSV | `org.beangle.serializer.csv` | CSV 序列化 |
| Protobuf | `org.beangle.serializer.protobuf` | Protobuf 序列化 |
| Marshal | `org.beangle.serializer.text.marshal` | 类型编组器 |

---

## JSON 模块

`org.beangle.serializer.json` - 提供 JSON 序列化功能。

**功能说明**
提供 JSON 格式的序列化和反序列化功能，支持复杂对象和自定义类型。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `JsonSerializer` | JSON 序列化器 | `JsonSerializer()` |
| `JsonDriver` | JSON 驱动接口 | `new DefaultJsonDriver()` |
| `JsonpSerializer` | JSONP 序列化器 | `JsonpSerializer()` |

**常用场景示例**

### 基本序列化

```scala
import org.beangle.serializer.json.JsonSerializer

val serializer = JsonSerializer()

val user = User("John", 30)
val json = serializer.serialize(user)
println(json)
```

### 反序列化

```scala
val json = """{"name":"John","age":30}"""
val user = serializer.deserialize[User](json)
println(s"Name: ${user.name}, Age: ${user.age}")
```

### 序列化集合

```scala
val users = Seq(
  User("John", 30),
  User("Alice", 25),
  User("Bob", 28)
)

val json = serializer.serialize(users)
```

### 序列化 Map

```scala
val data = Map(
  "name" -> "John",
  "age" -> 30,
  "active" -> true
)

val json = serializer.serialize(data)
```

### 自定义配置

```scala
import org.beangle.serializer.json.{DefaultJsonDriver, JsonSerializer}

val driver = new DefaultJsonDriver()
driver.prettyPrint = true
driver.indent = "  "

val serializer = JsonSerializer()
val json = serializer.serialize(user)
```

---

## XML 模块

`org.beangle.serializer.xml` - 提供 XML 序列化功能。

**功能说明**
提供 XML 格式的序列化和反序列化功能，支持复杂对象和自定义类型。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `XmlSerializer` | XML 序列化器 | `XmlSerializer()` |
| `XmlDriver` | XML 驱动接口 | `new DomDriver()` |
| `PrettyXmlWriter` | 格式化 XML 写入器 | `new PrettyXmlWriter(writer)` |

**常用场景示例**

### 基本序列化

```scala
import org.beangle.serializer.xml.XmlSerializer

val serializer = XmlSerializer()

val user = User("John", 30)
val xml = serializer.serialize(user)
println(xml)
```

### 反序列化

```scala
val xml = """<user><name>John</name><age>30</age></user>"""
val user = serializer.deserialize[User](xml)
println(s"Name: ${user.name}, Age: ${user.age}")
```

### 格式化输出

```scala
import org.beangle.serializer.xml.{DomDriver, XmlSerializer}

val driver = new DomDriver()
driver.prettyPrint = true

val serializer = XmlSerializer()
val xml = serializer.serialize(user)
```

---

## CSV 模块

`org.beangle.serializer.csv` - 提供 CSV 序列化功能。

**功能说明**
提供 CSV 格式的序列化和反序列化功能，适合表格数据的处理。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `CsvSerializer` | CSV 序列化器 | `CsvSerializer()` |
| `CsvDriver` | CSV 驱动接口 | `new DefaultCsvDriver()` |
| `CsvWriter` | CSV 写入器 | `new DefaultCsvWriter(writer)` |

**常用场景示例**

### 序列化对象列表

```scala
import org.beangle.serializer.csv.CsvSerializer

val serializer = CsvSerializer()

val users = Seq(
  User("John", 30),
  User("Alice", 25),
  User("Bob", 28)
)

val csv = serializer.serialize(users)
println(csv)
```

### 反序列化

```scala
val csv = """name,age
John,30
Alice,25
Bob,28"""

val users = serializer.deserialize[Seq[User]](csv)
users.foreach { user =>
  println(s"Name: ${user.name}, Age: ${user.age}")
}
```

### 自定义分隔符

```scala
import org.beangle.serializer.csv.{DefaultCsvDriver, CsvSerializer}

val driver = new DefaultCsvDriver()
driver.delimiter = ';'

val serializer = CsvSerializer()
val csv = serializer.serialize(users)
```

---

## Protobuf 模块

`org.beangle.serializer.protobuf` - 提供 Protobuf 序列化功能。

**功能说明**
提供 Protobuf 格式的序列化和反序列化功能，适合高性能场景。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `ProtobufSerializer` | Protobuf 序列化器 | `ProtobufSerializer()` |

**常用场景示例**

### 基本序列化

```scala
import org.beangle.serializer.protobuf.ProtobufSerializer

val serializer = ProtobufSerializer()

val user = User("John", 30)
val bytes = serializer.serialize(user)
```

### 反序列化

```scala
val user = serializer.deserialize[User](bytes)
println(s"Name: ${user.name}, Age: ${user.age}")
```

---

## Marshal 模块

`org.beangle.serializer.text.marshal` - 提供类型编组器。

**功能说明**
提供各种类型的编组器，支持自定义类型的序列化。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Marshaller` | 编组器接口 | `class MyMarshaller extends Marshaller` |
| `MarshallerRegistry` | 编组器注册表 | `new DefaultMarshallerRegistry()` |
| `BeanMarshaller` | Bean 编组器 | `new BeanMarshaller()` |
| `CollectionMarshaller` | 集合编组器 | `new CollectionMarshaller()` |
| `MapMarshaller` | Map 编组器 | `new MapMarshaller()` |
| `DateMarshaller` | 日期编组器 | `new DateMarshaller()` |
| `EnumMarshaller` | 枚举编组器 | `new EnumMarshaller()` |

**常用场景示例**

### 自定义编组器

```scala
import org.beangle.serializer.text.marshal.{Marshaller, MarshallingContext}

class UserMarshaller extends Marshaller[User] {
  def support(clazz: Class[_]): Boolean = clazz == classOf[User]
  
  def marshal(source: User, context: MarshallingContext): Unit = {
    context.startObject()
    context.putString("name", source.name)
    context.putInt("age", source.age)
    context.endObject()
  }
}

val registry = new DefaultMarshallerRegistry()
registry.register(new UserMarshaller())
```

### 注册自定义编组器

```scala
import org.beangle.serializer.json.{DefaultJsonDriver, JsonSerializer}

val driver = new DefaultJsonDriver()
val registry = new DefaultMarshallerRegistry()
registry.register(new UserMarshaller())

driver.registry = registry
val serializer = JsonSerializer()
```

---

## 最佳实践

### 格式选择

- **JSON**：适合 Web API 和前后端交互
- **XML**：适合配置文件和遗留系统集成
- **CSV**：适合表格数据导入导出
- **Protobuf**：适合高性能和低带宽场景

### 性能优化

- 使用流式处理大对象
- 避免不必要的序列化
- 使用缓存提高性能
- 选择合适的序列化格式

### 错误处理

- 捕获序列化异常
- 提供友好的错误信息
- 实现数据验证
- 记录序列化日志

### 安全考虑

- 避免序列化敏感数据
- 使用加密保护数据
- 验证反序列化数据
- 限制序列化深度
