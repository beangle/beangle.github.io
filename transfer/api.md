# Beangle Transfer API 调用说明

## 模块总览

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Importer | `org.beangle.transfer.importer` | 数据导入 |
| Exporter | `org.beangle.transfer.exporter` | 数据导出 |

---

## Importer 模块

`org.beangle.transfer.importer` - 提供数据导入功能。

**功能说明**
提供 Excel、CSV 等格式的数据导入功能，支持实体映射和数据验证。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Importer` | 导入器接口 | `class MyImporter extends Importer` |
| `EntityImporter` | 实体导入器 | `new EntityImporter()` |
| `ExcelReader` | Excel 读取器 | `new ExcelReader()` |
| `CsvReader` | CSV 读取器 | `new CsvReader()` |
| `Reader` | 读取器接口 | `reader.read(file)` |
| `ImportResult` | 导入结果 | `result.successCount` |
| `ImportMessage` | 导入消息 | `new ImportMessage()` |
| `ImportListener` | 导入监听器 | `class MyListener extends ImportListener` |

**常用场景示例**

### Excel 导入

```scala
import org.beangle.transfer.importer.{ExcelReader, EntityImporter}

val reader = new ExcelReader()
val importer = new EntityImporter()

val data = reader.read(new File("users.xlsx"))
val result = importer.importData(data)

println(s"成功导入: ${result.successCount}")
println(s"失败: ${result.failCount}")
```

### CSV 导入

```scala
import org.beangle.transfer.importer.{CsvReader, EntityImporter}

val reader = new CsvReader()
val importer = new EntityImporter()

val data = reader.read(new File("users.csv"))
val result = importer.importData(data)
```

### 自定义导入器

```scala
import org.beangle.transfer.importer.{Importer, ImportResult}

class MyImporter extends Importer {
  def importData(data: Seq[Array[String]]): ImportResult = {
    var successCount = 0
    var failCount = 0
    val messages = List.empty[ImportMessage]
    
    data.foreach { row =>
      try {
        processRow(row)
        successCount += 1
      } catch {
        case e: Exception =>
          failCount += 1
      }
    }
    
    new ImportResult(successCount, failCount, messages)
  }
  
  private def processRow(row: Array[String]): Unit = {
  }
}
```

### 使用监听器

```scala
import org.beangle.transfer.importer.{ImportListener, ImportMessage}

class MyImportListener extends ImportListener {
  def onStart(): Unit = {
    println("开始导入")
  }
  
  def onProgress(current: Int, total: Int): Unit = {
    println(s"进度: $current / $total")
  }
  
  def onComplete(result: ImportResult): Unit = {
    println(s"导入完成: 成功 ${result.successCount}, 失败 ${result.failCount}")
  }
  
  def onError(message: ImportMessage): Unit = {
    println(s"错误: ${message.content}")
  }
}

importer.addListener(new MyImportListener())
```

### 属性映射

```scala
import org.beangle.transfer.importer.Attribute

val attributes = Seq(
  Attribute("name", "姓名", required = true),
  Attribute("age", "年龄", required = false),
  Attribute("email", "邮箱", required = true)
)

importer.setAttributes(attributes)
```

---

## Exporter 模块

`org.beangle.transfer.exporter` - 提供数据导出功能。

**功能说明**
提供 Excel、CSV 等格式的数据导出功能，支持模板导出和数据格式化。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Exporter` | 导出器接口 | `class MyExporter extends Exporter` |
| `SimpleExporter` | 简单导出器 | `new SimpleExporter()` |
| `ExcelWriter` | Excel 写入器 | `new ExcelWriter()` |
| `CsvWriter` | CSV 写入器 | `new CsvWriter()` |
| `ExcelTemplateExporter` | Excel 模板导出器 | `new ExcelTemplateExporter()` |
| `Writer` | 写入器接口 | `writer.write(data, file)` |
| `ExportContext` | 导出上下文 | `new ExportContext()` |

**常用场景示例**

### Excel 导出

```scala
import org.beangle.transfer.exporter.{ExcelWriter, SimpleExporter}

val writer = new ExcelWriter()
val exporter = new SimpleExporter()

val data = Seq(
  Seq("John", 30, "john@example.com"),
  Seq("Alice", 25, "alice@example.com"),
  Seq("Bob", 28, "bob@example.com")
)

exporter.export(data, new File("users.xlsx"))
```

### CSV 导出

```scala
import org.beangle.transfer.exporter.{CsvWriter, SimpleExporter}

val writer = new CsvWriter()
val exporter = new SimpleExporter()

val data = Seq(
  Seq("John", 30, "john@example.com"),
  Seq("Alice", 25, "alice@example.com")
)

exporter.export(data, new File("users.csv"))
```

### 使用模板导出

```scala
import org.beangle.transfer.exporter.{ExcelTemplateExporter, ExportContext}

val exporter = new ExcelTemplateExporter()
val context = new ExportContext()

context.put("title", "用户列表")
context.put("data", users)

exporter.export(templateFile, outputFile, context)
```

### 自定义导出器

```scala
import org.beangle.transfer.exporter.{Exporter, ExportContext}

class MyExporter extends Exporter {
  def export(data: Seq[Seq[Any]], file: File): Unit = {
    val writer = new FileWriter(file)
    try {
      data.foreach { row =>
        writer.write(row.mkString(",") + "\n")
      }
    } finally {
      writer.close()
    }
  }
  
  def exportWithContext(data: Seq[Seq[Any]], file: File, context: ExportContext): Unit = {
  }
}
```

---

## 数据格式

### Excel 格式

支持 `.xls` 和 `.xlsx` 格式的 Excel 文件。

```scala
val reader = new ExcelReader()
val data = reader.read(new File("data.xlsx"))
```

### CSV 格式

支持标准 CSV 格式，可自定义分隔符。

```scala
val reader = new CsvReader()
reader.delimiter = ','
reader.encoding = "UTF-8"

val data = reader.read(new File("data.csv"))
```

---

## 最佳实践

### 导入优化

- 合理设置批量大小
- 使用事务保证数据一致性
- 实现数据验证
- 处理导入异常
- 使用监听器监控进度

### 导出优化

- 使用流式处理大文件
- 合理设置内存限制
- 优化数据格式
- 压缩输出文件
- 提供下载进度

### 错误处理

- 捕获导入导出异常
- 提供友好的错误信息
- 记录错误日志
- 实现重试机制

### 性能优化

- 使用批量操作
- 避免频繁的 I/O 操作
- 优化内存使用
- 使用多线程处理
