# Beangle Build

Beangle Build（`org.beangle.build:sbt-beangle-build`）是 Beangle 系列项目共用的 sbt 插件集，
把各仓库反复出现的构建约定收敛到一处：源码格式检查、代码行数统计、Maven 元信息内嵌、
启动依赖清单、war 打包与增量补丁、ORM/DDL 生成、GraalVM native-image 配置与原生包分发、
开发期嵌入式容器启动。

## 版本与兼容性

| 插件版本 | sbt | JDK | 说明 |
|----------|-----|-----|------|
| `0.1.x` | 2.x（artifact 后缀 `_sbt2_3`） | 17+ | 当前主线，本文对应 `0.1.10` |
| `0.0.x` | 1.x | 8+ | 旧版本，仅用于仍停留在 sbt 1.x 的项目 |

> 表中的 JDK 版本是**插件本身**的运行要求。Beangle 各模块的目标 JDK 由
> `sbt-beangle-parent` 统一决定（当前为 JDK 25），与插件的最低要求无关。

## 引入

```scala
// project/plugins.sbt
addSbtPlugin("org.beangle.build" % "sbt-beangle-build" % "0.1.10")
```

```properties
# project/build.properties
sbt.version=2.0.9
```

引入后**自动启用**的插件（`trigger = allRequirements`）立即生效，无需 `.enablePlugins(...)`；
**手动启用**的插件需要显式 `.enablePlugins(XxxPlugin)`。多数生成器在没有对应锚点文件
（`beangle.xml`、`meta-registrars.txt`、`aot-registrars.txt` 等）时自动跳过，不会导致构建失败。

## 插件一览

### 自动启用

| 插件 | 用途 |
|------|------|
| StylePlugin | 源码格式检查与格式化（空白 + 许可证头） |
| StatPlugin | 按扩展名统计代码行数 |
| PomPlugin | 打包时内嵌 Maven 元信息（`META-INF/maven`） |
| BootPlugin | 生成 beangle-boot 运行时依赖元数据 |
| CompileHookPlugin | 统一提供编译前/后钩子扩展点 |
| DdlPlugin | 生成 DDL 报告与版本间 DDL diff |
| OrmPlugin | 从 ORM 映射生成建表 DDL |

### 手动启用

| 插件 | 用途 |
|------|------|
| MetaPlugin | 聚合全 classpath 生成 bean 元数据索引 `beanmeta.idx` |
| AotPlugin | 聚合全 classpath 生成 GraalVM native-image 配置 |
| ProxyPlugin | 聚合全 classpath 生成 Hibernate 懒加载代理类 |
| NativeImagePlugin | 原生镜像链接、`tar.gz` 打包与增量发布 |
| WarPlugin | Web 应用 war 打包与增量 diff |
| SnapshotPlugin | 快照版本 war/jar 构建与上传 |
| TomcatPlugin | 开发期启动嵌入式 Tomcat |
| UndertowPlugin | 提供嵌入式 Undertow 测试依赖 |

> MetaPlugin、AotPlugin、ProxyPlugin 属于**终端集中式**生成器：由最终应用（war / native-image）
> 显式启用，扫描整个运行时 classpath 聚合各依赖库的声明锚点；库项目只负责携带声明，
> 不再各自生成配置产物。

## StylePlugin 格式检查与格式化

自动启用。编译前自动执行检查，并提供手工格式化任务。

| 任务 | 作用域 | 说明 |
|------|--------|------|
| `styleCheck` | Compile / Test | 检查空白（tab、行尾空格、CRLF）与许可证头，违规时列出文件并让编译失败 |
| `styleFormat` | Compile / Test | 手工格式化：tab→空格、去行尾空格、补末尾空行、CRLF→LF、按需补/替换许可证头 |

检查范围是 `unmanagedSourceDirectories ++ unmanagedResourceDirectories` 中的文本文件。
许可证头由 `licenses`（仅一个许可证时取其 SPDX id）、`startYear`、`organizationName` 推导，
内置 Apache-2.0、BSD-3-Clause、BSL-1.0、GPL-3.0、LGPL-3.0、MIT、MPL-2.0 模板。

| 设置 | 默认 | 说明 |
|------|------|------|
| `headerEmptyLine` | `true` | 许可证头与正文之间是否需要空行分隔 |

```scala
ThisBuild / licenses := Seq("LGPL-3.0" -> uri("https://www.gnu.org/licenses/lgpl-3.0.txt"))
ThisBuild / startYear := Some(2005)
ThisBuild / organizationName := "The Beangle Software"
```

```bash
sbt "Compile / styleCheck"     # 编译时自动执行，也可单独调用
sbt "Compile / styleFormat"    # 手工格式化
```

## StatPlugin 代码行数统计

自动启用，按文件扩展名统计非空行数（遍历项目根目录，排除 `target` 与隐藏目录）。

```bash
sbt "Compile / statSloc"
# myproject has 12345 lines.
# scala      8000
# xml        2345
# js         2000
```

## PomPlugin 内嵌 Maven 元信息

自动启用、无需配置：打包时把 `META-INF/maven/<groupId>/<artifactId>/pom.xml` 与
`pom.properties` 一并放入产物，行为和 `mvn package` 一致，便于按 jar 直接识别坐标。
POM 内容与 `publish` 完全相同（同样应用 `pomPostProcess`、`pomExtra`）；war 项目会自动落到
`WEB-INF/classes/META-INF/maven/...`。

## BootPlugin 运行时依赖元数据

自动启用。为 [jstart](/jstart/index.html) 一键启动生成运行时依赖清单：

| 任务 | 说明 |
|------|------|
| `bootDependencies` | 依据 `UpdateReport` 的 compile/runtime 配置生成 GAV 清单 `META-INF/beangle/dependencies` |
| `bootRepo` | 把实际存在的 jar 按 Maven 目录布局复制到 `target/repository` |

`bootDependencies` 通过编译后钩子写入 `Compile / resourceManaged`，因此 `sbt package`
会自动把清单打进 jar；`bootRepo` 则用 `target/repository` 提供离线启动仓库。

依赖筛选规则：

- 只取 `compile` 与 `runtime` 配置，**`test`、`provided`、`optional` 一律不进清单**；
- 排除 evicted 模块、SNAPSHOT 模块以及自身模块；
- 只保留无 classifier 的主 jar（`jar` / `bundle`），每行严格为 `groupId:artifactId:version`；
- `.dependsOn` 的兄弟模块仍会写出 GAV（便于发布后下载），但仅当 `exportJars := true`
  且 classpath 上有导出 jar 时才会复制进 `target/repository`。

```bash
sbt bootDependencies   # 生成 target/scala-*/resource_managed/main/META-INF/beangle/dependencies
sbt bootRepo           # 组装 target/repository（Maven 布局）
```

## CompileHookPlugin 编译钩子扩展点

自动启用，基础设施插件。sbt 中多个 AutoPlugin 若各自覆写同一个 key（如 `Compile / compile`），
后定义者会覆盖前者，本插件把"编译前后要执行的事"集中到一个唯一覆写点，供
Style、Boot、Meta、Aot、Proxy 等插件与用户项目一起挂载。

| 设置 | 类型 | 说明 |
|------|------|------|
| `compilePreHooks` | `Seq[Task[Unit]]` | `Compile / compile` 之前执行 |
| `compilePostHooks` | `Seq[Task[Unit]]` | `Compile / compile` 之后执行 |
| `testCompilePreHooks` | `Seq[Task[Unit]]` | `Test / compile` 之前执行 |
| `testCompilePostHooks` | `Seq[Task[Unit]]` | `Test / compile` 之后执行 |

```scala
Compile / compilePostHooks += Def.task {
  // 编译后要做的事，例如生成代码
  ()
}.taskValue
```

钩子任务里不要再去求值 `Compile / compile`，以免任务依赖成环。

## DdlPlugin DDL 报告与迁移脚本

自动启用。围绕 `src/main/resources/db/postgresql/` 下的数据库元数据工作：

| 任务 | 说明 |
|------|------|
| `ddlReport` | 把 `report.xml` 渲染为 HTML 报告到 `target/dbreport/` 并打开浏览器 |
| `ddlDiff oldVersion newVersion` | 对比两个 `db-<version>.xml`，生成增量迁移 SQL |

```bash
sbt "Compile / ddlReport"
sbt "Compile / ddlDiff 4.19.0 4.20.0"
# 生成 target/db/postgresql/migrate/4.19.0-4.20.0.sql
```

## OrmPlugin 建表 DDL 生成

自动启用。从 beangle-data 的 ORM 映射生成多数据库建表 DDL：

```bash
sbt "Compile / ormDdl"
# 生成 target/scala-*/db/ 下 PostgreSQL、MySQL、H2、Oracle、DB2、SQLServer 的 DDL
```

生成时使用 `Runtime / fullClasspath`，fork `org.beangle.data.orm.DdlGenerator`；
若过程中有警告，会输出 `warnings.txt` 并在构建日志中提示。

## MetaPlugin bean 元数据索引（终端集中式）

手动启用，由最终应用显式：

```scala
.enablePlugins(MetaPlugin) // 通常与 AotPlugin、ProxyPlugin 一起启用
```

终端项目构建时遍历整个运行时 classpath，读取各条目携带的 `MetaRegistrar` 声明
（`meta-registrars.txt` 与 `beangle.xml` 中的 mapping/module 声明），合并去重后生成一份
`META-INF/beangle/beanmeta.idx` 随产物打包；运行期由 beangle-commons 的 `MetaModels` 通过
`classpath*:` 直接加载，避免启动时反射扫描。

| 任务 | 作用域 | 说明 |
|------|--------|------|
| `metaIndex` | Compile / Test | 生成合并的 `META-INF/beangle/beanmeta.idx` |

Compile 扫描整个运行时 classpath；Test 只收集 test classes/资源里的声明（没有则跳过），
以免运行期用陈旧的 test 索引覆盖主索引。

## AotPlugin GraalVM native-image 配置生成（终端集中式）

手动启用，终端项目显式 `.enablePlugins(AotPlugin)`：

| 任务 | 作用域 | 说明 |
|------|--------|------|
| `aotHints` | Compile | 收集全 classpath 的 `AotHintRegistrar` 声明，生成合并的 native-image 配置 |

产物写入 `META-INF/native-image/beangle/`：`reachability-metadata.json`（GraalVM 25+ 格式，
含反射、资源、代理、序列化元数据）与 `native-image.properties`（有
`registerRuntimeInitialized` 时生成）。资源 glob 由各库的 registrar 显式声明
（如 `META-INF/services/*`、`beangle.xml`、`**/*.ftl`），不带 `module` 字段时在整个
classpath 上全局匹配，因此依赖库不需要自带 `META-INF/native-image/`。

## ProxyPlugin Hibernate 懒加载代理生成（终端集中式）

手动启用，终端项目显式 `.enablePlugins(ProxyPlugin)`：

| 任务 | 作用域 | 说明 |
|------|--------|------|
| `proxyClasses` | Compile / Test | 为 classpath 上声明的实体预生成 `<Entity>$HibernateProxy` 代理类 |

只在 classpath 上存在 `beangle.xml` 的 `<jpa>/<orm><mapping class="...">` 声明**且**
存在 `beangle-data-hibernate` 时才生成。构建期生成代理后，JVM 与 native-image 共用同一套
预生成类路径，运行期由 `PrebuiltProxyProvider` 按命名约定加载；插件同时输出
`META-INF/native-image/beangle/data/reachability-metadata.json` 片段。库项目不再生成代理，
只保留 `beangle.xml` 声明。

## NativeImagePlugin 原生镜像构建与分发

手动启用，用于把应用链接成原生可执行文件并打包分发。

| 键 | 说明 |
|----|------|
| `nativeImage` | 只做链接，产出原生可执行文件 |
| `nativeDist` | 链接 → 打成 `<name>-<version>-<classifier>.tar.gz`（含 `.sha1`/`.sha256`）→ 装入本地 native 仓库 → 生成与上一版本的 bsdiff 补丁 |
| `nativeDistUpload` | 从本地仓库取本版本整包上传：归档 + `.sha1` + `.sha256`（先构件、后校验） |
| `nativeDeltaUpload` | 上传本版本最新补丁：补丁 + 补丁 `.sha1`（先构件、后校验） |

两个上传任务都**不重新构建**，只读本地 native 仓库（缺文件时打印 `skip ... upload` 告警并正常结束），
因此可以安全地放进发布脚本单独调用。

| 设置 | 默认 | 说明 |
|------|------|------|
| `nativeImageCommand` | 自动探测 | 按 `GRAAL_HOME` / `GRAALVM_HOME` / `JAVA_HOME` 找 `bin/native-image` |
| `nativeImageOptions` | `Nil` | 传给 native-image 的附加参数，如 `-Os`、`--no-fallback` |
| `nativeDistClassifier` | 由 `os.name`/`os.arch` 推出 | 平台标签，如 `linux-amd64`、`darwin-arm64` |
| `nativeRepoHome` | `~/.m2` | 本地仓库根；正式版进 `repository`，快照版进 `snapshots` |
| `nativeDistDeltaBase` | `None` | 增量基准版本，缺省取小于当前版本的最大正式版本 |
| `nativePublishUrl` | `"unknown-url"` | micdn 的 `/native` 基地址（如 `https://host/native`）；上传地址 = 基地址 + 仓库内相对路径 + 文件名 |

```bash
sbt "portal/nativeDist"          # 链接 + 打包 + 入库 + 生成补丁
sbt "portal/nativeDistUpload"    # 上传整包
sbt "portal/nativeDeltaUpload"   # 上传增量补丁
```

## WarPlugin Web 应用打包

手动启用，依赖 BootPlugin：把 `Compile / package` 的产物改为 war，组装 `src/main/webapp`
静态资源，编译产物进 `WEB-INF/classes`、依赖 jar 进 `WEB-INF/lib`，并自动嵌入 BootPlugin
生成的依赖清单与 Maven 元信息。

| 键 | 类型 | 说明 |
|----|------|------|
| `warPrepare` | 任务 | 组装 webapp 打包内容 |
| `warAddDefaultWebxml` | 设置，默认 `true` | 缺少 `web.xml` 时自动补充默认模板 |
| `warDiff oldVersion [newVersion]` | 输入任务 | 基于本地 m2 仓库中两个版本 war 生成 BSDiff 增量补丁 |

```scala
lazy val myproject = (project in file("."))
  .enablePlugins(WarPlugin)
  .settings(
    name := "beangle-ems-app",
    Compile / package / artifact := Artifact("beangle-ems-app", "war", "war")
  )
```

```bash
sbt package                  # 生成 beangle-ems-app-<version>.war
sbt "warDiff 1.0.0 1.0.1"    # 生成热升级增量补丁
```

## SnapshotPlugin 快照版构建与上传

手动启用，把 SNAPSHOT 版 war/jar 打包为带时间戳的文件名，并以 HTTP PUT 上传到
[micdn](https://github.com/beangle/micdn) 的 `/maven` 发布端点（需在该实例的 `micdn.xml` 里
声明 `<auth publish-key="…"/>`），便于开发期部署联调。正式版与 SNAPSHOT 共用 `/maven` 一个入口。

| 键 | 类型 | 说明 |
|----|------|------|
| `snapshotBuild` | 任务 | 生成带时间戳的快照包及 `.sha1` 校验文件 |
| `snapshotUpload` | 任务 | 按 maven 布局 PUT 上传快照包及 `.sha1` |
| `snapshotRepoUrl` | 设置，默认 `"unknown-url"` | micdn 的 `/maven` 入口地址，如 `http://127.0.0.1:8080/maven`（不含 `{fileName}`） |
| `snapshotCredentials` | 设置 | 上传令牌属性文件，默认 `~/.sbt/snapshot_credentials`（只有 `token`：maven 快照走 Bearer，native 上传端点的 Basic 头用同一个 token 拼） |

上传路径为 `{groupId 点转斜杠}/{artifactId}/{version}/{文件名}`，2xx 视为成功。micdn 只按相对路径
原样落盘，`-SNAPSHOT` 别名与 `maven-metadata.xml` 都由其读路径生成，无需额外上传。

版本号不含 `SNAPSHOT` 或产物不是 war/jar 时，两个任务都会跳过并告警。

```bash
sbt snapshotBuild snapshotUpload
```

## TomcatPlugin 嵌入式 Tomcat 启动

手动启用，开发期直接用嵌入式 Tomcat 跑当前模块，无需安装独立容器或部署 war（自动引入
beangle-sas-engine、tomcat-embed-* 与 jul-to-slf4j 作为 test 依赖）。

```bash
sbt "web / tomcatStart 8080"
# fork 启动 org.beangle.sas.engine.tomcat.Bootstrap --dev=true，其余参数原样透传
```

## UndertowPlugin 嵌入式 Undertow 依赖

手动启用，只负责把 `beangle-sas-engine`、`undertow-servlet`、`jul-to-slf4j` 引入 test
classpath，不定义任务；应用自行通过 beangle-sas 引擎 API 启动 Undertow。

## 典型组合

- **普通库项目**：StylePlugin + StatPlugin + BootPlugin；如需声明 bean 元数据 / AOT 提示，
  在 `src/main/resources` 放置 `meta-registrars.txt`、`aot-registrars.txt`、`beangle.xml`，
  由终端项目统一聚合。
- **Web 应用项目**：显式启用 `WarPlugin`，依赖清单自动嵌入
  `WEB-INF/classes/META-INF/beangle/dependencies`，可用 [jstart](/jstart/index.html) 一键启动。
- **GraalVM native-image**：终端项目显式启用 `AotPlugin`（配合 `MetaPlugin`、`ProxyPlugin`），
  再用 `NativeImagePlugin` 链接、打包 `tar.gz` 并发布整包或增量补丁。
- **ORM 项目**：OrmPlugin 生成多数据库建表 DDL，DdlPlugin 生成 SQL 报告与迁移脚本。

## 深入阅读

- [插件源码与详细文档](https://github.com/beangle/build) —— 各插件的完整任务、设置与锚点文件说明
- [GraalVM 25+ reachability-metadata.json 格式备忘](https://github.com/beangle/build/blob/master/docs/graalvm-reachability-metadata.md)
