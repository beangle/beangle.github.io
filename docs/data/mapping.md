
# 更加简单的Hibernate Data Mapping

## 1、定义实体

任意的实体Bean定义，如果想通过扫描的方式让框架进行序列化支持，均需要在源代码类上作些标记。

* 在类上添加javax.persistence.Entity注解
* 实现特定的接口(org.beangle.data.model.Entity)

例如定义一个User实体
```scala
@Entity
class User{
  @Id
  @GeneratedValue(strategy=SEQUENCE, generator="seq_users")
  var id:Integer=_

  @Embedded
  var name:Name=_
}

@Embeddable
class Name{
  var first:String=_
  var last:String=_
}
```
或者
```scala
class User extends LongId{
  var name:Name=_
}

class Name{
  var first:String=_
  var last:String=_
}
```

如果User类复杂度上升，模型中又增加了Role,Member等等，代码如下：

```scala
class User(var id: java.lang.Long) extends Entity[java.lang.Long] {
  def this() = this(0)
  var name = new Name
  var roleSet: java.util.Set[Role] = new java.util.HashSet[Role]
  var age: Option[Int] = None
  var money: Short = _
  var properties: collection.mutable.Map[String, String] = _
  var occupy: WeekState = _
  var weekday: WeekDay = _

  var createdOn: java.sql.Date = _
  var role: Role = _
  var roleList: collection.mutable.Buffer[Role] = new collection.mutable.ListBuffer[Role]
  var member: Member = _
  var skills: collection.mutable.Map[SkillType, Skill] = _
}
class SkillType extends LongId

class Skill extends LongId{
  var skillType:SkillType=_
}

class Name extends Component {
  var first: String = _
  var last: String = _
}

class Member extends Component {
  @scala.beans.BeanProperty
  var user: User = _
  var granter: Role = _
  var admin: Boolean = _
  var roles: collection.mutable.Set[Role] = _
}
```

## 2、映射实体

按照JPA的规范，实体的定义应该加上@Entity注解，嵌入类应该加上@Embeddable注解。其他各类属性、以及实体之间的关系、生命周期等等均需要在属性或者方法上加以注解说明。由于Java支持嵌套注解，很多描述相当强大，同时也比较复杂。

可在Scala中使用JPA，却困难重重。

* Scala不支持嵌套注解，导致很多高级定制场景无法使用。
* Scala原生的Option类型，在hibernate需要额外扩展支持。
* Scala原生的collection库，不能支持使用。由于JPA的注解只能使用在java.util.*的集合类库上。

上述代码中包含了以下情况：

 * 简单类型(money:Short,createdOn:Date)
 * Option类型(age:Option[Int])
 * 自定义类型(weekday:WeekDay,occupy:WeekState)
 * Java集合类型(roleSet:java.util.Set)
 * Scala集合类型(roleList:mutable.Buffer)
 * Scala的简单Map类型(properties:Map[String,String])
 * Scala的复杂Map类型(skills:Map[SkillType,Skill])
 * 组件类型(name,member)
 * 组件中的多对一，一对多(granter,roles)
 * 组件中的parent(user in Member)

这些情况如果使用传统的hibernate的映射文件，大致需要写法：

```xml
<class name="org.beangle.data.jpa.model.User" >
    <id name="id" unsaved-value="0" type="long" >
      <generator class="native"/>
    </id>
    <component name="name" class="Name">
      <property name="first" length="50"  column="first_name" not-null="true"/>
      <property name="last" length="50" not-null="true"/>
    </component>
    <set name="roleSet" table="users_role_set">
      <key column="user_id"/>
      <many-to-many entity-name="org.beangle.data.jpa.model.Role" column="role_id"/>
    </set>
    <list name="roleList" collection-type="seq" table="users_roles_list">
      <key column="user_id"/>
      <list-index column="idx"/>
      <many-to-many entity-name="org.beangle.data.jpa.model.Role" column="role_id"/>
    </list>
    <property name="age" type="int?"/>
    <map name="properties" cascade="all" collection-type="map" table="users_props">
        <key column="user_id"/>
        <map-key column="name" type="string"/>
        <element column="value" type="string"/>
    </map>
    <component name="member" class="Member">
      <parent name="user"/>
      <many-to-one name="granter"/>
      <property name="admin" not-null="true"/>
      <set name="roles" table="users_roles" collection-type="set">
        <key column="user_id"/>
        <many-to-many entity-name="org.beangle.data.jpa.model.Role" column="role_id"/>
      </set>
    </component>
    <property name="occupy" type="weekstate"/>
    <property name="createdOn"/>
    <map name="skills" cascade="all" collection-type="map">
        <key column="user_id"/>
        <map-key-many-to-many class="org.beangle.data.jpa.model.SkillType" column="skill_type_id"/>
        <many-to-many class="org.beangle.data.jpa.model.Skill" column="skill_id"/>
    </map>
</class>

<class name="org.beangle.data.jpa.model.Role" >
    <id name="id" unsaved-value="0" type="integer">
      <generator class="assigned"/>
    </id>
    <property name="name" length="50" unique="true"/>
</class>

<class name="org.beangle.data.jpa.model.Skill" table="skill_list" >
    <id name="id" unsaved-value="0" type="integer">
      <generator class="assigned"/>
    </id>
    <many-to-one name="skillType"/>
    <property name="name"/>
</class>

<class name="org.beangle.data.jpa.model.SkillType" >
    <id name="id" unsaved-value="0" type="integer">
      <generator class="assigned"/>
    </id>
    <property name="name"/>
</class>
```
## 3、使用代码方式进行配置

因此如果在scala中使用注解，支持全方位的映射功能，没有实现的办法。可以采用Beangle中基于代码的配置方法。
```scala
object TestMapping1 extends Mapping {

  def binding(): Unit = {
    defaultIdGenerator("assigned")

    bind[Coded].on(c => declare(c.code is (notnull, length(20))))

    bind[User].on(e => declare(
      e.name.first is (unique, column("first_name")),
      e.name.first & e.name.last & e.createdOn are notnull,
      e.roleList is (ordered, table("users_roles_list")),
      e.properties is (table("users_props"), eleColumn("value2"), eleLength(200)))).generator("native")

    bind[SkillType]
    bind[Skill].table("skill_list")

    bind[Role].on(r => declare(
      r.name is (notnull, length(112), unique),
      r.children is (depends("parent"), cacheable)))

  }
}
```
最后在META-INF/beangle/orm.xml进行注册
```xml
<?xml version="1.0" encoding="UTF-8"?>
<orm>
  <mapping class="org.beangle.data.jpa.hibernate.TestMapping1"/>
</orm>
```

以User为例说明如何注册类型：
```scala
bind[User]
```
这样声明后，User的原来在xml使用property，many-to-one,many-to-many(list,set,map)的属性是自动配置的，没有其他要求可以不必写明。
需要特殊要求的再进行说明。

**声明ID产生器以及缓存等：**
```scala
bind[User].generator("sequence").cacheable()
```
**说明属性非空：**
```scala
bind[User].on(e => declare(
  e.createdOn is notnull
))
```
**说明属性的多个方面：**
```scala
bind[User].on(e => declare(
  e.name.first is (unique, column("first_name"))
))
```
**多个属性打包说明：**
```scala
bind[User].on(e => declare(
  e.name.first & e.name.last & e.createdOn are notnull
))
```
**增加集合的排序字段:**
```scala
bind[User].on(e => declare(
  e.roleList is ordered
))
```
**声明一对多:**
```scala
bind[Role].on(e => declare(
  r.children is one2many("parent").cascade("all",true)
))
```
如果属于具有依赖关系的主从的关系：
```scala
bind[Role].on(e => declare(
  r.children is depends("parent")
))
```
**声明缓存区和策略:**
```scala
defaultCache("test_cache_region", "read-write")
bind[A]
bind[B].cache("B_cache","ready_only")
// bind....
all.except(classOf[C],classOf[D],classOf[B]).cachable()
```
默认缓存区test_cache_region,本模块的所有类除了B、C、D之外所有的类都进行缓存。

**扩展一个既定模块的类:**
```scala
class ExtendRole(id: Integer) extends Role(id) {
  var enName: String = _
  def this() = this(0)
}

object TestMapping2 extends Mapping {
  def binding(): Unit = {
    //使用相同的Entity-Name,即可实现重置。Role的表中会增加en_name字段
    bind[ExtendRole](classOf[Role].getName)
  }
}
```
在META-INF/beangle/orm.xml进行增加注册
```xml
<?xml version="1.0" encoding="UTF-8"?>
<orm>
  <mapping class="org.beangle.data.jpa.hibernate.TestMapping1"/>
  <mapping class="org.beangle.data.jpa.hibernate.TestMapping2"/>
</orm>
```
**映射一个接口或者超类:**
```scala
bind[CodedEntity].on(c => declare(c.code is (length(22))))
```
CodedEntity的子类，其Code属性的长度为22.

**自定义表名**
```scala
bind[User].on(e => declare(
  e.roleList is (ordered, table("users_roles_list"))
)).table("user_list")
```
**配置Map**
```scala
bind[User].on(e => declare(
  e.properties is (table("users_props"), eleColumn("value2"), eleLength(200))
))
```
User中的properties属性中的value对应到列value2上，长度为200.

**声明命名策略和schema划分**

在META-INF/beangle/orm.xml进行增加注册
```xml
<?xml version="1.0" encoding="UTF-8"?>
<orm>
  <mapping class="org.beangle.data.jpa.hibernate.TestMapping1"/>
  <mapping class="org.beangle.data.jpa.hibernate.TestMapping2"/>
  <naming>
    <profile package = "org.beangle.data.jpa" pluralize="true" schema="jpa">
      <profile package = "mapping" plau="true" prefix="mp_"/>
    </profile>

    <profile package = "org.beangle.data.jpa.dao" pluralize="true" schema="dao"/>
  </naming>
</orm>
```
jpa模块会映射到jpa的schema上，其他的包各自映射自己的schema上。profile中支持嵌套描述子包的特征,子包继承父包的特征。
例如对应org.beangle.data.jpa.mapping的profile，其表前缀为mp_,schema仍为jpa.
