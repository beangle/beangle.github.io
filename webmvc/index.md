---
layout: page
title: "WebMVC Index"
---
{% include JB/setup %}
Beangle WebMVC 就是取代Struts或者SpringMVC这样类似的框架，他不仅仅定义了一些用法和惯例，还提供了简单有力的实现。 

类似Struts和SpringMVC，该库所提倡的用法也是基于Command的。

Beangle WebMVC 所提倡的惯例和用法包括：

* 框架不应该从底层扫描class文件，这样不仅很慢，开发者也不能控制哪些action不进入框架。
* 框架应提供按照约定，指明符合哪些条件的Action/Controller是Command控制器(同时可以个别剃除)，而不是逐个通过xml定义。struts的struts-config.xml很强大，但是不采用模式匹配的情况下，配置逐个action及其result很繁琐。
* 框架应能在大部分场景下，不侵入用户代码。切换库的代码不能太大。Spring的各种Annotation虽然有助于类扫描，但是这种第三方库的耦合太强了。
* 拥有一定的模块集结能力，可以不用二次配置把各个jar包中的action、tag整合在一起。struts的plugin机制很好，springmvc中针对Controller可以按照模块扫描集结，但是针对非jsp的tag library支持不够。
* 应能提供restful的支持
* Action/Contoller应能支持单例
* 应能支持参数绑定
* 应能支持flash参数闪存

Beange WebMVC包括

* [定义Action及其规则](/webmvc/usage.html)
* [开发自定义标签](/webmvc/tag-model.html)
* [BeangleMVC内置标签](/webmvc/tags.html)

