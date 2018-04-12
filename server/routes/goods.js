var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接数据库
mongoose.connect('mongodb://localhost:27017/demo-test', {
  useMongoClient: true,
});

mongoose.connection.on("connected", function () {
  console.log("sucess!!");
});

mongoose.connection.on("error", function () {
  console.log("err!!");
});

mongoose.connection.on("disconnected", function () {
  console.log("fail!!");
});

router.get('/list', function (req, res, next) {
  let priceLevel = req.query.priceLevel;  //过滤
  let page = parseInt(req.query.page);   //获取页数的参数
  let pageSize = parseInt(req.query.pageSize);  //获取每页商品数目的参数
  let sort = req.query.sortBy;//获取排序方式的参数 -1为降序，1为升序
  let skip = (page - 1) * pageSize;           //跳过的商品数目
  let gtPrice = '';
  let ltePrice = '';
  if (priceLevel) {
    switch (priceLevel) {
      case '0':
        gtPrice = 0;
        ltePrice = 500;
        break;
      case '1':
        gtPrice = 500;
        ltePrice = 1000;
        break;
      case '2':
        gtPrice = 1000;
        ltePrice = 2500;
        break;
      case '3':
        gtPrice = 2500;
        ltePrice = 4000;
        break;
      default:
        gtPrice = 0;
        ltePrice = 999999;
        break;
    }
  }
  let filter = {
    salePrice: {
      $gt: gtPrice,
      $lte: ltePrice
    }
  };
  let goodsModel = Goods.find(filter).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice': sort});
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      res.json({
        status: "0",
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  })
});

// 加入到购物车
// 是二级路由，一级路由在app.js
router.post("/addCart", function (req, res, next) {
  var userId = '100000077',
    productId = req.body.productId;  // post请求拿到res参数：req.body
  var User = require('../models/user');  // 引入user模型

  // 查询第一条:拿到用户信息
  User.findOne({
    userId: userId   // 查询条件
  }, function (err, userDoc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      // 用户数据
      if (userDoc) {
        let goodsItem = '';
        userDoc.cartList.forEach(function (item) {    // 遍历用户购物车，判断加入购物车的商品是否已经存在
          if (item.productId == productId) {
            goodsItem = item;
            item.productNum++; // 购物车这件商品数量+1
          }
        });
        if (goodsItem) {
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: "1",
                msg: err2.message
              })
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              })
            }
          })
        } else {   // 若购物车商品不存在，就添加进去
          Goods.findOne({productId: productId}, function (err1, doc) {  // 从商品列表页Goods查询点击加入购物车的那件商品信息
            if (err1) {
              res.json({
                status: "1",
                msg: err1.message
              })
            } else {
              if (doc) {
                doc.productNum = 1;   // 在Goods模型中添加属性，要去models/goods.js的Schema添加这两个属性。
                doc.checked = 1;
                userDoc.cartList.push(doc);  // 添加信息到用户购物车列表中
                userDoc.save(function (err2, doc2) {  // 保存数据库
                  if (err2) {
                    res.json({
                      status: "1",
                      msg: err2.message
                    })
                  } else {
                    res.json({
                      status: "0",
                      msg: '',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
});


module.exports = router;
