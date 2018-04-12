<template>
  <div>
    <!--头部-->
    <nav-header></nav-header>
    <!--面包屑-->
    <nav-bread>
      <span>goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a @click="sortGoodslist" href="javascript:void(0)" class="price">Price
            <img src="/static/sort.png" alt="">
          </a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceFilter(5)">All</a></dd>
              <dd>
                <a href="javascript:void(0)" @click="setPriceFilter(0)">0 - 500</a>
              </dd>
              <dd>
                <a href="javascript:void(0)" @click="setPriceFilter(1)">500 - 1000</a>
              </dd>
              <dd>
                <a href="javascript:void(0)" @click="setPriceFilter(2)">1000 - 2500</a>
              </dd>
              <dd>
                <a href="javascript:void(0)" @click="setPriceFilter(3)">2500 - 4000</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img :src="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">￥{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="#" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-infinite-scroll="loadMore" class="load-more" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
      <img src="./../assets/loading-spinning-bubbles.svg" alt="" v-show="loading">
    </div>
     <!--模态框-->
    <Modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">
        请先登陆，否则无法添加到购物车中。
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="#" @click="mdShow=false">关闭</a>
      </div>
    </Modal>
    <Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <img src="/static/suc-check.png" alt="">
        <span >加入购物车成功</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="#" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m" href="javascript:;" to="cart">查看购物车</router-link>
      </div>
    </Modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script>


  import NavHeader from '../components/NavHeader'
  import NavFooter from '../components/NavFooter'
  import NavBread from '../components/NavBread'
  import Modal from './../components/modal'
  import axios from 'axios'
  import './../assets/css/base.css'
  import './../assets/css/product.css'


  export default {
    data() {
      return {
        goodsList: [],
        page: 1,
        pageSize: 8,
        sortFlag: true,
        busy: true,
        priceChecked: 5,
        mdShow:false,
        mdShowCart:false,
        loading: true
      }
    },
    mounted() {
      this.getGoodsList();
    },
    methods: {
      getGoodsList(flag) {
        this.loading = true;
        axios.get('/goods/list', {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            sortBy: this.sortFlag ? 1 : -1,
            priceLevel: this.priceChecked
          }
        }).then((response) => {
          let res = response.data;
          this.loading = false;
          if (res.status == "0") {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.result.list);
              if (res.result.count == 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.result.list;
              this.busy = false;
            }

          } else {
            this.goodsList = [];
          }
        })
      },
      //商品排序
      sortGoodslist() {
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      //加载更多
      loadMore() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500);
      },
      //过滤
      setPriceFilter(index){
        this.priceChecked = index;
        this.page = 1;
        this.getGoodsList();
      },
      addCart(productId){
        axios.post("/goods/addCart",{
          productId:productId
        }).then((response)=>{
          let res = response.data;
          if(res.status == 0){
            this.mdShowCart = true;
            this.$store.commit("updateCartCount",1);
          }else{
            this.mdShow = true;
          }
        })
      },
      closeModal(){
        this.mdShow = false;
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    }
  }
</script>

<style scoped>
  .load-more {
    font-size: 130%;
    text-align: center;
    height: 100px;
    line-height: 100px;
  }
</style>
