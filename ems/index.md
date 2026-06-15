## Beangle EMS

Beangle EMS（Enterprise Management System）是一个企业系统集成平台，提供统一的用户管理、安全认证、权限控制和系统配置能力。

### 核心功能模块

| 模块 | 描述 |
|------|------|
| **User** | 用户管理，包括用户信息、角色、组织架构 |
| **Security** | 安全认证，包括菜单、权限、会话管理 |
| **OA** | 办公自动化，包括公告、文档、流程审批 |
| **Config** | 系统配置，包括域管理、数据源、应用管理 |
| **Log** | 日志管理，包括业务日志、错误日志 |
| **CAS** | 统一认证服务，支持 OAuth、单点登录 |
| **WS** | RESTful Web 服务接口 |

### 架构特点

- **统一认证**：支持 CAS、OAuth、JWT 等多种认证方式
- **多租户支持**：支持多域名、多组织的隔离管理
- **模块化设计**：各功能模块松耦合，可独立部署
- **RESTful API**：提供完整的 Web 服务接口

### 核心组件

#### 用户管理
- 用户信息管理（User、Profile、Avatar）
- 角色与权限（Role、RoleMember）
- 组织架构（Depart、Group、Dimension）

#### 安全管理
- 功能权限（Menu、Resource、Permission）
- 数据权限（DataPermission）
- 会话管理（SessionInfo、SessionEvent）
- OAuth 集成（OAuthCode、OAuthToken）

#### 办公自动化
- 公告通知（Notice）
- 文档管理（Doc）
- 流程审批（Flow、FlowTask）
- 消息服务（Message）

### 依赖关系

- **Commons**：核心工具库
- **Security**：安全框架
- **WebMVC**：Web 框架
- **Data**：数据访问
- **Cache**：缓存支持
- **Notify**：通知服务

### 典型应用场景

1. **统一身份认证**：企业内部多个应用系统的统一登录
2. **权限管理**：细粒度的功能权限和数据权限控制
3. **组织管理**：企业组织架构和人员信息管理
4. **流程审批**：各类业务流程的电子化审批