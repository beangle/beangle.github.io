
# WebMVC User Guide

## 一、Action快速上手

以一个简单的例子来说明，你需要单独写一个工程。
   通过Maven的模版创建工程（老实说，由于maven的依赖项较多，这一步简单但不快速）

```shell
mvn archetype:generate -B -DgroupId=com.example.message -DartifactId=message -DarchetypeGroupId=org.beangle.webui -DarchetypeArtifactId=beangle-webui-archetype_2.12 -DarchetypeVersion=0.0.6
```
在生成的目录中增加以下目录结构：
```
src
`-- main
    |-- scala(com.example.message.action代码)
    `-- resources(简单配置文件)
        `-- META-INF
            `-- beangle
              |-- cdi.xml
              `-- mvc.xml
```
action的代码如下:

```scala
package com.example.message.action
import org.beangle.webmvc.api.action.ActionSupport
/**
  * 消息管理控制器
  * 这个消息服务会自动注入
  */
class SearchAction(val messageService:MessageService) extends ActionSupport {

  def index():String ={
    //查找并验证您的参数
    val box = Params.get("box","default")
    //查询指定收件箱的消息
    val messages=messageService.search(box)
    //放到request.attribute中
    put("messages",messages)
    //调转到结果页面，默认到com/example/message/action/search/index.ftl
    forward()
  }
}
```

第二步，定义绑定模块，将action托管到IOC容器中。这个模块一般一个包只有一个，内部可以绑定N多action，从作用上类似Google Guice的Module。

MessageModule:

```scala
package com.example.message
import org.beangle.commons.inject.bind.AbstractBindModule
import com.example.message.action.MessageAction
import com.example.message.service.impl.MessageServiceImpl

  class MessageModule extends AbstractBindModule{
    protected override def binding(){
      bind(classOf[SearchAction],classOf[MessageServiceImpl])
    }
  }
```

定义META-INF/beangle/cdi.xml
```xml
<?xml version="1.0"?>
<cdi>
  <container name="web">
    <module class="com.example.message.MessageModule"/>
    <!--
    <module class="other module"/>
    -->
  </container>
</cdi>
```
第三步，定义路由规则
定义META-INF/beangle/mvc-config.xml。这个文件的定义是一次性的，不因action的数量而变得复杂。
```xml
<?xml version="1.0"?>
<profiles>
  <profile name="example" pattern="com.example.*.action">
    <!--这里是默认的规则，如有需要可以打开修改。
    <action suffix="Action" defaultMethod="index"/>
    <view path="/" style="full" suffix=".ftl" />
    <url path="/" suffix=""  style="seo" />
    -->
  </profile>
</profiles>
```
第四步 运行

可以选择依赖beangle-webmvc-webxml配置web.xml，运行该例子。
http://localhost:8080/context/message/search


## 二、mvc-config.xml详解

每个jar中的mvc-config.xml文件是定义了一个到多个配置。每个配置针对一定的package模式。例如上例中的`pattern="com.example.*.action"`，该模式指明了配置适应的代码范围。配置分为action、view和url三个部分。

action 部分配合规定符合条件的控制器
```properties
# 这个模式下的action
pattern="com.example.*.action"
# action 类文件的后缀,例如 Controller，默认是Action
suffix="Action"
# action缺省方法
defaultMethod="index"
```
view部分规定了页面的路径存放风格
```properties
# 缺省的视图存放的路径
path="/"
# 页面文件的路径采用什么风格(full 和类的路径一样，simple 采用action名字作为文件夹,seo 采用命名空间作为文件夹)
style="full"
# 页面的扩展名
suffix=".ftl"
```
url部分规定了action到url的路由风格

```properties
# 生成的url的固定前缀,可以带有变量
path=/
# url路径的风格(simple为/my/package/actionName,short为/actionName，seo为/my/package/action_name，plur-seo为/my/package/action_names)
style=seo
# url 后缀,可以定义.do,.action
suffix=""
```
## 三、参数绑定到Action方法
如果想让您的action方法直接获取参数，而不是通过Params.get()的方式，可以进行直接声明。

```scala
package com.example.message.action
import org.beangle.webmvc.annotation.param
import org.beangle.webmvc.api.action.ActionSupport
class SearchAction(var messageService:MessageService) extends ActionSupport{
  // + index method

  //通过param注解绑定参数
  def info(@param("message_id") messageId:String):String ={
    messageService.get(messageId) match{
      case Some(message) => put("message",message)
      case None=> addError(s"Cannot find message $messageId")
    }
    forward()
  }
}
```

这样访问方式仍旧不变，却比较有利于测试。
http://localhost:8080/context/message/search/info?message_id=1234

## 四、URL参数化
有时考虑到搜索引擎，将url趋向静态化一些，可以将url中部分查询参数(queryString)放到url中。例如消息管理中，查询消息的地址为/context/message/search?box=work,可以将其变为/context/message/work/search

一般url参数的视其范围可以区分如下：

* profile范围
* 单个action范围
* 单个方法范围

**Profile范围**内可以影响该profile的所有action，例如定制一个消息管理的profile，让其内部action对应的url全部按照box进行组织。
```xml
<?xml version="1.0"?>
<profiles>
  <profile name="example" pattern="com.example.*.action"/>
  <profile name="message" pattern="com.example.message.action">
    <url path="/message/{box}" suffix=""  style="seo" />
  </profile>
</profiles>
```
这样message.action下的所有action的url中都带有/message/{box}前缀，之前SearchAction的index方法可以不用修改，也可以修改成如下简单方式:

```scala
//通过param注解绑定参数
def index(@param("box") box:String):String ={
  val messages=messageService.search(box)
  put("messages",messages)
  forward()
}
```

**Action范围**影响下面的所有方法生成的url。仍旧在mvc-config.xml中去掉定制的profile。需要在SearchAction类增加注解，如下:

```scala
package com.example.message.action
import org.beangle.webmvc.annotation.action

@action("{box}/search")
class SearchAction(var messageService:MessageService) {}
```


**单个方法范围**仅仅影响单个方法，如下

```scala
package com.example.message.action
import org.beangle.webmvc.annotation.mapping

class SearchAction(var messageService:MessageService) {
  @mapping("{box}"//这里可以不用@param("box")进行参数绑定
  def index(box:String){}
}
```
但是生成的url却有些变化，不是/context/{box}/search而是/context/search/{box}

## 五、REST支持

根据httpmethod匹配到具体的方法上，非常有意思。Struts也对Restfull进行了支持，大多是针对各类httpmethod转换成单一的方法。例如GET /movies/abc 匹配到MovieAction的show方法。这样方式在过于简易，不利于扩展。SpringMVC对Restful的支持比较灵活，可以自行说明。Beangle WebMVC鼓励使用后者的做法。我们做个例子实现Struts restful的做法。

```scala
import org.beangle.webmvc.annotation.{mapping, param}
import org.beangle.webmvc.helper.Params

class MovieAction {

  def index(): String = {}

  @mapping("{id}")
  def info(@param("id") id: String): String = {}

  @mapping("{id}/edit")
  def edit(@param("id") id: String): String = { }

  @mapping("new")
  def editNew(): String = {}

  @mapping(value = "{id}", method = "delete")
  def remove(@param("id") id: String): String = { }

  @mapping(value = "{id}", method = "put")
  def update(@param("id") id: String): String = { }
}
```

映射的结果如下
```
GET    /movie                    index
GET    /movie/                   index
GET    /movie/index              index
GET    /movie/new                editNew
GET    /movie/123                info("123")
GET    /movie/123/edit           edit("123")
PUT    /movie/123                update("123")
DELETE /movie/123                remove("123")
POST   /movie/123?_method=delete remove("123")
```
## 六、Forward&Redirect支持

**Forward页面**,从代码中调转到页面可以直接使用forward方法。

```scala
forward()
//可以这样写
forward("index")
//调转到其他路径
forward("../search/index")
//调转到绝对路径
forward("/com/example/message/common/index")
```

profile中view定义的style分别有full/simple/seo三种，以com.example.message.ComplexSearchAction view为index为例,当pattern为com.example.*.action

* style="full"  地址为com/example/message/action/ComplexSearchAction/index.ftl
* style="simple" 地址为ComplexSearch/index.ftl
* style="seo" 地址为complex-search/index.ftl

**Forward到本Action的其他方法**

 以使用URL的/context/work/message/search为例:
```scala
//调转到/context/work/message/search/info
forward(to(this,"info"))

//调转到/context/family/message/search/info
foreard(to(this,"info","&box=family"))

//调转到/context/family/message/search/info?orderBy=date
foreard(to(this,"info","&box=family&orderBy=date"))
```

**Forward到其他Action**

方法类似于调转到本类，如下
```scala
//调转到/context/work/message/complex-search/info
forward(to(classOf[ComplexSearch],"info"))
```

**Redirect本类的其他方法**

以SearchAction.info方法为例子
```scala
redirect("search","&box="+get("box"),"error.bad_message_id")
```
**Redirect到其他类**
仍旧以SearchAction.info方法为例子
```scala
redirect(to(classOf[ComplexSearch],"search","&box="+get("box")),"error.bad_message_id")
```

## 七、Resful Json/XML支持

如果不提供界面，直接向客户端提供restful的数据，格式基于JSON或者XML，那么可以将方法直接返回查询结果。

```scala
package com.example.message.action
import org.beangle.webmvc.annotation.action

class SearchAction(var messageService:MessageService) {
    @response //这里要注明，否则该方法会被框架忽略
    def index():Seq[Message]={
      val box =  get("box","default")
      messageService.search(box)
    }
}
```

pom.xml中需要增加
```xml
<dependency>
  <groupId>org.beangle.webmvc</groupId>
  <artifactId>beangle-webmvc-serializer-plugin</artifactId>
  <version>0.1.0</version>
</dependency>
```
这样页面上的访问地址可以改为:

    http://localhost:8080/context/message/search.json返回JSON格式的数据，
    http://localhost:8080/context/message/search.xml返回xml格式的数据。

或者

    http://localhost:8080/context/message/search?format=json返回JSON格式的数据，
    http://localhost:8080/context/message/search?format=xml返回xml格式的数据。

## 八、其他支持

下载文件或者图片可以采用如下方法

```scala
package com.example.message.action
import org.beangle.webmvc.api.view._

class LogoAction(var messageService:MessageService) {
    def index():View={
      //Stream(new URL("http://www.example.com/logo.gif"))
      Stream(new File("/tmp/path/to/your/pic.gif"))
    }
}
```

如果给下载文件起个单独的名称，而非文件名，则需要
```scala
Stream(new File("/tmp/path/to/your/pic.gif","我的logo"))
```
该文件需要浏览器缓存，可以增加过期时间设置
```scala
import org.beangle.webmvc.api.util.CacheControl
CacheControl.expiresAfter(4)//4天后过期
Stream(new File("/tmp/path/to/your/pic.gif","我的logo"))
```
如果支持javascript跨域访问该文件，则需要在profile中添加跨域访问支持：

```xml
<?xml version="1.0"?>
<profiles>
  <profile name="message" pattern="com.example.message.action">
    <interceptors>
      <interceptor name="web.Interceptor.cors"/>
    </interceptors>
  </profile>
</profiles>
```

如果接收用户参数查找文件，文件没有找到，则需要返回404
```scala
package com.example.message.action
import org.beangle.webmvc.api.view._

class LogoAction {
   def index():View={
     val file = new File("/tmp/path/to/your/pic.gif")
     //或者Status(404)
     if(file.exists) Stream(file) else Status.NotFound
   }
}
```
