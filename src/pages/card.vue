<template>
    <div class="wrap">
        <div class="top">
            <img @click="back" class="back_img" src="../assets/nav_back.png" alt="">
            <div>银行卡信息</div>
        </div>
        <div class="main">
            <ul>
                <li>
                    <div class="d_info">
                        <span>{{$route.params.name}}</span>
                    </div>
                    <div class="d_num">{{banknum}}</div>
                </li>
            </ul>
            <div class="bot_div">
                <div>
                    <div class="btn" @click="changeCard">
                        <!-- <span class="iconfont icon-jia"></span> -->
                        <span>更换银行卡</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  components: {},
  computed:{
      banknum() {
      if (this.$route.params.id) {
        let arr = this.$route.params.id.split("");
        let newarr = [];
        let str = this.$route.params.id.substr(-(arr.length % 4));
        for (let i = 0, l = arr.length - arr.length % 4; i < l; i++) {
          if ((i + 1) % 4 == 0) {
            newarr.push("**** ");
          }
        }
        return newarr.join("") + str;
      }
    }
  },
  mounted() {
    let that = this;
    mui.back = function() {
      that.$router.back();
      error;
    };
  },
  methods: {
    back() {
      let that = this;
      that.$router.back();
    },
    changeCard(){
        this.$router.push({
            name:"bindcard",
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
  width: 100%;
  height: 100%;
  color: white;
  box-sizing: border-box;
  padding-top: 1.15rem;
  > .top {
    border-bottom: 0.05rem solid #242424;
  }
  .main {
    box-sizing: border-box;
    height: 100%;
    ul{
        padding: 0.4rem 6% 0.4rem;
        box-sizing: border-box;
        height: calc(100% - 2.4rem);
        overflow: auto;
        li{
            background: url(../assets/card.png) no-repeat;
            background-size: 100% 100%;
            overflow: hidden;
            border-radius: 8px;
            padding: 0.4rem;
            .d_action{
                text-align: right;
                >span{
                    display: inline-block;
                    padding: 0 0.05rem 0;
                }
            }
            .d_info{
                padding-left: .6rem;
                >span{
                    display: block;
                }
                >span:first-child{
                    font-size: 0.48rem;
                    padding: 0 0 0.1rem;
                }
            }
            .d_num{
                text-align: center;
                padding: 0.6rem 0 0.2rem;
                font-size: 0.46rem;
            }
        }
    }

    .bot_div{
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 0.4rem 6% 1rem;
        background: #010101;

        .btn{
            width: 100%;
            border: 1px dashed #ba9870;
            border-radius: 4px;
            text-align: center;
            font-size: 0.4rem;
            color: #888;
            height: 1rem;
            line-height: 1rem;
            .iconfont{
                color: #ba9870;
                font-size: 0.8rem;
                vertical-align: sub;
                display: inline-block;
                transform: translateY(1px);
            }
        }
    }
  }
}
</style>
