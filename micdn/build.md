---
title: 编译MiCDN
prev: /micdn/install
next: /micdn/index
---

# 编译MiCDN
[← 返回 MiCDN 首页](/micdn/index.html)

## 1. 准备编译环境

### Unbuntu 24.04 编译环境

```shell
# 1. 安装核心编译环境（解决 Scrt1.o、crti.o 错误，同时包含 lrt/ld/pthread/m 依赖）
sudo apt install -y build-essential libc6-dev

# 2. 安装额外缺失的专用库（lpq、lz 对应）
sudo apt install -y libpq-dev zlib1g-dev
```

## 2. 下载MiCDN代码
· 从GitHub下载MiCDN代码
```shell
wget https://github.com/beangle/micdn/archive/refs/tags/v0.1.5.zip
unzip v0.1.5.zip
cd micdn-0.1.5
```

## 3. 编译MiCDN
```shell
./mk_artifact.sh
```