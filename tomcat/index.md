---
layout: page
title: "Tomcat Index"
---
{% include JB/setup %}

Beangle Tomcat 是在Apache Tomcat基础上增加了一些简单的内容，简化和便利war的运行。

* 支持数据驱动中的密码为加密密码
* 支持以http的方式从远程服务器获取数据源配置信息
* 支持轻量级的war包运行(如果内部WEB/lib的包都是maven仓库上可以下载的，这部分包可以省去)
* 支持快速创建多个server,而不用复制tomcat

### 1. 快速安装

{% highlight xml linenos %}
$ wget https://raw.githubusercontent.com/beangle/tomcat/master/server/src/main/resources/netinstall.sh;\
chmod +x ./netinstall.sh;\
netinstall.sh 0.1.0
{% endhighlight %}

### 2. 加密你的数据源

#### Beangle-tomcat-jdbc原理
通常使用Apache Tomcat,数据源配置会放在$CATALINA_HOME/conf/catalina/localhost/app1.xml(或者$CATALINA_HOME/conf/server.xml),密码会暴露出来。
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

如果采用第一种情况，启动过程和明文密码一样。第二种情况中，password中密码前***多个一个特殊符号?***,意味着要在启动过程中进行输入。
如果使用catalina.sh run时需要在控制台中输入key；采用startup.sh则需要对其进行改造，例如该文件的最后一行前，追加如下内容：
{% highlight shell linenos %}
echo "What is the jdbc_app1_secret key?"
stty -echo
read jdbc_app1_secret
stty echo
export jdbc_app1_secret
{% endhighlight %}

### 3. 启用远程数据源配置

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


### 4. 制作轻量级war包
每个应用依赖的包和其他应用之间多少有些重复，例如使用了Struts2,Log4j等第三方开源的包。这些包通常都可以在maven仓库上可以下到。
因此可以这些包从war中排除调，在war运行的时候，tomcat服务器会下载到本地缓存中，可以在各个应用之间共用。

* 增加container.dependencies

在war的WEB-INF/classes/META-INF/目录下建立一个container.dependencies文件，内部可以使用

    #groupId:artifactId:version的格式
    org.hibernate:hibernate-core:4.3.1.Final
    org.hibernate:hibernate-ehcache:4.3.1.Final

* 清理war包

这包中的WEB/lib中上述jar文件删除，再将war包放到webapps中即可。

* 更改Context定义

在youcontext.xml或者server.xml中的Context定义中，添加

{% highlight xml linenos %}
<Loader className="org.apache.catalina.loader.RepositoryLoader" cacheLayout="maven2"/>
{% endhighlight %}
其中cacheLayout表示本地缓存的风格，支持maven2和ivy2。可以补充cacheBase属性，设置本地缓存的位置(例如/opt/maven/repository)

    默认使用maven2，目录默认为~/.m2/repository.
    当风格为ivy2时，默认为~/.ivy2/cache

使用maven开发的项目可以省去全面的步骤：

* 定义provided依赖

在项目的pom文件中增加：

{% highlight xml linenos %}
<dependency>
  <groupId>org.hibernate</groupId>
  <artifactId>hibernate-core</artifactId>
  <scope>provided</scope>
</dependency>
{% endhighlight %}

* 增加自动打包支持

在pom的build部分增加

{% highlight xml linenos %}
  <build>
      <plugins>
        <plugin>
          <groupId>org.beangle.maven</groupId>  
          <artifactId>beangle-maven-plugin</artifactId>  
          <version>0.1.0</version>
          <executions>
            <execution>
              <id>generate</id>
              <phase>compile</phase>
              <goals>
                <goal>gen-dependency</goal>
              </goals>
            </execution>
          </executions>
        </plugin>
      </plugins>
    </build>
{% endhighlight %}

直接运行mvn clean install即可将自动生成container.dependencies，并打到包中。

### 5. 发布应用和启动服务

Beangle Tomcat Server有特别的目录结构:

    |-- bin
    |   |-- install.sh(安装tomcat）
    |   |-- update.sh(更新tomcat)
    |   |-- start.sh(启动服务)
    |   `-- stop.sh(停止服务)
    |-- conf(配置文件)
    |-- servers(这里的内容为server运行产生，无需维护)
    `-- webapps(放置war包)

新的war包放置在webapps.在conf中配置一个context。beangle tomcat server不采用[Engine]/[Hostname]/Context.xml的方式配置应用，而是将context添加到server.xml中。可以有多个类似的server.xml，例如server1.xml,server2.xml。例如：

{% highlight xml linenos %}
<?xml version='1.0' encoding='utf-8'?>
<Server port="8005" shutdown="SHUTDOWN">
  <Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="off" />
  <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener" />
  <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener" />
  <Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener" />
  
  <Service name="Catalina">
    <Connector port="8080" protocol="HTTP/1.1"
           URIEncoding="UTF-8"
           enableLookups="false"
           acceptCount="100"
           maxThreads="200"
           minSpareThreads="10"
           connectionTimeout="20000"
           disableUploadTimeout="true"
           compression="off"
           />
    <Engine name="Catalina" defaultHost="localhost">
      <Host name="localhost" appBase="webapps" unpackWARs="true" autoDeploy="false">
        <Context path="" reloadable="false" docBase="../../../webapps/myapp">
           <JarScanner scanBootstrapClassPath="false" scanAllDirectories="false" scanAllFiles="false" scanClassPath="false"/>
           <Resource  name="jdbc/dataSource"   driverClassName="org.postgresql.Driver"
                      url="jdbc:postgresql://localhost:5432/postgresql"   type="javax.sql.DataSource"
                      username="postgresql"  password="postgresql" />
           <Loader className="org.apache.catalina.loader.RepositoryLoader"/>
	</Context>
      </Host>
    </Engine>
  </Service>
</Server>
{% endhighlight %}

其中Context的写法比较特殊为`docBase="../../../webapps/myapp"`

如果启动服务采用

    $ bin/start.sh server1

停止服务

    $ bin/stop server1
    
查看日志

    $ tail -f servers/server1/logs/catalina.out
    
### 6. 更新tomcat

当tomcat有了新版本时，可以通过命令进行直接更新

{% highlight shell linenos %}
# 更新到8.0.14
$ bin/update 8.0.14
{% endhighlight %}


