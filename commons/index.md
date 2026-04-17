# Beangle Commons

Beangle Commons 是一个基于 Scala 的企业级工具库，提供 24 个核心模块，覆盖字符串处理、集合操作、文件IO、网络通信、安全加密等企业级开发常用功能。

## 核心能力

Beangle Commons 提供以下核心能力：

- **字符串处理**：提供安全的字符串操作，包括空值处理、转换、分割、连接、格式化等
- **集合操作**：提供丰富的集合工具，支持空值检查、集合转换、集合运算等
- **数字处理**：提供数字类型转换、精确运算、格式化等功能
- **文件操作**：提供文件读写、复制、删除、权限管理等功能
- **Bean 操作**：支持属性访问、嵌套路径、索引和映射路径的属性操作
- **类型转换**：提供不同类型之间的相互转换功能
- **数据格式**：支持 CSV 读写和 JSON 解析、查询、序列化
- **配置管理**：提供配置查找、嵌套和处理器功能
- **缓存管理**：提供缓存接口和操作功能
- **资源加载**：支持类路径资源和模式匹配的资源加载
- **IO 操作**：提供流复制、资源关闭等 IO 工具
- **反射工具**：提供类信息获取、方法调用等反射功能
- **并发工具**：提供锁保护、异步任务、定时任务等并发功能
- **网络工具**：提供 HTTP 请求、网络信息获取等功能
- **安全加密**：提供 Base64、Hex、MD5、AES 等编码解码和加密功能
- **事件机制**：提供事件发布订阅模式
- **日志管理**：提供统一的日志接口
- **系统平台**：提供操作系统类型判断等平台相关功能
- **路径匹配**：支持 ANT 风格的路径模式匹配
- **表达式求值**：支持脚本和表达式计算

## Modules

* [API 调用说明](/commons/api.html) 完整的API使用指南，包含模块总览和所有模块的详细说明

## 模块总览

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
