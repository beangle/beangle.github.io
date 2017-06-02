---
layout: page
title: "Beangle AS Server"
---
{% include JB/setup %}

Beangle AS Server 是在Apache Tomcat<sup>®</sup>基础上增加了一些简单的内容，简化和便利war的运行。

* [支持数据驱动中的密码为加密密码](/tomcat/resource.html)
* 支持以http的方式从远程服务器获取数据源配置信息
* [支持轻量级的war包运行](/tomcat/lightwar.html)(如果内部WEB/lib的包都是maven仓库上可以下载的，这部分包可以省去)
* 支持快速创建多个server,而不用复制tomcat

### 1. 快速安装

{% highlight xml linenos %}
$ wget https://raw.githubusercontent.com/beangle/as/master/tomcat/src/main/resources/netinstall.sh;\
chmod +x ./netinstall.sh;./netinstall.sh
{% endhighlight %}

### 2. 发布应用和启动服务

Beangle AS Server有特别的目录结构:

    |-- bin
    |   |-- install.sh(安装或更新tomcat）
    |   |-- start.sh(启动服务)
    |   `-- stop.sh(停止服务)
    |-- conf(配置文件)
    |-- tomcat(tomcat文件,不要编辑这里的文件，升级时会全部删除)
    |-- servers(这里的内容为server运行产生，无需维护)
    `-- webapps(放置war包)

新的war包放置在webapps.在conf中配置一个config.xml。beangle  server不采用[Engine]/[Hostname]/Context.xml的方式配置应用，而是新建立一个格式的文件，支持同时管理多个tomcat节点。例如：

{% highlight xml linenos %}
<?xml version='1.0' encoding='utf-8'?>
<Tomcat version="8.0.17">
  <Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="off" />
  <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener" />
  <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener" />
  <Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener" />

  <Context>
    <Loader className="org.apache.catalina.loader.RepositoryLoader" cacheLayout="maven2"/>
    <JarScanner scanBootstrapClassPath="false" scanAllDirectories="false" scanAllFiles="false" scanClassPath="false"/>
  </Context>

  <Farm name="default" >
    <JvmArgs opts="-noverify -Xmx500M -Xms500M"/>
    <HttpConnector protocol="HTTP/1.1"
           URIEncoding="UTF-8"
           enableLookups="false"
           acceptCount="100"
           maxThreads="200"
           minSpareThreads="10"
           connectionTimeout="20000"
           disableUploadTimeout="true"
           compression="off" />
    <Server name="server1" shutdown="8005"  http="8080"  />
    <Server name="server2" shutdown="8006"  http="8081"  />
  </Farm>

<!--
  <Webapps>
    <Webapp name="${your_app_name}" reloadable="false" docBase="${as.home}/webapps/${your_war_name}">
      <ResourceRef ref="jdbc/${datasource}"/>
    </Webapp>
  </Webapps>

  <Resources>
    <Resource  name="jdbc/${datasource}"   driverClassName="org.postgresql.Driver"
                      url="jdbc:postgresql://localhost:5432/postgres"   type="javax.sql.DataSource"
                      username="postgres"  password="postgres" />
  </Resources>

  <Deployments>
    <Deployment webapp="${your_app_name}" on="default" path="/${context_path}"  />
  </Deployments>
 -->
</Tomcat>

{% endhighlight %}

其中Context的写法比较特殊为`docBase="${as.home}/webapps/myapp"`

如果启动单个服务采用

    $ bin/start.sh default.server1

启动所有服务

    $ bin/start.sh default

停止单个服务

    $ bin/stop default.server1

查看日志

    $ tail -f servers/default.server1/logs/catalina.out

### 3. 更新tomcat

当tomcat有了新版本时，可以通过命令进行直接更新

{% highlight shell linenos %}
# 更新到8.0.34
$ bin/install.sh tomcat 8.0.34
{% endhighlight %}
