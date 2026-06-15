# Beangle Serializer

Beangle Serializer 是一个基于 Scala 的序列化框架，提供 JSON、XML、CSV、Protobuf 等多种格式的序列化和反序列化功能。

## 核心能力

Beangle Serializer 提供以下核心能力：

- **多格式支持**：支持 JSON、XML、CSV、Protobuf 等多种格式
- **类型安全**：提供类型安全的序列化和反序列化
- **自定义编组**：支持自定义类型的编组器
- **流式处理**：支持流式序列化和反序列化
- **灵活配置**：支持多种配置选项和自定义设置
- **高性能**：优化的序列化性能

## 文档组织

* [API 调用说明](/serializer/api.html) 详细的 API 使用指南，包含所有模块的功能说明和使用示例

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Core | `org.beangle.serializer.text` | 核心序列化接口 |
| JSON | `org.beangle.serializer.json` | JSON 序列化 |
| XML | `org.beangle.serializer.xml` | XML 序列化 |
| CSV | `org.beangle.serializer.csv` | CSV 序列化 |
| Protobuf | `org.beangle.serializer.protobuf` | Protobuf 序列化 |
| Marshal | `org.beangle.serializer.text.marshal` | 类型编组器 |

## 快速开始

### JSON 序列化

```scala
import org.beangle.serializer.json.JsonSerializer

val serializer = JsonSerializer()
val json = serializer.serialize(User("John", 30))
val user = serializer.deserialize[User](json)
```

### XML 序列化

```scala
import org.beangle.serializer.xml.XmlSerializer

val serializer = XmlSerializer()
val xml = serializer.serialize(User("John", 30))
val user = serializer.deserialize[User](xml)
```

### CSV 序列化

```scala
import org.beangle.serializer.csv.CsvSerializer

val serializer = CsvSerializer()
val csv = serializer.serialize(Seq(User("John", 30), User("Alice", 25)))
val users = serializer.deserialize[Seq[User]](csv)
```

## 最佳实践

- 根据场景选择合适的序列化格式
- 使用自定义编组器处理复杂类型
- 合理设置序列化选项
- 处理序列化异常
- 优化序列化性能
