# ml.task
ML日常管理小程序。是采用[MPVue](https://github.com/Meituan-Dianping/mpvue) + [ColorUI](https://github.com/weilanwl/ColorUI)开发的一个日常管理的小程序，包括备忘，打卡，倒计时，OCR，微信运动报告等功能。

![记录分类]([https://raw.githubusercontent.com/mlzhuo/ml.task/master/Screenshots/0-%E8%AE%B0%E5%BD%95%E5%88%86%E7%B1%BB.png](https://raw.githubusercontent.com/mlzhuo/ml.task/master/Screenshots/0-记录分类.png))

![工具]([https://raw.githubusercontent.com/mlzhuo/ml.task/master/Screenshots/2-%E5%B7%A5%E5%85%B7.png](https://raw.githubusercontent.com/mlzhuo/ml.task/master/Screenshots/2-工具.png))

![我]([https://raw.githubusercontent.com/mlzhuo/ml.task/master/Screenshots/10-%E6%88%91.png](https://raw.githubusercontent.com/mlzhuo/ml.task/master/Screenshots/10-我.png))

## 配置文件

在项目目录 **src** 下添加 **config.js**

```js
export const config = {
  apiURL: 'http://192.168.191.1:4001/api',
}

```



## 安装 & 运行

先安装运行服务端 **[ml.task.server](https://github.com/mlzhuo/ml.task.server)**，然后安装运行小程序端。

```
npm install
npm start
```

