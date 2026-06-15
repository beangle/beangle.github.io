## API 参考

### org.beangle.doc.html 包

#### DomNode
```scala
trait DomNode {
  def tag: String
  def attributes: Map[String, String]
  def children: List[DomNode]
  def text: String
}
```

#### Element
```scala
class Element(tag: String) extends DomNode {
  def append(child: DomNode): Element
  def setAttribute(key: String, value: String): Element
}
```

#### Table
```scala
class Table(element: Element) {
  def rows: List[Row]
  def toMarkdown: String
  def toText: String
}
```

#### Document
```scala
object Document {
  def parse(html: String): Document
  def load(file: File): Document
}
```

---

### org.beangle.doc.docx 包

#### DocTemplate
```scala
class DocTemplate(templatePath: String) {
  def process(data: Map[String, Any]): ByteArrayOutputStream
  def process(data: AnyRef): ByteArrayOutputStream
}
```

#### DocHelper
```scala
object DocHelper {
  def merge(docs: List[InputStream]): ByteArrayOutputStream
  def convertToPdf(docx: InputStream): ByteArrayOutputStream
}
```

---

### org.beangle.doc.excel 包

#### Sheets
```scala
object Sheets {
  def read(path: String): Workbook
  def write(workbook: Workbook, path: String): Unit
}
```

#### ExcelSchema
```scala
class ExcelSchema {
  def sheet(name: String): SheetSchema
  def create(): Workbook
}
```

#### Transformer
```scala
class Transformer {
  def transform(template: InputStream, data: Map[String, Any]): ByteArrayOutputStream
}
```

---

### org.beangle.doc.pdf 包

#### PdfMaker
```scala
trait PdfMaker {
  def convert(html: String): ByteArrayOutputStream
  def convert(url: String): ByteArrayOutputStream
  def setOption(key: String, value: Any): PdfMaker
}
```

#### Signed
```scala
object Signed {
  def sign(input: InputStream, output: OutputStream, certificate: Certificate, privateKey: PrivateKey): Unit
}
```

#### Docs
```scala
object Docs {
  def merge(pdfs: List[InputStream]): ByteArrayOutputStream
  def split(input: InputStream, pages: Range): ByteArrayOutputStream
}
```