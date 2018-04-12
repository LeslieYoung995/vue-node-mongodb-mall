# mall

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


> 文件夹列表

```
| - build
| - config
| - resource -- 静态资源文件
| - server   -- express框架后端文件
    | - models  
        | - goods.js  -- 商品数据模型
        | - users.js  -- 用户数据模型
    | - routes
        | - goods.js  -- 商品相关接口
        | - users.js  -- 用户相关接口
| - src
    | - assets      -- 样式文件
    | - components
        | - Modal.vue      -- 模态框组件
        | - NavHeader.vue  -- 头部组件
        | - NavBread.vue   -- 面包屑组件
        | - NavFooter.vue  -- 底部组件
    | - router -- 路由配置文件
    | - util   -- 公用方法文件
    | - views
        | - GoodsList.vue    -- 商品列表页组件
        | - Cart.vue         -- 购物车列表组件
        | - Address.vue      -- 地址列表页组件
        | - OrderConfirm.vue -- 订单确认页面
        | - OrderSuccess.vue -- 订单成功页面
    | - App.vue
    | - main.js
| - static   -- 项目所用图片，图标

```
