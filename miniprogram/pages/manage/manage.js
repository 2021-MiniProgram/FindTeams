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
        // console.log(res);
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
    console.log(e);
    if(e.currentTarget.dataset.name=="mine"){
      app.globalData.teamId=this.data.mineList[e.currentTarget.dataset.index]._id;
      wx.navigateTo({
        url: '../teamInfo/teamInfo?id='+this.data.mineList[e.currentTarget.dataset.index]._id
      })
    }else{
      app.globalData.teamId=this.data.joinList[e.currentTarget.dataset.index]._id;
      wx.navigateTo({
        url: '../teamInfo/teamInfo?id='+this.data.joinList[e.currentTarget.dataset.index]._id
      })
    }
  }
})