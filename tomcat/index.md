---
layout: page
title: "Beangle Tomcat Server"
---
{% include JB/setup %}

Beangle Tomcat 是在Apache Tomcat基础上增加了一些简单的内容，简化和便利war的运行。

* [支持数据驱动中的密码为加密密码](/tomcat/resource.html)
* 支持以http的方式从远程服务器获取数据源配置信息
* [支持轻量级的war包运行](/tomcat/lightwar.html)(如果内部WEB/lib的包都是maven仓库上可以下载的，这部分包可以省去)
* 支持快速创建多个server,而不用复制tomcat

### 1. 快速安装

{% highlight xml linenos %}
$ wget https://raw.githubusercontent.com/beangle/tomcat/master/server/src/main/resources/netinstall.sh;\
chmod +x ./netinstall.sh;\
./netinstall.sh 0.1.0
{% endhighlight %}

### 2. 发布应用和启动服务

Beangle Tomcat Server有特别的目录结构:

    |-- bin
    |   |-- install.sh(安装tomcat）
    |   |-- update.sh(更新tomcat)
    |   |-- start.sh(启动服务)
    |   `-- stop.sh(停止服务)
    |-- conf(配置文件)
    |-- tomcat(tomcat文件,不要编辑这里的文件，升级时会全部删除)
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
    
### 3. 更新tomcat

当tomcat有了新版本时，可以通过命令进行直接更新

{% highlight shell linenos %}
# 更新到8.0.14
$ bin/update 8.0.14
{% endhighlight %}


