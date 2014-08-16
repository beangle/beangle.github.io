---
layout: page
title: "Commons Core"
description: "通用基础类库"
tags: [commons]
---
{% include JB/setup %}

1 集合操作和辅助类

* 数据分页

  如何让一个在集合呈现一种分页的效果呢——需要对集合进行包装。在一些缓存数据和数据后端无法提供分页的基础上，可以采用基于列表的内存分页方式。

{% highlight scala %}
    val sers = new collection.mutable.ListBuffer[User]
    (0,1000) foreach{ i=>
      users += new User(i)
    }

    val one=new PagedList(users,20);
    while(page.hasNext){
       val next = page.next()
       //do something
    }
{% endhighlight %}

* 数据转换和筛选

  筛选集合中符合特定规则的对象，收集(Select)成一个新的集合，也是经常遇到的。例如查找性别为男性的用户。
{% highlight scala %}
    val maleUsers=Collections.select(users, new Predicate(){
	  def  apply(user User):Boolean= (user.getGender.getName=="男")
    });
{% endhighlight %}

* 对象比较器

  往往我们需要按照指定的属性进行排序，例如按照创建日期、用户名排序。可以使用以下语句进行排序。
  
{% highlight scala %}
    val users=CollectUtils.newArrayList();
    users.sortBy(new PropertyOrdering("username",true))
    // sort by creator's username
    users.sortBy(new PropertyComparator("creator.username",true))
    //[User,Group] list
    val userGroups:Seq[Array[Object]]=search()
    userGroups.sortBy(new PropertyComparator("[0].username",true)
{% endhighlight %}
