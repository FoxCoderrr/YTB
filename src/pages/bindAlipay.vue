<template>
    <div class="wrap">
        <div class="top">
            <img @click="back" class="back_img" src="../assets/nav_back.png" alt="">
            <div>{{top_title}}</div>
        </div>
        <div class="form">
          <div class="d_input">
            <div class="f_l">
              <span>姓名：</span>
            </div>
            <div class="f_r">
                <x-input class="" type="text" v-model="u_name" placeholder="请输入支付宝账号真实姓名"></x-input>
            </div>
          </div>
          <div class="d_input">
            <div class="f_l">
              <span>支付宝：</span>
            </div>
            <div class="f_r">
                <x-input class="" type="text" v-model="u_alipay" placeholder="请输入支付宝账号"></x-input>
            </div>
          </div>
          <!-- <div class="d_input">
            <div class="f_l">
              <span>验证码：</span>
            </div>
            <div class="f_r">
                <input type="text" placeholder="请输入手机验证码" v-model="u_code">
                <span @click="getCode" class="code_span" :class="{f_cc:btn_msg!='发送验证码'}">{{btn_msg}}</span>
            </div>
          </div> -->
            <div class="form_bot">
                <button class="btn" @click="sub">提交</button>
            </div>
            <div class="name_tip f_c" style="padding-top:1rem;">真实姓名涉及交易转账，务必保证支付宝、微信、银行卡真实姓名一致。</div>
        </div>
    </div>
</template>
<script>
import {XInput } from "vux";
import $ from "jquery";
export default {
  data() {
    return {
    top_title:"",
      nid: 0,
      ccode: "",
      u_alipay: "",
      u_name: "",
      u_code: "",
      btn_msg: "发送验证码",
      time: 60,
    };
  },
  components: {
      XInput
  },
  mounted() {
    let that = this;
    mui.back = function() {
      clearInterval(window.t);
      that.$router.back();
      error;
    };
    let height =
      document.documentElement.clientHeight || document.body.clientHeight;
    that.height = height;
    $(".wrap").css("min-height", height);

    if(that.$route.params.type==1){
        that.top_title = "修改支付宝"
    }else{
        that.top_title = "绑定支付宝"
    }
  },
  methods: {
    back() {
      let that = this;
      clearInterval(window.t);
      that.$router.back();
    },
    getCode() {
      let that = this;
        if (that.btn_msg == "发送验证码") {
          that.btn_msg = "60";
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
                nozzle: "alipay_code",
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
      if (that.u_alipay) {
          that
            .$http({
              url: "/",
              method: "post",
              data: {
                nozzle: "bind_alipay",
                token: that.$store.state.user_info.token,
                phone: that.u_alipay,
                ali_name:that.u_name,
                // yzm: that.u_code,
              }
            })
            .then(function(res) {
              that.$vux.loading.hide();
              if (res.data.code == 1) {
                that.$vux.toast.show({
                  text: "绑定成功",
                  type: "success",
                  position: "middle",
                  time: 1200
                });
                that.$router.push({
                  name:"alipay",
                  params:{
                    alipay: that.u_alipay
                  }
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
        this.$vux.toast.show({
          text: "请输入支付宝账号！",
          type: "cancel",
          position: "middle",
          time: 1200
        });
      }
    },
  }
};
</script>
<style lang="less" scoped>
.wrap {
  font-size: 0.36rem;
  position: absolute;
  width: 100%;
  color: white;
  box-sizing: border-box;
  padding-top: 1.15rem;
  > .top {
    border-bottom: 0.05rem solid #242424;
  }
  .form {
    padding: 0.8rem 4% 0;
    .d_input {
      overflow: hidden;
      margin-bottom: 0.4rem;
      > .f_l {
        width: 2rem;
        height: 0.8rem;
        line-height: 0.8rem;
        text-align: right;
      }
      > .f_r {
        width: calc(100% - 2.2rem);
        border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        .code_span {
          float: right;
          line-height: 0.8rem;
          color: #ba9870;
          border: 1px solid #ba9870;
          border-radius: 20px;
          width: 2.2rem;
          text-align: center;
        }
        .f_cc {
          color: rgba(255, 255, 255, 0.4);
        }

        > input {
          width: calc(100% - 2.6rem);
          background: transparent;
          color: white;
          line-height: 0.8rem;
          padding-left: 0.15rem;
          box-sizing: border-box;
          border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        }
      }
    }

  }
  .form_bot {
    padding: 1rem 12% 0;
    .btn {
      display: block;
      width: 100%;
      line-height: 0.9rem;
      text-align: center;
      color: white;
      background: #ba9870;
      border-radius: 20px;
    }
    > div {
      overflow: hidden;
      > span {
        margin-top: 0.3rem;
      }
      a {
        color: #ba9870;
        font-size: 0.32rem;
      }
    }
  }
}
</style>
