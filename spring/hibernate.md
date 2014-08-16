---
layout: page
title: "Spring Hibernate"
description: "利用Spring集成Hibernate"
tags: [hibernate]
---
{% include JB/setup %}

### 1. Hibernate 集成上的特性

* RailsNamingStrategy 命名策略

指定RailsNamingStrategy命名策略，实现类似Rails中的表名、列名命名实现，还添加了基于包名的前缀规则。
例如在META-INF/beangle/table.properties中增加org.beangle.security=security,se_一行。即可实现所有该包下的所有类的表
映射到security用户下的，以se_开头。
采用Rails中的命名样例如下：
  
    User --> users 类到表
    User.creator --> creator_id 属性到外建
    Person --> people 基于英文复数习惯的表
    Person.roles --> people_resources 关联表

* OverrideConfiguration 支持类重载的覆盖配置

Hibernate 在XML配置中支持单独指定entity-name,这样可以使用from entity-name这样的hql进行查询。
为了实现实体bean的可扩展性，可以在模型之间的使用接口进行依赖，例如Role的创建者creator可以使用User接口，而不是UserBean对象。
这样带来的问题是，在Role.creator的映射上，需要指定targetEntity指定为UserBean类型，这样又和UserBean耦合了。

我们的办法是在UserBean上指定entity-name为接口的名称,例如entity-name="org.beangle.security.blueprint.User"
或者使用@Entity(name="org.beangle.security.blueprint.User")注解。这样使用时不用指定targetEntity。
只不过后者hibernate支持较少，需要我们做一些改进。

如果新的NewUserBean介入系统，即可按照@Entity(name="org.beangle.security.blueprint.User")的方式，重新配置在
hibernate的cfg.xml文件中即可。OverrideConfiguration就是支持这一做法的hibernate配置子类。

* 新的OpenSessionInViewFilter 推迟打开Session

通过新实现的OpenSessionInViewFilter过滤器,推迟打开Session，仅在使用时打开，并占用数据库连接。可以在访问login页面、
具有缓存的页面等不是必须使用数据库的场景下，优化对连接使用。

* 新的SessionFactoryBean

新的SessionFactoryBean支持通过Java的方式添加类。模块通过继承AbstractPersistModule，并在jar包中的META-INF/beangle/persist.properties中声明如下：

```
module=com.your.company.webapp.YouPersistModule
#hibernate.session_factory_name=jdbc/custom_name(optional)
```

此外SessionFactoryBean还支持两个有意思的特性

    1. 从System.properties中设置hibernate.properties，允许从运行参数中的动态设置。
    2. 支持全局hibernate.hbm.xml映射文件，可以免去从annotation扫描，集合其他的xml的开销，同时可以支持加载序列化的xml。


### 2. 支持Hibernate的工具

* HbmGenerator （实验性）

支持将现有的配置，转换成一体的xml配置。不管现有的配置时纯注解还是混合xml。

* DdlGenerator

支持指定包生成特定类的ddl语句，包括**注释**

