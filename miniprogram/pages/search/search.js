// miniprogram/pages/search/search.js
const db = wx.cloud.database()
Page({
  data: {
    resList: [],
    color:[
      "#ffcb91","#ffefa1","#94ebcd","#6ddccf"
    ]
  },
  search: function(e){
    db.collection("Teams").where({
      intro: db.RegExp({
        regexp: e.detail.value.keyWords,
        options: 'i',
      })
    }).get().then(
      res=>{
        this.setData({
          resList: res.data
        })
      }
    )
  },
  navigate: function(e){
    wx.navigateTo({
      url: '../teamInfo/teamInfo?info='+JSON.stringify(this.data.resList[e.currentTarget.dataset.index])
    })
  }
})