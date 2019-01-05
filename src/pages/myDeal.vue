<template>
  <div class="wrap">
    <div class="top">
      <img @click="back" class="back_img" src="../assets/nav_back.png" alt>
      <div>交易记录</div>
    </div>
    <div class="main">
      <div>
        <tab
          class="tab tab_radius"
          :line-width="2"
          custom-bar-width="50%"
          bar-active-color="#ba9870"
          active-color="#ba9870"
          :scroll-threshold="5"
        >
          <tab-item selected @click.native="navTap(0)">挂单中</tab-item>
          <tab-item @click.native="navTap(1)">交易中</tab-item>
          <tab-item @click.native="navTap(2)">已完成</tab-item>
          <tab-item @click.native="navTap(3)">卖家违约</tab-item>
        </tab>
      </div>
      <div
        v-if="list.length==0"
        style="color:rgba(255,255,255,.5);text-align:center;margin-top:16px;"
      >暂无数据...</div>
      <div class="d_list" v-if="type!=3&&list.length!=0">
        <ul v-for="(item,index) in list" :key="index">
          <li class="li">
            <span>订单号</span>
            <span>{{item.order_number}}</span>
          </li>
          <li class="li">
            <span>类型</span>
            <span :class="item.types==1?'f_c_red':'f_c_blue'">{{item.types==1?'买入':'卖出'}}</span>
          </li>
          <li class="li">
            <span>数量</span>
            <span>{{item.number}}</span>
          </li>
          <li class="li">
            <span>单价</span>
            <span>{{item.price}}元</span>
          </li>
          <li class="li">
            <span>总价</span>
            <span>{{item.count}}元</span>
          </li>
          <li class="li">
            <span>时间</span>
            <span>{{item.time}}</span>
          </li>
          <li class="li">
            <span>状态</span>
            <span v-if="type==0">挂单中</span>
            <span v-if="type==1&&item.trade==1&&item.path==null">未付款</span>
            <span v-if="type==1&&item.trade==1&&item.path!=null">已付款</span>
            <span v-if="type==1&&item.trade==2&&item.path==null">买家未付款</span>
            <span v-if="type==1&&item.trade==2&&item.path!=null">买家已付款</span>
            <span v-if="type==2">已完成</span>
            <span v-if="type==1" class="s_time">
              <span class="iconfont icon-naozhong"></span>
              <span>{{item.reciprocal_time}}</span>
            </span>
          </li>
          <li v-if="type!=0" class="li li_img">
            <span>支付截图</span>
            <div>
              <img @click="bigimg(item.path)" :src="item.path" alt>
            </div>
          </li>
          <li class="li_btns" v-if="type==0">
            <button class="btn" @click="cancelDeal(item.id,1)">放弃挂单</button>
          </li>
          <li class="li_btns" v-if="type==1&&item.types==1&&item.trade==1&&item.path==null">
            <button class="btn" @click="pay(item.hid,item.id)">去支付</button>
          </li>
          <li class="li_btns" v-if="type==1&&item.types==2&&item.trade==2&&item.path!=null">
            <button
              v-if="item.reciprocal_time!='00:00:00'"
              class="btn"
              @click="finish(item.id)"
            >确认收款</button>
          </li>
          <li
            class="li_btns li_btns_"
            v-if="type==1&&item.types==2&&item.trade==1&&item.path==null"
          >
            <button class="btn" @click="inform(item.tid)">提醒买家付款</button>
            <!-- <button class="btn" @click="cancelDeal(item.id,2)">取消订单</button> -->
          </li>
          <li
            class="li_btns li_btns_"
            v-if="type==1&&item.types==1&&item.trade==2&&item.path!=null"
          >
            <button class="btn" @click="inform(item.tid)">提醒卖家确认</button>
            <button
              v-if="item.reciprocal_time=='00:00:00'"
              class="btn"
              @click="toComplain(item.id)"
            >申请投诉</button>
          </li>
        </ul>
      </div>
      <div class="d_list" v-if="type==3&&list.length!=0">
        <ul v-for="(item,index) in list" :key="index">
          <li class="li">
            <span>卖家ID</span>
            <span>{{item.tid}}</span>
          </li>
          <li class="li">
            <span>时间</span>
            <span>{{item.time}}</span>
          </li>
          <li class="li">
            <span>状态</span>
            <span class="f_c_red">{{item.apply_type}}</span>
          </li>
          <li class="li li_img li_img_">
            <span>上传凭证</span>
            <div>
              <img @click="bigimg(item.path)" :src="item.path" alt>
            </div>
          </li>
          <li class="li_reason">
            <div>违约理由</div>
            <div>{{item.apply}}</div>
          </li>
        </ul>
      </div>
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
              <div>
                <span class="left">卖方姓名：</span>
                <span class="right">{{sell_info.bank_real_name||sell_info.ali_name||sell_info.wechat_name}}</span>
              </div>
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
                  <img :src="sell_info.wechat_img" alt @click="bigimg(sell_info.wechat_img)">
                </span>
              </div>
              <!-- <div>
                                <span class="left">买入数量：</span>
                                <span class="right">
                                    <input type="text" placeholder="请输入买入数量" v-model="buy_num">
                                </span>
              </div>-->
            </div>
            <div class="d_btns">
              <button class="btn" @click="toUpload">去上传</button>
            </div>
          </div>
        </div>
      </div>
    </x-dialog>
    <x-dialog v-model="dialog1" class="de_dialog up_dialog" hide-on-blur>
      <div class="dialog">
        <div class="ta_r close_div">
          <span class="vux-close" @click="dialog1=false"></span>
        </div>
        <div class="dd_con">
          <div class="d_title">上传支付截图</div>
          <div class="d_con">
            <div class="upload_div">
              <div>选择支付方式</div>
              <div class="pay_ways">
                <div @click="selectWay(0)">
                  <span
                    class="iconfont icon-yuanxingweixuanzhong"
                    :class="{'icon-danxuanxuanzhong':way == 0}"
                  ></span>支付宝
                </div>
                <div @click="selectWay(1)">
                  <span
                    class="iconfont icon-yuanxingweixuanzhong"
                    :class="{'icon-danxuanxuanzhong':way == 1}"
                  ></span>微信
                </div>
                <div @click="selectWay(2)">
                  <span
                    class="iconfont icon-yuanxingweixuanzhong"
                    :class="{'icon-danxuanxuanzhong':way == 2}"
                  ></span>银行卡
                </div>
              </div>
              <div class="up_div">
                <span class="icon f_c">+</span>
                <span class="jia">点击上传支付凭证</span>
                <img v-if="data1" :src="data1">
                <input
                  name="img"
                  :disabled="data1!=''"
                  type="file"
                  id="handcard"
                  @change="pushImg1($event)"
                  accept="image/jpeg, image/png, image/gif"
                  alt
                >
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
    <div @click="hidem" class="mmask">
      <img :src="bigpic" alt>
      
    </div>
  </div>
</template>
<script>
import { Tab, TabItem, XDialog } from "vux";
import $ from "jquery";
export default {
  data() {
    return {
      type: "",
      way: "0",
      dialog: false,
      dialog1: false,
      dialog3: false,
      data1: "",
      buy_num: "",
      sell_num: "",
      pwd: "",
      list: [],
      bigpic: "",
      sell_info: "",
      active_id: "",
      urll: ""
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
      clearInterval(window.t);
      that.$router.back();
      error;
    };
    that.navTap(0);
  },
  methods: {
    back() {
      let that = this;
      clearInterval(window.t);
      that.$router.back();
    },
    bigimg(pic) {
      $(".mmask").fadeIn();
      this.bigpic = pic;
    },
    hidem() {
      this.bigpic = "";
      $(".mmask").fadeOut();
    },
    navTap(i) {
      this.type = i;
      let that = this;
      // that.list = [];
      clearInterval(window.t);
      if (that.type == 1) {
        window.t = setInterval(fun, 1000);
      }
      fun();
      function fun() {
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "look_log",
              token: that.$store.state.user_info.token,
              uid: that.$store.state.user_info.id,
              type: that.type + 1
            }
          })
          .then(function(res) {
            that.list = res.data.data;
          });
      }
    },
    pay(id,id1) {
      let that = this;
      that.active_id = id1;
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
          that.dialog = true;
        });
    },
    cancelDeal(id, i) {
      let that = this;
      that.$vux.confirm.show({
        title: "放弃挂单",
        confirmText: "确定",
        cancelText: "取消",
        content: "确定放弃该挂单吗？",
        onShow() {},
        onHide() {},
        onCancel() {},
        onConfirm() {
          let nzle = "";
          if (i == 1) {
            nzle = "del_log";
          } else {
            nzle = "del_order";
          }
          that
            .$http({
              url: "/",
              method: "post",
              data: {
                nozzle: nzle,
                token: that.$store.state.user_info.token,
                id: id
              }
            })
            .then(function(res) {
              if (res.data.code == 1) {
                that.$vux.toast.show({
                  text: res.data.msg,
                  type: "success",
                  position: "middle",
                  time: 1200
                });
                that.navTap(0);
              } else {
                that.$vux.toast.show({
                  text: res.data.msg,
                  type: "cancel",
                  position: "middle",
                  time: 1200
                });
              }
            });
          that.$vux.confirm.hide();
        }
      });
    },
    selectWay(i) {
      this.way = i;
    },
    toUpload() {
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
    sub() {
      let that = this;
      if (!that.way) {
        that.$vux.toast.show({
          text: "请选择支付方式",
          type: "text",
          position: "middle",
          time: 1200
        });
        return false;
      }
      if (!that.urll) {
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
            nozzle: "update_order",
            token: that.$store.state.user_info.token,
            id: that.active_id,
            path: that.urll
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            that.dialog1 = false;
            that.dialog3 = true;
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
    confirm() {
      this.dialog3 = false;
    },
    finish(id) {
      let that = this;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "order_end",
            token: that.$store.state.user_info.token,
            id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            that.$vux.toast.show({
              text: res.data.msg,
              type: "success",
              position: "middle",
              time: 1200
            });
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
    toComplain(id) {
      this.$router.push({
        name: "complain",
        params: {
          id: id
        }
      });
    },
    inform(id) {
      let that = this;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "order_code",
            token: that.$store.state.user_info.token,
            id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            that.$vux.toast.show({
              text: res.data.msg,
              type: "success",
              position: "middle",
              time: 1200
            });
          } else {
            that.$vux.toast.show({
              text: res.data.msg,
              type: "text",
              position: "middle",
              time: 1200
            });
          }
        });
    }
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
.f_c_red {
  color: #e51c23;
}
.f_c_blue {
  color: #259b24;
}
.wrap {
  font-size: 0.36rem;
  width: 100%;
  height: 100%;
  color: white;
  box-sizing: border-box;
  padding-top: 1.15rem;
  background: #242424;
  > .top {
    border-bottom: 0.05rem solid #242424;
  }
  .main {
    box-sizing: border-box;
    box-sizing: border-box;
    padding: 0.2rem 3% 0.4rem;
    height: 100%;
    overflow: hidden;
    .vux-tab .vux-tab-item {
      color: #868686;
    }

    .d_list {
      margin-top: 0.4rem;
      box-sizing: border-box;
      height: calc(100% - 44px);
      overflow: auto;
      ul {
        background: #010101;
        color: #b5b5b5;
        padding: 0.2rem 0 0.2rem;
        margin-bottom: 0.4rem;

        .li {
          padding: 0.3rem 0 0.3rem 0.8rem;
          border-bottom: 1px solid rgba(186, 152, 112, 0.3);
          > span:first-child {
            display: inline-block;
            width: 2rem;
          }
          .icon-naozhong {
            color: #ff9800;
            font-size: 0.5rem;
          }
        }
        .li_img {
          border: 0;
          > span {
            vertical-align: top;
          }
          > div {
            display: inline-block;
            width: 3rem;
            height: 3rem;
            border-radius: 2px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .li_img_ {
          border-bottom: 1px solid rgba(186, 152, 112, 0.3);
        }
        .li_reason {
          padding: 0.3rem 0.8rem 0.3rem;
          border: 0;
          > div:first-child {
            padding-bottom: 0.2rem;
          }
        }
        .li_btns {
          padding: 0.8rem 0 0.5rem;
          .btn {
            display: block;
            width: 40%;
            line-height: 0.7rem;
            background: #ba9870;
            color: white;
            border-radius: 4px;
            margin: 0 auto;
          }
        }
        .li_btns_ {
          text-align: center;
          .btn {
            display: inline-block;
            width: 30%;
            margin: 0 0.2rem 0;
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
            width: calc(100% - 2.8rem);
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
            width: 2.8rem;
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
  .up_dialog {
    .upload_div {
      > div:first-child {
        text-align: left;
        padding: 0.1rem 0 0.4rem;
      }

      .pay_ways {
        margin-bottom: 0.5rem;
        > div {
          display: inline-block;
          padding: 0 0.2rem 0;
          .iconfont {
            display: inline-block;
            margin-right: 0.1rem;
            vertical-align: middle;
            transform: translateY(-1px);
          }
        }
        .icon-danxuanxuanzhong {
          color: #ba9870;
        }
      }
    }
  }
  .suc_dialog {
    .dialog {
      .iconfont {
        font-size: 1.6rem;
      }
      .suc_icon {
        padding-top: 0.4rem;
        p {
          > span {
            display: block;
            color: #333;
            font-size: 0.42rem;
            font-weight: 700;
          }
        }
      }
      .d_con {
        padding: 0 !important;
        .d_btns {
          margin-top: 0.4rem;
          padding: 0 !important;
          .btn {
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
  .mmask {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99999;
    display: none;
  }
  .mmask img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    margin: 0 auto;
  }
}
</style>
