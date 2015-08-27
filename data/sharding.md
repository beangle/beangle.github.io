---
layout: page
title: "Data Sharding"
---
{% include JB/setup %}

## 一、 客户端控制分区策略

### 1.1、显式的控制表名

    val sql = "select {sgip_mt_log.*} from sgip_mt_log_200610 {sgip_mt_log} where {sgip_mt_log}.MTID=1";
    query=session.createSQLQuery(sql).addEntity("sgip_mt_log",classOf[MTMsg]);

### 1.2、使用拦截器进行自动分表

 可以拦截普通的新增、更改、删除、以及Hql。

    import org.hibernate.EmptyInterceptor
    class TestInterceptor extends EmptyInterceptor {
      override def onPrepareStatement(sql: String): String = {
        //这里可以根据当前时间或者外部条件，更改sql中的表名
        sql
      }
    }
    configuration.setInterceptor(new TestInterceptor)

但是无法拿到参数，因此不能根据参数进行判断.这种方式也不是和好办法。

### 1.3、(ORM)使用Hibernate的shards库

该项目是在对 Google 财务系统数据 Sharding 过程中诞生的。

 优点：

 * 标准的 Hibernate 编程模型
 * 使用ShardConfiguration管理多个数据库连接
 * 支持简单的Criteria和HQL
 * 支持分库的ID生成策略
 * 使用注解进行ID生成策略配置
 * 相对弹性的 Sharding 策略以及支持虚拟 Shard

缺点：

 * 可以使用Criteria,最好没有orderBy
 * 可以使用HQL,最好没有orderBy以及聚合函数

参考:

* [Jboss网站上的文档](http://docs.jboss.org/hibernate/stable/shards/reference/en/html_single/)
* [Hibernate网站上的介绍](http://hibernate.org/others/)

### 1.4、使用驱动级别的分表工具TDDL

[Tddl](http://www.oschina.net/p/tddl)是淘宝的开源产品。整个产品包括对应用透明的分库分表层和具有众多特性的动态数据源。目前仅先开源动态数据源，尚未开源分库分表层部分。

动态数据源的主要特性有:

1. 数据库主备和动态切换
2. 带权重的读写分离
3. 单线程读重试
4. 集中式数据源信息管理和动态变更
5. 剥离的稳定jboss数据源
6. 支持mysql和oracle数据库
7. 基于jdbc规范，很容易扩展支持实现jdbc规范的数据源
8. 无server,client-jar形式存在，应用直连数据库
9. 读写次数,并发度流控，动态变更
10. 可分析的日志打印,日志流控，动态变更

## 二、使用独立进程的代理进行分区(Proxy)

### 2.1、Mysql Proxy kingshard <img alt="推荐" style="height:30px" src="http://www.oschina.net/img/recomm.gif">

[Kingshard](http://www.oschina.net/p/kingshard)是一个由Go开发高性能MySQL Proxy项目，kingshard在满足基本的读写分离的功能上，致力于简化MySQL分库分表操作；能够让DBA通过kingshard轻松平滑地实现MySQL数据库扩容。
主要功能：

* 读写分离。
* 跨节点分表。
* 客户端IP访问控制。
* 平滑上线DB或下线DB，前端应用无感知。

### 2.2、Mysql Proxy Spock

[Spock Proxy](http://spockproxy.sourceforge.net/)是由实际项目产生的一个开源项目（Spock是Rails的应用，Speck Proxy应当可用于Rails之外的，例如PHP或.NET），基于MySQL Proxy开发，是MySQL Proxy的一个分支，支持range-based horizontal paritioning，他对MySQL Proxy所做的改进包括：

a). 不使用LUA脚本，提升性能。例如将多个数据源返回的结果集合并期间还要与LUA脚本交互，这样的性能开销比较大
b). 客户端登录验证。MySQL Proxy支持客户端与各个服务器直接进行登录验证，Spock Proxy则将其统一管理，分离客户端与服务器的连接
c). 动态连接池。受益于客户端登录认证机制的改善

![架构图](http://www.oschina.net/uploads/img/201002/03062346_YmnG.png)



### 2.3 PL/Proxy <img alt="推荐" style="height:30px" src="http://www.oschina.net/img/recomm.gif">

PL/Proxy 则是针对 PostgreSQL 的，设计思想类似 Teradata 的 Hash 机制，数据存储对客户端是透明的，客户请求发送到 PL/Proxy 后，由这里分布式存储过程调用，统一分发。 PL/Proxy 的设计初衷就是在这一层充当"数据总线"的职责，所以，当数据吞吐量支撑不住的时候，只需要增加更多的 PL/Proxy 服务器即可。大名鼎鼎的 Skype 用的就是 PL/Proxy 的解决方案。

![架构图](http://tse1.mm.bing.net/th?&id=OIP.M125a49c7ff4d68d23ef91c9c0a5bee88o0&w=300&h=300&c=0&pid=1.9&rs=0&p=0)

## 三、其他资料

* [CSDN 上的一篇不错的综合介绍](http://blog.csdn.net/qingrx/article/details/8756839)
* [国人介绍PL/Proxy的pdf](http://wiki.postgresql.org/images/0/00/2011.10_Digoal.Zhou_PostgreSQL_PLProxy%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E8%B7%B5.pdf)
* [Mysql下全局ID生成策略Flicker](http://my.oschina.net/u/142836/blog/174465)
* [淘宝TDDL的剖析](http://blog.csdn.net/czp11210/article/details/23429001)
* [PostgreSQL群集软件PostgreSQL-XL](http://www.postgres-xl.org/overview/)
* [Instagram的ID生成策略](http://instagram-engineering.tumblr.com/post/10853187575/sharding-ids-at-instagram)
* [Postgresql扩展PG_Shard](https://github.com/citusdata/pg_shard)
* [仿照TDDL写的分区程序Kamike](https://github.com/hubinix/kamike.divide)
* [如何安装GridSql](http://shanchao7932297.blog.163.com/blog/static/136362420114250740984/)
* [对比pgpool, GridSQL和plproxy三种集群方案](http://topic.csdn.net/u/20090416/21/8629c72a-857a-487b-ae1b-3db31cfd850b.html)
