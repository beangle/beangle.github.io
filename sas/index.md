---
layout: page
title: "Beangle Sas Server"
---
{% include JB/setup %}

Beangle Sas Server 是在Apache Tomcat<sup>®</sup>基础上增加了一些简单的内容，简化和便利war的运行。

* [支持轻量级的war包运行](/sas/lightwar.html)(如果内部WEB/lib的包都是maven仓库上可以下载的，这部分包可以省去)
* 支持快速创建多个server,而不用复制tomcat

### 1. 快速安装

{% highlight bash linenos %}
wget http://beangle.github.io/sas/netinstall.sh; chmod +x ./netinstall.sh;./netinstall.sh
{% endhighlight %}
### 2. 发布应用和启动服务

Beangle Sas Server有特别的目录结构:

    |-- bin
    |   |-- install.sh(安装或更新tomcat）
    |   |-- start.sh(启动服务)
    |   `-- stop.sh(停止服务)
    |-- conf(配置文件)
    |-- engines(不同版本的tomcat，无需维护)
    |-- servers(这里的内容为server运行产生，无需维护)
    `-- webapps(放置war包)

新的war包放置在webapps.在conf中配置一个server.xml。beangle sas server没有采用[Engine]/[Hostname]/Context.xml的方式配置应用，而是新建立一个格式的文件，支持同时管理多个tomcat节点。例如：

{% highlight xml linenos %}
<?xml version='1.0' encoding='utf-8'?>
<Sas version="0.6.4">
  <!--从这里下载webapp的各类依赖性，如果涉及到没有开源的包，可以改为自己的伺服-->
  <Repository remote="maven.aliyun.com/nexus/content/groups/public"/>

  <Engines>
    <Engine name="tomcat80" type="tomcat" version="8.0.44">
      <!--添加数据源需要的驱动,没有该类型数据库需要的可以省略-->
      <Jar gav="org.postgresql:postgresql:42.1.1"/>
      <!--添加本地驱动,例如需要访问Oracle-->
      <Jar path="/opt/oracle/ojdbc6.jar"/>
    </Engine>
  </Engines>

  <Farms>
    <Farm name="default" engine="tomcat80">
      <JvmArgs opts="-noverify -Xmx500M -Xms500M"/>
      <Http acceptCount="100" maxThreads="200" minSpareThreads="10"
            connectionTimeout="20000" disableUploadTimeout="true" compression="off" />
      <Server name="server1" http="8080"  />
      <Server name="server2" http="8081"  />
    </Farm>
  </Farms>

<!--
  <Webapps>
    <Webapp name="${your_app_name}" reloadable="false" docBase="${sas.home}/webapps/${your_war_name}">
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
</Sas>

{% endhighlight %}

其中Context的写法比较特殊为`docBase="${sas.home}/webapps/myapp"`

如果启动单个服务采用

    $ bin/start.sh default.server1

启动所有服务

    $ bin/start.sh default

停止单个服务

    $ bin/stop default.server1

查看日志

    $ tail -f servers/default.server1/logs/catalina.out

生成代理配置

    $ bin/proxy.sh

### 3. 更新tomcat

当tomcat有了新版本时，可以通过修改server.xml中的其引擎version属性,之后重启应用直接更新
{% highlight xml linenos %}
<Engine name="tomcat80" type="tomcat" version="9.0.30">
</Engine>
{% endhighlight %}

0.3.x 支持8.0到8.5之间的版本，0.4.x之后支持tomcat9.0以上系列的版本.

