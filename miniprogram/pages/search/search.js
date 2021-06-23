// miniprogram/pages/search/search.js 
const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    resList: [],
    color:[
      "#ffcb91","#ffefa1","#94ebcd","#6ddccf"
    ]
  },
  search: function(e){
    console.log(e);
    if (e.detail.value.keyWords=="") {
      wx.showToast({
        title: '搜索不能为空',
        icon: 'error',
        duration: 1500
      })
    }
    else{
      db.collection("Teams").where({
        intro: db.RegExp({
          regexp: e.detail.value.keyWords,
          options: 'i',
        }),
        // info: db.RegExp({
        //   regexp: e.detail.value.keyWords,
        //   options: 'i',
        // })
      }).get().then(
        res=>{
          this.setData({
            resList: res.data
          })
        }
      ).then(res=> {
        if (this.data.resList.length==0) {
          wx.showToast({
            title: '未搜索到队伍',
            icon: 'error',
            duration: 1500
          })
        }
      })
    }
  },
  // navigate: function(e){
  //   wx.navigateTo({
  //     url: '../teamInfo/teamInfo?id='+this.data.resList[e.currentTarget.dataset.index]._id,
  //    // url: '../teamInfo/teamInfo?id='+this.data.teamList[e.currentTarget.dataset.index]._id
  //   })
  // }
  navigate: function(e){
    // console.log(this.data.teamList);
    // console.log(e);
    app.globalData.teamId=this.data.resList[e.currentTarget.dataset.index]._id;
    console.log(app.globalData.teamId);
    wx.navigateTo({
      // url: '../teamInfo/teamInfo?info='+JSON.stringify(this.data.teamList[e.currentTarget.dataset.index]._id)
      url: '../teamInfo/teamInfo?id='+this.data.resList[e.currentTarget.dataset.index]._id
    })
  }
})