<template>
    <div class="wrap">
        <div class="top">
            <img @click="back" class="back_img" src="../assets/nav_back.png" alt="">
            <div>申请投诉</div>
        </div>
        <div class="main">
            <div class="d_list">
                <ul>
                    <li class="li">
                        <span>订单号</span>
                        <span>{{info.order_number}}</span>
                    </li>
                    <li class="li">
                        <span>数量</span>
                        <span>{{info.number}}</span>
                    </li>
                    <li class="li">
                        <span>单价</span>
                        <span>{{info.price}}元</span>
                    </li>
                    <li class="li">
                        <span>总价</span>
                        <span>{{info.count}}元</span>
                    </li>
                    <li class="li">
                        <span>时间</span>
                        <span>{{info.time}}</span>
                    </li>
                    <li class="li">
                        <span>状态</span>
                        <span class="f_c_red">等待中</span>
                    </li>
                    <li class="li li_img li_img_">
                        <span>上传凭证</span>
                        <div>
                             <div class="up_div">
                                <span class="icon f_c">+</span>
                                <span class="jia">点击上传支付凭证</span>
                                <img v-if="data1" :src="data1" >
                                <input name="img" :disabled="data1!=''" type="file" id="handcard" @change="pushImg1($event)" accept="image/jpeg,image/png,image/gif" alt="">
                                <span class="clear iconfont icon-shanchu1" v-if="data1" @click="delImg1($event)"></span>
                            </div>
                        </div>
                    </li>
                    <li class="li_reason">
                        <div>申诉理由</div>
                        <div>
                            <textarea cols="30" rows="5" placeholder="请输入申诉理由" v-model="reason"></textarea>
                        </div>
                    </li>
                     <li class="li_btns">
                        <button class="btn" @click="sub">提交申诉</button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      info: "",
      data1: "",
      urll: "",
      reason: ""
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
          nozzle: "apply",
          token: that.$store.state.user_info.token,
          id: that.$route.params.id
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

    // 上传
    pushImg1: function(e) {
      let file = e.target,
        reader = new FileReader(),
        that = this,
        _name,
        _fileName;
      _name = file.value;
      _fileName = _name.substring(_name.lastIndexOf(".") + 1).toLowerCase();
      // if (_fileName !== "png" && _fileName !== "jpg") {
      //   that.$vux.toast.show({
      //     text: "请上传图片类型文件！",
      //     type: "cancel",
      //     position: "middle",
      //     time: 1200
      //   });
      // }else{
      reader.readAsDataURL(file.files[0]);
      if (file.files[0].size > 10 * 1024 * 1024) {
        that.$vux.toast.show({
          text: that.$t("ups.d"),
          type: "warn",
          position: "middle",
          time: 1500
        });
      } else {
        that.$vux.loading.show({
          text: "上传中..."
        });
        reader.onload = function() {
          let result = this.result;

          // that.data1 = result;

          var image = new FormData();
          image.append("file", e.target.files[0]);
          // image.append("nozzle", "upload");
          // image.append("token", that.$store.state.user_info.token);
          that
            .$http({
              url: "/upload",
              method: "post",
              data: image
            })
            .then(function(res) {
              that.$vux.loading.hide();
              if (res.data.code == 200) {
                that.data1 = result;
                that.urll = res.data.msg;
              } else {
                that.$vux.toast.show({
                  text: res.data.msg,
                  type: "cancel",
                  position: "middle",
                  time: 1200
                });
              }
            });
        };
      }

      // }
    },
    delImg1: function(e) {
      this.data1 = "";
      let dom = document.getElementById("handcard");
      dom.value = "";
    },
    sub() {
      let that = this;
      if(!that.urll){
        that.$vux.toast.show({
          text: "请上传投诉凭证",
          type: "cancel",
          position: "middle",
          time: 1200
        });
        return false;
      }
      if(!that.reason){
        that.$vux.toast.show({
          text: "请输入投诉原因",
          type: "cancel",
          position: "middle",
          time: 1200
        });
        return false;
      }
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "add_apply",
            token: that.$store.state.user_info.token,
            id: that.$route.params.id,
            apply: that.reason
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            that.$vux.toast.show({
              text: res.data.msg,
              type: "success",
              position: "middle",
              time: 1200
            });
            that.urll = "";
            that.reason = "";
          } else {
            that.$vux.toast.show({
              text: res.data.msg,
              type: "cancel",
              position: "middle",
              time: 1200
            });
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
textarea {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.8);
  width: 100%;
  padding: 0.2rem;
  color: white;
}
.up_div {
  clear: both;
  width: 5rem;
  height: 4rem;
  margin: 0 auto;
  border: 1px solid #ba9870;
  position: relative;
  text-align: center;
  .icon {
    position: absolute;
    left: 50%;
    top: 0.6rem;
    font-size: 1.4rem;
    transform: translateX(-50%);
  }
  .jia {
    position: absolute;
    left: 50%;
    top: 2.4rem;
    color: #ba9870;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  input {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .clear {
    font-size: 0.72rem;
    color: #ba9870;
    position: absolute;
    right: -0.8rem;
    top: -0.4rem;
  }
}
.f_c_red {
  color: #e51c23;
}
.f_c_blue {
  color: #259b24;
}
.wrap {
  font-size: 0.36rem;
  width: 100%;
  height: 100%;
  color: white;
  box-sizing: border-box;
  padding-top: 1.15rem;
  background: #242424;
  > .top {
    border-bottom: 0.05rem solid #242424;
  }
  .main {
    box-sizing: border-box;
    box-sizing: border-box;
    padding: 0.2rem 3% 0;
    height: 100%;
    overflow: hidden;
    .vux-tab .vux-tab-item {
      color: #868686;
    }

    .d_list {
      box-sizing: border-box;
      height: 100%;
      overflow: auto;
      ul {
        background: #010101;
        color: #b5b5b5;
        padding: 0.2rem 0 0.2rem;
        margin-bottom: 0.4rem;

        .li {
          padding: 0.3rem 0 0.3rem 0.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          > span:first-child {
            display: inline-block;
            width: 2rem;
          }
          .icon-naozhong {
            color: #ff9800;
            font-size: 0.5rem;
          }
        }
        .li_img {
          border: 0;
          > span {
            vertical-align: top;
          }
          > div {
            display: inline-block;
          }
        }
        .li_img_ {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .li_reason {
          padding: 0.3rem 0.8rem 0.3rem;
          border: 0;
          > div:first-child {
            padding-bottom: 0.2rem;
          }
        }
        .li_btns {
          padding: 0.8rem 0 0.5rem;
          .btn {
            display: block;
            width: 40%;
            line-height: 0.7rem;
            background: #ba9870;
            color: white;
            border-radius: 4px;
            margin: 0 auto;
          }
        }
      }
    }
  }
}
</style>
