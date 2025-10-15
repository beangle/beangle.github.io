# Beangle Sqlplus

## 1. 快速安装

```shell
wget http://beangle.github.io/docs/data/sqlplus.sh; chmod +x ./sqlplus.sh
```

## 2. 如何使用
使用beangle-sqlplus进行数据库转换，可以将数据、约束、索引、序列进行转换到目标数据库上。 例如按照如下的配置保存到sample.xml文件上，将oracle数据库中的数据转换到postgresql上。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<conversion maxthreads="10">
  <source>
    <db>
      <driver>oracle.jdbc.driver.OracleDriver</driver>
      <url>jdbc:oracle:thin:@//192.168.100.1:1521/public</url>
      <user>user</user>
      <password>password</password>
    </db>
    <tables lowcase="true" index="true" constraint="true">
      <includes>*</includes>
      <excludes></excludes>
    </tables>
    <sequences>
      <includes>*</includes>
    </sequences>
  </source>

  <target>
    <db>
      <driver>org.postgresql.Driver</driver>
      <url>jdbc:postgresql://192.168.100.2:5432/urp</url>
      <user>user</user>
      <password>password</password>
      <schema>schema</schema>
    </db>
  </target>
</conversion>
```

然后使用sqlplus.sh sample.xml即可