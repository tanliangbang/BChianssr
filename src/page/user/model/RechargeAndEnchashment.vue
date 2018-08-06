<template>
  <div v-if="isShow" class="rechargeAndEnchashment">
      <div class="mask"></div>
      <div class="maskContent">
         <img v-on:click="closeEnRe" class="close-btn" src="../../../../static/img/close.png"/>
         <div v-if="type ===1" class="recharge">
           <div class="mask-header">
             {{$t("lang.assertManage.title1")}} 火币网{{$t("lang.assertManage.title2")}}BTC
           </div>
           <p>{{$t("lang.assertManage.withdrawAdress")}}</p>
           <p>1DNNSDSDJK7ssdjfkDdasdASDAiasiaAS{{$t("lang.assertManage.content1")}}<i>{{$t("lang.assertManage.content2")}}</i>
             {{$t("lang.assertManage.content3")}}<router-link to="financeRecord">{{$t("lang.assertManage.content4")}}</router-link></p>
           <div><img src="../../../../static/img/code.png"></div>
           <div class="promit">
             <p>{{$t("lang.assertManage.tips")}}</p>
             <p>{{$t("lang.assertManage.promit1")}}</p>
             <p>{{$t("lang.assertManage.promit2")}}</p>
             <p>{{$t("lang.assertManage.promit3")}}</p>
             <p>{{$t("lang.assertManage.promit4")}}</p>
             <p>{{$t("lang.assertManage.promit5")}}</p>
           </div>
           <div class="close">
              <button v-on:click="closeEnRe">{{$t("lang.assertManage.close")}}</button>
           </div>
         </div>

        <div v-if="type ===2" class="enchashment">
          <div class="mask-header">
            向 火币网提取BTC
          </div>
          <div>
           <p>提币地址</p>
           <div><input type="text" placeholder="输入提币地址" /></div>
            <p>提币数量<span>可提余额:23232.2556BTC</span></p>
            <div><input type="text" placeholder="输入提币地址" /></div>
            <div>
              <div><p>手续费<span>手续费率</span></p><input/></div>
              <div><p>实际到账</p><input/></div>
            </div>
            <div class="promit">
              <p>温馨提示</p>
              <p>1.请勿向上述地址充值任何非BTC资产，否则资产将不可找回。</p>
              <p>2.您充值至上述地址后，需要整个网络节点的取人，1次网络确认后到账，6次网络确认后可提币。</p>
              <p>3.最小充值金额：0.01BTC,小于最小金额的充值将不会上帐。</p>
              <p>4.您的充值地址不会经常改变，可以重复充值；如有改变，我们会尽量通过网站公告或邮件通知您。</p>
              <p>5.请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
            </div>
            <div class="enchash-btn">
               <button v-on:click="enchashment">提币</button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'RechargeAndEnchashment',
  components: {
  },
  data () {
    return {
      isShow: false,
      type: 1
    }
  },
  created () {
  },
  methods: {
    showEnRe (type) {
      this.isShow = true
      this.type = type
    },
    closeEnRe () {
      this.isShow = false
    },
    enchashment () {
      this.$mask.showAlert('提币成功', 'success')
      this.isShow = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../../style/var";
  .rechargeAndEnchashment{
    .mask{
      position:fixed;
      width:100%;
      height:100%;
      z-index:2;
      top:0;
      left:0;
      background:@bg_color;
      opacity:0.8;
    }
    .maskContent{
      border-radius: 14px;
      width:516px;
      height:600px;
      background:#284585;
      top:50%;
      left:50%;
      z-index:3;
      margin-top:-300px;
      margin-left:-258px;
      position:fixed;
      .close-btn{
        width: 24px;
        height: 24px;
        position:absolute;
        top:23px;
        right:31px;
        cursor: pointer;
      }
      .mask-header{
        line-height:70px;
        font-size: 16px;
        padding-left:30px;
        border-bottom:1px solid @bg_color;
        margin-bottom:40px;
      }
      .recharge{
        padding:0px 30px;
        >p:nth-child(2){
          font-size:18px;
          margin-bottom:10px;
        }
        >p:nth-child(3){
          font-size:18px;
          i, a{
            color: #39f1ff;
          }
        }
        >div:nth-child(4) {
          text-align: right;
          img{
            margin-top:-15px;
          }
        }
        .close{
          text-align: center;
          button{
            width: 240px;
            height: 44px;
            background-image: linear-gradient(176deg, #245bfc 0%, #00a7ff 100%);
            border-radius: 100px;
            border:none;
            color:#fff;
            margin-top:20px;
            cursor: pointer;
          }
        }
      }

      .enchashment{
        >div:nth-child(2){
          padding:0px 52px;
          >div:nth-child(5){
            display:flex;
            flex-wrap: wrap-reverse;
            div{
              flex:1;
              p{
                font-size:14px;
                >span{
                  font-size:12px;
                  transform: scale(0.90);
                  color: #0088ff;
                  float:right;
                  margin-right:10px;
                }
              }
              >input{
                width: 198px;
                height: 50px;
                background-color: #273c6e;
                border-radius: 8px;
                border: solid 2px #304a87;
              }
            }
          }
          >div{
            >input{
              width: 409px;
              height: 50px;
              background-color: #273c6e;
              border-radius: 8px;
              border: solid 2px #304a87;
              color: #a9c2fd;
              padding-left:25px;
              margin-top:3px;
              margin-bottom:20px;
            }
            input::-webkit-input-placeholder{
              color:#a9c2fd;
              font-size:16px;
            }
          }
        }
        p:nth-child(3) {
          span{
            float:right;
            font-size:10px;
            margin-right:20px;
            margin-top:5px;
          }
        }
      }

      >div:nth-child(5){
        display:flex;
        flex-wrap: wrap-reverse;
        div{
          flex:1;
          >input{
            width: 198px;
            height: 50px;
            background-color: #273c6e;
            border-radius: 8px;
            border: solid 2px #304a87;
          }
        }
      }

      .enchash-btn{
        text-align: center;
        button{
          width: 213px;
          height: 44px;
          background-image: linear-gradient(176deg, #245bfc 0%, #00a7ff 100%);
          border-radius: 100px;
          border:none;
          color:#fff;
          margin-top:20px;
          cursor: pointer;
        }
      }

    }
  }

  .promit{
    margin-top:10px;
    p{
      font-size:12px;
      color: #a9c2fd;
    }
  }

</style>
