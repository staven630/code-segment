# PHP配置
&emsp;&emsp;php.ini-development：开发时的php.ini配置

&emsp;&emsp;php.ini-production：项目运行时的php.ini配置
复制php.ini-development文件到C:\Windows目录下,修改成php.ini。方便php版本升级。直接覆盖原版本即可

### 配置时区
date.timezone = PRC
&emsp;&emsp;配置目录查找扩展库
```$xslt
extension_dir = "D:/amp/php/ext"
```    
### 启动mysql扩展
```$xslt
extension=php_mysql.dll
extension=php_mysqli.dll
```
### 配置session保存路径
```$xslt
session.save_path = "C:/Windows/Temp"
```

# Apache配置
### 加载PHP模块到Apache中
```$xslt
LoadModule php5_module "D:/amp/php/php5apache2_2.dll"
```
### 设定php引擎解析何种文件扩展名

方法一：
```$xslt
<FilesMatch "\.php$">
    SetHandler application/x-httpd-php
</FilesMatch>
```

方法二：
```$xslt
AddType application/x-httpd-php .php .php3
```
### 设定php.ini的路径

&emsp;&emsp;在httpd.conf中添加
```$xslt
PHPIniDir "D:/amp/php"
```
&emsp;&emsp;若已将php.ini复制到C:\Windows目录下，则无须配置此项。
配置访问目录
```$xslt
ServerName www.staven.com
 
DocumentRoot "D:/amp/codes"
 
<Directory "D:/amp/codes">
    Options Indexes  
    Order deny,allow
    Allow from all
</Directory>
```
### 配日志默认访问首页
```$xslt

<IfModule dir_module>
    DirectoryIndex index.html  index.php
</IfModule>
```
&emsp;&emsp;也可以将DirectoryIndex设置项放在一个单独的站点或单独的文件夹中，则只对该单独的站点或单独的文件夹起作用。
```$xslt
<Directory "D:/amp/codes">
    Options Indexes  
    Order deny,allow
    Allow from all
    DirectoryIndex base2.php3
</Directory>
```
### 设置主机别名
```$xslt
ServerAlias 别名1,别名2……
```
### 文件夹访问控制的文件控制方式
&emsp;&emsp;通常，我们在config配置文件中，使用Directory配置项，目的是用来控制文件夹的访问权限。
&emsp;&emsp;但我们也可以使用一个独立的文件夹中来控制文件夹的访问权限。该文件名必须是.htaccess。该文件必须放在要被控制的文件夹中(不同文件夹可以放不同的该文件)，其“上级文件夹”(通常是Directory设定中的文件夹)必须使用如下代码允许.htaccess发挥作用，AllowOverride All。.htaccess文件中出现代码，几乎可以跟Directory设定中出现的代码一样。.htaccess文件有效，则其设置会覆盖上级设置。
目录别名设置Alias

&emsp;&emsp;目录别名也叫虚拟目录。一个站点是一个文件夹。
```$xslt
<IfModule alias_module>
    Alias /soft "真实路径"
</IfModule>
```
&emsp;&emsp;需要设置文件夹访问权限。
```$xslt
<Directory "真实路径">
    Options Indexes  
    Order deny,allow
    Allow from all
    DirectoryIndex base2.php3
    AllowOverride All
</Directory>
```
# 多站点配置：

&emsp;&emsp;首先在httpd.conf中打开多站点
```$xslt
Include conf/extra/httpd-vhosts.conf

```
```$xslt
<VirtualHost *:80>
    ServerName www.staven.com
    ServerAlias staven.com
    DocumentRoot "D:/amp/codes/staven"
    <Directory "D:/amp/codes/staven">
        Options Indexes
        AllowOverride All
        Order  deny,allow
        allow from all    
        DirectoryIndex index.html index.php
    </Directory>
    Alias /abc "D:/amp/codes"  //此别名只能在此站点中有效
</VirtualHost>
```    
&emsp;&emsp;配置多站点后，默认站点设置失效,同时需要在hosts中添加绑定对应链接。