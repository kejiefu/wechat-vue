<template>
  <transition name="slide">
    <div class="circle">
      <div class="circle-wrap">
        <div class="back">
          <div @click="back">
            <img src="../../../assets/返回.png" height="16" width="19"/>
          </div>
          <span>{{ title }}</span>
        </div>
        <div class="content">
          <div class="content-wrapper" ref="wrapper">
            <div class="content-text">
              <div class="content-body">
                <h2></h2>
                <div class="server">
                  <div @click="logout">
                    <p>退出</p>
                    <span class="switch">
                                      </span>
                  </div>
                  <router-link tag="div" class="setup" to="login">
                    <div tag="div" to="/set/login">
                      <p>登录</p>
                      <span class="switch">
                    </span>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import {MessageBox} from 'mint-ui'

export default {
  components: {
    BScroll,
    MessageBox
  },
  data () {
    return {
      title: '设置'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true
      })
    })
  },
  methods: {
    back (event) {
      // 为防止PC端时,点击事件会被执行两次,须作如下判断，但是这里暂时不需要，参考http://blog.csdn.net/alsnei/article/details/54375957
      // if (!event._constructed) {
      //   return
      // }
      this.$router.back()   // 返回上一级
    },
    logout () {
      // 清除token信息
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('username')
      window.localStorage.removeItem('headPortrait')
      this.$toast({
        message: '退出成功',
        duration: 1500
      })
    }
  }
}
</script>

<style scoped>
.circle {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 203;
  background-color: rgba(238, 233, 233, 1);
}

.back {
  background: #1e2b39;
  height: 50px;
  color: #fff;
  position: fixed;
  width: 100%;
  z-index: 99;
}

.back div {
  height: 50px;
  width: 50px;
}

.back img {
  position: absolute;
  top: 25px;
  margin-top: -8px;
  left: 14px;
}

.back span {
  position: absolute;
  font-size: 20px;
  top: 25px;
  margin-top: -10px;
  left: 50px;
  padding-left: 10px;
  border-left: 1px solid #000;
}

.content {
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
}

.content-wrapper {
  height: 100%;
  overflow: hidden;
}

.content-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  background-color: #666f76;
}

.payment, .pocket, .card {
  flex: 1;
  display: flex;
  /*flex-direction: row | row-reverse | column | column-reverse;*/
  flex-direction: column;
  color: #fff;
  justify-content: center;
  align-items: center;
}

.pocket {
  padding-top: 20px;
}

.payment h4, .pocket h4, .card h4 {
  margin-top: 10px;
}

.pocket span {
  font-size: 12px;
  margin-top: 2px;
}

.content-body {
  padding-top: 20px;
}

.server div {
  /*border: 1px solid red;*/
  position: relative;
  height: 40px;
  background-color: #fff;
  margin-top: 10px;
}

.server div p {
  font-size: 16px;
  line-height: 40px;
  padding-left: 10px;
}

.switch {
  position: absolute;
  top: 5px;
  right: 10px;
}


.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

</style>
