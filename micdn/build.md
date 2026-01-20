---
title: 编译MiCDN
prev: /micdn/install
next: /micdn/index
---

# 编译MiCDN
[← 返回 MiCDN 首页](/micdn/index.html)

## 1. 准备编译环境

Unbuntu 24.04 编译环境

```shell
sudo apt install -y build-essential libc6-dev libpq-dev zlib1g-dev zip
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