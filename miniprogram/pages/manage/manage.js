// miniprogram/pages/manage/manage.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    mineList: [],
    joinList: [],
    color:[
      "#ffcb91","#ffefa1","#94ebcd","#6ddccf"
    ]
  },
  onShow: function () {
    //What I found
    db.collection("Teams").where({
      _openid: app.globalData.openID
    }).get().then(
      res=>{
        this.setData({
          mineList: res.data
        })
      }
    )
    //What I join
    db.collection("Teams").where({
      member: app.globalData.openID
    }).get().then(
      res=>{
        this.setData({
          joinList: res.data
        })
      }
    )
  },
  navigate: function(e){
    if(e.currentTarget.dataset.name=="mine"){
      wx.navigateTo({
        url: '../teamInfo/teamInfo?info='+JSON.stringify(this.data.mineList[e.currentTarget.dataset.index])
      })
    }else{
      wx.navigateTo({
        url: '../teamInfo/teamInfo?info='+JSON.stringify(this.data.joinList[e.currentTarget.dataset.index])
      })
    }
  }
})