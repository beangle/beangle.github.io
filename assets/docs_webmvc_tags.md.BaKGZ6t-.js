import{_ as s,c as t,o as n,ae as e}from"./chunks/framework.CBTkueSR.js";const q=JSON.parse('{"title":"Webmvc 标签","description":"","frontmatter":{},"headers":[],"relativePath":"docs/webmvc/tags.md","filePath":"docs/webmvc/tags.md"}'),p={name:"docs/webmvc/tags.md"};function i(o,a,l,u,c,r){return n(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="webmvc-标签" tabindex="-1">Webmvc 标签 <a class="header-anchor" href="#webmvc-标签" aria-label="Permalink to &quot;Webmvc 标签&quot;">​</a></h1><p>Beangle webmvc提供了以b开头的一组标签和方法, 他利用freemarker,提供高度集成化的freemarker UI标签,主要的方法有：</p><h2 id="国际化" tabindex="-1">国际化 <a class="header-anchor" href="#国际化" aria-label="Permalink to &quot;国际化&quot;">​</a></h2><ul><li>b.text(key) 无参调用</li><li>b.text(key,val1) 仅含有一个参数</li><li>b.text(key,val1,val2) 两个参数</li></ul><h2 id="url生成" tabindex="-1">URL生成 <a class="header-anchor" href="#url生成" aria-label="Permalink to &quot;URL生成&quot;">​</a></h2><p>如果当前访问地址为：<code>/security/user.action</code></p><ul><li>b.url(&quot;!delete?id=1&quot;) -&gt; /security/user!delete.action?id=1</li><li>b.url(&quot;group!search&quot;) -&gt; /security/group!search.action</li><li>b.url(&quot;/system/info&quot;) -&gt; /system/info.action</li></ul><h2 id="web资源主题支持" tabindex="-1">web资源主题支持 <a class="header-anchor" href="#web资源主题支持" aria-label="Permalink to &quot;web资源主题支持&quot;">​</a></h2><p>Beangle对web资源主题的布局如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static/themes/</span></span>
<span class="line"><span>      themename/icons/[16x16|48x48]/any.png</span></span>
<span class="line"><span>      themename/any.css</span></span></code></pre></div><ul><li>访问当前主题的名称 b.theme.ui</li><li>访问当前主题的css为<code>[@b.css href=&quot;my.css&quot;/]</code></li><li>访问主题中的16x16的图标，<code>\${b.iconurl(&quot;action/save.png&quot;)}</code></li><li>访问主题中的48x48的图标，<code>\${b.iconurl(&quot;action/save.png&quot;,48)}</code></li></ul><h2 id="web组件" tabindex="-1">web组件 <a class="header-anchor" href="#web组件" aria-label="Permalink to &quot;web组件&quot;">​</a></h2><ul><li>anchor(a) 能够进行异步访问的锚</li></ul><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[@b.a href=&quot;!info?id=4&quot; href=&quot;mydiv&quot;/]</span></span></code></pre></div><ul><li>grid(row/col/boxcol) 进行数据表格样式显示</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[@b.grid items=users var=&quot;user&quot;]</span></span>
<span class="line"><span>  [@b.gridbar]</span></span>
<span class="line"><span>  bar.addItem(&quot;\${b.text(&quot;action.new&quot;)}&quot;,action.add());</span></span>
<span class="line"><span>  bar.addItem(&quot;\${b.text(&quot;action.modify&quot;)}&quot;,action.edit());</span></span>
<span class="line"><span>  bar.addItem(&quot;\${b.text(&quot;action.freeze&quot;)}&quot;,activateUser(&#39;false&#39;),&#39;\${b.theme.iconurl(&#39;actions/freeze.png&#39;)}&#39;);</span></span>
<span class="line"><span>  bar.addItem(&quot;\${b.text(&quot;action.activate&quot;)}&quot;,activateUser(&#39;true&#39;),&#39;\${b.theme.iconurl(&#39;actions/activate.png&#39;)}&#39;);</span></span>
<span class="line"><span>  bar.addItem(&quot;\${b.text(&quot;action.delete&quot;)}&quot;,action.remove());</span></span>
<span class="line"><span>  bar.addItem(&quot;\${b.text(&quot;action.export&quot;)}&quot;,exportUserList());</span></span>
<span class="line"><span>  function activateUser(isActivate){</span></span>
<span class="line"><span>    return action.multi(&quot;activate&quot;,&quot;确定提交?&quot;,&quot;isActivate=&quot;+isActivate);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  function exportUserList(){</span></span>
<span class="line"><span>    extParams=&quot;properties=&quot;+&quot;name,fullname,mail,groups,creator.fullname,createdAt,updatedAt,status&quot;;</span></span>
<span class="line"><span>    extParams+=&quot;&amp;titles=&quot;+&quot;登录名,姓名,电子邮件,用户组,创建者,创建时间,修改时间,状态&quot;;</span></span>
<span class="line"><span>    return action.method(&quot;export&quot;,null,extParams,false);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  [/@]</span></span>
<span class="line"><span>  [@b.row]</span></span>
<span class="line"><span>    [@b.boxcol/]</span></span>
<span class="line"><span>    [@b.col property=&quot;name&quot;][@b.a href=&quot;!dashboard?user.id=\${user.id}&quot; target=&quot;_blank&quot;]\${user.name}[/@][/@]</span></span>
<span class="line"><span>    [@b.col property=&quot;fullname&quot;/]</span></span>
<span class="line"><span>    [@b.col property=&quot;mail&quot; title=&quot;common.email&quot; /]</span></span>
<span class="line"><span>    [@b.col property=&quot;creator.fullname&quot;/]</span></span>
<span class="line"><span>    [@b.col property=&quot;defaultCategory.name&quot; title=&quot;entity.userCategory&quot;]</span></span>
<span class="line"><span>      [#list user.categories as uc]</span></span>
<span class="line"><span>        [#if uc!=user.defaultCategory]&lt;em&gt;\${uc.name}&lt;/em&gt;[#else]\${uc.name}[/#if][#if uc_has_next]&amp;nbsp;[/#if]</span></span>
<span class="line"><span>      [/#list]</span></span>
<span class="line"><span>    [/@]</span></span>
<span class="line"><span>    [@b.col property=&quot;updatedAt&quot; title=&quot;common.updatedAt&quot;]\${user.updatedAt?string(&quot;yyyy-MM-dd&quot;)}[/@]</span></span>
<span class="line"><span>    [@b.col property=&quot;status&quot; title=&quot;common.status&quot;][@enableInfo user.enabled/][/@]</span></span>
<span class="line"><span>  [/@]</span></span>
<span class="line"><span>[/@]</span></span></code></pre></div><ul><li>nav(navmenu/navitem)</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[@b.navmenu title=&quot;权限管理&quot;]</span></span>
<span class="line"><span>  [@b.navitem title=&quot;控制台&quot; href=&quot;index&quot;/]</span></span>
<span class="line"><span>  [@b.navitem title=&quot;用户&quot; href=&quot;/security/user&quot; /]</span></span>
<span class="line"><span>  [@b.navitem title=&quot;用户组&quot; href=&quot;/security/group&quot; /]</span></span>
<span class="line"><span>  [@b.navitem title=&quot;菜单&quot; href=&quot;/security/menu&quot; /]</span></span>
<span class="line"><span>  [@b.navitem title=&quot;资源&quot; href=&quot;/security/resource!search&quot; /]</span></span>
<span class="line"><span>  [@b.navitem title=&quot;数据限制&quot; href=&quot;/security/restrict-meta&quot; /]</span></span>
<span class="line"><span>  [@b.navitem title=&quot;用户头像&quot; href=&quot;/avatar/board&quot; /]</span></span>
<span class="line"><span>  [@b.navitem title=&quot;系统监控&quot; href=&quot;/security/monitor&quot; /]</span></span>
<span class="line"><span>  [@b.navitem title=&quot;我的账户&quot; href=&quot;/security/my?nav=true&quot; /]</span></span>
<span class="line"><span>[/@]</span></span></code></pre></div><ul><li>form/submit 异步表单</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[@b.form action=&quot;!save&quot;]</span></span>
<span class="line"><span>  some html</span></span>
<span class="line"><span>[/@]</span></span></code></pre></div><ul><li>div 异步容器</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[@b.div href=&quot;!info?id=1&quot;/]</span></span></code></pre></div><ul><li>head/foot 根据是否为ajax请求，增加html头和脚</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[@b.head/][/@b.foot/]</span></span></code></pre></div><ul><li>toolbar</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[@b.toolbar title=&quot;my title&quot;]</span></span>
<span class="line"><span>  bar.addItem(&quot;upload&quot;,uploadfunciton);</span></span>
<span class="line"><span>[/@]</span></span></code></pre></div><ul><li>pagebar</li><li>messages(actionerror/actionmessage)</li><li>datepicker</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[@b.datepicker format=&quot;YYYY-MM-dd HH:mm&quot; value=&quot;2010-09-10 20:30&quot;/]</span></span></code></pre></div>`,28)])])}const b=s(p,[["render",i]]);export{q as __pageData,b as default};
