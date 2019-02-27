<template>
  <div class="wrap">
    <div class="top">
      <div>交易</div>
      <span class="iconfont icon-icon-test4" @click="toMydeal"></span>
    </div>
    <div class="main">
      <div class="f_c top_num">
        {{new_price}}
        <span>CNY</span>
      </div>
      <div class="chart_type">
        <div class="d_nav">
          <span :class="{s_active:chart_type==0}" @click="navTap(0)">日线图</span>
          <span :class="{s_active:chart_type==1}" @click="navTap(1)">周线图</span>
        </div>
        <span>趋势类型：</span>
      </div>
      <div class="d_chart">
        <div class="chart">
          <div id="myChart" :style="{width: '100%', height: '260px'}"></div>
        </div>
      </div>

      <div class="bs_btns">
        <button class="btn f_l" @click="buySell(0)">
          <img src="../assets/buy.png" alt>
          <span>我要买入</span>
        </button>
        <button class="btn f_r" @click="buySell(1)">
          <img src="../assets/sell.png" alt>
          <span>我要卖出</span>
        </button>
      </div>
      <div class="toTrade_btn">
        <button class="btn" @click="toTrade">
          <img src="../assets/totrade.png" alt>
          <span>交易大厅</span>
        </button>
      </div>
      <div class="d_rules ta_c">
        <span @click="toRule">《交易规则》</span>
      </div>
    </div>
    <!-- 弹窗 -->
    <x-dialog v-model="dialog" class="bs_dialog" hide-on-blur @on-hide="hideDialog">
      <div class="dialog">
        <div class="ta_r close_div">
          <span class="vux-close" @click="dialog=false"></span>
        </div>
        <div class="dd_con">
          <div class="d_nav">
            <span :class="{s_active:bs_type==0}" @click="bsTap(0)">我要买入</span>
            <span :class="{s_active:bs_type==1}" @click="bsTap(1)">我要卖出</span>
          </div>
          <div class="d_con">
            <div class="cur_price">
              当前价：
              <span class="f_c">{{new_price}}CNY</span>
            </div>
            <div class="up_down">
              <span class="iconfont icon-jian f_l" @click="down"></span>
              <input type="text" class="f_l" @input="num" v-model="price">
              <span class="iconfont icon-jia f_l" @click="up"></span>
            </div>
            <div class="input_list" v-if="bs_type==0">
              <div>买入数量：</div>
              <input type="text" placeholder="请输入购买数量" @input="num1($event,0)" v-model="buy_num">
            </div>
            <div class="input_list" v-if="bs_type==1">
              <div>卖出数量：</div>
              <input type="text" placeholder="请输入卖出数量" @input="num1($event,1)" v-model="sell_num">
            </div>
            <div class="input_list">
              <div>交易密码：</div>
              <input type="password" placeholder="请输入交易密码" v-model="pwd">
            </div>
            <div class="d_btns">
              <button class="btn" @click="bsSub">确定</button>
            </div>
            <!-- <div class="tip" @click="toRule">
                            <span class="iconfont icon-zhuyi"></span>交易规则
            </div>-->
          </div>
        </div>
      </div>
    </x-dialog>
  </div>
</template>
<script>
import $ from "jquery";
import echarts from "echarts";
import { XDialog } from "vux";
export default {
  data() {
    return {
      chart_type: 0,
      bs_type: 0,
      dialog: false,
      new_price: "",
      price: 8.5,
      buy_num: "",
      sell_num: "",
      pwd: "",
      times: [],
      yvalues: [],
      times1: [],
      yvalues1: [],
      bool: ""
    };
  },
  components: {
    XDialog
  },
  mounted() {
    let that = this;
    mui.back = function() {
      that.$router.back();
      clearInterval(window.price_t);
      error;
    };
    that.testTrade();
    that.timeRequest();

    // 日线
    that
      .$http({
        url: "/",
        method: "post",
        data: {
          nozzle: "trend_data",
          token: that.$store.state.user_info.token,
          type: 1
        }
      })
      .then(function(res) {
        if (res.data.code == 1) {
          that.times = res.data.data.time;
          that.yvalues = res.data.data.price;
          that.drawChart("myChart", 0);
        }
      });
    // 周线
    that
      .$http({
        url: "/",
        method: "post",
        data: {
          nozzle: "trend_data",
          token: that.$store.state.user_info.token,
          type: 2
        }
      })
      .then(function(res) {
        if (res.data.code == 1) {
          that.times1 = res.data.data.time;
          that.yvalues1 = res.data.data.price;
        }
      });
  },
  methods: {
    back() {
      let that = this;
      clearInterval(window.price_t);
      that.$router.back();
    },
    testTrade() {
      let that = this;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "restrict",
            token: that.$store.state.user_info.token,
            uid: that.$store.state.user_info.id
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            that.bool = true;
          } else {
            that.bool = false;
          }
        });
    },
    num(e) {
      $(e.target).val(
        $(e.target)
          .val()
          .match(/\d+\.?\d{0,2}/)
      );
      this.price = $(e.target).val();
    },
    num1(e, i) {
      $(e.target).val(
        $(e.target)
          .val()
          .match(/\d+\.?\d{0,6}/)
      );
      if (i) {
        this.buy_num = $(e.target).val();
      } else {
        this.sell_num = $(e.target).val();
      }
    },
    drawChart(id, i) {
      var myChart = echarts.init(document.getElementById(id));
      let that = this,
        times,
        prices,
        dataZooms;
      if (i) {
        times = that.times1;
        prices = that.yvalues1;
        if (times.length <= 7) {
          dataZooms = { type: "inside" };
        } else {
          dataZooms = {
            type: "inside",
            startValue: times.length-7,
            endValue: times.length-1
          };
        }
      } else {
        times = that.times;
        prices = that.yvalues;
        if (times.length <= 7) {
          dataZooms = { type: "inside" };
        } else {
          dataZooms = {
            type: "inside",
            startValue: times.length-7,
            endValue: times.length-1
          };
        }
      }
      // 指定图表的配置项和数据
      var option = {
        grid: {
          left: "3%",
          top: "20",
          height: "200",
          width: "82%"
        },
        textStyle: {
          color: "white"
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: times,
          axisLabel: {
            interval: 0,
            rotate: -30
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: "solid",
              color: "rgba(255,255,255,.2)"
            }
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "rgba(255,255,255,.5)"
            }
          },
          axisTick: {
            //刻度线
            show: false //去掉刻度线
          }
        },
        yAxis: {
          type: "value",
          position: "right",
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "rgba(255,255,255,.5)"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,.2)"
            }
          },
          axisLabel: {
            formatter: function(value, index) {
              return value.toFixed(2);
            }
          }
        },
        dataZoom: [dataZooms],
        series: [
          {
            data: prices,
            type: "line",
            smooth: true,
            lineStyle: {
              color: "white"
            },
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#ba9870"
                  },
                  {
                    offset: 1,
                    color: "#ba9870"
                  }
                ],
                globaCoord: false
              },
              borderColor: "white"
            },
            areaStyle: {
              //区域填充样式
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(255,255,255,.5)"
                    },
                    {
                      offset: 1,
                      color: "rgba(255,255,255,.2)"
                    }
                  ],
                  globaCoord: false
                }
              }
            }
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.clear(option, true);
      myChart.setOption(option, true);
    },
    toHelp() {
      this.$router.push({
        name: "helpcenter"
      });
    },
    navTap(i) {
      this.chart_type = i;
      this.drawChart("myChart", i);
    },
    exit() {
      let that = this;
    },
    bsTap(i) {
      this.bs_type = i;
    },
    up() {
      this.price = (parseFloat(this.price) + 0.1).toFixed(2);
    },
    down() {
      this.price = (parseFloat(this.price) - 0.1).toFixed(2);
      if (this.price <= 0) {
        this.price = 0;
      }
    },
    buySell(i) {
      // this.$vux.toast.show({
      //   text: "交易暂未开放！",
      //   type: "cancel",
      //   position: "middle",
      //   time: 1200
      // });
      // return false;
      let that = this;
      that.bs_type = i;
      if (that.bool) {
        clearInterval(window.price_t);
        that.dialog = true;
      } else {
        that.$vux.toast.show({
          text: "请绑定支付方式",
          type: "cancel",
          position: "middle",
          time: 1200
        });
      }
    },
    bsSub() {
      let that = this,
        number;
      if (that.bs_type) {
        number = that.sell_num;
      } else {
        number = that.buy_num;
      }
      if (number == "" || that.price == "" || that.pwd == "") {
        that.$vux.toast.show({
          text: "请输入完整信息",
          type: "text",
          position: "middle",
          time: 1200
        });
        return false;
      }
      if (number <= 0 || that.price <= 0) {
        that.$vux.toast.show({
          text: "请输入合理价格、数量",
          type: "text",
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
            nozzle: "add_log",
            token: that.$store.state.user_info.token,
            type: that.bs_type + 1,
            uid: that.$store.state.user_info.id,
            number: number,
            price: that.price,
            pwd: that.pwd
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
            that.dialog = false;
            that.pwd = "";
          } else {
            that.$vux.toast.show({
              text: res.data.msg,
              type: "text",
              position: "middle",
              time: 1200
            });
          }
        });
    },
    toTrade() {
      // this.$vux.toast.show({
      //   text: "交易暂未开放！",
      //   type: "cancel",
      //   position: "middle",
      //   time: 1200
      // });
      // return false;
      if (!this.bool) {
        this.$vux.toast.show({
          text: "请绑定支付方式",
          type: "cancel",
          position: "middle",
          time: 1200
        });
        return false;
      }
      clearInterval(window.price_t);
      this.$router.push({
        name: "tradecenter"
      });
    },
    toMydeal() {
      // this.$vux.toast.show({
      //   text: "交易暂未开放！",
      //   type: "cancel",
      //   position: "middle",
      //   time: 1200
      // });
      // return false;
      clearInterval(window.price_t);
      this.$router.push({
        name: "mydeal"
      });
    },
    toRule() {
      clearInterval(window.price_t);
      this.$router.push({
        name: "rule",
        params: {
          type: 0
        }
      });
    },
    timeRequest() {
      let that = this;
      fun();
      function fun() {
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "new_price"
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              that.new_price = parseFloat(res.data.data).toFixed(2);
              that.price = parseFloat(res.data.data).toFixed(2);
            } else {
              that.$vux.toast.show({
                text: res.data.msg,
                type: "text",
                position: "middle",
                time: 1200
              });
            }
          });
      }
      // window.price_t = setInterval(fun,5000);
    },
    hideDialog() {
      this.timeRequest();
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
  padding-bottom: 1.5rem;
  > .top {
    border-bottom: 0.05rem solid #242424;
    .iconfont {
      position: absolute;
      right: 0.4rem;
      top: 0.03rem;
      color: #ba9870;
      font-size: 0.9rem;
    }
  }
  .main {
    padding: 0 5% 0;
    box-sizing: border-box;
    .top_num {
      font-size: 0.6rem;
      padding: 0.2rem 0 0.4rem;
      > span {
        font-size: 0.34rem;
      }
    }
    .chart_type {
      text-align: right;
      white-space: nowrap;
      line-height: 0.7rem;
      overflow: hidden;
      > span {
        float: right;
        margin-right: 0.2rem;
      }
      .d_nav {
        float: right;
        line-height: 0.7rem;
        border: 1px solid white;
        border-radius: 2px;
        span {
          float: left;
          line-height: 0.7rem;
          padding: 0 0.6rem 0;
        }
        .s_active {
          background: white;
          color: #ba9870;
        }
      }
    }
    .d_chart {
      box-sizing: border-box;
    }
    .bs_btns {
      overflow: hidden;
      margin-top: 0.6rem;
      .btn {
        width: 46%;
        background: #ba9870;
        border-radius: 6px;
        color: white;
        line-height: 1.5rem;
        font-size: 0.42rem;
        img {
          width: 0.8rem;
          display: inline-block;
          vertical-align: middle;
          margin-right: 0.1rem;
        }
      }
    }
    .toTrade_btn {
      margin-top: 0.6rem;
      .btn {
        width: 100%;
        background: #ba9870;
        border-radius: 6px;
        color: white;
        line-height: 1.5rem;
        font-size: 0.42rem;
        img {
          width: 0.8rem;
          display: inline-block;
          vertical-align: middle;
          margin-right: 0.1rem;
        }
      }
    }
    .d_rules {
      padding-top: 0.4rem;
      text-decoration: underline;
      padding-bottom: 0.4rem;
    }
  }
  .bs_dialog .dialog {
    ::-webkit-input-placeholder {
      color: #888;
    }
    ::-moz-input-placeholder {
      color: #888;
    }
    ::-o-input-placeholder {
      color: #888;
    }
    ::-ms-input-placeholder {
      color: #888;
    }
    color: #333;
    .close_div {
      padding: 0.2rem 0.2rem 0;
    }
    .d_nav {
      overflow: hidden;
      padding-top: 0.2rem;
      > span {
        float: left;
        width: 50%;
        text-align: center;
        line-height: 0.7rem;
        padding-bottom: 0.2rem;
        border-bottom: 2px solid transparent;
        color: #6f6f6f;
      }
      > .s_active {
        border-color: #ba9870;
        color: #333;
      }
    }
    .d_con {
      padding: 0.4rem 1rem 0.4rem;
      .cur_price {
        text-align: left;
        margin-bottom: 0.4rem;
      }
      .up_down {
        overflow: hidden;
        border: 1px solid #ba9870;
        border-radius: 4px;
        line-height: 0.7rem;

        .iconfont {
          font-size: 0.7rem;
          transform: translateY(0.1rem);
          padding: 0 0.1rem 0;
        }
        input {
          line-height: 0.8rem;
          width: calc(100% - 1.8rem - 2px);
          text-align: center;
          border-left: 1px solid #ba9870;
          border-right: 1px solid #ba9870;
          padding: 0 0.2rem 0;
          box-sizing: border-box;
        }
      }
      .input_list {
        > div:first-child {
          text-align: left;
          padding: 0.3rem 0 0.2rem;
        }
        > input {
          border: 1px solid #ba9870;
          line-height: 0.8rem;
          width: 100%;
          padding: 0 0.2rem 0;
          box-sizing: border-box;
        }
      }
      .d_btns {
        padding: 0.6rem 0 0.4rem;
        .btn {
          width: 100%;
          background: #ba9870;
          color: white;
          line-height: 0.8rem;
          border-radius: 2px;
        }
      }
      .tip {
        font-size: 0.32rem;
        color: #808080;
        .iconfont {
          color: #808080;
          display: inline-block;
          transform: translateY(1px);
          margin-right: 0.1rem;
        }
      }
    }
  }
}
</style>
