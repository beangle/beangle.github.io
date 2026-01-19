# <img src='https://spring.io/img/spring-2.svg' style='height:30px;display:inline-block;'/> 绑定spring中的Bean

## 起因
如果在spring bean配置中厌烦使用的大量xml，又不能对代码标以注解（annotation），可以使用beangle提供的scala方式进行bean注册。
优点是

1. 支持重构，避免类名拼写错误
2. 配置量少简单、快捷

## 如何进行绑定
就权限系统中常见的用户、角色、权限等服务，配置简单例子如下：

```scala
package org.beangle.sample
import org.beangle.commons.inject.bind.AbstractBindModule
class DefaultModule extends AbstractBindModule {

  protected override def doBinding() {
    //以单例形式绑定单个bean,不必声明绑定实现类对应的接口
    bind(classOf[PermissionServiceImpl])
    //以单例形式绑定批量绑定多个bean
    bind(classOf[UserServiceImpl],classOf[RoleServiceImpl])
    //绑定Action每次使用创建新的实例
    bind(classOf[UserAction]).in(Scope.PROTOTYPE)
  }
}
```

然后，将beangle自带的SpringConfigProcessor处理器以及刚才定义的DefaultModule，注入到spring bean中，即实现bean配置。
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

  <bean id="BeangeSpringConfigProcessor" class="org.beangle.inject.spring.config.SpringConfigProcessor">
    <property name="reconfigResources" value=";classpath*:spring-config.xml"/>
  </bean>

  <bean class="org.beangle.sample.DefaultModule"/>
</beans>
```
以上的例子完成了四个bean的定义，等价与一下xml配置。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

  <bean class="org.beangle.sample.service.PermissionServiceImpl"
    id="org.beangle.sample.service.PermissionServiceImpl" autowire="no"/>

  <bean class="org.beangle.sample.service.UserServiceImpl"
      id="org.beangle.sample.service.UserServiceImpl" autowire="no"/>

  <bean class="org.beangle.sample.service.RoleServiceImpl"
      id="org.beangle.sample.service.RoleServiceImpl" autowire="no"/>

  <bean class="org.beangle.sample.web.action.UserAction"
    id="org.beangle.sample.web.action.UserAction" autowire="no">
    <property name="userService" ref="org.beangle.sample.service.UserServiceImpl"/>
    <property name="roleService" ref="org.beangle.sample.service.RoleServiceImpl"/>
    <property name="permissionService" ref="org.beangle.sample.service.PermissionServiceImpl"/>
  </bean>
</beans>
```
## 原理和要求
SpringConfigProcessor后处理器，通过查询spring中注册的类似DefaultModule之类的bean，提取其中的"配置"，然后注册到spring中。
从功效上类似xml注册，在运行期间，不参与bean实例化，因此不存在运行开销。

至于bean之间的依赖关系（通过setXXX形式声明的），绑定后续处理中自行完成，无需声明类似autoWireByName,autoWireByType等自动注入策略。针对bean的某个依赖属性，实现一下注入逻辑：

1. 首先查找符合注入的类型的bean配置列表，对应UserAction.userService对应UserService接口。
2. 如果仅有一个符合的bean配置，直接完成注入，这一点类似autowire="byType"。
3. 然后根据bean的name是否符合属性名，如果符合完成注入，这一点类似autowire="byName"。
4. 如果没有找到，查找列表中有无注册为primary的bean，即首选和默认bean，找到第一个进行注册。
5. 仍然没找到，提示警告。

上例中UserAction中使用UserService接口，自动注入逻辑中发现了符合要求的实例仅存在UserServiceImpl一个实现，直接进行注入。

## 支持spring的配置范围

目前支持spring的配置语法如下

  * name，id属性 --> bind("youbeanname",bean.class)
  * parent属性 --> bind(Bean.class).parent("parentBeanName");
  * lazy属性 --> bind(Bean.class).lazy();
  * primary --> bind(Bean.class).primary();
  * scope --> bind(Bean.class).in(Scope.SINGLETON);
  * abstract --> bind(Bean.class).setAbstract();
  * property --> bind(Bean.class).property("attr",value);
  * 属性中存在bean --> bind(Bean.class).property("attr",bean(InnerBean.class).property("attr1","value1"));
  * 属性中存在ref的 --> bind(Bean.class).property("s1",ref(Service.clas)).property("s2",ref("s2Bean"));

针对list，set，map，array之类的集合属性配置
例如ProviderManager中管理了`providers`列表，类型为`List<Provider>`;
注入方式如下：

```scala
bind(ProviderManage.class).property("providers",list(AProvider.class,BProvider.class));
```
如果采用注册好的bean，采用形式如下：
```scala
bind("aprovider",AProvider.class).property("superman","admin");
bind(ProviderManage.class).property("providers",list(ref("aprovider"),BProvider.class));
```
而BProvider则被注册为一个名称较长的内部单例bean。或者
```scala
bind(AProvider.class).property("superman","admin");
bind(BProvider.class).property("sompeproperty","value");
bind(ProviderManage.class).property("providers",listref(AProvider.class,BProvider.class));
```
类似array，set，之类的可以采用set(),array()语法注入多个bean。

针对Map,采用的语法稍有不同：
```scala
bind("restrictionService", RestrictionServiceImpl.class).property("providers",
    map(entry("csv", CsvDataResolver.class), entry("oql", OqlDataProvider.class))).property(
    "dataResolver",IdentifierDataResolver.class);
```
采用entry(key,value)函数表示一个元素。

所有在集合、map中使用的Class类型数据，如果没有采用ref(Some.class)形式，而是直接使用Some.class,效果是不一样的。例如
```scala
// bind(AProvider.class,BProvider.class)；不需要这样的代码了
// list(Class<?> ... classes)会直接创建bean的定义
bind(ProviderManage.class).property("providers",list(AProvider.class,BProvider.class));
//如果想使用已有的配置，则需要采用ref
bind(ProviderManage.class).property("providers",list(ref(AProvider.class),ref(BProvider.class)));
//或者使用listref
bind(ProviderManage.class).property("providers",listref(AProvider.class,BProvider.class));
```
