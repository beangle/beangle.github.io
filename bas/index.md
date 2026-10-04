# Beangle Bas Server
Beangle Bas Server 是在Apache Tomcat<sup>®</sup>基础上增加了一些简单的内容，简化和便利war的运行。

* [支持轻量级的war包运行](/bas/lightwar.html)(如果内部WEB/lib的包都是maven仓库上可以下载的，这部分包可以省去,不用放在war中)
* 支持快速创建多个server,而不用复制tomcat

## 1. 快速安装

```shell
# 先安装 basctl（控制面）与 jstart（构件解析/启动），见各自项目
basctl init /opt/bas     # 写入 /opt/bas/bin/*.sh，并建 conf/
cd /opt/bas && ./bin/start.sh all
```

## 2. bas目录结构

Beangle Bas Server有特别的目录结构:
```
  |-- bin
  |   |-- bas.sh
  |   |-- start.sh(启动服务)
  |   `-- stop.sh(停止服务)
  |-- conf(配置文件)
  |-- engines(不同版本的tomcat，无需维护)
  |-- servers(这里的内容为server运行产生，无需维护)
  |-- logs 产生的日志
  `-- webapps(放置war包,尤其是SNAPSHOT版本的)
```

新的war包放置在webapps.在conf中配置一个server.xml。Beangle Bas Server没有采用[Engine]/[Hostname]/Context.xml的方式配置应用，而是新建立一个格式的文件，支持同时管理多个tomcat节点。

## 3. bas 示例
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

```xml
<?xml version='1.0' encoding='utf-8'?>
<bas xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:noNamespaceSchemaLocation="http://beangle.github.io/schema/bas-1.0.0.xsd"
     version="0.14.0">
  <!--从这里下载webapp的各类依赖性，如果涉及到没有开源的包，可以改为自己的伺服-->
  <repository remote="maven.aliyun.com/nexus/content/groups/public"/>
  <hosts>
    <host name="web1" ip="192.168.10.1"/>
    <host name="web2" ip="192.168.10.2"/>
  </hosts>
  <engines>
    <engine name="tomcat9" type="tomcat" version="9.0.35" jsp-support="true">
      <jar uri="gav://com.oracle:ojdbc6:11.2.0.1.0"/>
    </engine>
    <engine name="tomcat10" type="tomcat" version="10.0.20">
      <jar uri="gav://org.postgresql:postgresql:42.2.6"/>
    </engine>
  </engines>

  <farms>
    <farm name="farm1" engine="tomcat9" max-heap-size="2000">
      <http accept-count="200"/>
      <proxy-options>
        balance roundrobin
        http-response set-header X-XSS-Protection 1;\ mode=block
        http-response set-header X-Frame-Options DENY
        http-response set-header X-Content-Type-Options nosniff
      </proxy-options>
      <server name="server1"  http="8080" host="web1" />
    </farm>

    <farm name="farm2" engine="tomcat10" max-heap-size="2000">
      <server name="server1" http="8081" host="web2"/>
    </farm>

    <farm name="farm3" engine="tomcat10" max-heap-size="500">
      <proxy-options>
        balance roundrobin
        cookie SERVERID insert indirect nocache
      </proxy-options>
      <server name="server1"  http="9080" host="web1" proxy-options="check cookie s1"/>
      <server name="server2"  http="9081" host="web1" proxy-options="check cookie s2"/>
      <server name="server3"  http="9080" host="web2" proxy-options="check cookie s3"/>
      <server name="server4"  http="9081" host="web2" proxy-options="check cookie s4"/>
    </farm>
  </farms>

  <webapps>
    <!--gav 是group-artifact-version的缩写，表示该组件在maven仓库的信息-->
    <!--maven仓库上没有的war包，可以省去该属性，转而写成doc-base="${bas.home}/webapps/app1.war"-->
    <webapp name="app1"  uri="gav://org.group:group-app1:0.x.x" run-at="group1" path="/app1" />
    <webapp name="app2"  uri="gav://org.group:group-app2:0.x.x" run-at="group1" path="/app2"/>
    <webapp name="app3"  uri="gav://org.group:group-app3:0.x.x" run-at="farm2" path="/app3"/>
    <webapp name="app4"  uri="gav://org.group:group-app4:0.x.x" run-at="farm2" path="/app4"/>

    <webapp name="app_index" uri="gav://org.group:group-app_index:0.x.x"/>
  </webapps>

  <!--配置代理-->
  <proxy engine="haproxy" hostname="your.domain.name">
    <!--启用https-->
    <https/>
  </proxy>
</bas>
```

## 4. 日常使用

bas安装完成后，只需要更改server.xml文件即可。

### 4.1 解析war

在日常war包版本号更新后，需要完成war包下载，以及解析轻量级war包的依赖，然后再运行。通常这个操作依赖于网络带宽，长时间停止服务可能影响生产环境。
可以先解析war包，然后再重启服务。

```shell
$ bin/bas.sh resolve
```

解析过程中bas会下载war包，如果发现war有声明的依赖项，也会下载。下载目录为maven的本地仓库 `~/.m2/repository`。除此之外还会下载jar/war对应的sha1摘要信息。
一旦发现sha1信息和jar包不符，将会删除jar和sha1。

### 4.2 查看状态和起停服务

查看bas接管的服务可以通过

```shell
$ bin/bas.sh status
```

查看哪些服务是启动的，以及版本号。

如果启动单个服务采用`bin/start.sh {farm_name}.{server_name}`的形式,取前面的farm3上的server1为例，启动命令如下：
```shell
$ bin/start.sh farm3.server1
```

启动farm3所有服务
```shell
$ bin/start.sh farm3
```

停止单个服务
```shell
$ bin/stop.sh farm3.server1
```

重启所有服务
```shell
$ bin/stop.sh all
$ bin/start.sh all
```

### 4.3 查看日志

查看日志farm3.server1
```shell
$ tail -f logs/farm3.server1/console.out
```
每次启动启动farm3.server1,都会创建一个新的console.out。历史日志在logs/archive下可以找到。

### 4.4 更新tomcat

当tomcat有了新版本时，可以通过修改server.xml中的其引擎version属性,之后重启应用直接更新
```xml
<engine name="tomcat80" type="tomcat" version="9.0.30">
</engine>
```

## 5 升级

不再有独立的 bas 发行包：控制脚本随 `basctl` 发布，升级 `basctl` 后执行以下命令刷新 `bin/*.sh`：

```shell
$ basctl init --force /opt/bas
```

引擎版本在 `conf/server.xml` 的 `<bas version="...">` 与各 `<engine version="...">` 中声明，重启后生效。
