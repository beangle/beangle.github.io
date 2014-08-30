---
layout: page
title: "Webmvc Usage"
description: "Webmvch核心功能"
tags: [webmvc]
---
{% include JB/setup %}

#### 一、快速上手Action

以一个简单的例子来说明，你需要单独写一个工程。

    src
    `-- main
        |-- scala(com.example.message.actions代码)
        `-- resources(简单配置文件)
            `-- META-INF
               `-- beangle
                  |-- web-module.properties
                  `-- mvc-config.xml
 
action的代码如下:

{% highlight scala linenos %}
package com.example.message.actions
    /**
     * 消息管理控制器
     * 这个消息服务会自动注入
     */
    class SearchAction(var messageService:MessageService) {

      def index():String ={
        //查找并验证您的参数
        val box = Params.get("box")
        //查询指定收件箱的消息
        val messages=messageService.search(box)
        //放到request.attribute中
        put("messages",messages)
        //调转到结果页面，默认到com/example/message/actions/search/index.ftl
        forward()
      }
    }
{% endhighlight %}

第二步，定义绑定模块，将action托管到IOC容器中。这个模块一般一个包只有一个，内部可以绑定N多action，从作用上类似Google Guice的Module。

MessageModule:

{% highlight scala linenos %}
package com.example.message
import org.beangle.commons.inject.bind.AbstractBindModule
import com.example.message.actions.MessageAction
import com.example.message.service.impl.MessageServiceImpl

  class MessageModule extends AbstractBindModule{
    protected override def binding(){
      bind(classOf[SearchAction],classOf[MessageServiceImpl])
    }
  }
{% endhighlight %}

定义META-INF/beangle/web-module.properties

    modules=com.example.message.MessageModule

第三步，定义路由规则
定义META-INF/beangle/mvc-config.xml。这个文件的定义是一次性的，不因action的数量而变得复杂。

    <?xml version="1.0"?>
    <profiles>
      <profile name="example" pattern="com.example.*.actions">
        <!--这里是默认的规则，如有需要可以打开修改。
        <action suffix="Action" defaultMethod="index"/>
        <view path="/" style="full" suffix=".ftl" />
        <url path="/" suffix=""  style="seo" />
        -->
      </profile>
    </profiles>

第四步 运行

可以选择依赖beangle-webmvc-webxml配置web.xml，运行该例子。
http://localhost:8080/context/message/search


#### 二、mvc-config.xml详解

每个jar中的mvc-config.xml文件是定义了一个到多个配置。每个配置针对一定的package模式。例如上例中的`pattern="com.example.*.actions"`，该模式指明了配置适应的代码范围。配置分为action、view和url三个部分。

action 部分配合规定符合条件的控制器

    # 这个模式下的action
    pattern="com.example.*.actions"
    # action 类文件的后缀,例如 Controller，默认是Action
    suffix="Action"
    # action缺省方法
    defaultMethod="index"

view部分规定了页面的路径存放风格

    # 缺省的视图存放的路径
    path="/"
    # 页面文件的路径采用什么风格(full 和类的路径一样，simple 采用action名字作为文件夹,seo 采用命名空间作为文件夹)
    style="full"
    # 页面的扩展名
    suffix=".ftl"

url部分规定了action到url的路由风格

    # 生成的url的固定前缀,可以带有变量
    path=/
    # url路径的更个(simple为 /my/package/actionName,short 为/actionName，seo 为/my/package/action_name)
    style=seo
    # url 后缀,可以定义.do,.action
    suffix="" 

#### 三、参数绑定到Action方法
如果想让您的action方法直接获取参数，而不是通过Params.get()的方式，可以进行直接声明。

{% highlight scala linenos %}
package com.example.message.actions
import org.beangle.webmvc.annotation.param

    class SearchAction(var messageService:MessageService) {
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
{% endhighlight %}

这样访问方式仍旧不变，却比较有利于测试。
http://localhost:8080/context/message/search/info?message_id=1234

#### 四、URL参数化
有时考虑到搜索引擎，将url变得静态化一些，可以将url中查询参数(queryString)放到url中。例如消息管理中，查询消息的地址为/context/message/search?box=work,可以将其变为/context/message/work/search

一般url参数的视其范围可以区分如下：

* profile范围
* 单个action范围
* 单个方法范围

**Profile范围**内可以影响该profile的所有action，例如定制一个消息管理的profile，让其内部action对应的url全部按照box进行组织。

    <?xml version="1.0"?>
    <profiles>
      <profile name="example" pattern="com.example.*.action"/>
      <profile name="message" pattern="com.example.message.action">
        <url path="/message/{box}" suffix=""  style="seo" />
      </profile>
    </profiles>

这样message.action下的所有action的url中都带有/message/{box}前缀，之前SearchAction的index方法可以不用修改，也可以修改成如下简单方式:

{% highlight scala linenos %}
      //通过param注解绑定参数
      def index(@param("box") box:String):String ={
        val messages=messageService.search(box)
        put("messages",messages)
        forward()
      }
{% endhighlight %}

**Action范围**影响下面的所有方法生成的url。仍旧在mvc-config.xml中去掉定制的profile。需要在SearchAction类增加注解，如下:

{% highlight scala linenos %}
package com.example.message.action
import org.beangle.webmvc.annotation.action

    @action("{box}/search")
    class SearchAction(var messageService:MessageService) {}
{% endhighlight %}


**单个方法范围**仅仅影响单个方法，如下

{% highlight scala linenos %}
package com.example.message.action
import org.beangle.webmvc.annotation.mapping

    class SearchAction(var messageService:MessageService) {
      @mapping("{box}"//这里可以不用@param("box")进行参数绑定
      def index(box:String){}
    }
{% endhighlight %}
但是生成的url却有些变化，不是/context/{box}/search而是/context/search/{box}

#### 五、REST支持
根据httpmethod匹配到具体的方法上，非常有意思。Struts也对Restfull进行了支持，大多是针对各类httpmethod转换成单一的方法。例如GET /movies/abc 匹配到MovieAction的show方法。这样方式在过于简易，不利于扩展。SpringMVC对Restful的支持比较灵活，可以自行说明。Beangle WebMVC鼓励使用后者的做法。我们做个例子实现Struts restful的做法。

{% highlight scala linenos %}
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
{% endhighlight %}

映射的结果如下

    GET    /movie                    index
    GET    /movie/                   index
    GET    /movie/index              index
    GET    /movie/new                editNew
    GET    /movie/123                info("123")
    GET    /movie/123/edit           edit("123")
    PUT    /movie/123                update("123")
    DELETE /movie/123                remove("123")
    POST   /movie/123?_method=DELETE remove("123")

#### 六、Forward&Redirect支持

**Forward页面**,从代码中调转到页面可以直接使用forward方法。

    forward()
    //可以这样写
    forward("index")
    //调转到其他路径
    forward("../search/index")
    //调转到绝对路径
    forward("/com/example/message/common/index")

profile中view定义的style分别有full/simple/seo三种，以com.example.message.ComplexSearchAction view为index为例,当pattern为com.example.*.action

* style="full"  地址为com/example/message/action/ComplexSearchAction/index.ftl
* style="simple" 地址为ComplexSearch/index.ftl
* style="seo" 地址为complex-search/index.ftl

**Forward到本Action的其他方法**

 以使用URL的/context/work/message/search为例:

    //调转到/context/work/message/search/info
    forward(to(this,"info"))
    
    //调转到/context/family/message/search/info
    foreard(to(this,"info","&box=family"))

    //调转到/context/family/message/search/info?orderBy=date
    foreard(to(this,"info","&box=family&orderBy=date"))

**Forward到其他Action**

   方法类似于调转到本类，如下

    //调转到/context/work/message/complex-search/info
    forward(to(classOf[ComplexSearch],"info"))

**Redirect本类的其他方法**

    以SearchAction.info方法为例子
    redirect("search","error.bad_message_id","&box="+get("box"))

**Redirect到其他类**

    仍旧以SearchAction.info方法为例子
    redirect(to(classOf[ComplexSearch],"search","&box="+get("box")),"error.bad_message_id")
