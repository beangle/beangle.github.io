---
layout: page
title: "Webmvc Core"
description: "Webmvch核心功能"
tags: [webmvc]
---
{% include JB/setup %}

Webmvc-core是为了取代Struts-Convention-Plugin , Codebehind Plugin and Zero Config plugins. 等包，提供类似的功能。

*  比Struts-Convention-Plugin更短的配置
*  以Profile的形式，支持多套约定
*  类名到url绑定
*  包名到namespace绑定
*  支持三种url形式(i.e simple/short/seo)
*  支持三种page布局形式(i.e simple/full/seo)
*  通过xml重制约定配置

##### 1.和Struts Convention Plugin不同的地方

  * 以profile的方式支持多种约定风格
  * 每个profile可以支持不同的URI风格，页面的路径布局
  * 不再扫描类
  * 支持合并struts xml

##### 2.Default profile introduction

Beangle-Strust2 包含了一个缺省的路由文件 *convention-default.properties*.

	# action 的包名模式
	default.actionPattern=default
	# action 类文件的后缀,例如 Controller，默认是Action
	default.actionSuffix=Action
	# 是否允许扫描您的action配置
	default.actionScan=true
	# 缺省的视图存放的路径
	default.viewPath=/
	# 页面文件的路径采用什么风格(full 和类的路径一样，simple 采用action名字作为文件夹,seo 采用命名空间作为文件夹)
	default.viewPathStyle=full
	# 页面的扩展名
	default.viewExtension=ftl
	# 生成的url的固定前缀
	default.uriPath=/
	# url路径的更个(simple为 /my/package/actionName,short 为/actionName，seo 为/my/package/action_name)
	default.uriPathStyle=seo
	# uri 后缀
	default.uriExtension=action
	# action缺省方法
	default.defaultMethod=index

##### 3.编写您的profile
在项目中添加一个 *META-INF/convention-route.properties* 或者放置在maven工程的*src/main/resources* 路径下.

	profile0.actionPattern=com.example.actions
	profile0.uriPathStyle=seo

##### 4.例子

如果我们在com.example包下面，有三个action，想让他们按照seo的方式映射:

	com.example.actions.MainAction -> /main
	com.example.products.actions.DisplayAction -> /products/display
	com.example.company.actions.details.ShowCompanyDetailsAction -> /company/details/show-company-details

需要的profile类似

	profile0.actionPattern=com.example.actions
	profile1.actionPattern=com.example.*.actions
	profile1.viewPath=/pages/

##### 5.Demo
Action code like this

	package com.example.product.actions;

	import org.beangle.strust2.action.DispatchAction; 

	public class ManagerAction extends BaseAction {
	  private String message;

	  public String getMessage() {
		return message;
	  }

	  public String search(){
		 // find products using sql instead
		 List products=new ArrayList();
		 put("products",products);
		 return forward();
	  }

	  public String info() {
		put("product",new Product());
		// or return SUCCESS;
		return forward();
	  }

	  public String remove(){
		Long productId= getLong("product.id");
		// remove it
		// redirect to search method with success message 
		return redirect("search","info.remove.success");
	  }
	}

create *pages* folder and file located src/main/resources or webapp.
	/pages/:
	product/manager/list.ftl
	product/manager/info.ftl

NO Struts action config and spring action bean config needed.
