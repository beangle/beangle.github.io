---
layout: page
title: 部署Micdn
description: "部署Micdn"
categories: [deploy]
version: ["1.0.0"]
---
{% include JB/setup %}

Micdn是一个小型的cdn服务器。它包含两个组件，blob是一个集中的文件存储服务，asset是web静态文件服务器。

### 1. 安装操作系统环境

安装必要的软件包，适用于centos 8

    [root@centos8 ~]# dnf -y install libssl11 postgresql-libs

如果不能通过dnf安装，可以访问在线资源[openssl11](https://download-ib01.fedoraproject.org/pub/epel/7/x86_64/Packages/o/openssl11-1.1.1c-2.el7.x86_64.rpm),[openssl11-libs](https://download-ib01.fedoraproject.org/pub/epel/7/x86_64/Packages/o/openssl11-libs-1.1.1c-2.el7.x86_64.rpm),[postgresql-libs](http://mirrors.163.com/centos/7/os/x86_64/Packages/postgresql-libs-9.2.24-2.el7.x86_64.rpm)
以及ldc的动态连接库
[ldc-druntime]( 	https://copr-be.cloud.fedoraproject.org/results/harbottle/main/epel-7-x86_64/01619106-ldc/ldc-druntime-1.23.0-2.el7.harbottle.x86_64.rpm),
[ldc-phobos](https://copr-be.cloud.fedoraproject.org/results/harbottle/main/epel-7-x86_64/01619106-ldc/ldc-phobos-1.23.0-2.el7.harbottle.x86_64.rpm),


下载到某个目录下（如/tmp/rpms），然后执行安装:

    [root@centos8 ~]# dnf -y install /tmp/rpms/*

### 2. 在用户目录下准备blob所需配置

以当前用户为beangle,在/home/beangle/.ems/建立blob相关目录

    [beangle@centos8 ~]$ mkdir -p /home/beangle/.ems/micdn
    [beangle@centos8 ~]$ touch /home/beangle/.ems/micdn/blob.xml

并将以下xml中的${}的变量内容，根据实际数据库的配置情况进行替换。
注意其中的base默认是~/.ems/blob,hostname一定要根据实际情况进行替换。
{% highlight xml%}
<?xml version="1.0" encoding="UTF-8"?>
<blob base=~/.ems/blob" maxSize="50M" hostname="system.school.edu.cn">
  <dataSource>
    <serverName>${serverName}</serverName>
    <databaseName>${databaseName}</databaseName>
    <user>${user}</user>
    <password>${password}</password>
    <schema>blob</schema>
  </dataSource> 
</blob>
{% endhighlight %}

### 3. 在用户目录下准备asset所需配置

在/home/beangle/.ems/建立asset相关目录

    [beangle@centos8 ~]$ mkdir -p /home/beangle/.ems/micdn
    [beangle@centos8 ~]$ touch /home/beangle/.ems/micdn/asset.xml

将项目需要的静态资源生命在asset.xml中。
{% highlight xml%}
<?xml version="1.0" encoding="UTF-8"?>
<asset base="~/.ems/static">
  <contexts>
    <context base="/local/">
      <dir location="~/.ems/local"/>
    </context>
    <context base="/bui/">
      <jar gav="org.beangle.bundles:beangle-bundles-bui:0.3.0"/>
    </context>
    。。。
  </contexts> 
</asset>
{% endhighlight %}

文件服务器需要连接数据，登记文件元信息，需要执行以下sql语句。
{% highlight sql%}
create schema blob;
create table blb.blob_metas(id bigint,domain_id int4,owner varchar(100) not null,name varchar(300)  not null,
                              size bigint  not null,sha varchar(100)  not null,media_type varchar(100)  not null,
                              profile_id int4 not null,file_path varchar(400) not null,updated_at timestamp not null);
alter table blb.blob_metas add primary key (id);
create unique  index idx_blob_meta_profile_path on blb.blob_metas (profile_id,file_path);

create table blb.profiles(id int4 primary key,domain_id int4,name varchar(100) not null,base varchar(100) not null,users varchar(200),
                           named_by_sha bool not null,public_list bool not null,
                           public_download bool not null);
--以下代码是对接platform
create view blb.users as select domain_id,name,secret as key from cfg.apps;
create view blb.domains as select id,hostname from cfg.domains;
--建立第一个profile
insert into blb.profiles(id,domain_id,name,base,users,named_by_sha,public_download)
values(1,(select min(id) from cfg.domains),'系统管理','/platform','platform-portal,platform-ws,platform-userapp',true,true);
{% endhighlight %}

### 3. 安装文件服务器blob和静态资源服务器asset

下载beangle-micdn-blob-0.0.10-ldc.bin到服务器上的指定目录。

    [beangle@centos8 ~]$ wget https://github.com/beangle/micdn/releases/download/v0.0.10/beangle-micdn-0.0.10.zip
    [beangle@centos8 ~]$ unzip beangle-micdn-0.0.10.zip
    [beangle@centos8 ~]$ cp -r org ~/.m2/repository/
    [beangle@centos8 ~]$ rm -rf org

在beangle-sas(>=0.7.6)上注册该应用
在server.xml中修改如下：
{% highlight xml%}
<Engines>
   ...
  <Engine name="vibed" type="vibed" version="0.8.6"/>
</Engines>
<Farms>
  ...
  <Farm name="micdn" engine="vibed">
    <Options>--home=~/.ems</Options>
    <Server name="blob" http="7081"/>
    <Server name="asset" http="8080"/>
  </Farm>
<Farms>
<Proxy>
 ...
  <Backend name="micdn_asset">
     <Server name="micdn.asset" port="6081"/>
  </Backend>
</Proxy>

<Webapps>
  ...
  <Webapp name="micdn.blob" gav="org.beangle.micdn:beangle-micdn-blob:bin:ldc:0.0.10"/>
  <Webapp name="micdn.asset" gav="org.beangle.micdn:beangle-micdn-asset:bin:ldc:0.0.10"/>
</Webapps>
<Deployments>
  ...
  <Deployment webapp="micdn.blob" on="micdn.blob"  path="/blob"/>
  <Deployment webapp="micdn.asset" on="micdn_asset"  path="/static"/>
</Deployments>
{% endhighlight %}
为避免冲突，http端口可以适当调整。

beangle-sas服务器中执行bin/sas.sh proxy生成haproxy.cfg,将其拷贝到/etc/haproxy/

    [beangle@centos8 ~]$ cd beangle-sas
    [beangle@centos8 ~]$ bin/sas.sh proxy

以下如果beangle是管理员，可以执行，否则需要换成root执行（那就不需要前面的sudo)。

    [beangle@centos8 ~]$ sudo cp /home/beangle/beangle-sas/conf/haproxy.cfg /etc/haproxy/haproxy.cfg
    [beangle@centos8 ~]$ sudo systemctl restart haproxy

### 4. 启动和停止

在beangle-sas目录下执行如下命令可以启停

    [beangle@centos8 ~]$ cd beangle-sas
    [beangle@centos8 ~]$ bin/start.sh micdn
    [beangle@centos8 ~]$ bin/stop.sh micdn

