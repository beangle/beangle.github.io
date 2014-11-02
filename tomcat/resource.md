---
layout: page
title: "Tomcat Resource"
---
{% include JB/setup %}

Beangle Tomcat ResourceFactory是为Tomcat提供密码和配置托管提供的Factory。

* 支持数据驱动中的密码为加密密码
* 支持以http的方式从远程服务器获取数据源配置信息

### 1. 加密你的数据源

#### 数据源密码加密解析原理
原理参考[老外的博客](http://www.jdev.it/encrypting-passwords-in-tomcat/)。
通常使用Apache Tomcat,数据源配置会放在$CATALINA_HOME/conf/catalina/localhost/app1.xml(或者conf/server.xml),密码会暴露出来。
例如
{% highlight xml linenos %}
<Resource 
  name="jdbc/app1"
  driverClassName="oracle.jdbc.driver.OracleDriver"
  url="jdbc:oracle:thin:@database_server:1521:orcl" 
  type="javax.sql.DataSource"
  username="app1_user_name"
  password="app1_password"
  />
{% endhighlight %}

通过将配置中的密码改成加密密码，可在一定程度上防止明文密码泄露。beangle-tomcat-jdbc中提供了对称加密（AES）方式，
可以基于默认key或者用户输入key产生密码。他实际上是通过继承tomcat的`DataSourceFactory`，并要求在配置中明确声明`  factory="org.beangle.tomcat.jdbc.EncryptedDataSourceFactory"`的方式实现将解密的密码注入到数据源中。

#### 使用步骤

* 生成密码

{% highlight shell linenos %}
# 使用普通的加密密文
$ bin/gen-pass.sh 123456
123456:fd7f189b5c6b7140ca06390b61a06a35
# 生成自定义key的密文
$ bin/gen-pass.sh 123456 mykey
123456:468eed9cd1d0eb71edd7fbf763cd0ba0
{% endhighlight %}

这样上述配置可以改为：
{% highlight xml linenos %}
<Resource 
  name="jdbc/app1"
  factory="org.beangle.tomcat.jdbc.EncryptedDataSourceFactory"
  driverClassName="oracle.jdbc.driver.OracleDriver"
  url="jdbc:oracle:thin:@database_server:1521:orcl" 
  type="javax.sql.DataSource"
  username="app1_user_name"
  password="fd7f189b5c6b7140ca06390b61a06a35"
  <!--或者password="?468eed9cd1d0eb71edd7fbf763cd0ba0"-->
  />
{% endhighlight %}

* 启动系统

如果采用第一种情况，启动过程和明文密码一样。第二种情况中，password中密码前**多个一个特殊符号?**,意味着要在启动过程中进行输入。
如果使用catalina.sh run时需要在控制台中输入key；采用startup.sh则需要对其进行改造，例如该文件的最后一行前，追加如下内容：
{% highlight shell linenos %}
echo "What is the jdbc_app1_secret key?"
stty -echo
read jdbc_app1_secret
stty echo
export jdbc_app1_secret
{% endhighlight %}

### 2. 启用远程数据源配置

为了方便在Tomcat中的数据源管理,可以将数据源的地址，用户名和密码以及最大链接数等配置在远程服务器上，例如LDAP或者专门的db中。
通过搭建网络服务，例如http友好的restful服务，可以让数据源的变更不在是手工活。

例如：
{% highlight xml linenos %}
<Resource 
  name="jdbc/app1"
  factory="org.beangle.tomcat.jdbc.EncryptedDataSourceFactory"
  url="http://mydatasource.com/app/myid?mykey" 
  type="javax.sql.DataSource"
  />
{% endhighlight %}

url中返回的内容以json样式呈现例如：
{% highlight xml linenos %}
{
  driverClassname="oracle.jdbc.driver.OracleDriver",
  url="jdbc:oracle:thin:@database_server:1521:orcl",
  username="app1_user_name",
  password="fd7f189b5c6b7140ca06390b61a06a35",
  maxActive=20
}
{% endhighlight %}

