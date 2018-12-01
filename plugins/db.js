import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import VueFire from 'vuefire'

Vue.use(VueFire)

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyA9vD18aWdNgWCwDsuKX45ZV5igH-0vjVo',
  authDomain: 'react-mobx-demo.firebaseapp.com',
  databaseURL: 'https://react-mobx-demo.firebaseio.com/',
})

// firebase.auth().onAuthStateChanged(user => {
//   if (user) {
//     isLogin = true
//   }
// })

export { firebase }
export default firebaseApp.database()
