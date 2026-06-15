## Beangle Doc

Beangle Doc 提供文档处理相关的工具库，包含 HTML、DOCX、Excel、PDF 等多种文档格式的处理能力。

### 功能模块

| 模块 | 描述 |
|------|------|
| **html** | HTML 解析和处理工具 |
| **docx** | Word 文档模板处理和转换 |
| **excel** | Excel 文件读写和模板引擎 |
| **pdf** | PDF 文件生成、签名和转换 |

### 核心能力

- **HTML 处理**：HTML 解析、表格提取、样式处理
- **Word 文档**：模板渲染、文档转换、图片处理
- **Excel 操作**：读写 Excel、模板引擎、数据导出
- **PDF 生成**：HTML转PDF、PDF签名、文档合并分割

### 安装

```scala
libraryDependencies += "org.beangle.doc" % "beangle-doc-html" % "0.5.4"
libraryDependencies += "org.beangle.doc" % "beangle-doc-docx" % "0.5.4"
libraryDependencies += "org.beangle.doc" % "beangle-doc-excel" % "0.5.4"
libraryDependencies += "org.beangle.doc" % "beangle-doc-pdf" % "0.5.4"
```

### 依赖关系

- **Commons**：核心工具库
- **Template**：模板引擎支持（docx模块）

### 模块结构

```
doc
├── html        # HTML解析处理
├── docx        # Word文档处理
│   └── depends on html
├── excel       # Excel处理
│   └── depends on html
└── pdf         # PDF处理
```