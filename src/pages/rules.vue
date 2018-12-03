<template>
    <div class="wrap">
        <div class="top">
            <img @click="back" class="back_img" src="../assets/nav_back.png" alt="">
            <div>{{title}}</div>
        </div>
        <div class="main">
            <div class="con" v-html="html"> </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      nozzle: "",
      title: "",
      html: ""
    };
  },
  components: {},
  mounted() {
    let that = this;
    mui.back = function() {
      that.$router.back();
      error;
    };
    if(that.$route.params.type == 0){
        that.title = "交易规则";
        that.nozzle = "order_protocol";
    }else if(that.$route.params.type == 1){
        that.title = "白皮书";
        that.nozzle = "book_protocol";
    }else if(that.$route.params.type == 2){
        that.title = "合约地址";
        that.nozzle = "address_protocol";
    }else if(that.$route.params.type == 3){
        that.title = "开源代码";
        that.nozzle = "open_protocol";
    }
    that
      .$http({
        url: "/",
        method: "post",
        data: {
          nozzle: that.nozzle
        }
      })
      .then(function(res) {
        if (res.data.code == 1) {
          that.html = res.data.data;
        }
      });
  },
  methods: {
    back() {
      let that = this;
      that.$router.back();
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
  height: 100%;
  overflow: hidden;
  > .top {
    border-bottom: 0.05rem solid #242424;
  }
  .main {
    padding: 0 4% 0;
    box-sizing: border-box;
    height: 100%;
    .title {
      font-size: 0.4rem;
      padding: 0.4rem 0 0.4rem;
    }
    .con {
      padding: 0.4rem 0 0.4rem;
      height: 100%;
      box-sizing: border-box;
      overflow: auto;
    }
  }
}
</style>
