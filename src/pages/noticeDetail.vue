<template>
    <div class="wrap">
        <div class="top">
            <img @click="back" class="back_img" src="../assets/nav_back.png" alt="">
            <div>公告详情</div>
        </div>
        <div class="main">
            <div class="title ta_c">{{title}}</div>
            <div class="con" v-html="content"> </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      title:"",
      content:""
    };
  },
  components: {},
  mounted() {
    let that = this;
    mui.back = function() {
      that.$router.back();
      error;
    };
    that.title = JSON.parse(sessionStorage.getItem("notices"))[that.$route.params.i].title;
    that.content = JSON.parse(sessionStorage.getItem("notices"))[that.$route.params.i].content;
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
  > .top {
    border-bottom: 0.05rem solid #242424;
  }
  .main {
    padding: 0 4% 0;
    box-sizing: border-box;
    .title {
      font-size: 0.4rem;
      padding: 0.4rem 0 0.4rem;
    }
  }
}
</style>
