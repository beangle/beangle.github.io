---
title: 编译MiCDN
prev: /micdn/install
next: /micdn/index
---

# 编译MiCDN
[← 返回 MiCDN 首页](/micdn/index.html)

## 1. 准备编译环境

### 1.1 Ubuntu/Debian 编译环境

在 Ubuntu 24.04+ 或 Debian 12+ 上：

```shell
sudo apt install -y build-essential libc6-dev libpq-dev zlib1g-dev zip git dub ldc fakeroot dpkg-dev
```

### 1.2 CentOS/RHEL 编译环境

```shell
sudo dnf -y install git dub ldc gcc gcc-c++ zlib-devel
```

## 2. 下载MiCDN代码

### 2.1 从GitHub下载发布版本

```shell
wget https://github.com/beangle/micdn/archive/refs/tags/v0.2.0.zip
unzip v0.2.0.zip
cd micdn-0.2.0
```

### 2.2 从Git仓库克隆（开发版本）

```shell
git clone https://github.com/beangle/micdn.git
cd micdn
```

## 3. 编译MiCDN

### 3.1 基本编译

```shell
dub build --release
```

编译完成后，可执行文件会生成在 `bin/micdn`。

### 3.2 构建RPM包

在 CentOS/RHEL 上构建 RPM 包：

```shell
# 安装rpmbuild
sudo dnf -y install rpm-build

# 构建RPM包
./scripts/build_rpm.sh

# 构建结果
ls -la target/
```

### 3.3 构建DEB包

在 Debian/Ubuntu 上构建 DEB 包：

```shell
# 构建DEB包
./scripts/build_deb.sh

# 构建结果
ls -la target/
```

### 3.4 构建容器镜像

```shell
# 构建Docker/Podman镜像
./scripts/build_image.sh
```

## 4. 从源码安装

编译完成后，你可以手动安装 MiCDN：

```bash
# 复制可执行文件
cp bin/micdn /usr/bin/

# 创建配置目录
mkdir -p /etc/micdn /var/log/micdn

# 复制配置文件
cp scripts/package/micdn.xml /etc/micdn/
cp scripts/package/micdn.service /etc/systemd/system/

# 创建用户和目录
# Debian/Ubuntu
if ! getent group beangle >/dev/null 2>&1; then
  addgroup --system beangle
fi
if ! getent passwd micdn >/dev/null 2>&1; then
  adduser --system --ingroup beangle --home /var/lib/micdn --no-create-home --disabled-login micdn
fi

# CentOS/RHEL
groupadd -r beangle
useradd -r -g beangle -d /var/lib/micdn -s /sbin/nologin micdn

# 创建所需目录
mkdir -p /var/cache/micdn/asset /var/cache/micdn/www
mkdir -p /var/lib/micdn/blob /var/lib/micdn/maven /var/lib/micdn/npm /var/lib/micdn/local

# 设置权限
chown -R micdn:beangle /var/log/micdn /var/cache/micdn /var/lib/micdn

# 启用并启动服务
systemctl enable micdn
systemctl start micdn
```

## 5. 构建脚本说明

| 脚本 | 用途 | 适用系统 |
|------|------|----------|
| `build_image.sh` | 构建容器镜像 | 任何支持 Docker/Podman 的系统 |
| `build_deb.sh` | 构建 DEB 包 | Debian/Ubuntu |
| `build_rpm.sh` | 构建 RPM 包 | CentOS/RHEL |
| `build_srpm.sh` | 构建源码 RPM 包 | CentOS/RHEL |
| `setup-windows.ps1` | Windows 环境设置 | Windows |

## 6. 常见编译问题

### 6.1 缺少 DUB 或 LDC

**解决方案**：安装 DUB（D 语言包管理器）和 LDC（D 语言编译器）。

### 6.2 依赖项缺失

**解决方案**：根据系统类型安装相应的依赖包。

### 6.3 权限错误

**解决方案**：确保有足够的权限创建目录和文件。

## 7. 构建产物

- **可执行文件**：`bin/micdn`
- **RPM 包**：`target/beangle-micdn-*.rpm`
- **DEB 包**：`target/micdn_*.deb`
- **容器镜像**：`micdn:latest`

## 8. 相关链接

- [DUB 官方文档](https://dub.pm/)
- [LDC 官方网站](https://wiki.dlang.org/LDC)
- [MiCDN GitHub 仓库](https://github.com/beangle/micdn)