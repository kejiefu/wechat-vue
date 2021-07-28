<template>
  <transition name="slide">
    <div class="chatroom">
      <div class="back">
        <router-link to='/chat'>
          <img class="img" src="../../assets/返回.png" @click='clearContent' height="16" width="19"/>
        </router-link>
        <span class="dissname">{{ this.info.friendName }}</span>
        <span class="logo" @click="gotoUser(info)">
          <img src="../../assets/我.png" height="28" width="28">
          <!-- <span class="icon-user"></span> -->
        </span>
      </div>
      <div class="content">
        <div class="content-wrapper" ref="wrapper">
          <div class="content-text">
            <div class="content-top">
              <p>————现在可以和我聊天了————</p>
            </div>
            <div class="content-body" ref="body">
              <ul class="inHtml" v-for="item in content">
                <li class="ask" v-show="item.askContent">
                  <img :src="item.askImg"/>
                  <p>{{ item.askContent }}</p>
                </li>
                <li class="reply" v-show="item.replyContent">
                  <img :src="item.replyImg"/>
                  <p>{{ item.replyContent }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="send">
          <input
            type="text"
            placeholder="请输入聊天内容"
            class="sText"
            ref="sTest"
          />
          <input type="button" class="btn" value="发送" @click="sendContent"/>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import {mapGetters} from 'vuex'
import {createSocket} from '../../store/websocket.js'

// 经过测试发现，在页面刷新时，实例依次执行了beforeCreate(),created(),beforeMount(),mounted(),beforeUpdate(),updated()。
// 并没有来得及执行destroy，与把页面关闭再重新打开的效果是一样的。所以在beforeDestroy或destroyed时执行的代码，要额外考虑一下对页面刷新的处理。
// 在created的时候，视图中的html并没有渲染出来，所以此时如果直接去操作html的dom节点，一定找不到相关的元素
// 而在mounted中，由于此时html已经渲染出来了，所以可以直接操作dom节点

export default {
  components: {
    BScroll,
    createSocket
  },
  data () {
    return {
      text: '', // 输入框的文字
      randomReply: [
        '你谁啊？',
        '请你再说一遍！',
        '想和我聊天？得先夸我！'
      ],
      content: [
        // {
        //   askImg: require('../../assets/me/minion.png'),
        //   replyImg: '',
        //   askContent: '你好',
        //   replyContent: '谢谢'
      ]
    }
  },
  computed: {
    ...mapGetters([
      'info'
    ])
  },
  // created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
  created () {

  },
  // mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
  mounted () {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true
      })
    })
    createSocket('wss://api.baidu.com')
  },
  methods: {
    back () {
      this.$router.back()   // 返回上一级
    },
    gotoUser (info) {
      this.$router.push({
        path: `/chatroom/user`
      })
    },
    sendContent () {
      this.text = this.$refs.sTest.value
      if (this.text !== '') {
        this.content.push({
          askImg: require('../../assets/me/minion.png'),
          askContent: this.text
        })
        setTimeout(() => {
          this.content.push({
            replyImg: '',
            replyContent: this.randomReply[Math.floor(Math.random() * 19)]
          })
          for (let i = 0; i < this.content.length; i++) { // 定义回复者的头像
            this.content[i].replyImg = this.info.headPortrait
          }
        }, 1000)
      }
      this.$refs.sTest.value = '' // 清空输入框的内容
    },
    clearContent () {
      this.content = []
    }
  },
  // 销毁
  beforeDestroy () {
    // 销毁监听
    this.socket.onclose = this.close
  }
}
</script>

<style scoped>
.chatroom {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 19;
  background-color: #ebebeb;
}

.back {
  background: #1e2b39;
  height: 50px;
  color: #fff;
  position: fixed;
  width: 100%;
}

.back .img {
  position: absolute;
  top: 25px;
  margin-top: -8px;
  left: 14px;
}

.back .dissname {
  position: absolute;
  font-size: 20px;
  top: 25px;
  margin-top: -10px;
  left: 50px;
  padding-left: 10px;
  border-left: 1px solid #000;
}

.back .logo {
  position: absolute;
  font-size: 20px;
  top: 30px;
  margin-top: -15px;
  right: 20px;
}

.content {
  position: fixed;
  top: 50px;
  bottom: 50px;
  left: 0;
  right: 0;
  /*border: 1px solid red;*/
}

.content-wrapper {
  height: 100%;
  overflow: hidden;
}

.content-top {
  font-size: 14px;
  color: rgba(153, 153, 153, 0.6);
  text-align: center;
  margin-top: 4px;
}

.content-body {
  position: relative;
  padding: 20px 10px;
  /*overflow: hidden;*/
  /*border: 1px solid blue;*/
}

.content-body li {
  position: relative;
  overflow: hidden;
  margin-bottom: 15px;
  line-height: 28px;
}

.inHtml img {
  position: relative;
  width: 30px;
  height: 30px;
}

.ask {
  text-align: right;
}

.reply {
  text-align: left;
}

.ask img {
  float: right;
  margin-left: 15px;
}

.reply img {
  float: left;
  margin-right: 15px;
}

.reply p, .ask p {
  border-radius: 4px;
  text-align: left;
  font: 14px 'Microsoft YaHei';
  line-height: 30px;
}

.ask p {
  float: right;
  padding: 3px 10px;
  max-width: 182px;
  background: #228b22;
  color: #fff;
}

.reply p {
  left: 2pc;
  float: left;
  padding: 3px 10px;
  max-width: 190px;
  background: #fff;
}

.bottom {
  position: fixed;
  height: 50px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
}

.send {
  display: flex;
}

.sText {
  flex: 6;
  height: 30px;
  margin: 10px;
  border: 0;
  padding-left: 8px;
  border-bottom: 1px solid rgba(153, 153, 153, 0.8);
  /*border: 1px solid rgba(153,153,153,0.8);*/
  font-size: 15px;
}

.sText.active {
  background-color: red;
}

.btn {
  flex: 1;
  width: 65px;
  height: 30px;
  margin: 10px 10px;
  border: 0;
  border-radius: 5px;
  /*float: right;*/
  text-align: center;
  font-size: 18px;
  color: white;
  background-color: #09BB07;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
