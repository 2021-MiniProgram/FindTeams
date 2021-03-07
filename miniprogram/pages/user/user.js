// miniprogram/pages/user/user.js
const app=getApp()
const db=wx.cloud.database()
Page({
  data: {
    hasUserInfo: false,
    userInfo: {},
    canEdit: false
  },
  onLoad: function (options) {
    wx.getSetting({
      success: res=>{
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success: res=>{
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          })
          let that=this
          wx.cloud.callFunction({
            name: "getUser",
            success: res=>{
              that.setData({
                inputInfo: res.result.data.inputInfo
              })
              app.globalData.openID=res.result.data._id
              app.globalData.inputInfo=res.result.data.inputInfo
            }
          })
        }
      }
    })
  },
  getUserInfo: function(e){
    if(e.detail.userInfo){
      this.setData({
        userInfo: {
          avatarUrl: e.detail.userInfo.avatarUrl,
          nickName: e.detail.userInfo.nickName,
        },
        hasUserInfo: true
      })
      wx.cloud.callFunction({
        name: "addUser",
        data:{
          inputInfo: app.globalData.inputInfo
        },
      })
      wx.showToast({
        title: '请先完善您的个人信息！',
        duration: 2000,
        icon: 'none'
      })
      this.onLoad()
    }
    else{
      wx.showModal({
        title: e.detail.errMsg,
        content: "小程序需要用户授权获取公开信息才可使用。"
      })
    }
  },
  editUserInfo: function(e){
    this.setData({
      canEdit: true
    })
  },
  submitChanges: function(e){
    this.setData({
      canEdit: false
    })
    app.globalData.inputInfo={
      grade: e.detail.value.grade,
      QQ: e.detail.value.QQ,
      WeChat: e.detail.value.WeChat
    }
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