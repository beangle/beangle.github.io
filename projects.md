## 简介

Beangle立足企业软件开发，提供敏捷、基于约定(Convention Over Configuration)的脚手架和工具包。着力以简化项目构建,并规范项目开发习惯,形成易于管理的最佳实践.

## 项目列表

* [Boot](/boot/index.html) 提供应用启动和部署相关的工具
* [BUI](/bui/index.html) 提供基于Bootstrap的前端UI框架，包含丰富的标签和组件
* [Cache](/cache/index.html) 提供统一的缓存接口和多种缓存实现
* [Commons](/commons/index.html) 提供依赖注入，bean，反射，CSV、字符串处理，web通用基础类
* [Config](/config/index.html) 提供统一的配置加载和管理功能
* [Cron](/cron/index.html) 提供轻量级任务调度功能
* [Data](/data/index.html) 提供基于数据模型的定义、转化、查询支持，集成jpa、hibernate
* [Event](/event/index.html) 提供事件驱动框架，支持数据事件总线和消息队列
* [JDBC](/jdbc/index.html) 提供数据库连接管理、SQL执行、元数据查询等功能
* [Micdn](/micdn/index.html) 部署简易的cdn
* [Notify](/notify/index.html) 提供邮件、短信等多种通知方式，支持异步发送和消息队列
* [Otk](/otk/index.html) 提供在线工具包，包括验证码、二维码、短链接等工具
* [Sas](/sas/index.html) 提供简化配置和便利部署的能力
* [Security](/security/index.html) 提供认证、授权、会话管理等核心安全功能
* [Serializer](/serializer/index.html) 提供JSON、XML、CSV、Protobuf等多种格式的序列化功能
* [She](/she/index.html) 提供Shell扩展框架，包括Web MVC支持和Hibernate集成
* [Spring](/cdi/index.html) 提供container支持，集成spring、hibernate
* [Template](/template/index.html) 提供模板引擎框架，支持FreeMarker
* [Transfer](/transfer/index.html) 提供数据导入导出功能，支持Excel、CSV等格式
* [Web](/web/index.html) 提供Web相关的工具类和功能，包括HTTP处理、资源管理等
* [WebMVC](/webmvc/index.html) 提供webmvc所需的约定，集成spring和struts提供运行环境
* [Doc](/doc/index.html) 提供文档处理能力，包含HTML、DOCX、Excel、PDF等格式处理
* [EMS](/ems/index.html) 企业系统集成平台，提供统一用户管理、安全认证、权限控制
* [IDS](/ids/index.html) 基于CAS协议的身份认证服务，提供统一单点登录能力
* [CA](/ca/index.html) 数字证书签名组件，支持PDF签名、电子印章、时间戳服务
* [SQLPlus](/sqlplus/index.html) 面向关系数据库的工具集，提供数据迁移、报告生成、SQL检查

## 依赖关系

Beangle 项目之间存在清晰的依赖关系，底层基础模块支撑上层应用模块。以下依赖图主要展示核心模块之间的关系，独立服务（Otk、Micdn）和应用服务器（Sas）未包含在内。

### 模块依赖关系图

```
                           ┌──────────────────────────────────────────────────┐
                           │              Web框架层 (Web Framework)           │
                           │     BUI          WebMVC          She            │
                           └──────────────┬───────────────────┬───────────────┘
                                          │                   │
                                          ▼                   ▼
                           ┌──────────────────────────────────────────────────┐
                           │                 安全层 (Security)                │
                           │                    Security                     │
                           └───────────────────────┬─────────────────────────┘
                                                   │
          ┌────────────────────────────────────────┼────────────────────────────────┐
          │                                        │                                │
          ▼                                        ▼                                ▼
┌────────────────────────┐           ┌────────────────────────┐     ┌────────────────────────┐
│    工具层 (Tools)      │           │     数据层 (Data)       │     │    基础层 (Foundation) │
│  ┌─────────────────┐   │           │  ┌─────────────────┐   │     │  ┌─────────────────┐   │
│  │ Cache  Event    │   │           │  │    JDBC         │   │     │  │   Boot         │   │
│  │ Notify Template │   │           │  │    Data         │   │     │  │   Web          │   │
│  │ Doc   Serializer│   │           │  └─────────────────┘   │     │  │   Config       │   │
│  │ Cron  Transfer  │   │           └────────────────────────┘     │  │   CDI          │   │
│  └─────────────────┘   │                                          │  └─────────────────┘   │
│                        │                                          │                        │
│         工具层内模块互不依赖                                         │                        │
└────────────────────────┘                                          └────────────────────────┘
        │                              │                                        │
        │                              │                                        │
        └──────────────────────────────┴────────────────────────────────────────┘
                                         │
                                         ▼
                           ┌──────────────────────────────────────────────────┐
                           │         Commons (语言和库增强)                   │
                           │   字符串|集合|反射|DI|加密|IO|网络|并发           │
                           └──────────────────────────────────────────────────┘
```

### 模块分类详情

#### 基础层（Foundation）

提供最核心的基础设施能力，是所有模块的基石：

| 模块 | 功能描述 | 依赖 |
|------|---------|------|
| **Commons** | 字符串处理、集合操作、依赖注入、反射、CSV处理、安全加密 | 无 |
| **Boot** | 应用启动和部署相关工具 | Commons |
| **Web** | HTTP处理、资源管理、Servlet集成 | Commons |
| **Config** | 统一配置加载和管理功能 | Commons |
| **CDI** | Container支持，集成Spring、Hibernate | Commons |

---

#### 数据层（Data）

提供数据访问和处理能力，与工具层并列：

| 模块 | 功能描述 | 依赖 |
|------|---------|------|
| **JDBC** | 数据库连接管理、SQL执行、元数据查询 | Commons |
| **Data** | 数据模型定义、转化、查询支持，集成JPA/Hibernate | Commons、JDBC |

---

#### 工具层（Tools）

提供各类独立工具能力，模块之间互不依赖：

| 模块 | 功能描述 | 依赖 |
|------|---------|------|
| **Cache** | 统一缓存接口，支持Caffeine、Redis、Ehcache | Commons |
| **Event** | 事件驱动框架，支持数据事件总线和消息队列 | Commons |
| **Notify** | 邮件、短信等通知方式，支持异步发送 | Commons、Cache |
| **Template** | 模板引擎框架，支持FreeMarker | Commons |
| **Doc** | 文档处理库，支持HTML、DOCX、Excel、PDF | Commons、Template |
| **Serializer** | JSON、XML、CSV、Protobuf序列化 | Commons |
| **Cron** | 轻量级任务调度功能 | Commons |
| **Transfer** | 数据导入导出，支持Excel、CSV | Commons |

---

#### 安全层（Security）

提供认证、授权、会话管理等核心安全功能：

| 模块 | 功能描述 | 依赖 |
|------|---------|------|
| **Security** | 认证、授权、会话管理，支持JWT、OAuth | Commons、JDBC、Cache、Web、Serializer |

---

#### Web框架层（Web Framework）

提供Web应用开发框架：

| 模块 | 功能描述 | 依赖 |
|------|---------|------|
| **BUI** | 基于Bootstrap的前端UI框架 | Commons、Template |
| **WebMVC** | Web MVC框架，集成Spring和Struts | Commons、Web、Template |
| **She** | Shell扩展框架，Web MVC支持和Hibernate集成 | Commons、WebMVC、Data |

---

#### 应用层（Application）

| 模块 | 功能描述 | 依赖 |
|------|---------|------|
| **Sas** | 应用服务器，简化配置和便利部署 | Commons、Web |

---

#### 独立服务（Standalone Services）

独立运行的服务模块：

| 模块 | 功能描述 | 依赖 |
|------|---------|------|
| **Otk** | 在线工具包，包括验证码、二维码、短链接等 | Commons、Security |
| **Micdn** | 简易CDN部署 | Commons |
| **EMS** | 企业系统集成平台，提供用户管理、安全认证、权限控制 | Commons、Security、WebMVC、Data、Cache |

---

### 核心依赖关系

```
Commons (基础)
  ├── Boot
  ├── Web ────────► WebMVC ──┬──► Sas
  │                └───────► She │
  ├── Config                   │
  ├── CDI                      │
  │                            │
  ├── JDBC ──┬──► Security ────┘
  │          └──► Data ──────────┘
  │
  ├── Cache ───► Notify
  ├── Event
  ├── Template ──┬──► BUI
  │              └──► Doc
  ├── Serializer
  ├── Cron
  └── Transfer
```

### 版本兼容性矩阵

| 模块 | 依赖 Commons 版本 | 说明 |
|------|-----------------|------|
| Commons | - | 核心基础库 |
| Boot | 6.0.0+ | 启动工具 |
| Web | 6.1.0+ | Web基础 |
| Config | 6.0.0+ | 配置管理 |
| CDI | 6.0.0+ | 容器集成 |
| JDBC | 6.0.4+ | 数据库访问 |
| Data | 6.0.0+ | 数据模型 |
| Cache | 6.0.0+ | 缓存抽象 |
| Event | 6.0.0+ | 事件总线 |
| Notify | 6.0.17+ | 通知服务 |
| Template | 6.1.0+ | 模板引擎 |
| Doc | 6.0.6+ | 文档处理 |
| Serializer | 6.0.0+ | 序列化 |
| Cron | 6.0.0+ | 任务调度 |
| Transfer | 6.0.0+ | 数据传输 |
| Security | 6.1.0+ | 安全框架 |
| WebMVC | 6.1.1+ | Web MVC |
| BUI | 6.0.0+ | UI框架 |
| She | 6.0.0+ | Shell扩展 |
| Sas | 6.0.0+ | 应用服务器 |
| Otk | 6.0.0+ | 在线工具 |
| Micdn | 6.0.0+ | CDN服务 |
| EMS | 6.0.0+ | 企业系统集成平台 |

---

## 独立服务与平台介绍

### Sas - 应用服务器

**Sas**（Simple Application Server）是一个轻量级的 Java 应用服务器，专为 Beangle 应用设计：

**核心特性：**

- **简化部署**：支持一键部署 WAR、JAR 等多种打包格式
- **内置管理**：提供 Web 管理界面，支持应用监控和配置管理
- **热部署**：支持应用的热更新，无需重启服务器
- **负载均衡**：内置简单的负载均衡能力
- **配置灵活**：支持多种配置方式，易于定制

---

### Otk - 在线工具服务

**Otk**（Online Toolkit）是一个提供多种在线工具的独立服务：

**核心功能：**

| 工具 | 描述 |
|------|------|
| **验证码服务** | 生成图形验证码、短信验证码 |
| **二维码生成** | 支持多种格式的二维码生成 |
| **短链接服务** | URL 短链接生成和解析 |
| **文档处理** | PDF 生成、Excel 处理 |

**技术特点：**

- 独立部署，提供 RESTful API
- 支持高并发访问
- 可与 EMS 集成，作为统一认证后的工具服务

---

### Micdn - 简易 CDN 服务

**Micdn**（Mini CDN）是一个轻量级的 CDN 服务：

**核心功能：**

- **静态资源托管**：支持图片、CSS、JS 等静态文件
- **文件缓存**：多级缓存策略，提升访问速度
- **资源压缩**：自动压缩静态资源
- **访问统计**：提供资源访问统计和分析

**适用场景：**

- 中小型网站的静态资源加速
- 内部系统的资源共享
- 开发环境的资源管理

---

### EMS - 企业系统集成平台

**EMS**（Enterprise Management System）是一个综合性的企业系统集成平台：

**核心模块：**

| 模块 | 描述 |
|------|------|
| **用户管理** | 用户信息、角色、组织架构管理 |
| **安全认证** | CAS、OAuth、JWT 统一认证 |
| **权限控制** | 功能权限、数据权限管理 |
| **系统配置** | 多租户、多域名配置管理 |
| **办公自动化** | 公告、文档、流程审批 |

**架构特点：**

- **多租户支持**：支持多个组织或部门独立使用
- **统一认证**：集成多种认证方式，单点登录
- **模块化设计**：各模块松耦合，可按需启用
- **RESTful API**：提供完整的 Web 服务接口

**典型应用场景：**

1. **企业统一身份管理**：集中管理企业所有应用的用户
2. **权限中心**：统一的权限管理和审计
3. **系统集成**：作为企业应用的集成枢纽

## 许可证
[LGPL v3](http://www.gnu.org/licenses/lgpl.txt)
