var express = require('express');
var router = express.Router();
require('./../utils/util');
var User = require('./../models/user');

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


//登陆
router.post('/login', function (req, res, next) {
  var userParam = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(userParam, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 120 * 6 //生命周期为6小时
        });
        //res.session.user = doc;
        res.json({
          status: '0',
          msg: '',
          result: doc
        })
      }
    }
  })
});

//  登出
router.post("/logout", function (req, res, next) {
  res.cookie("userName", "", {
    path: "/",
    maxAge: -1  // 销毁cookie生命周期
  });
  res.json({
    status: "0",
    msg: '',
    result: ''
  })
});

// 登陆状态检查
router.get("/checkLogin", function (req, res, next) {
  if (req.cookies.userName) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
});

//  获取当前用户的购物车列表
router.get("/cartList", function (req, res, next) {
  var userName = req.cookies.userName;
  User.findOne({userName: userName}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.cartList
      });
    }
  })
});

//删除购物车的接口
router.post('/cartDel', function (req, res, next) {
  var userName = req.cookies.userName;
  var productId = req.body.productId;
  User.update({userName: userName}, {
      $pull: {
        'cartList': {
          'productId': productId
        }
      }
    }, function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        })
      } else {
        res.json({
          status: "0",
          msg: '',
          result: 'success'
        })
      }
    }
  )
});

// 商品修改
// 修改商品数量和勾选接口
router.post("/editCart", function (req, res, next) {
  var userName = req.cookies.userName,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({             // 查询条件
    "userName": userName,
    "cartList.productId": productId
  }, {                      // 修改的数据
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      });
    }
  });
});

//  全选接口
router.post('/editAllChecked', function (req, res, next) {
  var userName = req.cookies.userName;
  var checkAll = req.body.checked ? 1 : 0;
  User.findOne({
    "userName": userName
  }, function (err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAll;
        });
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        })
      }
    }
  })
});


router.get('/addressList', function (req, res, next) {
  var userName = req.cookies.userName;
  User.findOne({userName: userName}, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: "0",
        msg: '',
        result: doc.addressList
      })
    }
  })
});


//设置默认地址的接口
router.post("/setDefault", function (req, res, next) {
  var userName = req.cookies.userName;
  var addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '10086',
      msg: 'addressId is null',
      result: []
    })
  }
  User.findOne({userName: userName}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: []
      })
    } else {
      doc.addressList.forEach((item) => {
        if (item.addressId == addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      });
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: ''
          })
        }
      })
    }

  })
});

//删除地址接口
router.post("/delAddress", function (req, res, next) {
  let userName = req.cookies.userName;
  let addressId = req.body.addressId;
  User.update({userName: userName}, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: 'succ',
        result: ''
      })
    }
  });
});

//增加地址接口
router.post("/addAddress", function (req, res, next) {
  var userName = req.cookies.userName;
  var Consignee = req.body.Consignee;
  var streetName = req.body.streetName;
  var postCode = req.body.postCode;
  var tel = req.body.tel;
  var time = new Date().getTime();
  var addressId = String(time);
  var data = {
    'addressId': addressId,
    'userName': Consignee,
    'streetName': streetName,
    'postCode': postCode,
    'tel': tel,
    'isDefault': false
  };
  User.findOne({userName: userName}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        doc.addressList.push(data);
        doc.save(function (err1, doc1) {
          if (err1) {
            res.json({
              status: "1",
              msg: err1.message
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
});

//订单接口
router.post('/payMent', function (req, res, next) {
  var userName = req.cookies.userName;
  var addressId = req.body.addressId;
  var orderTotal = req.body.orderTotal;
  User.findOne({userName: userName}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var address = '', goodsList = [];
      //获取当前用户的地址信息
      doc.addressList.forEach((item) => {
        if (item.addressId == addressId) {
          address = item;
        }
      });
      //获取用户购物车数据
      doc.cartList.filter((item) => {
        if (item.checked == '1') {
          goodsList.push(item);
        }
      });

      var platform = '6969';    //平台号
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);
      var sysDate = new Date().Format('yyyyMMddhhmmss');  //系统时间
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');  //创建时间
      var orderId = platform + r1 + sysDate + r2;   //订单号
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      };
      doc.orderList.push(order);
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      });

    }
  })
});


//订单建立成功接口
router.get("/orderDetail", function (req, res, next) {
  var userName = req.cookies.userName,
    orderId = req.param("orderId");   // 前端传过来的订单id
  User.findOne({userName: userName}, function (err, userInfo) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var orderList = userInfo.orderList;  // orderList订单列表
      if (orderList.length > 0) {  // 说明有订单
        var orderTotal = 0;
        // 遍历订单列表，根据订单id得到该订单总金额orderTotal
        orderList.forEach((item) => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal;
          }
        });
        if (orderTotal > 0) {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        } else {
          res.json({
            status: '120002',
            msg: '无此订单',
            result: ''
          });
        }
      } else {
        res.json({
          status: '120001',
          msg: '当前用户未创建订单',
          result: ''
        });
      }
    }
  })
});

// 获取购物车数量
router.get("/getCartCount", function (req, res, next) {
  if (req.cookies && req.cookies.userName) {
    var userName = req.cookies.userName;
    User.findOne({userName: userName}, function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        var cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function (item) {
          cartCount += parseInt(item.productNum);
        });
        res.json({
          status: '0',
          msg: '',
          result: cartCount
        })
      }
    })
  }
});
module.exports = router;
