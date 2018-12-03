<template>
  <div v-if="bshow" class="footer">
    <div class="con d-flex">
        <router-link tag="div"  class="flex1"  @click.native="navTap(0,'捐赠')" :to="{ name:'donate' }">
          <p>
            <span class="iconfont icon-aixin"></span>
          </p>
          捐赠
        </router-link>
        <router-link tag="div"  class="flex1"  @click.native="navTap(1,'金库')" :to="{ name:'coffers' }">
          <p>
            <span class="iconfont icon-bitebi"></span>
          </p>
          金库
        </router-link>
        <router-link tag="div"  class="flex1"  @click.native="navTap(2,'交易')" :to="{ name:'trade' }">
          <p>
            <span class="iconfont icon-xiaochuizi"></span>
          </p>
          交易
        </router-link>
        <router-link tag="div"  class="flex1"  @click.native="navTap(3,'钱包')" :to="{ name:'wallet' }">
          <p>
            <span class="iconfont icon-icon-test1"></span>
          </p>
          钱包
        </router-link>
        <router-link tag="div"  class="flex1"  @click.native="navTap(4,'邀请')" :to="{ name:'invite' }">
          <p>
            <span class="iconfont icon-icon-test2"></span>
          </p>
          邀请
        </router-link>
    </div>
  </div>
</template>
<script>
import $ from "jquery"
export default {
  data() {
    return {
      nid: 0,
      bshow:this.bshow
    };
  },
  mounted(){
    let that = this;
    // $(window).resize(function () { 
    //   that.bshow = !that.bshow;
    // })
  },
  methods: {
    navTap(id,text) {
      this.nid = id;
      this.$store.state.top_title = text;
    }
  }
};
</script>
<style scoped>
.footer {
  border-top: 2px solid #242424;
  width: 100%;
  height: 1.3rem;
  position: fixed;
  bottom: 0;
  background: #0F0F0F;
  z-index: 999;
  font-size: 0.34rem;
}
.con{
  width: 100%;
  padding-top: 0.05rem;
  color:#aaa;
  text-align: center;
}
.flex1 .iconfont{
  font-size: 0.66rem;
  color: #aaa;
}
.flex1 .icon-fenlei{
  font-size: 0.56rem;
  transform: translateY(0.04rem);
  display: block;
  margin-bottom: 0.04rem;
}
.router-link-exact-active{
  color: #ba9870;
}
.router-link-exact-active .iconfont{
  color: #ba9870;
}
</style>

