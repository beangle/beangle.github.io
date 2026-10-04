# 轻量级war包的生成和部署

Beangle Bas Server支持war包声明依赖项、由容器加载的方式，从而降低war包体积的做法。

## 1. 手工制作轻量级war包
每个应用依赖的包和其他应用之间多少有些重复，例如使用了Struts2,Log4j等第三方开源的包。这些包通常都可以在maven仓库上可以下到。
因此可以这些包从war中排除调，在war运行的时候，Bas Server会下载到本地缓存中，可以在各个应用之间共用。

* 增加依赖声明文件

在war的`WEB-INF/classes/META-INF/beangle/dependencies`文件（普通jar为`META-INF/beangle/dependencies`）中声明依赖，内部可以使用
```
#groupId:artifactId:version的格式
org.hibernate:hibernate-core:4.3.1.Final
org.hibernate:hibernate-ehcache:4.3.1.Final
```

* 清理war包

这包中的WEB/lib中上述jar文件删除，再将war包放到webapps中即可。Bas Server启动时会由引擎的
`DependencyClassLoader`读取该声明文件，把声明的依赖解析到本地maven仓库后加载，无需手工配置Context的Loader。

## 2.使用maven制作轻量级war

使用maven的项目可以省去上面的步骤：

* 定义provided依赖

在项目的pom文件中增加：

```xml
<dependency>
  <groupId>org.hibernate</groupId>
  <artifactId>hibernate-core</artifactId>
  <scope>provided</scope>
</dependency>
```

* 增加自动打包支持

在pom的build部分增加

```xml
  <build>
      <plugins>
        <plugin>
          <groupId>org.beangle.maven</groupId>
          <artifactId>beangle-maven-plugin</artifactId>
          <version>0.3.32</version>
          <executions>
            <execution>
              <id>generate</id>
              <phase>compile</phase>
              <goals>
                <goal>dependencies</goal>
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
```

直接运行mvn clean install即可将自动生成依赖声明文件，并打到包中。
