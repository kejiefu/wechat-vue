<template>
  <div class="chat">
    <scroll class="chat-wrapper" :data="chatList">
      <div>
        <ul>
          <router-link
            to='/chatroom'
            tag="li"
            v-for="addinfo in this.addList"
            :key="addinfo.id"
            class="item"
          >
            <div class="item-cell" @click="">
              <img class="item-img" :src="addinfo.imgurl" height="40" width="40"/>
              <h2 class="dissname" v-html="addinfo.dissname"></h2>
              <p class="summary">点击发送消息</p>
              <span class="item-time">刚刚</span>
            </div>
          </router-link>
        </ul>
        <ul>
          <router-link
            to='/chatroom'
            tag="li"
            v-for="info in chatList"
            :key="info.id"
            class="item"
          >
            <div class="item-cell" @click="gotoChatroom(info)">
              <div class="img-unread">
                <img class="item-img" :src="info.headPortrait" height="40" width="40"/><span v-html="info.unread"
                                                                                             v-show="info.unread"></span>
              </div>
              <h2 class="dissname" v-html="info.friendName"></h2>
              <p class="summary" v-html="info.summary"></p>
              <span class="item-time" v-html="info.time"></span>
            </div>
          </router-link>
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '../../base/scroll/scroll'
import {mapMutations, mapGetters} from 'vuex'

export default {
  components: {
    Scroll
  },
  // updated () {
  //   console.log('测试：测试：')
  //   console.log(this.addList)
  // },
  computed: {
    ...mapGetters([ // 拿到info的状态
      'info',
      'addList'
    ])
  },
  methods: {
    getData: function () {
      let api = 'http://127.0.0.1:18085/user-friend/message'
      let headers = {'Content-Type': 'application/json;charset=utf-8', 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6IuafryIsInVzZXJJZCI6MTM0OTY0MzI5NzIxMTY5OTIwMX0.fCVDgHAnOCq66Yib1lLGOUZd-FeBr4lsPGz05OuORzY'}
      this.$http.post(api, {}, {headers: headers})
        .then((res) => {
          console.log('res.body.data:' + JSON.stringify(res.body.data))
          this.chatList = res.body.data
        }, (err) => {
          console.log(err)
        })
    },
    enterMessage () {
      console.log('enterMessage')
    },
    gotoChatroom (info) {
      info.unread = ''  // 点击后使未读消息的提示消失
      info.summary = '点击发送消息' // 点击后使未读消息的提示消失
      info.time = '刚刚'
      this.setAddress(info)
    },
    ...mapMutations({
      setAddress: 'SET_INFO'
    })
  },
  data () {
    return {
      chatList: []
    }
  },
  // mounted是vue中的一个钩子函数，一般在初始化页面完成后，再对dom节点进行相关操作。
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
.chat {
  position: fixed;
  /*border: 1px solid red;*/
  /*width: 100%;*/
  top: 50px;
  bottom: 50px;
  left: 0;
  right: 0;
}

.item {
  width: 100%;
  margin-left: 0;
}

.chat-wrapper {
  height: 100%;
  overflow: hidden;
}

.item-cell {
  position: relative;
  border-bottom: 1px solid rgba(153, 153, 153, 0.4);
  height: 60px;
}

.img-unread {
  position: relative;
}

.img-unread span {
  position: absolute;
  top: 0;
  left: 44px;
  font-size: 10px;
  line-height: 14px;
  color: #fff;
  height: 14px;
  width: 14px;
  text-align: center;
  vertical-align: middle;
  background-color: red;
  border: 1px solid red;
  border-radius: 50%;
}

.item-img {
  float: left;
  margin: 10px 10px 10px 10px;
}

.dissname {
  /*border: 1px solid red;*/
  font-size: 14px;
  font-weight: bold;
  padding-top: 10px;
  padding-left: 70px;
}

.summary {
  font-size: 14px;
  padding-top: 10px;
  padding-left: 70px;
  color: rgba(153, 153, 153, 0.8);
  font-style: italic;
}

.item-time {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  color: rgba(153, 153, 153, 0.8);
}

</style>
