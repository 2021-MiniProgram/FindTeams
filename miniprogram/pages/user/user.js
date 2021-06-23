// 云端存储用户信息 已实现
// miniprogram/pages/user/user.js
const app=getApp()
const db=wx.cloud.database()
Page({
  data: {
    hasUserInfo: false,
    userInfo: {},
    canEdit: false,
    // hasUserProfile: false
  },
  onShow() {
    console.log("onshow");
    console.log(this.data);
    console.log(app.globalData);
  },
  // onLoad: function (options) {
  //   //目的：修改并存储信息在js代码中
  //   wx.getSetting({
  //     success: res=>{
  //       console.log(res);
  //       // console.log(this.data.hasUserInfo);
  //       // wx.getUserInfo接口改变 scope.userInfo默认返回true
  //       // if(res.authSetting['scope.userInfo']){
  //       if(this.data.hasUserProfile){
  //         wx.getUserProfile({
  //           success: res=>{
  //             console.log("wx.getUserProfile成功");
  //             // console.log(res);
  //             this.setData({
  //               userInfo: res.userInfo,
  //               // 意义？
  //               hasUserInfo: true
  //             })
  //           },
  //           fail: res => {
  //             console.log("wx.getUserProfile失败");
  //             console.log(res);
  //           }
  //         })
  //         let that=this
  //         // console.log(that);
  //         // bug：第一次授权登录后云函数调用失败
  //         //调用服务端的云函数
  //         wx.cloud.callFunction({
  //           name: "getUser",
  //           success: res=>{
  //             // console.log(that==this);
  //             // console.log(this.data);
  //             console.log(res);
  //             //获取用户输入信息
  //             that.setData({
  //               inputInfo: res.result.data.inputInfo
  //             })
  //             console.log(this.data);
  //             //保存全局数据openID
  //             app.globalData.openID=res.result.data._id
  //             //提交表单时保存过 为什么重新保存??
  //             app.globalData.inputInfo=res.result.data.inputInfo
  //           },
  //           fail: res=> {
  //             console.log(res);
  //             console.log(this.data);
  //             console.log(app.globalData);
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  onLoad: function(options) {
    console.log("onload");
    let that = this
    wx.cloud.callFunction({
      name: "getUser",
      success: res=> {
        console.log("getUser调用成功");
        console.log(res);
        that.setData({
          hasUserInfo: true,
          userInfo: res.result.data.userInfo,
          inputInfo: res.result.data.inputInfo,
        })
        app.globalData.openID = res.result.data._openid;
        app.globalData.inputInfo = res.result.data.inputInfo
      },
      fail: res=> {
        console.log(this.data);
        console.log("getUser调用失败");
      }
    })
  },
  getUserProfile: function(e){
    wx.getUserProfile({
      desc: 'desc',
      success: res => {
        console.log(res);
        // this.setData({
        //   userInfo: {
        //     avatarUrl: res.userInfo.avatarUrl,
        //     nickName: res.userInfo.nickName,
        //   },
        //   hasUserInfo: true,
        //   // hasUserProfile: true
        // })
        // console.log(app.globalData);
        // 将用户添加进数据库，设置初始inputInfo都为空，但能通过上下文获取到用户的openId
        wx.cloud.callFunction({
          name: "addUser",
          data:{
            inputInfo: app.globalData.inputInfo,
            userInfo: res.userInfo
          },
        }).then(res=>{
          console.log("addUser调用成功");
          this.onLoad()
          wx.showToast({
            title: '请先完善您的个人信息！',
            duration: 2000,
            icon: 'none'
          })
        })
       
        // 重新加载页面
        // setTimeout(() => {
        //   this.onLoad()
        // }, 0);
        // this.onLoad()
        // let that = this
        // setTimeout(() => {
        //   that.onLoad()
        // }, 10);
      },
      fail: res => {
        wx.showModal({
          // title: res.errMsg,
          content: "小程序需要用户授权获取公开信息才可使用。"
        })
      }
    })
    // console.log(e);
    // if(e.detail.userInfo){
    //   this.setData({
    //     userInfo: {
    //       avatarUrl: e.detail.userInfo.avatarUrl,
    //       nickName: e.detail.userInfo.nickName,
    //     },
    //     hasUserInfo: true
    //   })
    //   wx.cloud.callFunction({
    //     name: "addUser",
    //     data:{
    //       inputInfo: app.globalData.inputInfo
    //     },
    //   })
    //   wx.showToast({
    //     title: '请先完善您的个人信息！',
    //     duration: 2000,
    //     icon: 'none'
    //   })
    //   // ?
    //   this.onLoad()
    // }
    // else{
    //   wx.showModal({
    //     title: e.detail.errMsg,
    //     content: "小程序需要用户授权获取公开信息才可使用。"
    //   })
    // }
  },

  editUserInfo: function(e){
    this.setData({
      canEdit: true
    })
  },
  
  submitChanges: function(e){
    console.log(e);
    this.setData({
      canEdit: false
    })
    //将输入数据保存在全局变量中
    app.globalData.inputInfo={
      grade: e.detail.value.grade,
      QQ: e.detail.value.QQ,
      WeChat: e.detail.value.WeChat
    }
    //将输入数据更新到云端
    console.log(app.globalData);
    db.collection("Users").doc(app.globalData.openID).update({
      data:{
        inputInfo: app.globalData.inputInfo
      },
      success: function(res) {
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        })
      }
    })
  }
})






// //缓存存储用户信息  未实现
// // miniprogram/pages/user/user.js
// const app=getApp()
// const db=wx.cloud.database()
// Page({
//   data: {
//     hasUserInfo: false,
//     userInfo: {},
//     canEdit: false,
//     // hasUserProfile: false
//   },
//   onShow() {
//     console.log("onshow");
//     console.log(this.data);
//     console.log(app.globalData);
//   },
//   onLoad: function(options) {
//     console.log("onload");
//     let that = this
//     wx.cloud.callFunction({
//       name: "getUser",
//       success: res=> {
//         console.log("getUser调用成功");
//         console.log(res);
//         that.setData({
//           hasUserInfo: true,
//           userInfo: res.result.data.userInfo,
//           inputInfo: res.result.data.inputInfo,
//         })
//         app.globalData.openID = res.result.data._openid;
//         app.globalData.inputInfo = res.result.data.inputInfo
//       },
//       fail: res=> {
//         console.log(this.data);
//         console.log("getUser调用失败");
//       }
//     })
//   },
//   getUserProfile: function(e){
//     wx.getUserProfile({
//       desc: 'desc',
//       success: res => {
//         console.log(res);
//         wx.cloud.callFunction({
//           name: "addUser",
//           data:{
//             inputInfo: app.globalData.inputInfo,
//             userInfo: res.userInfo
//           },
//         }).then(res=>{console.log("addUser调用成功");})
//         wx.showToast({
//           title: '请先完善您的个人信息！',
//           duration: 2000,
//           icon: 'none'
//         })
//         this.onLoad()
//       },
//       fail: res => {
//         wx.showModal({
//           content: "小程序需要用户授权获取公开信息才可使用。"
//         })
//       }
//     })
//   },

//   editUserInfo: function(e){
//     this.setData({
//       canEdit: true
//     })
//   },
  
//   submitChanges: function(e){
//     console.log(e);
//     this.setData({
//       canEdit: false
//     })
//     //将输入数据保存在全局变量中
//     app.globalData.inputInfo={
//       grade: e.detail.value.grade,
//       QQ: e.detail.value.QQ,
//       WeChat: e.detail.value.WeChat
//     }
//     //将输入数据更新到云端
//     console.log(app.globalData);
//     db.collection("Users").doc(app.globalData.openID).update({
//       data:{
//         inputInfo: app.globalData.inputInfo
//       },
//       success: function(res) {
//         wx.showToast({
//           title: '修改成功',
//           icon: 'success'
//         })
//       }
//     })
//   }
// })