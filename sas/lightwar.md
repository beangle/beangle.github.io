---
layout: page
title: "Sas Light War"
---
{% include JB/setup %}

Beangle Sas Server支持war包声明依赖项，容器加载的方式，从而降低war包体积的做法。

### 1. 手工制作轻量级war包
每个应用依赖的包和其他应用之间多少有些重复，例如使用了Struts2,Log4j等第三方开源的包。这些包通常都可以在maven仓库上可以下到。
因此可以这些包从war中排除调，在war运行的时候，tomcat服务器会下载到本地缓存中，可以在各个应用之间共用。

* 增加container.dependencies

在war的WEB-INF/classes/META-INF/目录下建立一个container.dependencies文件，内部可以使用

    #groupId:artifactId:version的格式
    org.hibernate:hibernate-core:4.3.1.Final
    org.hibernate:hibernate-ehcache:4.3.1.Final

* 清理war包

这包中的WEB/lib中上述jar文件删除，再将war包放到webapps中即可。

* 更改Context定义

在youcontext.xml或者server.xml中的Context定义中，添加

{% highlight xml linenos %}
<Loader className="org.apache.catalina.loader.RepositoryLoader"/>
{% endhighlight %}
其中cacheLayout表示本地缓存的风格，支持maven2和ivy2。可以补充cacheBase属性，设置本地缓存的位置(例如/opt/maven/repository)

    默认使用maven2，目录默认为~/.m2/repository.
    当风格为ivy2时，默认为~/.ivy2/cache

### 2.使用maven制作轻量级war

使用maven的项目可以省去上面的步骤：

* 定义provided依赖

在项目的pom文件中增加：

{% highlight xml linenos %}
<dependency>
  <groupId>org.hibernate</groupId>
  <artifactId>hibernate-core</artifactId>
  <scope>provided</scope>
</dependency>
{% endhighlight %}

* 增加自动打包支持

在pom的build部分增加

{% highlight xml linenos %}
  <build>
      <plugins>
        <plugin>
          <groupId>org.beangle.maven</groupId>
          <artifactId>beangle-maven-plugin</artifactId>
          <version>0.3.23</version>
          <executions>
            <execution>
              <id>generate</id>
              <phase>prepare-package</phase>
              <goals>
                <goal>sas</goal>
              </goals>
            </execution>
          </executions>
        </plugin>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-war-plugin</artifactId>
          <version>3.0.0</version>
          <configuration>
            <packagingExcludes>
            %regex[WEB-INF/lib/.*[^T].jar]
            </packagingExcludes>
          </configuration>
        </plugin>
      </plugins>
    </build>
{% endhighlight %}

直接运行mvn clean install即可将自动生成container.dependencies，并打到包中。
