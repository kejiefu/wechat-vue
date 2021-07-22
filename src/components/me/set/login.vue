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
                <div class="server">
                  <mt-field label="username" placeholder="账号" v-model="username"></mt-field>
                </div>
                <div class="server">
                  <mt-field label="password" placeholder="密码" type="password" v-model="password"></mt-field>
                </div>
                <div class="server">
                  <mt-button size="large" @click="login">登录</mt-button>
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
import Indicator from 'mint-ui'
import Md5 from 'js-md5'

export default {
  components: {
    BScroll,
    Md5,
    Indicator
  },
  data () {
    return {
      title: '登录',
      username: '',
      password: ''
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
    login () {
      let api = 'http://127.0.0.1:18085/user/login'
      let data = {username: this.username, password: Md5(this.password)}
      this.$http.post(api, data)
        .then((res) => {
          console.log('res.body.data:' + JSON.stringify(res.body.data))
          if (res.body.data != null) {
            // 写入token
            localStorage.token = res.body.data.authorization
            localStorage.username = res.body.data.username
            this.$router.push({path: '/me'})
          } else {
            this.$toast({
              message: '密码错误',
              duration: 1500
            })
          }
        }, (err) => {
          this.$toast({
            message: '服务器异常，请稍后再试',
            duration: 1500
          })
          console.log(err)
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

.server {
  /*border: 1px solid red;*/
  position: relative;
  height: 40px;
  background-color: #fff;
  margin-top: 5%;
}


</style>
