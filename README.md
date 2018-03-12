# CRM前端

## 关于代码压缩
###　Tree-shaking for JS
做了`lodash`的`tree-shaking`(配合`babel-plugin-lodash`)
### Tree-shaking for CSS
### img-loader
由于事先已经将图片压缩, 使用img-loader效果不大, 故省略

### 压缩效果: 以vendor.js为例，从2.1M的文件，缩减到697KB左右, 最后利用后端`gzip`压缩成200KB+

组件树

App
 - Signin
 - Home

    ~~- Company~~

    ~~- Employee~~
    - Contract

    ...
 - Utils

    ~~- SearchCompany~~

    - SearchEmp

    ...
 ...
