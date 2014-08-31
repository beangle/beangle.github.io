---
layout: page
title: "Commons Release 4.1.0"
description: "通用基础类4.1.0发布"
tags: [commons]
---
{% include JB/setup %}

Beangle Commons Core
====

1.增强
--

* 增加了spi注解
* 增加了description注解，以及绑定支持
* 支持PlaceHolder及其默认值
* Arrays中增加了isBlank，concat 方法 
* 增加了ResourceResolver，支持按照模式查找资源
* 增加了Locales解析类
* 增加了BeanManifest专门用于采集属性
* 支持Injection
* 增加了更多的mimetype
* Strings增加了stripEnd方法，用于删除尾部的字符串
* 增加了Des算法支持

2.重构和向后不兼容改变
--

* 删除了PropertyTransformer，UnaryFunction，BinaryFunction用scala原生的接口取代
* 重构了Text Bundle的目录结构，删除了spi包，采用spi注解的方式
* 重构了静态资源过滤器，过滤器接口去除了预先对出的字节数组
* 绑定bean时默认的LazyInit=true改为了false，有助于发现一些循环依赖错误。
* 重命名ContainerHook为ContainerRefreshedHook
* 删除了ClassInfo中关于属性的支持，这部分移动到BeanManifest
* 将xml形式的模块定义，转换成properties
* AbstractBindModule的方法由doBinding改为binding
* 基于scala 2.11

3.修复错误
--

* 修复了TextFormat中的错误
* 修复数字转换错误(convertor error)
* 修复 Objects array equals error 

Beangle Commons Web
====

1.增强
--

* 新的web模块化支持(Initializer,web-module.properties)
* 增加了ServletContextHolder

2.重构和向后不兼容改变
--

* UrlRender的渲染方法中增加了context参数

