var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  'userId':String,
  'userName':String,
  'userPwd':String,
  'orderList':Array,
  'cartList':[           // 购物车列表
    {
      "productId":String,
      "productName":String,
      "salePrice":Number,
      "productImage":String,
      "checked":String,     // 是否选中
      "productNum":Number  // 商品数量
    }
  ],
  "addressList":[         //地址列表
    {
      "addressId": String,
      "userName": String,
      "streetName": String,
      "postCode": String,
      "tel": String,
      "isDefault": Boolean
    }
  ]
});

module.exports = mongoose.model('User',userSchema);
