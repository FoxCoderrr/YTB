<template>
    <div class="wrap">
        <div class="top">
            <img @click="back" class="back_img" src="../assets/nav_back.png" alt="">
            <div>公告中心</div>
        </div>
        <div class="main">
            <ul>
                <li v-for="(item,index) in info" :key="index" @click="toDetail(index)">
                    <span class="f_l">{{item.title}}</span>
                    <img class="f_r r_img" src="../assets/right1.png" alt="">
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      info:[],
    };
  },
  components: {},
  mounted() {
    let that = this;
    mui.back = function() {
      that.$router.back();
      error;
    };
    that.info = JSON.parse(sessionStorage.getItem("notices"));
  },
  methods: {
    back() {
      let that = this;
      that.$router.back();
    },
    toDetail(i){
        this.$router.push({
            name:"noticedetail",
            params:{
                i:i
            }
        })
    },
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
