import Vue from 'vue'
import router from '../router'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
  state: { //$store.state.a调用
    a: 1,
    top_title:"捐赠",
    tip:true,
    bool: true,
    end: "",
    h: '--',
    m: '--',
    s: '--',
    nid: "0",
    user_info: JSON.parse(window.sessionStorage.getItem("uinfo"))||"",
    cur_notice: "",
    pattern_data: [],
    cur_data: ""
  },
  mutations: { //$store.commit('sum')调用
    countDown(state) {
      let that = this;
      if(state.end==0){
        state.d = "00";
        state.h = "00";
        state.m = "00";
        state.s = "00";
        return false;
      }
      window.a=1;
      window.tmain = setInterval(function () {
        var date = new Date();
        var now = date.getTime();
        //设置截止时间
        var endDate = new Date(state.end.replace(/-/g,'/'));
        var end = endDate.getTime();
        //时间差
        let leftTime = end - now;
        //定义变量 d,h,m,s保存倒计时的时间
        let d, h, m, s;
        if (leftTime > 0) {
          state.bool = true;
          d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
          h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
          m = Math.floor(leftTime / 1000 / 60 % 60);
          s = Math.floor(leftTime / 1000 % 60);
          if (d < 10) {
            d = "0" + d;
          }
          if (h < 10) {
            h = "0" + h;
          }
          if (m < 10) {
            m = "0" + m;
          }
          if (s < 10) {
            s = "0" + s;
          }
        } else {
          d = "00";
          h = "00";
          m = "00";
          s = "00";
          state.bool = false;
        }
        state.h = h;
        state.m = m;
        state.s = s;
      }, 1000)
    },
  },
  actions: {

  },
  getters: {

  },
})
