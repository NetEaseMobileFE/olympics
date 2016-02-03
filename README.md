此处仅介绍跟配置选项相关的部分，打包思路及详细说明请参考该[文章](https://app.classeur.io/#!/files/3xAiWQ42tsXxS52vG9ne)。

---

## Develop

直接基于 [react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate) 提供的环境进行开发，配置简单，报错友好。项目根目录下执行：

```
npm start
```

如果需要静态目录来存储模拟接口的测试数据，可手动在 `devServer.js` 中添加：

``` js
app.use('/mocks', express.static(__dirname + '/src/mocks'));
```

---

## Publish

部署发布仍使用 GulpJs， 为配合打版本，`webpack.config.prod.js` 增加了部分动态内容，由 `gulpfile.js` 引入时通过 `global` 参数传递。**发布之前需要确认三个文件中的设置：**

> 建议路径及项目名称均使用小写，防止因为服务器设置造成的访问问题。

### package.json

修改 `name` 字段为项目的名称，发布的路径后面会自动拼接该字段值。

### .profile

上传相关的配置集中存储在 `.profile` 文件中，第一次 clone 请基于 `.profile.sample` 修改。

### gulpfile.js

文件发布的路径及版本信息均在 `gulpfile.js` 中设定，预设了两种发布模式（mode）：
- 测试模式 `test` ---- 用于正式发布前的测试，一般不需要打版本号
- 正式模式 `pro` ---- 正式上线发布，建议增加版本号，避免缓存

``` js
[mode]: { 				// 发布模式
	htmlFtp: 'galaxy',	// 上传 HTML 文件使用的 FTP 配置，对应 .profile 中的字段
	htmlRoot: 'test',	// 上传 HTML 文件的存储路径，默认根目录 ''
	assetFtp: 'galaxy', 	// 类似 'htmlFtp'，针对非 HTML 文件
	assetRoot: 'test',	// 类似 'htmlRoot'，针对非 HTML 文件
	revision: false,		// 是否附带版本号
	withHash: false     // 'vendor' 文件是否附带 hash
}
```

### Publish Command

修改完相关配置，直接执行 `gulp`，默认使用测试模式的配置进行打包并上传，如果想使用正式模式需在后边加参数 `-p`：
``` js
gulp -p
```

### Directory Structure

打包后的文件本地存储在 `dist` 目录下，不附加版本及 hash 打包后的结构比较简单，依照文件分类平行存放：
``` js
dist/
  css/
  img/
  js/
  index.html
```
附带版本及 hash 会根据文件的设置存放在不同目录下：
``` js
dist/
  [version]/
    css/
      app.css
    js/
      bundle.js
      0.bundle.js
      ...
  img/
  js/
	vendor.[hash].js
	webpackBootstrap.[hash].js
  index.html
```