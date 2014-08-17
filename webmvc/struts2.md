
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
