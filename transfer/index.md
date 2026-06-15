# Beangle Transfer

Beangle Transfer 是一个基于 Scala 的数据导入导出框架，提供 Excel、CSV 等格式的数据导入导出功能，支持实体映射和数据转换。

## 核心能力

Beangle Transfer 提供以下核心能力：

- **数据导入**：支持 Excel、CSV 等格式的数据导入
- **数据导出**：支持 Excel、CSV 等格式的数据导出
- **实体映射**：支持实体属性的映射和转换
- **数据验证**：提供数据验证和错误处理
- **批量处理**：支持大批量数据的导入导出
- **监听器支持**：提供导入导出过程的监听和回调

## 文档组织

* [API 调用说明](/transfer/api.html) 详细的 API 使用指南，包含所有模块的功能说明和使用示例

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Importer | `org.beangle.transfer.importer` | 数据导入 |
| Exporter | `org.beangle.transfer.exporter` | 数据导出 |

## 快速开始

### Excel 导入

```scala
import org.beangle.transfer.importer.ExcelReader

val reader = new ExcelReader()
val data = reader.read(new File("data.xlsx"))
```

### Excel 导出

```scala
import org.beangle.transfer.exporter.ExcelWriter

val writer = new ExcelWriter()
writer.write(data, new File("output.xlsx"))
```

### CSV 导入导出

```scala
import org.beangle.transfer.importer.CsvReader
import org.beangle.transfer.exporter.CsvWriter

val reader = new CsvReader()
val data = reader.read(new File("data.csv"))

val writer = new CsvWriter()
writer.write(data, new File("output.csv"))
```

## 最佳实践

- 合理设置批量大小，避免内存溢出
- 使用监听器监控导入导出进度
- 实现数据验证，确保数据质量
- 处理导入导出异常
- 优化大文件处理性能
