<template>
    <div class="wrap">
        <div class="top">
            <img @click="back" class="back_img" src="../assets/nav_back.png" alt="">
            <div>支付宝信息</div>
        </div>
        <div class="form">
          <div class="d_input">
            <div class="f_l">
              <span>支付宝：</span>
            </div>
            <div class="f_r">
                <x-input class="" type="text" v-model="alipay" disabled></x-input>
            </div>
          </div>
            <div class="form_bot">
                <button class="btn" @click="change">更改支付宝</button>
            </div>
        </div>
    </div>
</template>
<script>
import {XInput } from "vux";
import $ from "jquery";
export default {
  data() {
    return {
        alipay:""
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
    that.alipay = that.$route.params.alipay;
    let height =
      document.documentElement.clientHeight || document.body.clientHeight;
    that.height = height;
    $(".wrap").css("min-height", height);
  },
  methods: {
    back() {
      let that = this;
      clearInterval(window.t);
      that.$router.back();
    },
    change(){
        this.$router.push({
            name:"bindalipay",
            params:{
                type:"1"
            }
        })
    }

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
    .d_input:nth-child(2) > .f_r {
      border: 0;
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
