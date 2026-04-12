# MiCDN 安装指南

MiCDN 是一个小型的 CDN 服务器，提供文件上传、下载、Maven/NPM 镜像、静态文件服务等功能。

## 1. 安装方式

### 1.1 RPM 包安装（推荐，适用于 CentOS/RHEL）

在 CentOS 7/8/9 上，推荐使用 RPM 包安装：

```bash
# 下载 RPM 包
wget https://github.com/beangle/micdn/releases/download/v0.2.0/beangle-micdn-0.2.0-1.x86_64.rpm

# 安装
rpm -ivh beangle-micdn-0.2.0-1.x86_64.rpm
```

### 1.2 DEB 包安装（适用于 Debian/Ubuntu）

在 Debian 12+/Ubuntu 24.04+ 上，使用 DEB 包安装：

```bash
# 下载 DEB 包
wget https://github.com/beangle/micdn/releases/download/v0.2.0/micdn_0.2.0-1_amd64.deb

# 安装
dpkg -i micdn_0.2.0-1_amd64.deb

# 安装依赖（如果需要）
apt install -f
```

### 1.3 从源码构建

如果需要从源码构建，请参考 [编译 MiCDN](/micdn/build.html) 文档。

## 2. 配置文件

### 2.1 主配置文件

主配置文件位于 `/etc/micdn/micdn.xml`，默认配置如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<micdn xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xi="http://www.w3.org/2001/XInclude"
  xsi:noNamespaceSchemaLocation="http://beangle.github.io/schema/micdn-1.0.0.xsd"
  listen="0.0.0.0:8888"
  log-file="/var/log/micdn/micdn.log"
  log-level="info">

  <!-- 可选：取消注释并配置 blob.xml 后启用 Blob 服务（须放在 maven 等节点之前） -->
  <!-- <xi:include href="blob.xml" /> -->

  <maven base="~/maven">
    <remote url="https://maven.aliyun.com/repository/public" />
    <remote url="https://repo1.maven.org/maven2/" />
  </maven>

  <npm base="~/npm">
    <remote url="https://registry.npmmirror.com" />
  </npm>

  <static base="/var/cache/micdn/asset">
    <bundle name="local">
      <dir location="~/local" />
    </bundle>
  </static>

  <www base="/var/cache/micdn/www">
  </www>

</micdn>
```

### 2.2 配置方式

MiCDN 支持两种配置方式：

#### 2.2.1 内嵌配置（推荐）
将所有配置直接写在 `micdn.xml` 文件中，如上面的示例所示。

#### 2.2.2 外部文件配置
使用 `<xi:include>` 标签引入外部配置文件，例如：

```xml
<micdn ...>
  <!-- 外部配置文件必须放在内部配置节点之前 -->
  <xi:include href="blob.xml" />
  <xi:include href="maven.xml" />
  <xi:include href="npm.xml" />
  
  <!-- 内部配置节点 -->
  <static ...>
  </static>
</micdn>
```

**重要注意事项：**
- **放置顺序**：如果使用 `<xi:include>`，必须将其放在所有内部配置节点（如 `npm`、`maven`、`asset`、`www`）之前
- **包含内容**：每个外部文件可以包含 `npm`、`maven`、`asset`、`www`、`blob` 中的任意一种或多种配置
- **多个 include**：可以使用多个 `<xi:include>` 标签组合不同的配置文件

### 2.3 关键配置项

- `listen`：监听地址和端口，默认为 `127.0.0.1:8888`
- `log-file`：日志文件路径
- `log-level`：日志级别（info, debug, error）

### 2.4 服务配置

- **Maven 镜像**：`/maven` 端点，缓存 Maven 依赖
- **NPM 镜像**：`/npm` 端点，缓存 NPM 包
- **静态文件服务**：`/static` 端点，提供静态文件访问
  - **资产合并功能**：支持逗号合并写法，如 `/a/b,c.js` 会解析为 `/a/b.js` 与 `/a/c.js` 两个文件的合并
- **Blob 存储**：可选的文件存储服务，需单独配置

## 3. 启动和管理

### 3.1 启动服务

```bash
# 启用并启动服务
systemctl enable micdn
systemctl start micdn

# 查看状态
systemctl status micdn

# 查看日志
journalctl -u micdn
```

### 3.2 配置防火墙

如果需要从外部访问 MiCDN，需要开放相应端口：

**CentOS/RHEL（使用 firewalld）：**

```bash
# 开放 8888 端口
firewall-cmd --permanent --add-port=8888/tcp
firewall-cmd --reload
```

**Debian/Ubuntu（使用 ufw）：**

```bash
# 开放 8888 端口
ufw allow 8888/tcp
ufw reload
```

## 4. 服务端点

安装完成后，MiCDN 提供以下服务：

- **Maven 镜像**：`http://localhost:8888/maven`
- **NPM 镜像**：`http://localhost:8888/npm`
- **静态文件**：`http://localhost:8888/static`
- **Blob 存储**：`http://localhost:8888/blob`（需启用）

## 5. 依赖说明

- **不再依赖数据库**：新版本使用文件系统存储，无需配置数据库
- **核心依赖**：
  - CURL
- **系统要求**：
  - CentOS 7/8/9
  - Debian 12+/Ubuntu 24.04+
  - **不支持 Windows 服务器**
  - 足够的磁盘空间用于缓存

## 6. 存储特性说明

### 6.1 对象存储与扩展属性

MiCDN 的文件对象存储功能**支持扩展属性**（Extended Attributes），这一特性：

- **依赖于 Linux 文件系统**：利用 Linux 操作系统文件系统的扩展属性功能存储文件元数据
- **无需数据库**：通过文件系统的扩展属性存储元数据，避免了数据库依赖
- **高性能**：直接操作文件系统，读写速度快
- **跨平台限制**：**不适合在 Windows 上部署**，因为 Windows 文件系统对扩展属性的支持有限

### 6.2 元数据管理

- **基本元数据**：文件名、大小、类型、创建时间等通过扩展属性存储
- **复杂查询**：如果需要更复杂的对象源信息查询（如按类型、大小、时间范围等多维查询），建议：
  - 由调用方单独维护数据库
  - 定期同步 MiCDN 的文件元数据到数据库
  - 在数据库中构建索引以支持复杂查询

## 7. 自定义配置

### 7.1 更改监听端口

修改 `/etc/micdn/micdn.xml` 中的 `listen` 属性：

```xml
<micdn ... listen="0.0.0.0:8080">
```

### 7.2 配置 Blob 存储

创建 `/etc/micdn/blob.xml` 文件：

```xml
<blob base="/var/lib/micdn/blob" maxSize="50M" endpoint="/blob" bucket-resolve-style="host">
  <bucket name="local" key="your-private-long-key" />
</blob>
```

然后在 `micdn.xml` 中取消注释：

```xml
<xi:include href="blob.xml" />
```

## 7. 升级和维护

### 7.1 升级版本

**CentOS/RHEL：**

```bash
# 下载新版本 RPM
wget https://github.com/beangle/micdn/releases/download/vX.Y.Z/beangle-micdn-X.Y.Z-1.x86_64.rpm

# 升级
rpm -Uvh beangle-micdn-X.Y.Z-1.x86_64.rpm

# 重启服务
systemctl restart micdn
```

**Debian/Ubuntu：**

```bash
# 下载新版本 DEB
wget https://github.com/beangle/micdn/releases/download/vX.Y.Z/micdn_X.Y.Z-1_amd64.deb

# 升级
dpkg -i micdn_X.Y.Z-1_amd64.deb

# 重启服务
systemctl restart micdn
```

### 7.2 清理缓存

```bash
# 清理 Maven 缓存
rm -rf ~/maven/*

# 清理 NPM 缓存
rm -rf ~/npm/*

# 重启服务
systemctl restart micdn
```

## 8. 故障排查

### 8.1 查看服务状态

```bash
systemctl status micdn
```

### 8.2 查看详细日志

```bash
journalctl -u micdn -f
```

### 8.3 常见问题

- **端口被占用**：修改 `listen` 配置
- **权限错误**：确保 `micdn` 用户有相应目录的读写权限
- **依赖缺失**：确保安装了所需的系统依赖（如 CURL）

## 9. 项目结构

```
/etc/micdn/
├── micdn.xml          # 主配置文件

/var/log/micdn/        # 日志目录
/var/cache/micdn/      # 缓存目录
├── asset/             # 静态文件缓存
└── www/               # 网站文件
```

## 10. 权限管理

### 10.1 beangle 用户组

MiCDN 使用 `micdn` 用户和 `beangle` 用户组来管理文件权限。如果普通用户需要备份或读写 blob 中的文件，需要将用户添加到 `beangle` 用户组。

### 10.2 添加 beangle 用户组

**Debian/Ubuntu：**

```bash
# 创建 beangle 用户组（如果不存在）
sudo addgroup --system beangle

# 将当前用户添加到 beangle 组
sudo usermod -a -G beangle $USER

# 重新登录以应用组变更
```

**CentOS/RHEL：**

```bash
# 创建 beangle 用户组（如果不存在）
sudo groupadd -r beangle

# 将当前用户添加到 beangle 组
sudo usermod -a -G beangle $USER

# 重新登录以应用组变更
```

### 10.3 验证权限

添加到 beangle 组后，用户应该能够访问和操作 blob 存储目录：

```bash
# 检查用户是否在 beangle 组中
groups $USER

# 测试对 blob 目录的访问
ls -la /var/lib/micdn/blob/
```

## 11. 相关链接

- [GitHub 仓库](https://github.com/beangle/micdn)
- [项目文档](https://github.com/beangle/micdn/tree/master/docs)
- [最新版本下载](https://github.com/beangle/micdn/releases)
