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

使用0.8.0以上的sas还需要使用root用户执行

    # yum install tomcat-native

### 2. sas目录结构

Beangle Sas Server有特别的目录结构:

    |-- bin
    |   |-- sas.sh
    |   |-- start.sh(启动服务)
    |   `-- stop.sh(停止服务)
    |-- conf(配置文件)
    |-- engines(不同版本的tomcat，无需维护)
    |-- servers(这里的内容为server运行产生，无需维护)
    |-- logs 产生的日志
    `-- webapps(放置war包)

新的war包放置在webapps.在conf中配置一个server.xml。Beangle SAS server没有采用[Engine]/[Hostname]/Context.xml的方式配置应用，而是新建立一个格式的文件，支持同时管理多个tomcat节点。

### 3. sas 示例
现有两台web服务器(web1,web2)，一台负载均衡服务器(proxy)的构成系统的拓扑结构。两台web分别各自部署2个应用，其中web1上部署app1,app2,web2上部署app3,app4。
另外有一个应用app_index同时部署在web1,web2上做高可用。

三台服务器

* proxy(192.168.10.1)
* web1(192.168.10.2)
* web2(192.168.10.3)

五个应用，及其要求。

* app1 部署在web1 (tomcat9/oracle/with jsp)
* app2 部署在web1 (tomcat9/oracle/)
* app3 部署在web2 (tomcat10/postgresql/no jsp)
* app4 部署在web2 (tomcat10/postgresql/no jsp)
* app_index 部署在web1,web2 (tomcat10/postgresql/no jsp)

例如：

{% highlight xml linenos %}
<?xml version='1.0' encoding='utf-8'?>
<Sas version="0.8.1">
  <!--从这里下载webapp的各类依赖性，如果涉及到没有开源的包，可以改为自己的伺服-->
  <Repository remote="maven.aliyun.com/nexus/content/groups/public"/>
  <Hosts>
    <Host name="web1" ip="192.168.10.2"/>
    <Host name="web2" ip="192.168.10.2"/>
  </Hosts>
  <Engines>
    <Engine name="tomcat9" type="tomcat" version="9.0.35" jspSupport="true">
      <Jar gav="com.oracle:ojdbc6:11.2.0.1.0"/>
    </Engine>
    <Engine name="tomcat10" type="tomcat" version="10.0.0-M8">
      <Jar gav="org.postgresql:postgresql:42.2.6"/>
    </Engine>
  </Engines>

  <Farms>
    <Farm name="farm1" engine="tomcat9" hosts="web1">
      <Options>-noverify -server -Xms2G -Xmx2G  -Djava.security.egd=file:/dev/./urandom</Options>
      <Http acceptCount="200"  maxThreads="800"  minSpareThreads="10" connectionTimeout="20000" compression="off" />
      <Server name="server1"  http="8080"  />
    </Farm>

    <Farm name="farm2" engine="tomcat10" hosts="web2">
      <Options>-noverify -server -Xms2G -Xmx2G  -Djava.security.egd=file:/dev/./urandom</Options>
      <Server name="server1" http="8081"/>
    </Farm>

    <Farm name="farm3" engine="tomcat10" hosts="web1,web2">
      <Options>-noverify -server -Xms250M -Xmx500M  -Djava.security.egd=file:/dev/./urandom</Options>
      <Http acceptCount="200"  maxThreads="800"  minSpareThreads="10" connectionTimeout="20000" compression="off" />
      <Server name="server1"  http="9080"  />
      <Server name="server2"  http="9081"  />
    </Farm>
  </Farms>

  <Webapps>
    <!--gav 是group-artifact-version的缩写，表示该组件在maven仓库的信息-->
    <!--maven仓库上没有的war包，可以省去该属性，转而写成docBase="${sas.home}/webapps/app1.war"-->
    <Webapp name="app1"  gav="org.group:group-app1:0.x.x" />
    <Webapp name="app2"  gav="org.group:group-app2:0.x.x" />
    <Webapp name="app3"  gav="org.group:group-app3:0.x.x" />
    <Webapp name="app4"  gav="org.group:group-app4:0.x.x"/>

    <Webapp name="app_index" gav="org.group:group-app_index:0.x.x"/>
  </Webapps>

  <!--配置代理-->
  <Proxy engine="haproxy" hostname="your.domain.name">
    <!--启用https-->
    <Https/>
    <!--入口group1，对应服务web1:8080-->
    <Backend name="group1" servers="farm1">
      <Options>
        balance roundrobin
        http-response set-header X-XSS-Protection 1;\ mode=block
        http-response set-header X-Frame-Options DENY
        http-response set-header X-Content-Type-Options nosniff
      </Options>
    </Backend>
    <!--省去group2的入口配置，这里自动创建-->
    <!--入口group3，对应服务web1上的9080端口和web2上的9081端口-->
    <Backend name="group3" serves="farm3">
      <Options>
        balance roundrobin
        cookie SERVERID insert indirect nocache
      </Options>
      <Server name="farm3.server1" host="web1" options="check cookie s1"/>
      <Server name="farm3.server2" host="web2" options="check cookie s2"/>
    </Backend>
  </Proxy>

  <Deployments>
    <!--on表示负载中的人口，或者farm以及farm上的server-->
    <Deployment webapp="app1" on="group1" path="/app1" />
    <Deployment webapp="app2" on="group1" path="/app2" />
    <Deployment webapp="app3" on="farm2" path="/app3" />
    <Deployment webapp="app4" on="farm2" path="/app4" />
    <Deployment webapp="app4" on="group2" path="/app4" />
  </Deployments>
</Sas>
{% endhighlight %}

### 3. sas 日常使用

sas安装完成后，只需要更改server.xml文件即可。

#### 3.1 解析war

在日常war包版本号更新后，需要完成war包下载，以及解析轻量级war包的依赖，然后再运行。通常这个操作依赖于网络带宽，长时间停止服务可能影响生产环境。
可以先解析war包，然后再重启服务。

    $ bin/sas.sh resolve

解析过程中sas会下载war包，如果发现war有声明的依赖项，也会下载。下载目录为maven的本地仓库 `~/.m2/repository`。除此之外还会下载jar/war对应的sha1摘要信息。
一旦发现sha1信息和jar包不符，将会删除jar和sha1。

#### 3.2 生成代理配置

不论是采用haproxy抑或是enginx,都可以在server.xml中声明后，采用如下命令生成:

    $ bin/sas.sh proxy

该命令会在conf目录下生成haproxy.cfg或者enginx.conf文件。

***注意***:该文件需要使用root账户拷贝到haproxy的对应目录下，然后重启haproxy方能生效。

#### 3.3 查看状态和起停服务

查看sas接管的服务可以通过

    $ bin/sas.sh status

查看哪些服务是启动的，以及版本号。

如果启动单个服务采用`bin/start.sh {farm_name}.{server_name}`的形式,取前面的farm3上的server1为例，启动命令如下：

    $ bin/start.sh farm3.server1

启动farm3所有服务

    $ bin/start.sh farm3

停止单个服务

    $ bin/stop.sh farm3.server1

重启所有服务

    $ bin/stop.sh all
    $ bin/start.sh all

#### 3.4 查看日志

查看日志farm3.server1

    $ tail -f logs/farm3.server1/console.out

每次启动启动farm3.server1,都会创建一个新的console.out。历史日志在logs/archive下可以找到。

#### 3.5 更新tomcat

当tomcat有了新版本时，可以通过修改server.xml中的其引擎version属性,之后重启应用直接更新
{% highlight xml linenos %}
<Engine name="tomcat80" type="tomcat" version="9.0.30">
</Engine>
{% endhighlight %}

### 4 更新sas

0.3.x 支持tomcat 8.0到8.5之间的版本，0.4.x之后支持tomcat9.0以上系列的版本.0.8.1之后的版本支持tomcat 10
发现新版本的sas后，需要执行更新命令：

    $ bin/sas.sh update new_version

然后更改conf/server.xml中的`<Sas version="old_version">`节点中的version,将其改为new_version

