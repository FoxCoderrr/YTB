<template>
    <div class="wrap">
        <div class="top">
            <img @click="back" class="back_img" src="../assets/nav_back.png" alt="">
            <div>提币</div>
        </div>
        <div class="main">
            <div> <span style="display:block">可用余额：</span> {{balance}} ETW &asymp; {{eth}}ETH</div>
            <div class="form">
              <div>
                    <div>提币币种：</div>
                    <select @change="selectCoin" v-model="coin_type">
                        <option value="ETW">ETW</option>
                        <option value="ETH">ETH</option>
                    </select>
                </div>
                <div>
                    <div>提币地址：</div>
                    <select @change="selectAds($event)">
                        <option v-for="(item,index) in ads_lists" :key="index" :value="item.id">{{item.address}}</option>
                    </select>
                </div>
                <div>
                    <div>数量：</div>
                    <div>
                        <input class="f_l" type="number" @input="num($event)" v-model="u_num" :placeholder=min>
                        <span class="f_r f_c">{{coin_type}}</span>
                    </div>
                </div>
                <div>
                    <div>实际到账：</div>
                    <div>
                        <input class="f_l" type="text" v-model="u_number" readonly>
                        <span class="f_r f_c">{{coin_type}}</span>
                    </div>
                </div>
                <div>
                    <div>交易密码：</div>
                    <div>
                        <input type="password" v-model="u_pwd" placeholder="请输入交易密码">
                    </div>
                </div>
                <div class="yzm">
                    <div>手机验证码：</div>
                    <div>
                        <input class="f_l" type="text" v-model="u_code" placeholder="请输入手机验证码">
                        <span class="f_l f_c" :class="{f_cc:btn_msg!='发送验证码'}" @click="getCode">{{btn_msg}}</span>
                    </div>
                </div>
                <div class="textarea">
                    <div></div>
                    <div>
                        <textarea cols="30" rows="4" placeholder="备注：" v-model="u_comment"></textarea>
                    </div>
                </div>
                <button class="btn" @click="sub">确认提币</button>
            </div>
            <div class="d_bot">
                <div>提币说明：</div>
                <ul>
                    <li v-for="(item,index) in tips" :key="index">{{index+1}}. {{item}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import $ from "jquery";
export default {
  data() {
    return {
      coin_type:"ETW",
      u_ads: "",
      u_num: "",
      u_number: "0",
      u_pwd: "",
      u_code: "",
      u_comment: "",
      min: "",
      min_num: "",
      fee: "",
      btn_msg: "发送验证码",
      time: 60,
      tips: [],
      balance: "",
      ads_lists: [],
      etw_ads:[],
      eth_ads:[],
      ratio:"",
      eth:"",
    };
  },
  components: {},
  computed:{
    etw(){
      if(!parseFloat(this.balance)){
        return "0.00"
      }else{
        return parseFloat(this.balance*this.ratio).toFixed(4)
      }
    }
  },
  mounted() {
    let that = this;
    // that.ratio = parseFloat(sessionStorage.getItem("ratio"));
    mui.back = function() {
      clearInterval(window.t);
      that.$router.back();
      error;
    };
    that.getInfo();
  },
  watch:{
    coin_type(v){
      this.min = "请输入提币数量，至少" + this.min_num + this.coin_type;;
    }
  },
  methods: {
    back() {
      let that = this;
      clearInterval(window.t);
      that.$router.back();
    },
    num(e) {
      $(e.target).val(
        $(e.target)
          .val()
          .match(/\d+\.?\d{0,4}/)
      );
      this.u_num = $(e.target).val();
      if (parseFloat(this.u_num) >= parseFloat(this.min_num)) {
        this.u_number = parseFloat(this.u_num * (1- this.fee/100)).toFixed(4);
      } else {
        this.u_number = 0;
      }
    },
    getInfo(){
      let that = this;
      that
      .$http({
        url: "/",
        method: "post",
        data: {
          nozzle: "withdraw_info",
          token: that.$store.state.user_info.token
        }
      })
      .then(function(res) {
        if (res.data.code == 1) {
          that.tips = res.data.data.explain;
          that.balance = res.data.data.balance;
          that.eth = res.data.data.eth;
          that.min = "请输入提币数量，至少" + res.data.data.min + that.coin_type;
          that.min_num = res.data.data.min;
          that.fee = res.data.data.fee;
          if(res.data.data.address.etw.length){
            that.u_ads = res.data.data.address.etw[0].id;
            for (let i = 0, l = res.data.data.address.etw.length; i < l; i++) {
              res.data.data.address.etw[i].ads =
                res.data.data.address.etw[i].address.split(":")[0] +
                "【" +
                res.data.data.address.etw[i].address.split(":")[1] +
                "】";
            }
            for (let i = 0, l = res.data.data.address.eth.length; i < l; i++) {
              res.data.data.address.eth[i].ads =
                res.data.data.address.eth[i].address.split(":")[0] +
                "【" +
                res.data.data.address.eth[i].address.split(":")[1] +
                "】";
            }
          }
          that.etw_ads = res.data.data.address.etw;
          that.eth_ads = res.data.data.address.eth;
          that.ads_lists = res.data.data.address.etw;
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
    
    selectCoin(){
      if(this.coin_type == "ETW"){
        this.ads_lists = this.etw_ads;
        if(this.etw_ads.length){
          this.u_ads = this.etw_ads[0].id;
        }
      }else{
        this.ads_lists = this.eth_ads;
        if(this.eth_ads.length){
          this.u_ads = this.eth_ads[0].id;
        }
      }
    },
    selectAds(e) {
      this.u_ads = e.target.value;
    },
    getCode() {
      let that = this;
      if (that.btn_msg == "发送验证码") {
        that.btn_msg = "60秒";
        window.t = setInterval(function() {
          that.time--;
          that.btn_msg = that.time + "秒";
          if (that.time <= 0) {
            that.btn_msg = "发送验证码";
            clearInterval(window.t);
            that.time = 60;
          }
        }, 1000);
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "withdraw_code",
              token: that.$store.state.user_info.token
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              that.$vux.toast.show({
                text: res.data.msg,
                type: "success",
                position: "middle",
                time: 3000
              });
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
            } else {
              that.$vux.toast.show({
                text: res.data.msg,
                type: "text",
                position: "middle",
                time: 1200
              });
              that.btn_msg = "发送验证码";
              clearInterval(window.t);
              that.time = 60;
            }
          });
      }
    },
    sub() {
      let that = this;
      if (that.u_num && that.u_number && that.u_pwd && that.u_code) {
        if (parseFloat(that.u_num) >= that.min_num) {
          if (
            parseFloat(that.u_num) <=
            parseFloat(that.balance) - parseFloat(that.fee)
          ) {
            that.$vux.loading.show({
              text: ""
            });
            that
              .$http({
                url: "/",
                method: "post",
                data: {
                  nozzle: "withdraw_operation",
                  token: that.$store.state.user_info.token,
                  address: that.u_ads,
                  number: that.u_num,
                  password: that.u_pwd,
                  code: that.u_code,
                  remark: that.u_comment,
                  coin_name: that.coin_type
                }
              })
              .then(function(res) {
                that.$vux.loading.hide();
                if (res.data.code == 1) {
                  that.$vux.toast.show({
                    text: res.data.msg,
                    type: "success",
                    position: "middle",
                    time: 1200
                  });
                  that.u_ads = "";
                  that.u_num = "";
                  that.u_pwd = "";
                  that.u_code = "";
                  that.u_comment = "";
                  that.getInfo();
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
                } else {
                  that.$vux.toast.show({
                    text: res.data.msg,
                    type: "cancel",
                    position: "middle",
                    time: 1200
                  });
                }
              });
          } else {
            that.$vux.toast.show({
              text: "可用余额不足！",
              type: "cancel",
              position: "middle",
              time: 1200
            });
          }
        } else {
          that.$vux.toast.show({
            text: "提币数量最小为" + that.min_num + that.coin_type +"！",
            type: "cancel",
            position: "middle",
            time: 1200
          });
        }
      } else {
        that.$vux.toast.show({
          text: "请输入完整信息！",
          type: "cancel",
          position: "middle",
          time: 1200
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.wrap {
  font-size: 0.36rem;
  width: 100%;
  color: white;
  box-sizing: border-box;
  padding-top: 1.15rem;
  input,
  select {
    background: transparent;
    border: 1px solid #ba9870;
    color: #ba9870;
    width: calc(100% - 1.4rem);
    height: 0.8rem;
    box-sizing: border-box;
  }
  select {
    border-radius: 6px;
    height: 0.84rem;
    line-height: 0.84rem;
    outline: 0;
    padding: 0 0.1rem 0;
    box-sizing: border-box;
  }
  input {
    padding: 0 0.2rem 0;
  }
  textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 0.2rem;
    border: 1px solid #ba9870;
    background: #6a5337;
    color: white;
    outline: 0;
  }
  ::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  ::-moz-input-placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  ::-o-input-placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  ::-ms-input-placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  > .top {
    border-bottom: 0.05rem solid #242424;
  }
  .main {
    padding: 1rem 8% 1rem;
    box-sizing: border-box;
    > div:first-child {
      font-size: 0.42rem;
      padding-bottom: .6rem;
    }
    .form {
      > div {
        overflow: hidden;
        margin-bottom: 0.5rem;
        span {
          line-height: 0.86rem;
        }
      }
      > div {
        > div:first-child {
          padding-bottom: 0.14rem;
        }
      }

      > .yzm {
        input {
          width: calc(100% - 3.8rem);
        }
        span {
          padding-left: 0.5rem;
        }
        .f_cc {
          color: #888;
        }
      }
      .btn {
        display: block;
        width: 96%;
        line-height: 0.9rem;
        border-radius: 20px;
        background: #ba9870;
        color: white;
        margin: 0.8rem auto;
      }
    }
    .d_bot {
      padding: 0.6rem 0 0;
      > div:first-child {
        font-size: 0.52rem;
        padding-bottom: 0.2rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.4);
      }
      ul {
        padding-top: 0.4rem;
        li {
          padding-bottom: 0.2rem;
        }
      }
    }
  }
}
</style>
