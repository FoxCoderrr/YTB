<template>
    <div class="wrap">
        <div class="top">
            <img @click="back" class="back_img" src="../assets/nav_back.png" alt="">
            <div>设置</div>
        </div>
        <div class="main">
            <ul>
                <li @click="toHelp">
                    <span class="f_l">帮助中心</span>
                    <img class="f_r r_img" src="../assets/right1.png" alt="">
                </li>
                <li @click="toRule(1)">
                    <span class="f_l">白皮书</span>
                    <img class="f_r r_img" src="../assets/right1.png" alt="">
                </li>
                <li @click="toRule(2)">
                    <span class="f_l">合约地址</span>
                    <img class="f_r r_img" src="../assets/right1.png" alt="">
                </li>
                <li @click="toRule(3)">
                    <span class="f_l">开源代码</span>
                    <img class="f_r r_img" src="../assets/right1.png" alt="">
                </li>
                <li @click="toCard">
                    <span class="f_l">绑定银行卡</span>
                    <img class="f_r r_img" src="../assets/right1.png" alt="">
                </li>
                <li @click="toAlipay">
                    <span class="f_l">绑定支付宝</span>
                    <img class="f_r r_img" src="../assets/right1.png" alt="">
                </li>
                <li @click="toWx">
                    <span class="f_l">绑定微信</span>
                    <img class="f_r r_img" src="../assets/right1.png" alt="">
                </li>
            </ul>
            <div class="bot">
                <button class="btn" @click="exit">退出</button>
                <div class="ta_c f_c">版本 1.0.0</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      info:"",
    };
  },
  components: {},
  mounted() {
    let that = this;
    mui.back = function() {
      that.$router.back();
      error;
    };
    that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "restrict",
            token: that.$store.state.user_info.token,
            uid:that.$store.state.user_info.id,
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            that.info = res.data.data;
          }
        });
  },
  methods: {
    back() {
      let that = this;
      that.$router.back();
    },
    toRule(i){
        this.$router.push({
            name:"rule",
            params:{
                type:i
            }
        })
    },
    toHelp(){
        this.$router.push({
            name:"helpcenter"
        })
    },
    toCard(){
      let type="";
      if(this.info.bank){
        this.$router.push({
          name:"card",
          params:{
            id: this.info.bank,
            name: this.info.bank_name,
          }
        })
      }else{
        this.$router.push({
          name:"bindcard",
          params:{
            type:"0"
          }
        })
      }
    },
    toAlipay(){
      let type="";
      if(this.info.alipay){
        this.$router.push({
          name:"alipay",
          params:{
            alipay: this.info.alipay
          }
        })
      }else{
        this.$router.push({
          name:"bindalipay",
          params:{
            type:"0"
          }
        })
      }
    },
    toWx(){
      let type="";
      if(this.info.we_chat){
        this.$router.push({
          name:"weixin",
          params:{
            wx: this.info.we_chat,
            src:this.info.wechat_img,
          }
        })
      }else{
        this.$router.push({
          name:"bindweixin",
          params:{
            type:"0"
          }
        })
      }
    },
    exit() {
      let that = this;
      that.$vux.confirm.show({
        title: "退出",
        confirmText: "确定",
        cancelText: "取消",
        content: "确定要退出登录吗？",
        onShow() {},
        onHide() {},
        onCancel() {},
        onConfirm() {
          // mui.plusReady(function() {
          //   plus.runtime.quit();
          // });
           that.$router.push({
              name: "login"
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.wrap {
  font-size: 0.36rem;
  width: 100%;
  min-height: 100%;
  color: white;
  box-sizing: border-box;
  padding-top: 1.15rem;
  > .top {
    border-bottom: 0.05rem solid #242424;
  }
  .main {
    box-sizing: border-box;
    ul {
      li {
        overflow: hidden;
        padding: 0.2rem 4% 0.2rem;
        line-height: 0.7rem;
        border-bottom: 1px solid #242424;
        .r_img {
          width: 0.7rem;
        }
      }
    }
    .bot {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      .btn {
        display: block;
        width: 6rem;
        text-align: center;
        background: #ba9870;
        color: white;
        line-height: 0.9rem;
        border-radius: 20px;
        margin: 0.6rem auto 0;
      }
      div {
        font-size: 0.32rem;
        padding: 0.6rem 0 .6rem;
      }
    }
  }
}
</style>
