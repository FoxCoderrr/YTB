<template>
    <div class="wrap">
        <div class="top">
            <img @click="back" class="back_img" src="../assets/nav_back.png" alt="">
            <div>交易大厅</div>
        </div>
        <div class="main">
            <tab class="tab tab_radius" :line-width = 2 bar-active-color="#ba9870" active-color="#ba9870" :scroll-threshold="5">
                <tab-item selected @click.native="navTap(0)">买入专区</tab-item>
                <tab-item @click.native="navTap(1)">卖出专区</tab-item>
            </tab>
            <div v-if="!list.length" style="color:rgba(255,255,255,.5);text-align:center;margin-top:16px;">暂无挂单...</div>
            <ul v-if="list.length">
                <li v-for="(item,index) in list" :key="index">
                    <div class="d_top">
                        <span class="f_l">ID:{{item.id}}</span>
                        <span class="f_r">{{item.time}}</span>
                    </div>
                    <div>
                        <div class="d_left f_l">
                            <span class="f_c">单号：{{item.hang_number}}</span>
                            <span>单价：{{item.price}}元</span>
                        </div>
                        <div class="d_mid f_l">
                            <span>挂卖：{{item.residue}}ETW</span>
                            <span>总价：{{item.count}}</span>
                        </div>
                        <div class="d_right f_r">
                            <button v-if="item.uid != $store.state.user_info.id" class="btn" @click="bsBtn(item.id,item.residue)">{{btnType}}</button>
                            <button v-if="item.uid == $store.state.user_info.id" class="btn" disabled>{{btnType}}</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 弹窗 -->
        <x-dialog v-model="dialog" class="de_dialog buy_dialog" hide-on-blur>
            <div class="dialog">
                <div class="ta_r close_div">
                    <span class="vux-close" @click="dialog=false"></span>
                </div> 
                <div class="dd_con">
                    <div class="d_title">卖家信息</div>
                    <div class="d_con">
                        <div class="d_form">
                            <div v-if="sell_info.bank">
                                <span class="left">银行卡账号：</span>
                                <span class="right">{{sell_info.bank}}</span>
                            </div>
                            <div v-if="sell_info.alipay">
                                <span class="left">支付宝账号：</span>
                                <span class="right">{{sell_info.alipay}}</span>
                            </div>
                            <div v-if="sell_info.wechat_img">
                                <span class="left">微信收款码：</span>
                                <span class="right">
                                    <img :src="sell_info.wechat_img" alt="">
                                </span>
                            </div>
                            <div>
                                <span class="left">买入数量：</span>
                                <span class="right">
                                    <input type="text" placeholder="请输入买入数量" @input="num1($event,0)" v-model="buy_num">
                                </span>
                            </div>
                        </div>
                        <div class="d_btns">
                            <button class="btn" @click="toUpload">去上传</button>
                        </div>
                    </div>
                </div>
            </div>
        </x-dialog>
        <x-dialog v-model="dialog1" class="de_dialog up_dialog" hide-on-blur @on-hide="noUpload">
            <div class="dialog">
                <div class="ta_r close_div">
                    <span class="vux-close" @click="noUpload"></span>
                </div> 
                <div class="dd_con">
                    <div class="d_title">上传支付截图</div>
                    <div class="d_con">
                        <div class="upload_div">
                            <div>选择支付方式</div>
                            <div class="pay_ways">
                                <div @click="selectWay(1)">
                                    <span class="iconfont icon-yuanxingweixuanzhong" :class="{'icon-danxuanxuanzhong':way == 1}"></span>支付宝
                                </div>
                                <div @click="selectWay(2)">
                                    <span class="iconfont icon-yuanxingweixuanzhong" :class="{'icon-danxuanxuanzhong':way == 2}"></span>微信
                                </div>
                                <div @click="selectWay(3)">
                                    <span class="iconfont icon-yuanxingweixuanzhong" :class="{'icon-danxuanxuanzhong':way == 3}"></span>银行卡
                                </div>
                            </div>
                            <div class="up_div">
                                <span class="icon f_c">+</span>
                                <span class="jia">点击上传支付凭证</span>
                                <img v-if="data1" :src="data1" >
                                <input name="img" :disabled="data1!=''" type="file" id="handcard" @change="pushImg1($event)" accept="image/jpeg,image/png,image/gif" alt="">
                                <span class="clear iconfont icon-shanchu1" v-if="data1" @click="delImg1($event)"></span>
                            </div>
                        </div>
                        <div class="d_btns">
                            <button class="btn" @click="sub">提交</button>
                        </div>
                    </div>
                </div>
            </div>
        </x-dialog>

        <x-dialog v-model="dialog2" class="de_dialog sell_dialog" hide-on-blur>
            <div class="dialog">
                <div class="ta_r close_div">
                    <span class="vux-close" @click="dialog2=false"></span>
                </div> 
                <div class="dd_con">
                    <div class="d_title">卖出</div>
                    <div class="d_con">
                        <div class="d_form">
                            <div>
                                <span class="left">卖出数量：</span>
                                <span class="right">
                                    <input type="text" placeholder="请输入卖出数量" @input="num1($event,1)" v-model="sell_num">
                                </span>
                            </div>
                            <div>
                                <span class="left">交易密码：</span>
                                <span class="right">
                                    <input type="password" placeholder="请输入交易密码" v-model="pwd">
                                </span>
                            </div>
                        </div>
                        <div class="d_btns">
                            <button class="btn" @click="subSell">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        </x-dialog>

        <x-dialog v-model="dialog3" class="de_dialog suc_dialog" hide-on-blur>
            <div class="dialog">
                <div class="dd_con">
                    <div class="suc_icon f_c">
                      <span class="iconfont icon-duihao"></span>
                      <p>
                        <span>提交支付截图提示</span>
                        <span>提交审核中</span>
                      </p>
                    </div>
                    <div class="d_con">
                        <div class="d_btns">
                            <button class="btn" @click="confirm">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        </x-dialog>
    </div>
</template>
<script>
import $ from "jquery";
import { Tab, TabItem, XDialog } from "vux";
export default {
  data() {
    return {
      bs_type: 0,
      way:"1",
      dialog: false,
      dialog1: false,
      dialog2: false,

      dialog3: false,
      data1: "",
      buy_num:"",
      sell_num:"",
      pwd:"",
      list: [],
      sell_info:"",
      active_id:"",
      active_left:"",
      urll:"",
    };
  },
  components: {
    Tab,
    TabItem,
    XDialog
  },
  mounted() {
    let that = this;
    mui.back = function() {
      that.$router.back();
      error;
    };
    that.navTap(0);
  },
  computed: {
    btnType() {
      if (this.bs_type) {
        return "卖出";
      } else {
        return "买入";
      }
    }
  },
  methods: {
    back() {
      let that = this;
      that.$router.back();
    },
    num1(e,i){
        $(e.target).val(
        $(e.target)
          .val()
          .match(/\d+\.?\d{0,6}/)
      );
        if(i){
            this.sell_num = $(e.target).val();
        }else{
            this.buy_num = $(e.target).val();
        }
    },
    navTap(i) {
      this.bs_type = i;
      let that = this;
      that.list = [];
      that
      .$http({
        url: "/",
        method: "post",
        data: {
          nozzle: "order_hang",
          token: that.$store.state.user_info.token,
          type: that.bs_type+1,
        }
      })
      .then(function(res) {
        if (res.data.code == 1) {
          that.list = res.data.data;
        } else if (res.data.code == -1) {
          that.$vux.toast.show({
            text: res.data.msg,
            type: "text",
            position: "middle",
            time: 1200
          });
          that.$router.push({
            name: "login"
          });
        }
      });
    },
    bsBtn(id,left) {
      let that = this;
      that.active_id = id;
      that.active_left = left;
      if (that.bs_type) {
        // 卖出
        that.dialog2 = true;
      } else {
        // 买入
        that.dialog = true;
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "hang_data",
              token: that.$store.state.user_info.token,
              id: id
            }
          })
          .then(function(res) {
              that.sell_info = res.data;
          });
       
      }
    },
    selectWay(i){
        this.way = i;
    },
    toUpload() {
      let that = this;
        if(!that.buy_num||that.buy_num>that.active_left){
          that.$vux.toast.show({
            text: "请输入合理买入数量",
            type: "text",
            position: "middle",
            time: 1200
          });
          return false;
        }

        this.dialog = false;
        this.dialog1 = true;

    },
    // 上传
    pushImg1: function(e) {
      let file = e.target,
        reader = new FileReader(),
        that = this,
        _name,
        _fileName;
      _name = file.value;
      _fileName = _name.substring(_name.lastIndexOf(".") + 1).toLowerCase();
      // if (_fileName !== "png" && _fileName !== "jpg") {
      //   that.$vux.toast.show({
      //     text: "请上传图片类型文件！",
      //     type: "cancel",
      //     position: "middle",
      //     time: 1200
      //   });
      // }else{
      reader.readAsDataURL(file.files[0]);
      if (file.files[0].size > 10 * 1024 * 1024) {
        that.$vux.toast.show({
          text: that.$t("ups.d"),
          type: "warn",
          position: "middle",
          time: 1500
        });
      } else {
        that.$vux.loading.show({
          text: "上传中..."
        });
        reader.onload = function() {
          let result = this.result;

          // that.data1 = result;

          var image = new FormData();
          image.append("file", e.target.files[0]);
          // image.append("nozzle", "upload");
          // image.append("token", that.$store.state.user_info.token);
          that
            .$http({
              url: "/upload",
              method: "post",
              data: image
            })
            .then(function(res) {
              that.$vux.loading.hide();
              if (res.data.code == 200) {
                that.data1 = result;
                that.urll = res.data.msg;
              } else {
                that.$vux.toast.show({
                  text: res.data.msg,
                  type: "cancel",
                  position: "middle",
                  time: 1200
                });
              }
            });
        };
      }

      // }
    },
    delImg1: function(e) {
      this.data1 = "";
      let dom = document.getElementById("handcard");
      dom.value = "";
    },
    noUpload(){
      let that = this;
      that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "insert_order",
              token: that.$store.state.user_info.token,
              id: that.active_id,
              uid: that.$store.state.user_info.id,
              number: that.buy_num,
              type: that.bs_type+1,
               pwd:"",
               state:"",
               path:""
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              that.$vux.toast.show({
                text: "您未支付该订单",
                type: "text",
                position: "middle",
                time: 1200
              });
              that.dialog1 = false;
            } else {
              that.dialog1 = false;
            }
          });
    },
    sub() {
      let that = this;
      if(!that.way){
        that.$vux.toast.show({
          text: "请选择支付方式",
          type: "text",
          position: "middle",
          time: 1200
        });
        return false;
      }
      if(!that.urll){
        that.$vux.toast.show({
          text: "请上传支付截图",
          type: "text",
          position: "middle",
          time: 1200
        });
        return false;
      }
      that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "insert_order",
              token: that.$store.state.user_info.token,
              id: that.active_id,
              uid: that.$store.state.user_info.id,
              number: that.buy_num,
              state: that.way,
              path:that.urll,
              type: that.bs_type+1,
              pwd:"",
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
               that.dialog1 = false;
              that.dialog3 = true;
              that.buy_num = "";
              that.navTap(0);
            } else {
              that.$vux.toast.show({
                text: res.data.msg,
                type: "text",
                position: "middle",
                time: 1200
              });
            }
          });
     
    },
    confirm(){
      this.dialog3 = false;
    },
    subSell(){
      let that = this;
      if(!that.sell_num||that.sell_num>that.active_left){
        that.$vux.toast.show({
          text: "请输入合理卖出数量",
          type: "text",
          position: "middle",
          time: 1200
        });
        return false;
      }
      if(!that.pwd){
        that.$vux.toast.show({
          text: "请输入交易密码",
          type: "text",
          position: "middle",
          time: 1200
        });
        return false;
      }
      that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "insert_order",
              token: that.$store.state.user_info.token,
              id: that.active_id,
              uid: that.$store.state.user_info.id,
              number: that.buy_num,
              type: that.bs_type+1,
              pwd:that.pwd,
              path:"",
              state:""
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              that.$vux.toast.show({
                text: res.data.msg,
                type: "text",
                position: "middle",
                time: 1200
              });
              that.dialog2 = false;
              that.sell_num = "";
              that.pwd = "";
              that.navTap(1);
            } else {
              that.$vux.toast.show({
                text: res.data.msg,
                type: "text",
                position: "middle",
                time: 1200
              });
            }
          });
    },
  }
};
</script>
<style lang="less" scoped>
.up_div {
  clear: both;
  width: 5rem;
  height: 4rem;
  margin: 0 auto;
  border: 1px solid #ba9870;
  position: relative;
  text-align: center;
  .icon {
    position: absolute;
    left: 50%;
    top: 0.6rem;
    font-size: 1.4rem;
    transform: translateX(-50%);
  }
  .jia {
    position: absolute;
    left: 50%;
    top: 2.4rem;
    color: #ba9870;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  input {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .clear {
    font-size: 0.72rem;
    color: #ba9870;
    position: absolute;
    right: -0.8rem;
    top: -0.4rem;
  }
}
.wrap {
  font-size: 0.36rem;
  width: 100%;
  height: 100%;
  color: white;
  box-sizing: border-box;
  padding-top: 1.15rem;
  background: #242424;
  overflow: hidden;
  > .top {
    border-bottom: 0.05rem solid #242424;
  }
  .main {
    box-sizing: border-box;
    padding: 0.2rem 3% 0.4rem;
    height: 100%;

    ul {
      background: #010101;
      margin-top: 0.4rem;
      padding: 0.2rem 0 0;
      border-radius: 4px;
      box-sizing: border-box;
      max-height: calc(100% - 64px);
      overflow: auto;
      li {
        border-bottom: 1px solid #242424;
        color: #b5b5b5;
        padding: 0.3rem;
        .d_top {
          overflow: hidden;
          padding-bottom: 0.3rem;
          > .f_r {
            color: #868686;
            font-size: 0.32rem;
          }
        }
        > div {
          overflow: hidden;

          > div:first-child {
            margin-right: 1rem;
          }
          > div {
            > span {
              display: block;
              padding-bottom: 0.15rem;
              font-size: 0.32rem;
            }
          }
          .btn {
            background: #ba9870;
            color: white;
            line-height: 0.8rem;
            padding: 0 0.5rem 0;
            border-radius: 2px;
            margin-top: 0.15rem;
          }
          .btn[disabled]{
            background: rgb(180, 175, 175);
          }
        }
      }
    }
  }
  .de_dialog .dialog {
    ::-webkit-input-placeholder {
          color: #888;
        }
        ::-moz-input-placeholder {
          color: #888;
        }
        ::-o-input-placeholder {
          color: #888;
        }
        ::-ms-input-placeholder {
          color: #888;
        }
    color: #333;
    .close_div {
      padding: 0.2rem 0.2rem 0;
    }

    .d_title {
      font-size: 0.42rem;
      font-weight: 700;
    }
    .d_con {
      padding: 0.4rem;
      .d_form {
        > div {
          overflow: hidden;
          margin-bottom: 0.4rem;
          > span {
            float: left;
            width: calc(100% - 2.5rem);
            box-sizing: border-box;
            line-height: 0.8rem;

            img {
              width: 50%;
            }

            input {
              width: 90%;
              box-sizing: border-box;
              padding: 0 0.2rem 0;
              border: 1px solid #bbb;
              line-height: 0.8rem;
            }
          }
          > .right {
            text-align: left;
            padding-left: 0.2rem;
          }
          > span:first-child {
            width: 2.5rem;
            text-align: right;
          }
        }
      }
      .d_btns {
        padding: 0.6rem 0 0.4rem;
        .btn {
          width: 50%;
          background: #ba9870;
          color: white;
          line-height: 0.8rem;
          border-radius: 2px;
        }
      }
    }
  }
  .up_dialog{
      .upload_div{
          >div:first-child{
              text-align: left;
              padding: 0.1rem 0 0.4rem;
          }

          .pay_ways{
              margin-bottom: 0.5rem;
              >div{
                  display: inline-block;
                  padding: 0 0.2rem 0;
                  .iconfont{
                      display: inline-block;
                      margin-right: 0.1rem;
                      vertical-align: middle;
                      transform: translateY(-1px);
                  }
              }
              .icon-danxuanxuanzhong{
                color: #ba9870;
              }
          }
      }
  }
  .suc_dialog{
    .dialog{
      .iconfont{
        font-size: 1.6rem;
      }
      .suc_icon{
        padding-top: 0.4rem;
        p{
          >span{
            display: block;
            color: #333;
            font-size: 0.42rem;
            font-weight: 700;
          }
        }
      }
      .d_con{
        padding: 0!important;
        .d_btns{
          margin-top: 0.4rem;
          padding: 0!important;
          .btn{
            width: 100%;
            background: transparent;
            border-top: 1px solid #ba9870;
            color: #ba9870;
            font-size: 0.44rem;
            line-height: 1rem;
          }
        }
      }
    }
  }
  .sell_dialog{
    .dialog{
      .d_con{
        .d_form{
          >div{
            >span:first-child{
              width: 2.2rem;
            }
            span{
              input{
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
