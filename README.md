## 初始化操作

- 初始化操作
```
执行 import.bat 文件
执行 ionic state restore 命令
```

## 操作说明

- 代码生成
```
gulp generate
参数说明:
 --modelname 模块名字    ..............注明生成的模块名称（必须）
 --display tab          ..............注明模块显示类型（非必需）
                        ..............如果需要生成首页tab标签页内容则需要加此参数，否则默认生成独立的页面
 --type chart/list      ..............生成模块内容类型（必须）
                        ..............如果生成图标类模块则为chart，如果生成列表类型模块则为list，如果生成空白的框架则为blank
例如要生成模块名称为 chart 、在首页标签页中显示、模块显示类型为图表，则执行命令：
    gulp generate --modelname chart --display tab --type chart
执行完代码生成命令后，需要接着执行gulp index 命令
如果想修改代码生成的模板可以修改 ./model 文件夹中文件的内容；
```

- 编译sass
```
gulp sass
```

- 开发模块时添加新js或修改了scss文件，则需要执行命令：
```
gulp index
```

- 模块中的js在编写完成后执行命令：
```
gulp validate

用于检查js的书写规范，确保没有任何warning（除调用第三方插件导致的warning）
如果需要指定验证某一文件夹下的js文件，可以使用命令：

gulp validate --vpath 文件夹名
```


- 网站发布之前需要执行命令：
```
gulp build
```

- 项目编译打包
```
ionic build android
```

## 目录说明

```
scss/			-- 样式类，使用scass编写
www/
    assets/		-- 资源文件夹
        global/ 	-- 全局资源文件夹
            css		-- 全局样式文件夹（此文件夹里面的文件不需要手动维护，由gulp自动生成）
            img		-- 全局图片文件夹
            js		-- 全局js文件夹（此文件夹里面的文件不需要手动维护，由gulp自动生成）
    js/			-- js源文件
    lib/		-- 第三方类库文件夹
    templates/		-- 模块
index.html		-- 首页
gulpfile.js		-- gulp 配置文件
```
