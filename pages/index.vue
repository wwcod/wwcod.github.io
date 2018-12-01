<template>
  <div class="container"
       @mousemove="mousemove"
       :style="!me && { cursor: 'default' }"
       @click="clickOutside">
    <User v-for="user in userList"
          v-if="me ? me.avatar !== user.avatar : true"
          :key="user.avatar"
          v-bind="user" />
    <User v-if="me"
          v-bind="me" />
    <div class="input__container">
      <a-input class="input"
               size="large"
               ref="input"
               v-model="inputText"
               placeholder="Say Something!" />
    </div>
    <div class="auth__container"
         v-if="!user">
      <img class="github-login"
           src="/github-icon.svg"
           @click="login" />
    </div>
    <div class="anounce"
         v-html="me ? '<b>Enter</b> - Chat, <b>T</b> - Toggle Avatar' : 'GitHub로 로그인하세요'"></div>
    <video ref="video"
           width="480"
           height="360"></video>
    <canvas ref="canvas"
            width="100"
            height="100">

    </canvas>
  </div>
</template>

<script>
import db, { firebase } from '../plugins/db'
import User from '../components/User.vue'

const faceDetector = new window.FaceDetector({ fastMode: true })

export default {
  data: () => ({
    user: null,
    uid: null,
    me: null,
    inputText: '',
    isInputFocus: false,
    isFace: false,
    timer: null,
  }),
  firebase: () => ({
    users: db.ref('users'),
  }),
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user)
        this.user = user
        this.uid = user.uid
        this.me = {
          ...this.me,
          avatar: user.photoURL,
          name: user.displayName || user.email.substring(0, user.email.lastIndexOf('@')),
          x: 100,
          y: 100,
        }
        db.ref(`users/${this.uid}`).set(this.me)
      }
    })
    window.addEventListener('beforeunload', e => {
      db.ref(`users/${this.uid}`).set({})
    })
    window.addEventListener('keypress', e => {
      if (e.keyCode !== 13 || !this.me) return
      if (!this.isInputFocus) {
        this.inputText = ''
        this.$refs.input.focus()
        this.isInputFocus = true
      } else {
        this.isInputFocus = false
        e.target.blur()
        if (this.inputText === '') return
        this.me = {
          ...this.me,
          message: this.inputText,
        }
        db.ref(`users/${this.uid}/message`).set(this.inputText)
        this.inputText = ''
      }
    })
    window.addEventListener('keypress', async e => {
      // console.log(e.keyCode)
      if (e.keyCode !== 116 && e.keyCode !== 12613) return
      if (!this.isFace) {
        this.cameraOn()
        this.isFace = true
        this.timer = setInterval(() => {
          faceDetector.detect(this.$refs.video).then(faces => {
            if (!faces[0]) return
            const { x, y, width, height } = faces[0].boundingBox
            const margin = width / 3
            this.$refs.canvas
              .getContext('2d')
              .drawImage(
                this.$refs.video,
                x - margin,
                y - margin,
                width + margin * 2,
                height + margin * 2,
                0,
                0,
                100,
                100,
              )
            const base = this.$refs.canvas.toDataURL('image/jpeg', 0.5)
            this.me = {
              ...this.me,
              face: base,
              isFace: this.isFace,
            }
            db.ref(`users/${this.uid}`).set(this.me)
          })
        }, 100)
      } else {
        this.isFace = false
        this.me = {
          ...this.me,
          isFace: this.isFace,
        }
        db.ref(`users/${this.uid}`).set(this.me)
        clearInterval(this.timer)
      }
    })
  },
  methods: {
    mousemove(e) {
      if (!this.user && !this.uid) return
      this.me = {
        ...this.me,
        x: e.pageX,
        y: e.pageY,
      }
      db.ref(`users/${this.uid}`).set(this.me)
    },
    clickOutside(e) {
      this.isInputFocus = false
      e.target.blur()
    },
    async login() {
      const user = await firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
      // console.log(user)
      this.user = user.user
      this.uid = user.user.uid
      this.me = {
        ...this.me,
        avatar: user.user.photoURL,
        name: user.user.displayName || user.user.email.substring(0, user.user.email.lastIndexOf('@')),
        x: 0,
        y: 0,
      }
      db.ref(`users/${this.uid}`).set(this.me)
    },
    cameraOn() {
      const video = this.$refs.video
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        video.onloadedmetadata = e => video.play()
        video.srcObject = stream
      })
    },
  },
  computed: {
    userList() {
      const users = this.users.map(user => {
        const result = { ...user }
        delete result['.key']
        return result
      })
      return users
    },
  },
  components: {
    User,
  },
}
</script>

<style lang="scss" scoped>
.container {
  /* position: absolute; */
  display: grid;
  height: 100%;
  width: 100%;
  cursor: none;
  overflow: hidden;
  .auth__container {
    position: absolute;
    display: grid;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    .github-login {
      justify-self: center;
      align-self: center;
      cursor: pointer;
      width: 60px;
      height: 60px;
    }
  }
  .input__container {
    position: absolute;
    display: grid;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .input {
      display: inline-block;
      width: 300px;
      height: 50px;
      justify-self: center;
      align-self: center;
      border-radius: 4px;
      animation: popdown 0.25s cubic-bezier(0.215, 0.61, 0.355, 1) both;
      &:focus {
        animation: popup 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
      }
    }
  }
  .anounce {
    position: absolute;
    text-align: center;
    width: 100%;
  }
}
@keyframes popup {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
@keyframes popdown {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
}
video {
  display: none;
}
canvas {
  display: none;
}
</style>
