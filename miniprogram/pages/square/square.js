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
    console.log("square onshow");
    db.collection("Teams").get().then(
      res=>{
         console.log(res);
        this.setData({
          teamList: res.data.reverse()
        })
      }
    )
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    this.onShow();
    console.log("下拉刷新成功");
  },
  navigate: function(e){
    // console.log(this.data.teamList);
    // console.log(e);
    app.globalData.teamId=this.data.teamList[e.currentTarget.dataset.index]._id;
    console.log(app.globalData.teamId);
    wx.navigateTo({
      // url: '../teamInfo/teamInfo?info='+JSON.stringify(this.data.teamList[e.currentTarget.dataset.index]._id)
      url: '../teamInfo/teamInfo?id='+this.data.teamList[e.currentTarget.dataset.index]._id
    })
  }
})