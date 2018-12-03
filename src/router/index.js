import Vue from 'vue'
import Router from 'vue-router'
import BotNav from '@/components/botNav'
import Login from '@/pages/login'
import ForgetPwd from '@/pages/forgetPwd'
import Register from '@/pages/register'
import NoticeDetail from '@/pages/noticeDetail'
import Notices from '@/pages/notices'
import Setting from '@/pages/setting'
import BindAlipay from '@/pages/bindAlipay'
import Alipay from '@/pages/alipay'
import BindWeixin from '@/pages/bindWeixin'
import WeiXin from '@/pages/weixin'

import BindCard from '@/pages/bindCard'
import Card from '@/pages/card'




import HelpCenter from '@/pages/helpCenter'
import GameFinish from '@/pages/gameFinish'
import Index from '@/pages/index'
import Donate from '@/pages/donate'
import Coffers from '@/pages/coffers'
import FreeDonate from '@/pages/freeDonate'
import FixDonate from '@/pages/fixDonate'
import TodayReturn from '@/pages/todayReturn'
import TodayBonus from '@/pages/todayBonus'
import CanProfit from '@/pages/canprofit'
import WithdrawHistory from '@/pages/withdrawHistory'
import Wallet from '@/pages/wallet'
import EditAddress from '@/pages/editAddress'
import TopupCoin from '@/pages/topupCoin'
import TopupHistory from '@/pages/topupHistory'
import WithdrawCoin from '@/pages/withdrawCoin'
import TransferCoin from '@/pages/transferCoin'
import TransferCoin1 from '@/pages/transferCoin1'
import EditAddress1 from '@/pages/editAddress1'
import TransferHistory from '@/pages/transferHistory'
import Invite from '@/pages/invite'
import Trade from '@/pages/trade'
import Rules from '@/pages/rules'

import TradeCenter from '@/pages/tradeCenter'
import MyDeal from '@/pages/myDeal'
import Complain from '@/pages/complain'





Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [{
      path: '/',
      name: 'login',
      components: {
        main: Login,
      },
      meta: {
        index: 1
      }
    },
    {
      path: '/forgetpwd/type=:type',
      name: 'forgetpwd',
      components: {
        main: ForgetPwd
      },
      meta: {
        index: 2
      }
    },
    {
      path: '/register',
      name: 'register',
      components: {
        main: Register
      },
      meta: {
        index: 2
      }
    },
    {
      path: '/index',
      name: 'index',
      components:{
        main: Index,
        footer: BotNav
      },
      meta: {
        index: 2
      },
      children: [{
          path: '/index/donate',
          name: 'donate',
          components: {
            child: Donate,
          },
          meta: {
            index: 3,
            none:"true"
          }
        },
        {
          path: '/index/coffers',
          name: 'coffers',
          components: {
            child: Coffers
          },
          meta: {
            index: 3,
            none:"true"
          }
        },
        {
          path: '/index/wallet',
          name: 'wallet',
          components: {
            child: Wallet
          },
          meta: {
            index: 4,
            none:"true"
          }
        },
        {
          path: '/index/invite',
          name: 'invite',
          components: {
            child: Invite
          },
          meta: {
            index: 5,
            none:"true"
          }
        }
      ]
    },
    {
      path: '/gamefinish/type=:type&num=:num',
      name: 'gamefinish',
      components: {
        main: GameFinish
      },
      meta: {
        index: 4
      }
    },
    {
      path: '/notices',
      name: 'notices',
      components: {
        main: Notices
      },
      meta: {
        index: 5
      }
    },
    {
      path: '/noticedetail/i=:i',
      name: 'noticedetail',
      components: {
        main: NoticeDetail
      },
      meta: {
        index: 6
      }
    },
    {
      path: '/setting',
      name: 'setting',
      components: {
        main: Setting
      },
      meta: {
        index: 6
      }
    },
    {
      path: '/alipay/alipay=:alipay',
      name: 'alipay',
      components: {
        main: Alipay
      },
      meta: {
        index: 7
      }
    },
    {
      path: '/bindalipay/type=:type',
      name: 'bindalipay',
      components: {
        main: BindAlipay
      },
      meta: {
        index: 8
      }
    },
    {
      path: '/weixin/wx=:wx&src=:src',
      name: 'weixin',
      components: {
        main: WeiXin
      },
      meta: {
        index: 7
      }
    },
    {
      path: '/bindweixin/type=:type',
      name: 'bindweixin',
      components: {
        main: BindWeixin
      },
      meta: {
        index: 8
      }
    },
    {
      path: '/card/id=:id&name=:name',
      name: 'card',
      components: {
        main: Card
      },
      meta: {
        index: 7
      }
    },
    {
      path: '/bindcard/type=:type',
      name: 'bindcard',
      components: {
        main: BindCard
      },
      meta: {
        index: 8
      }
    },
    {
      path: '/helpcenter',
      name: 'helpcenter',
      components: {
        main: HelpCenter
      },
      meta: {
        index: 7
      }
    },
    {
      path: '/freedonate',
      name: 'freedonate',
      components: {
        main: FreeDonate
      },
      meta: {
        index: 4
      }
    },
    {
      path: '/fixdonate',
      name: 'fixdonate',
      components: {
        main: FixDonate
      },
      meta: {
        index: 4
      }
    },
    {
      path: '/todayreturn',
      name: 'todayreturn',
      components: {
        main: TodayReturn
      },
      meta: {
        index: 4
      }
    },
    {
      path: '/todaybonus',
      name: 'todaybonus',
      components: {
        main: TodayBonus
      },
      meta: {
        index: 4
      }
    },
    {
      path: '/canprofit',
      name: 'canprofit',
      components: {
        main: CanProfit
      },
      meta: {
        index: 4
      }
    },
    {
      path: '/withdrawhistory',
      name: 'withdrawhistory',
      components: {
        main: WithdrawHistory
      },
      meta: {
        index: 5
      }
    },
    {
      path: '/editaddress',
      name: 'editaddress',
      components: {
        main: EditAddress
      },
      meta: {
        index: 5
      }
    },
    {
      path: '/topupcoin',
      name: 'topupcoin',
      components: {
        main: TopupCoin
      },
      meta: {
        index: 5
      }
    },
    {
      path: '/topuphistory',
      name: 'topuphistory',
      components: {
        main: TopupHistory
      },
      meta: {
        index: 6
      }
    },
    {
      path: '/withdrawcoin',
      name: 'withdrawcoin',
      components: {
        main: WithdrawCoin
      },
      meta: {
        index: 5
      }
    },
    {
      path: '/transfercoin',
      name: 'transfercoin',
      components: {
        main: TransferCoin
      },
      meta: {
        index: 5
      }
    },
    {
      path: '/transfercoin1',
      name: 'transfercoin1',
      components: {
        main: TransferCoin1
      },
      meta: {
        index: 5
      }
    },
    {
      path: '/editaddress1',
      name: 'editaddress1',
      components: {
        main: EditAddress1
      },
      meta: {
        index: 6
      }
    },
    {
      path: '/transferhistory',
      name: 'transferhistory',
      components: {
        main: TransferHistory
      },
      meta: {
        index: 5
      }
    },
    {
      path: '/trade',
      name: 'trade',
      components: {
        main: Trade,
        footer: BotNav
      },
      meta: {
        index: 2,
        none:"true"
      }
    },
    {
      path: '/rule/type=:type',
      name: 'rule',
      components: {
        main: Rules,
      },
      meta: {
        index: 20,
      }
    },
    {
      path: '/tradecenter',
      name: 'tradecenter',
      components: {
        main: TradeCenter,
      },
      meta: {
        index: 3,
        none:"false"
      }
    },
    {
      path: '/mydeal',
      name: 'mydeal',
      components: {
        main: MyDeal,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/complain/id=:id',
      name: 'complain',
      components: {
        main: Complain,
      },
      meta: {
        index: 5,
      }
    }
  ]
})
