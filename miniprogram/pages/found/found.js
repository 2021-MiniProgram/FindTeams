// miniprogram/pages/found/found.js
const app=getApp()
const db=wx.cloud.database()
Page({
  data: {
    num: 1
  },
  changeNum: function(e){
    console.log(e)
    this.setData({
      num: e.detail.value*1+1
    })
  },
  found: function(e){
    console.log("OK")
    if(e.detail.value.intro==""||e.detail.value.info==""){
      wx.showToast({
        title: '请完善队伍信息！',
      })
      return
    }
    db.collection("Teams").add({
      data:{
        intro: e.detail.value.intro,
        info: e.detail.value.info,
        num: this.data.num,
        have: 0,
        member: [],
        admin: {
          QQ: app.globalData.inputInfo.QQ,
          WeChat: app.globalData.inputInfo.WeChat
        }
      },
      success: res=>{
        wx.showToast({
          title: '创建成功',
          icon: 'success'
        })
        this.setData({
          intro: "",
          info: "",
          num: 1
        })
        // wx.requestSubscribeMessage({
        //   tmplIds:["ZdutduKwsh4BuFsDQcKGNvMvUdxlIkCfbP6XtPUWdSM"],
        //   success: res=>{
        //     wx.showToast({
        //       title: '订阅成功',
        //     })
        //   },
        //   fail: res=>{
        //       wx.showToast({
        //         title: res.errMsg,
        //         icon: 'none'
        //       })
        //   }
        // })
        wx.switchTab({
          url: '../square/square',
        })
      }
    })
  }
})