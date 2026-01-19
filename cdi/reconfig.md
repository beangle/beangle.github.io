# Spring再配置

## 一、为什么我们需要“再配置”?

### 1.POJO服务的两项配置问题

JavaBean形式的各种服务中，需要对其他服务和对自身属性的两项配置问题。

1. 对依赖的服务，javabean本身仅仅知道服务接口，但是无法确定服务的提供者。
2. 对自身的配置项，仅仅能够提供一些默认值。

这两项都可以称之为对bean的依赖配置或管理。现在IOC框架大都提供了基于xml或者
注解（Annotation)的配置方式。问题在于这些配置一旦模块化之后，就会发现难以克服的困难。

例如一个提供用户服务(UserService)的模块(bundle,jar),他依赖提供用户数据的服务（UserDao）.
实际上这两个服务的实现通常在同一模块中，以一个整体提供给系统的其他部分使用。如果我们提供了
另外一个服务UserDao接口的实现，并且想在整个系统中采用该实现的话，就需要将UserService实现的
提供者也使用该实现，但是userService实现的配置，无论是xml还是annotaion都是模块固化的，很难改变。

### 2.动态装配能否解决?

采用动态装配情况下，实现同一接口的两个实现，都难以提供给IOC容器选择。以spring为例

1. autowire-byName策略，一般这种策略基于名字的唯一性，实际上起不到使用新实现的效果
2. autowire-byType策略，这种策略注定要失败，因为同一类型的bean提供了两个，spring无法选择。

### 3.问题症结和最终需要
如果所有的bean的配置定义(xml)全部从模块中抽出来，统一在一个配置文件中手工解决，倒是可以。
实际上就是个再次配置的过程，但是这与模块化有些背道而驰。其实配置本身就是个组装服务的过程，为什么
还需要对其进行模块后，再更改呢？原因只有一个，如果不进行默认配置，则服务端配置工作量会很大，如果
进行了默认配置但不允许更改，将会产生服务不可替换和不可更改参数的两种情况。

spring jira给出了个这方便的表述:http://jira.springframework.org/browse/SPR-5509

列举了两个情景：
1. 测试情况下，对配置的微调
2. 扩展已有配置
或者说再配置的过程，应满足以下四个需要：
1. 我们需要扩展已有配置，包括更改属性，置空，增加属性配置，调整集合中的值。
2. 替换已有配置
3. 增加新的配置
4. 删除已有配置

## 二、使用spring可以接受的办法

### 1.不同文件中使用同一ID
基于spring的应用中，如果使用不同模块定义同一ID的bean，小心的规划模块之间的加载顺序，倒是可以
将之前模块的bean定义重新配置。实际上这适用于简单的情况，一旦模块中提供了很多可选实现，他就很难提供一个符合接口的唯一bean定义，
另外一般也不建议将不同实现的bean配置为同一个ID。这仅仅是spring提供的一个辅助特性。
例如最常见的是security中关于各种认证提供者（AuthenticationProvider）。

### 2.使用属性覆盖
org.springframework.beans.factory.config.PropertyOverrideConfigurer提供了一个基于属性
覆盖的策略，覆盖和修改单个属性，但是需要额外提供一个属性文件。

混合使用上述两中办法可以解决90%的情况，但是无法满足“删除已有配置”的需要。但是我们需要一个一致的，方便的
再次配置的途径。总体来讲利用现有的实现组合或配置一个符合要求的服务正是配置工作的核心。

## 三、好策略在哪里?

### 1.全局再次配置
如果能将对所有配置文件的bean定义进行再次配置，则可以较为统一的解决所有配置问题。
再次配置中，仅仅需要对指定的bean进行
1. 属性赋值
2. 删除原有配置
3. 合并到原有配置
例如：
在使用hibernate的过程中，我们定义了一个bean为hibernateConfig配置如下：
```xml
<bean id="hibernateConfig" class="org.springframework.beans.factory.config.PropertiesFactoryBean">
	<property name="properties">
		<props>
		    <prop key="hibernate.dialect">org.hibernate.dialect.HSQLDialect</prop>
			<prop key="hibernate.show_sql">false</prop>
		</props>
	</property>
</bean>
```
在测试环境下，我们需要更改为连接Oracle,不显示sql，但是需要动态更新数据库结构，即打开hbm2ddl的update。
因此，再配置如下：
```xml
<bean id="hibernateConfig" 
	<property name="properties">
		<props merge="true">
		    <prop key="hibernate.dialect">org.hibernate.dialect.OracleDialect</prop>
		    <prop key="hibernate.hbm2ddl.auto">update</prop>
		</props>
	</property>
</bean>
```
按照Don't Repeat it Yourself的原则，我们在配置中，不再声明hibernateConfig的类型，除非需要更换实现类。对于属性properties的再次配置，我们使用了合并属性的方式，仅仅更改了方言和添加了hbm2ddl的配置。

所以这些再配置信息,集中放在一个文件中，例如spring-config.xml中，即可实现手工对bean默认配置的更改。*目前beangle-commons中的config包按照spring的PostProcessor方式实现了上述建议的再次配置功能。*
