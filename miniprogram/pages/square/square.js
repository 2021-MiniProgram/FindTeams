// miniprogram/pages/user/square/square.js
const app=getApp()
const db=wx.cloud.database()
Page({
  data: {
    color:[
      "#ffcb91","#ffefa1","#94ebcd","#6ddccf"
    ]
  },
  onShow: function () {
    db.collection("Teams").get().then(
      res=>{
        this.setData({
          teamList: res.data
        })
      }
    )
  },
  navigate: function(e){
    wx.navigateTo({
      url: '../teamInfo/teamInfo?info='+JSON.stringify(this.data.teamList[e.currentTarget.dataset.index])
    })
  }
})