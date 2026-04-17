# Beangle Commons API 调用说明

## 模块总览

Beangle Commons 提供 24 个核心模块，覆盖字符串处理、集合操作、文件IO、网络通信、安全加密等企业级开发常用功能。

| 模块 | 包名 | 功能说明 |
|------|------|----------|
| Strings | `org.beangle.commons.lang.Strings` | 字符串工具，提供空值处理、转换、分割、连接等 |
| Collections | `org.beangle.commons.collection.Collections` | 集合工具，提供空值检查、集合转换、集合运算等 |
| Numbers | `org.beangle.commons.lang.Numbers` | 数字工具，提供类型转换、精确运算、格式化等 |
| Files | `org.beangle.commons.io.Files` | 文件工具，提供文件读写、复制、权限管理等 |
| Properties | `org.beangle.commons.bean.Properties` | Bean属性工具，支持嵌套、索引、映射路径访问 |
| Conversion | `org.beangle.commons.conversion` | 类型转换，支持不同类型间的相互转换 |
| CSV | `org.beangle.commons.csv` | CSV读写，支持自定义格式的CSV文件处理 |
| JSON | `org.beangle.commons.json` | JSON处理，提供解析、查询、序列化功能 |
| Config | `org.beangle.commons.config` | 配置管理，支持属性查找、嵌套和处理器 |
| Cache | `org.beangle.commons.cache` | 缓存管理，提供缓存接口和操作 |
| Resources | `org.beangle.commons.io.Resources` | 资源加载，支持类路径资源和模式匹配 |
| IOs | `org.beangle.commons.io.IOs` | IO操作，提供流复制、资源关闭等 |
| BeanInfo | `org.beangle.commons.lang.reflect` | 反射工具，提供类信息获取和方法调用 |
| Locks | `org.beangle.commons.concurrent.Locks` | 并发锁，提供锁保护和临界区操作 |
| Tasks | `org.beangle.commons.concurrent.Tasks` | 任务执行，提供异步和定时任务支持 |
| HttpUtils | `org.beangle.commons.net.http` | HTTP工具，提供GET/POST请求 |
| Networks | `org.beangle.commons.net.Networks` | 网络工具，获取本机网络信息 |
| MediaTypes | `org.beangle.commons.activation` | 媒体类型，根据扩展名获取MIME类型 |
| Codec | `org.beangle.commons.codec` | 编码解码，提供Base64、Hex、MD5、AES等 |
| Event | `org.beangle.commons.event` | 事件机制，提供发布订阅模式 |
| Logger | `org.beangle.commons.logging` | 日志记录，统一日志接口 |
| Platform | `org.beangle.commons.os.Platform` | 系统平台，判断操作系统类型 |
| AntPathPattern | `org.beangle.commons.regex` | 路径匹配，支持ANT风格路径模式 |
| ExpressionEvaluator | `org.beangle.commons.script` | 表达式求值，支持脚本和表达式计算 |

---

## Strings 模块

`org.beangle.commons.lang.Strings` - 提供安全、便捷的字符串操作方法，支持空值处理、字符串转换、分割、连接等操作。

**功能说明**
提供安全、便捷的字符串操作方法，支持空值处理、字符串转换、分割、连接等操作。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `isEmpty` | 检查字符串是否为空或null | `Strings.isEmpty("test") // false` |
| `isBlank` | 检查字符串是否为空白、空或null | `Strings.isBlank("   ") // true` |
| `capitalize` | 将字符串首字母大写 | `Strings.capitalize("hello") // "Hello"` |
| `join` | 将集合元素用分隔符连接 | `Strings.join(List(1,2,3), ",") // "1,2,3"` |
| `split` | 按字符分割字符串 | `Strings.split("a,b,c", ',') // ["a", "b", "c"]` |
| `substring` | 安全地获取子字符串 | `Strings.substring("hello", 1, 3) // "el"` |
| `replace` | 替换字符串中的子串 | `Strings.replace("abc", "a", "x") // "xbc"` |
| `trim` | 去除字符串两端空白 | `Strings.trim("  hello  ") // "hello"` |
| `abbreviate` | 缩写字符串 | `Strings.abbreviate("Hello World", 8) // "Hello..."` |
| `unCamel` | 将驼峰命名转换为分隔符格式 | `Strings.unCamel("camelCase", '_') // "camel_case"` |

**常用场景示例**

```scala
// 检查字符串是否有效
if (Strings.isNotBlank(userInput)) {
  // 处理有效输入
}

// 连接集合元素
val ids = List(1, 2, 3, 4)
val idStr = Strings.join(ids, ",") // "1,2,3,4"

// 分割字符串并转换为数字
val numStr = "1,2,3,4,5"
val numbers = Strings.split(numStr, ',').map(_.toInt) // Array(1, 2, 3, 4, 5)
```

---

## Collections 模块

`org.beangle.commons.collection.Collections` - 提供集合操作的工具方法，包括空值检查、集合转换、集合运算等功能。

**功能说明**
提供集合操作的工具方法，包括空值检查、集合转换、集合运算等功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `isEmpty` | 检查集合是否为空或null | `Collections.isEmpty(List()) // true` |
| `isNotEmpty` | 检查集合是否不为空且非null | `Collections.isNotEmpty(List(1,2,3)) // true` |
| `split` | 将列表分割成指定大小的子列表 | `Collections.split(List(1,2,3,4,5), 2)` |
| `convertToMap` | 将对象序列转换为映射 | `Collections.convertToMap(users, "id")` |
| `union` | 合并两个集合，保留最大出现次数 | `Collections.union(List(1,2), List(2,3)) // List(1,2,3)` |
| `intersection` | 求两个集合的交集 | `Collections.intersection(List(1,2,3), List(2,3,4))` |
| `subtract` | 从第一个集合中移除第二个集合的元素 | `Collections.subtract(List(1,2,3), List(2))` |
| `newBuffer` | 创建一个新的可变缓冲区 | `val buffer = Collections.newBuffer[String]` |
| `newSet` | 创建一个新的可变集合 | `val set = Collections.newSet[Int]` |
| `newMap` | 创建一个新的可变映射 | `val map = Collections.newMap[String, Int]` |

**常用场景示例**

```scala
// 检查集合是否为空
if (Collections.isNotEmpty(items)) {
  // 处理非空集合
}

// 分割大列表进行批处理
val largeList = (1 to 1000).toList
val batches = Collections.split(largeList, 100)
batches.foreach(batch => processBatch(batch))

// 合并两个集合并去重
val list1 = List(1, 2, 3)
val list2 = List(3, 4, 5)
val merged = Collections.union(list1, list2) // List(1,2,3,4,5)
```

---

## Numbers 模块

`org.beangle.commons.lang.Numbers` - 提供数字转换、格式化和数学运算的工具方法，支持安全的字符串到数字转换。

**功能说明**
提供数字转换、格式化和数学运算的工具方法，支持安全的字符串到数字转换。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `toInt` | 将字符串转换为Int | `Numbers.toInt("123", 0) // 123` |
| `toLong` | 将字符串转换为Long | `Numbers.toLong("123456", 0L) // 123456` |
| `toDouble` | 将字符串转换为Double | `Numbers.toDouble("123.45", 0.0) // 123.45` |
| `isDigits` | 检查字符串是否只包含数字 | `Numbers.isDigits("12345") // true` |
| `round` | 四舍五入到指定小数位 | `Numbers.round(123.456, 2) // 123.46` |
| `add` | 精确加法运算 | `Numbers.add(0.1, 0.2) // 0.3` |
| `subtract` | 精确减法运算 | `Numbers.subtract(1.0, 0.1) // 0.9` |
| `multiply` | 精确乘法运算 | `Numbers.multiply(0.1, 0.2) // 0.02` |
| `divide` | 精确除法运算 | `Numbers.divide(1.0, 3.0, 2) // 0.33` |

**常用场景示例**

```scala
// 安全地转换用户输入
val ageStr = userInput.get("age").orElse("0")
val age = Numbers.toInt(ageStr, 0)

// 精确的金融计算
val price = 19.99
val quantity = 3
val total = Numbers.multiply(price, quantity) // 59.97

// 四舍五入到指定精度
val taxRate = 0.0825
val tax = Numbers.round(total * taxRate, 2) // 4.95
```

---

## Files 模块

`org.beangle.commons.io.Files` - 提供文件操作的工具方法，包括文件读写、复制、删除、权限设置等功能。

**功能说明**
提供文件操作的工具方法，包括文件读写、复制、删除、权限设置等功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `forName` | 创建文件对象，支持波浪号扩展 | `Files.forName("~/Documents/file.txt")` |
| `readString` | 读取文件内容为字符串 | `Files.readString(new File("data.txt"))` |
| `writeString` | 将字符串写入文件 | `Files.writeString(new File("output.txt"), "Hello")` |
| `readLines` | 按行读取文件内容 | `Files.readLines(new File("data.txt"))` |
| `copy` | 复制文件到新位置 | `Files.copy(new File("source.txt"), new File("target.txt"))` |
| `touch` | 更新文件的最后修改时间 | `Files.touch(new File("flag.txt"))` |
| `remove` | 递归删除文件或目录 | `Files.remove(new File("temp"))` |
| `clear` | 清空目录或删除文件 | `Files.clear(new File("cache"))` |
| `setReadOnly` | 设置文件为只读 | `Files.setReadOnly(new File("config.xml"))` |
| `setWriteable` | 设置文件为可写 | `Files.setWriteable(new File("data.txt"))` |

**常用场景示例**

```scala
// 读取配置文件
val configFile = new File("config.properties")
val configContent = Files.readString(configFile)

// 写入日志文件
val logFile = new File("app.log")
Files.writeString(logFile, "Application started\n", true) // 追加模式

// 复制文件
val backupFile = new File("data_backup.txt")
Files.copy(new File("data.txt"), backupFile)

// 清理临时目录
val tempDir = new File("temp")
Files.clear(tempDir)
```

---

## Properties 模块

`org.beangle.commons.bean.Properties` - 提供Bean属性的访问和操作工具，支持嵌套、索引和映射路径的属性操作。

**功能说明**
提供Bean属性的访问和操作工具，支持嵌套、索引和映射路径的属性操作。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `set` | 设置Bean的属性值 | `Properties.set(user, "name", "John")` |
| `get` | 获取Bean的属性值 | `val name = Properties.get[String](user, "name")` |
| `copy` | 复制值到Bean属性 | `Properties.copy(user, "age", 25)` |
| `isWriteable` | 检查属性是否可写 | `Properties.isWriteable(user, "name")` |
| `getType` | 获取属性类型 | `Properties.getType(classOf[User], "name")` |
| `writables` | 获取可写属性名集合 | `Properties.writables(classOf[User])` |

**常用场景示例**

```scala
// 访问嵌套属性
val address = Properties.get[String](user, "address.street")

// 访问索引属性
val firstItem = Properties.get[String](user, "items[0]")

// 访问映射属性
val value = Properties.get[String](user, "attributes['key']")

// 批量设置属性
Properties.set(user, "name", "John")
Properties.set(user, "age", 30)
```

---

## Conversion 模块

`org.beangle.commons.conversion` - 提供类型转换功能，支持不同类型之间的相互转换。

**功能说明**
提供类型转换功能，支持不同类型之间的相互转换。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `convert` | 将源值转换为目标类型 | `conversion.convert("123", classOf[Int])` |

**常用场景示例**

```scala
// 创建默认转换实例
val conversion = DefaultConversion.Instance

// 字符串转数字
val intValue = conversion.convert("123", classOf[Int])

// 数字转字符串
val strValue = conversion.convert(123, classOf[String])

// 集合转换
val list = conversion.convert(Seq(1, 2, 3), classOf[java.util.List[_]])
```

---

## CSV 模块

`org.beangle.commons.csv` - 提供CSV文件的读写功能，支持自定义CSV格式。

**功能说明**
提供CSV文件的读写功能，支持自定义CSV格式。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `CsvReader` | 从Reader读取CSV数据 | `new CsvReader(new FileReader("data.csv"))` |
| `readNext` | 读取下一行CSV数据 | `reader.readNext()` |
| `CsvWriter` | 写入CSV数据 | `new CsvWriter(new FileWriter("output.csv"))` |
| `write` | 写入一行CSV数据 | `writer.write(Array("name", "age"))` |

**常用场景示例**

```scala
// 读取CSV文件
val reader = new CsvReader(new FileReader("data.csv"))
var row = reader.readNext()
while (row != null) {
  println(row.mkString(","))
  row = reader.readNext()
}

// 写入CSV文件
val writer = new CsvWriter(new FileWriter("output.csv"))
writer.write(Array("Name", "Age"))
writer.write(Array("John", "30"))
writer.write(Array("Alice", "25"))
writer.close()
```

---

## JSON 模块

`org.beangle.commons.json` - 提供JSON的解析、查询和序列化功能。

**功能说明**
提供JSON的解析、查询和序列化功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `parse` | 解析JSON字符串 | `Json.parse("{\"name\": \"John\"}")` |
| `parseObject` | 解析JSON字符串为JsonObject | `Json.parseObject("{\"name\": \"John\"}")` |
| `parseArray` | 解析JSON字符串为JsonArray | `Json.parseArray("[1, 2, 3]")` |
| `toJson` | 将对象转换为JSON字符串 | `Json.toJson(Map("name" -> "John"))` |
| `query` | 查询JSON路径 | `Json.query(jsonStr, "user.age")` |
| `escape` | 转义JSON字符串 | `Json.escape("Hello \"World\"")` |

**常用场景示例**

```scala
// 解析JSON
val jsonStr = "{\"name\": \"John\", \"address\": {\"city\": \"Beijing\"}}"
val json = Json.parse(jsonStr)

// 查询嵌套属性
val city = json.query("address.city")

// 构建JSON
val data = Map("name" -> "John", "age" -> 30, "hobbies" -> Seq("reading", "coding"))
val jsonString = Json.toJson(data)

// 解析数组
val array = Json.parseArray("[1, 2, 3, 4, 5]")
```

---

## Config 模块

`org.beangle.commons.config` - 提供配置管理功能，支持属性查找、嵌套和处理器。

**功能说明**
提供配置管理功能，支持属性查找、嵌套和处理器。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `get` | 获取配置值 | `config.get("app.name")` |
| `getString` | 获取字符串配置 | `config.getString("app.name", "default")` |
| `getInt` | 获取整数配置 | `config.getInt("server.port", 8080)` |
| `getLong` | 获取长整数配置 | `config.getLong("connection.timeout", 30000)` |
| `getDouble` | 获取浮点数配置 | `config.getDouble("discount.ratio", 0.9)` |
| `getDuration` | 获取持续时间配置 | `config.getDuration("cache.ttl", Duration.ofMinutes(5))` |
| `contains` | 检查配置是否存在 | `config.contains("app.name")` |
| `keys` | 获取指定前缀的配置键 | `config.keys("app.")` |

**常用场景示例**

```scala
// 读取应用配置
val appName = config.getString("app.name")
val serverPort = config.getInt("server.port", 8080)

// 读取嵌套配置
val dbUrl = config.getString("database.url")
val dbUser = config.getString("database.username")

// 读取列表配置
val enabledModules = config.get("app.modules", Seq.empty).asInstanceOf[Seq[String]]

// 读取映射配置
val credentials = config.get("security.credentials", Map.empty).asInstanceOf[Map[String, String]]
```

---

## Cache 模块

`org.beangle.commons.cache` - 提供缓存接口和管理功能。

**功能说明**
提供缓存接口和管理功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Cache` | 缓存接口 | `CacheManager.getCache("userCache")` |
| `get` | 获取缓存值 | `cache.get("userId")` |
| `put` | 设置缓存值 | `cache.put("userId", user)` |
| `remove` | 删除缓存值 | `cache.remove("userId")` |
| `clear` | 清空缓存 | `cache.clear()` |

**常用场景示例**

```scala
// 获取缓存
val userCache = CacheManager.getCache("userCache")

// 读取缓存
val user = userCache.get("user:123")

// 设置缓存
userCache.put("user:123", currentUser)

// 删除缓存
userCache.remove("user:123")

// 清空缓存
userCache.clear()
```

---

## Resources 模块

`org.beangle.commons.io.Resources` - 提供资源加载功能，支持类路径资源和模式匹配。

**功能说明**
提供资源加载功能，支持类路径资源和模式匹配。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `getResource` | 获取单个资源 | `Resources.getResource("config.xml")` |
| `getResources` | 获取多个资源 | `Resources.getResources("**/*.xml")` |
| `readString` | 读取资源内容为字符串 | `Resources.readString(resource)` |

**常用场景示例**

```scala
// 加载类路径资源
val resource = Resources.getResource("config/application.xml")
val content = Resources.readString(resource)

// 加载多个资源
val resources = Resources.getResources("**/*.xml")
resources.foreach { r => println(r.getURL) }
```

---

## IOs 模块

`org.beangle.commons.io.IOs` - 提供IO操作的工具方法，包括流复制、资源关闭等。

**功能说明**
提供IO操作的工具方法，包括流复制、资源关闭等。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `copy` | 复制流数据 | `IOs.copy(inputStream, outputStream)` |
| `close` | 关闭多个资源 | `IOs.close(input, output)` |
| `readString` | 读取输入流为字符串 | `IOs.readString(inputStream)` |
| `readBytes` | 读取输入流为字节数组 | `IOs.readBytes(inputStream)` |

**常用场景示例**

```scala
// 复制文件
val input = new FileInputStream("source.txt")
val output = new FileOutputStream("target.txt")
IOs.copy(input, output)
IOs.close(input, output)

// 读取流内容
val inputStream = new ByteArrayInputStream("Hello".getBytes)
val content = IOs.readString(inputStream)
```

---

## BeanInfo 模块

`org.beangle.commons.lang.reflect` - 提供反射相关的工具方法，包括Bean信息获取、类加载等。

**功能说明**
提供反射相关的工具方法，包括Bean信息获取、类加载等。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `BeanInfos.get` | 获取Bean信息 | `BeanInfos.get(classOf[User])` |
| `Reflections.getMethod` | 获取方法 | `Reflections.getMethod(classOf[User], "getName")` |
| `BeanInfo.properties` | 获取属性映射 | `beanInfo.properties` |

**常用场景示例**

```scala
// 获取Bean信息
val beanInfo = BeanInfos.get(classOf[User])

// 获取属性信息
val properties = beanInfo.properties
properties.foreach { case (name, prop) =>
  println(s"Property: $name, Type: ${prop.clazz.getName}")
}

// 调用方法
val user = new User()
val method = Reflections.getMethod(classOf[User], "setName", classOf[String])
method.invoke(user, "John")
```

---

## Locks 模块

`org.beangle.commons.concurrent.Locks` - 提供并发锁工具，保护临界区操作。

**功能说明**
提供并发锁工具，保护临界区操作。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `withLock` | 在锁保护下执行操作 | `Locks.withLock(lock)(() => result)` |

**常用场景示例**

```scala
// 使用锁保护临界区
val lock = new AnyRef
Locks.withLock(lock) {
  // 线程安全的操作
  sharedResource += 1
}
```

---

## Tasks 模块

`org.beangle.commons.concurrent.Tasks` - 提供任务执行工具，支持异步和定时任务。

**功能说明**
提供任务执行工具，支持异步和定时任务。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `execute` | 执行异步任务 | `Tasks.execute(() => println("Done"))` |
| `Timers.schedule` | 定时执行任务 | `Timers.schedule(5000)(() => task)` |
| `Workers.submit` | 提交后台任务 | `Workers.submit(() => process())` |

**常用场景示例**

```scala
// 执行异步任务
Tasks.execute {
  Thread.sleep(1000)
  println("Task completed")
}

// 定时执行任务
Timers.schedule(5000) {
  println("Scheduled task executed")
}

// 提交后台任务
val future = Workers.submit {
  processData()
}
val result = future.get()
```

---

## HttpUtils 模块

`org.beangle.commons.net.http.HttpUtils` - 提供HTTP工具，支持GET/POST请求。

**功能说明**
提供HTTP工具，支持GET/POST请求。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `get` | 发送GET请求 | `HttpUtils.get("https://example.com")` |
| `post` | 发送POST请求 | `HttpUtils.post("https://api.example.com/submit", data)` |

**常用场景示例**

```scala
// 发送HTTP GET请求
val content = HttpUtils.get("https://api.example.com/data")

// 发送HTTP POST请求
val data = Map("name" -> "John", "age" -> "30")
val response = HttpUtils.post("https://api.example.com/submit", data)
```

---

## Networks 模块

`org.beangle.commons.net.Networks` - 提供网络工具，获取本机网络信息。

**功能说明**
提供网络工具，获取本机网络信息。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `localHostAddress` | 获取本机IP地址 | `Networks.localHostAddress` |

**常用场景示例**

```scala
// 获取本地IP地址
val localIp = Networks.localHostAddress
println(s"Local IP: $localIp")
```

---

## MediaTypes 模块

`org.beangle.commons.activation.MediaTypes` - 提供媒体类型工具，根据文件扩展名获取MIME类型。

**功能说明**
提供媒体类型工具，根据文件扩展名获取MIME类型。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `get` | 根据扩展名获取MIME类型 | `MediaTypes.get("image.jpg")` |
| `register` | 注册自定义媒体类型 | `MediaTypes.register("application/json", "json")` |

**常用场景示例**

```scala
// 获取文件的媒体类型
val mimeType = MediaTypes.get("document.pdf")
println(s"PDF MIME type: $mimeType")

// 注册自定义媒体类型
MediaTypes.register("application/x-custom", "custom")
val customType = MediaTypes.get("file.custom")
```

---

## Codec 模块

`org.beangle.commons.codec` - 提供编码解码功能，包括Base64、Hex、MD5、AES等。

**功能说明**
提供编码解码功能，包括Base64、Hex、MD5、AES等。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Base64.encode` | Base64编码 | `Base64.encode("Hello")` |
| `Base64.decode` | Base64解码 | `Base64.decode(encoded)` |
| `Hex.encode` | 十六进制编码 | `Hex.encode("Hello")` |
| `Digests.md5` | MD5摘要 | `Digests.md5("Hello")` |
| `PBEEncryptor` | 密码加密 | `PBEEncryptor.random("password")` |
| `Aes` | AES加密 | `new Aes("key")` |

**常用场景示例**

```scala
// Base64编码
val encoded = Base64.encode("Hello World")
val decoded = Base64.decode(encoded)

// MD5摘要
val md5Hash = Digests.md5("Hello")

// 密码加密
val encryptor = PBEEncryptor.random("secretKey")
val encrypted = encryptor.encrypt("sensitive data")
val decrypted = encryptor.decrypt(encrypted)

// AES加密
val aes = new Aes("encryptionKey")
val encryptedText = aes.encrypt("Hello")
val decryptedText = aes.decrypt(encryptedText)
```

---

## Event 模块

`org.beangle.commons.event` - 提供事件发布订阅机制。

**功能说明**
提供事件发布订阅机制。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Event` | 事件接口 | `case class UserCreatedEvent(user: User) extends Event` |
| `EventListener` | 事件监听器 | `class UserListener extends EventListener[UserCreatedEvent]` |
| `SimpleEventMulticaster` | 事件多播器 | `new SimpleEventMulticaster()` |
| `publish` | 发布事件 | `multicaster.publish(UserCreatedEvent(user))` |
| `subscribe` | 订阅事件 | `multicaster.subscribe(listener)` |

**常用场景示例**

```scala
// 定义事件
case class UserCreatedEvent(user: User) extends Event

// 定义监听器
class UserListener extends EventListener[UserCreatedEvent] {
  def onEvent(event: UserCreatedEvent): Unit = {
    println(s"User created: ${event.user.name}")
  }
}

// 创建多播器并订阅
val multicaster = new SimpleEventMulticaster()
multicaster.subscribe(new UserListener())

// 发布事件
val user = User(1, "John")
multicaster.publish(UserCreatedEvent(user))
```

---

## Logger 模块

`org.beangle.commons.logging` - 提供统一日志接口。

**功能说明**
提供统一日志接口。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Logger` | 获取日志记录器 | `Logger(getClass)` |
| `info` | 记录信息日志 | `logger.info("Application started")` |
| `warn` | 记录警告日志 | `logger.warn("Configuration not found")` |
| `error` | 记录错误日志 | `logger.error("Failed to connect", e)` |
| `debug` | 记录调试日志 | `logger.debug("Processing request")` |

**常用场景示例**

```scala
// 获取日志记录器
val logger = Logger(getClass)

// 记录不同级别的日志
logger.info("Application starting")
logger.debug("Initializing components")

// 记录带异常的错误日志
try {
  // 业务逻辑
} catch {
  case e: Exception =>
    logger.error("Operation failed", e)
}

// 条件日志
if (logger.isDebugEnabled) {
  logger.debug(s"Processing ${items.size} items")
}
```

---

## Platform 模块

`org.beangle.commons.os.Platform` - 提供操作系统平台判断工具。

**功能说明**
提供操作系统平台判断工具。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `os` | 获取操作系统名称 | `Platform.os` |
| `isWindows` | 检查是否为Windows | `Platform.isWindows` |
| `isLinux` | 检查是否为Linux | `Platform.isLinux` |
| `Shell.create` | 创建命令执行器 | `Shell.create()` |

**常用场景示例**

```scala
// 检查操作系统
if (Platform.isWindows) {
  println("Running on Windows")
} else if (Platform.isLinux) {
  println("Running on Linux")
}

// 执行命令
val shell = Shell.create()
val result = shell.execute("echo Hello World")
println(result.output)
```

---

## AntPathPattern 模块

`org.beangle.commons.regex.AntPathPattern` - 提供ANT风格的路径模式匹配。

**功能说明**
提供ANT风格的路径模式匹配。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `matches` | 检查路径是否匹配模式 | `pattern.matches("src/main/java/Test.java")` |

**常用场景示例**

```scala
// 创建ANT路径模式
val pattern = new AntPathPattern("/**/*.scala")

// 匹配路径
val paths = List(
  "src/main/scala/Test.scala",
  "src/test/java/Test.java",
  "resources/config.xml"
)

paths.foreach { path =>
  if (pattern.matches(path)) {
    println(s"$path matches pattern")
  }
}

// 更复杂的模式
val complexPattern = new AntPathPattern("/api/**/v[0-9]*/**")
val apiPath = "/api/users/v1/profile"
println(s"API path matches: ${complexPattern.matches(apiPath)}")
```

---

## ExpressionEvaluator 模块

`org.beangle.commons.script.ExpressionEvaluator` - 提供脚本和表达式求值功能。

**功能说明**
提供脚本和表达式求值功能。

**主要 API**

| API | 功能描述 | 使用示例 |
|-----|---------|----------|
| `Jexl3` | 创建表达式求值器 | `new Jexl3()` |
| `evaluate` | 求值表达式 | `evaluator.evaluate("a + b", Map("a" -> 1, "b" -> 2))` |

**常用场景示例**

```scala
// 创建表达式求值器
val evaluator = new Jexl3()

// 求值简单表达式
val context = Map("x" -> 10, "y" -> 20)
val result = evaluator.evaluate("x + y", context)
println(s"Result: $result")

// 求值复杂表达式
val complexExpr = "if (x > y) { x - y } else { y - x }"
val complexResult = evaluator.evaluate(complexExpr, context)
println(s"Complex result: $complexResult")
```

---

## 最佳实践

### 空值安全处理

使用 `Strings.isEmpty()`、`Collections.isEmpty()` 等方法进行空值检查，避免 NullPointerException。

### 性能考虑

- 对于大量字符串操作，使用 `StringBuilder` 而不是字符串连接
- 对于大集合操作，考虑使用迭代器而不是一次性加载所有元素
- 对于文件操作，确保正确关闭流资源

### 代码风格

- 静态导入常用工具方法，提高代码可读性
- 遵循 Scala 编码规范，使用驼峰命名法
- 为复杂操作添加注释说明
