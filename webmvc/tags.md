---
layout: page
title: "Webmvc Tag"
description: "Webmvch 标签"
tags: [webmvc]
---
{% include JB/setup %}

Beangle webmvc提供了以b开头的一组标签和方法, 他利用freemarker,提供高度集成化的freemarker UI标签,主要的方法有：

#### 国际化
* b.text(key) 无参调用
* b.text(key,val1) 仅含有一个参数
* b.text(key,val1,val2) 两个参数

#### URL生成
如果当前访问地址为：/security/user.action

* b.url("!delete?id=1") -> /security/user!delete.action?id=1
* b.url("group!search") -> /security/group!search.action
* b.url("/system/info") -> /system/info.action

#### web资源主题支持
Beangle对web资源主题的布局如下
```
static/themes/
			themename/icons/[16x16|48x48]/any.png
			themename/any.css
```

* 访问当前主题的名称 b.theme.ui
* 访问当前主题的css为[@b.css href="my.css"/]
* 访问主题中的16x16的图标，${b.iconurl("action/save.png")}
* 访问主题中的48x48的图标，${b.iconurl("action/save.png",48)}

#### web组件

* anchor(a) 能够进行异步访问的锚
{% highlight ftl %}
  [@b.a href="!info?id=4" href="mydiv"/]
{% endhighlight %}

* grid(row/col/boxcol) 进行数据表格样式显示
{% highlight ftl %}
[@b.grid items=users var="user"]
	[@b.gridbar]
	bar.addItem("${b.text("action.new")}",action.add());
	bar.addItem("${b.text("action.modify")}",action.edit());
	bar.addItem("${b.text("action.freeze")}",activateUser('false'),'${b.theme.iconurl('actions/freeze.png')}');
	bar.addItem("${b.text("action.activate")}",activateUser('true'),'${b.theme.iconurl('actions/activate.png')}');
	bar.addItem("${b.text("action.delete")}",action.remove());
	bar.addItem("${b.text("action.export")}",exportUserList());
	function activateUser(isActivate){
		return action.multi("activate","确定提交?","isActivate="+isActivate);
	}
	function exportUserList(){
		extParams="properties="+"name,fullname,mail,groups,creator.fullname,createdAt,updatedAt,status";
		extParams+="&titles="+"登录名,姓名,电子邮件,用户组,创建者,创建时间,修改时间,状态";
		return action.method("export",null,extParams,false);
	}
	[/@]
	[@b.row]
		[@b.boxcol/]
		[@b.col property="name"][@b.a href="!dashboard?user.id=${user.id}" target="_blank"]${user.name}[/@][/@]
		[@b.col property="fullname"/]
		[@b.col property="mail" title="common.email" /]
		[@b.col property="creator.fullname"/]
		[@b.col property="defaultCategory.name" title="entity.userCategory"]
			[#list user.categories as uc]
				[#if uc!=user.defaultCategory]<em>${uc.name}</em>[#else]${uc.name}[/#if][#if uc_has_next]&nbsp;[/#if]
			[/#list]
		[/@]
		[@b.col property="updatedAt" title="common.updatedAt"]${user.updatedAt?string("yyyy-MM-dd")}[/@]
		[@b.col property="status" title="common.status"][@enableInfo user.enabled/][/@]
	[/@]
[/@]
{% endhighlight %}

* nav(navmenu/navitem)
{% highlight ftl %}
	[@b.navmenu title="权限管理"]
		[@b.navitem title="控制台" href="index"/]
		[@b.navitem title="用户" href="/security/user" /]
		[@b.navitem title="用户组" href="/security/group" /]
		[@b.navitem title="菜单" href="/security/menu" /]
		[@b.navitem title="资源" href="/security/resource!search" /]
		[@b.navitem title="数据限制" href="/security/restrict-meta" /]
		[@b.navitem title="用户头像" href="/avatar/board" /]
		[@b.navitem title="系统监控" href="/security/monitor" /]
		[@b.navitem title="我的账户" href="/security/my?nav=true" /]
	[/@]
{% endhighlight %}
* form/submit 异步表单
{% highlight ftl %}
	[@b.form action="!save"]
		some html
	[/@]
{% endhighlight %}
* div 异步容器
{% highlight ftl %}
	[@b.div href="!info?id=1"/]
{% endhighlight %}
* head/foot 根据是否为ajax请求，增加html头和脚
{% highlight ftl %}
	[@b.head/][/@b.foot/]
{% endhighlight %}
* toolbar
{% highlight ftl %}
    [@b.toolbar title="my title"]
	  bar.addItem("upload",uploadfunciton);
    [/@]
{% endhighlight %}
* pagebar
* messages(actionerror/actionmessage)
* datepicker
{% highlight ftl %}
	[@b.datepicker format="YYYY-MM-dd HH:mm" value="2010-09-10 20:30"/]
{% endhighlight %}

