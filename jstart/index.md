# jstart

jstart 是用 D 语言实现的轻量级 Java 工件（jar/war）启动器，取代旧的 Boot Toolkit 启动脚本。
它本身是独立的原生可执行文件，定位是**命令**而非常驻服务。

## 功能和原理

jstart 面向瘦 jar/war：读取包内的依赖清单（jar 为 `META-INF/beangle/dependencies`，
war 为 `WEB-INF/classes/META-INF/beangle/dependencies`），把缺失的依赖从 Maven 仓库
下载到本地并做 `.sha1` 校验，再以正确的 classpath `exec` 成 `java` 启动应用；war 则由
`[engine] init` 命令先准备容器环境，再 exec 容器。依赖清单是依赖的**唯一来源**——jstart
不做传递依赖解析，全部运行期依赖须由构建期插件显式写全。

- 正式版依赖默认走内置镜像（阿里云 → 华为云 → Maven Central），可 `--remote=` 覆盖；
  SNAPSHOT 走独立的 `--snapshot-remote=`，两者互不混合；
- 本地仓库默认 `~/.m2/repository`，SNAPSHOT 时间戳构件单独放在 `~/.m2/snapshots`；
- 下载走宿主 `curl`，支持并行与增量补丁；`stop` 按 base 停止 `run` 启动的实例。

## 一、Maven工程中生成依赖文件

如果使用Maven构建项目，可以只通过插件在打包的时候生成这个依赖文件，省去手工编辑。
```xml
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
```
如果是普通的Jar工程，则配置maven-jar-plugin,添加Main-Class，如下：
```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-jar-plugin</artifactId>
  <version>3.4.2</version>
  <configuration>
    <archive>
      <manifest>
        <mainClass>com.yourcompany.project.MainClass</mainClass>
      </manifest>
    </archive>
  </configuration>
</plugin>
```

在工程的pom.xml中的plugins中添加这两个插件，并配置工程的入口类`com.yourcompany.project.MainClass`，这样在打包时就可以生成依赖文件。
_⚠️如果是spring-boot项目需要禁用`spring-boot-maven-plugin`插件，这个插件默认会打出fat jar。_

如果是War工程，需要配置maven-war-plugin，避免打包其他依赖到WEB-INF/lib中。
```xml
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
```

## 二、Sbt工程中生成依赖文件

在工程的`project/plugins.sbt`中引入Beangle构建插件：
```scala
addSbtPlugin("org.beangle.build" % "sbt-beangle-build" % "0.1.10")
```
并在`project/build.properties`中把sbt升级到2.x：
```properties
sbt.version=2.0.9
```
插件的BootPlugin是自动启用的，编译后会在`META-INF/beangle/dependencies`生成依赖文件，并随jar
自动打包，无需在build.sbt中做额外配置。如果这个jar需要直接启动，则再声明入口类：
```scala
Compile / packageBin / packageOptions +=
Package.ManifestAttributes(java.util.jar.Attributes.Name.MAIN_CLASS -> "org.your.main.class.name")
```
之后执行`sbt package`，打包结果中就会带上依赖文件。也可以单独执行`sbt bootDependencies`
生成该文件（写入`target/scala-*/resource_managed/main/META-INF/beangle/dependencies`），
或执行`sbt bootRepo`在`target/repository`组装一份Maven布局的离线仓库。更多说明见[Beangle Build](/build/index.html)。

## 三、安装

下载 jstart 的原生可执行文件并放到 `PATH`（运行需宿主 `curl`）。源码与下载见
[beangle/jstart](https://github.com/beangle/jstart)。

## 四、启动jar包

```bash
jstart run /path/to/your/project.jar
jstart run -Xmx1G -Dk1=v1 /path/to/your/project.jar arg1 arg2
jstart run org.beangle.sqlplus:beangle-sqlplus:0.0.46 db.xml
```

- `-D`/`-X` 开头的参数归 JVM，其余原样传给应用；
- 需要额外 classpath 时设置环境变量 `CLASSPATH_EXTRA`；
- 主类按 `--main=<class>` > launch spec 的 `[app] main` > jar 内 `Main-Class` 确定；
- `jstart run --print <target>` 只打印将执行的命令、不启动。

## 五、解析与查看

```bash
jstart resolve app.jar      # 准备依赖并输出应用绝对路径（exit=0 表示依赖齐备）
jstart classpath app.jar    # 输出 Main-Class@classpath，便于自定义启动脚本
jstart info app.jar         # 输出结构化解析结果（key: value）
```

## 六、运行war包 / 多实例

裸 war 必须写进 launch spec 的 `[app] entry`，并由 `[engine] init` 命令启动容器。日常由
[basctl](/bas/index.html) 编排：

```bash
basctl run /path/to/app.war --port=8080 --path=/app   # 嵌入式单应用
basctl start <farm|server|all>                        # 按 conf/server.xml 管理多实例
```

basctl 生成 launch spec 并调用 jstart，jstart 完成依赖解析与进程拉起。

## 七、停止

```bash
jstart stop <target>        # 停止 run 启动的实例（按 base）
```
