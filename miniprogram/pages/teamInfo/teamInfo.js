// miniprogram/pages/teamInfo/teamInfo.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    isAdmin: false,
    joinOK: false,
    color:[
      "#ffcb91","#ffefa1","#94ebcd","#6ddccf"
    ]
  },
  onLoad: function (options) {
    this.setData({
        info: JSON.parse(options.info)
    })
    if(app.globalData.openID==this.data.info._openid){
      this.setData({
        isAdmin: true
      })
      db.collection("Users").where({
        _openid: db.command.in(this.data.info.member)
      }).get().then(res=>{
        this.setData({
          memberList: res.data
        })
      })
    }else{
      db.collection("Teams").where({
        _id: this.data.info._id,
        member: app.globalData.openID
      }).get().then(res=>{
        if(res.data.length==1){
          this.setData({
            joinOK: true,
          })
        }
      })
    }
  },
  join: function(){
    wx.showModal({
      title: "确认加入该队伍？",
      success: res=>{
        db.collection("Teams").doc(this.data.info._id).update({
          data:{
            have: db.command.inc(1),
            member: db.command.push(app.globalData.openID) 
          },
          success: res=>{
            wx.showToast({
              title: '加入成功！',
              icon: "success"
            })
            this.setData({
              "info.have" : this.data.info.have+1,
              joinOK: true
            })
            // .then(res=>{
            //   console.log("s1")
            //   wx.cloud.callFunction({
            //     name: 'sendMessage',
            //     data: {
            //       openID: this.data.info._openid,
            //       schedule: this.data.info.have+'/'+this.data.info.num,
            //       alteration: "新成员加入！"
            //     },
            //     success: res=>{
            //       console.log(res)
            //     }
            //   })
            // })
          }
        })
      }
    })
  },
  quit: function(){
    wx.showModal({
      title: "确认退出该队伍？",
      success: res=>{
        if(res.confirm){
          db.collection("Teams").doc(this.data.info._id).update({
            data:{
              member: db.command.pull(app.globalData.inputInfo.openID),
              have: db.command.inc(-1)
            }
          }).then(res=>{
            wx.showToast({
              title: '退出成功！',
              icon: "success"
            })
            // wx.cloud.callFunction({
            //   name: 'sendMessage',
            //   data: {
            //     openID: this.data.info._openid,
            //     schedule: this.data.info.have+'/'+this.data.info.num,
            //     alteration: "新成员加入！"
            //   },
            //   success: res=>{
            //     console.log(res)
            //   }
            // })
            wx.navigateBack({
              delta: 0,
            })
          })
        }
      }
    })
  },
  delete: function(){
    wx.showModal({
      title: "确定删除？",
      success: res=>{
        if (res.confirm) {
          db.collection("Teams").doc(this.data.info._id).remove().then(res=>{
            wx.showToast({
              title: '删除成功！',
              icon: "success"
            })
          })
          wx.navigateBack({
            delta: 0,
          })
        }
      }
    })
  },
  dismiss: function(e){
    wx.showModal({
      title: "确认移除该成员？",
      success: res=>{
        if(res.confirm){
          db.collection("Teams").doc(this.data.info._id).update({
            data: {
              member: db.command.pull(this.data.info.member[e.currentTarget.dataset.index]),
              have: db.command.inc(-1)
            }
          }
          ).then(res=>{
            wx.showToast({
              title: '移除成功！',
            })
            this.data.info.member.splice(e.currentTarget.dataset.index,1)
            db.collection("Users").where({
              _openid: db.command.in(this.data.info.member)
            }).get().then(res=>{
              this.setData({
                memberList: res.data,
                "info.member": this.data.info.member,
                "info.have" : this.data.info.have-1
              })
            })
          })
        }
      }
    })
  }
})