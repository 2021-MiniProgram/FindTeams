// miniprogram/pages/teamInfo/teamInfo.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    isAdmin: false,
    joinOK: false,
    isFull: false,
    info: {},
    color:[
      "#ffcb91","#ffefa1","#94ebcd","#6ddccf"
    ],
    admin: {}
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    this.onLoad();
    console.log("下拉刷新成功");
  },
  onLoad: function (options) {
    // console.log(options);
    console.log("teaminfo onload");
    //设置全局变量teamId作导航使用
    this.setData({
        // info: JSON.parse(options.id)
        id: app.globalData.teamId
    })
    //从云端获取数据，设置页面team数据info
    db.collection("Teams").where({
      _id: this.data.id
    }).get().then(res=> {
      //console.log(res);
      this.setData({
        info: res.data[0]
      })
    }).then(res=> {
      // 判断是否满员
      console.log("**********");
      db.collection("Teams").where({
        _id: this.data.id
      }).get().then(res=>{
        //console.log(res);
        if (res.data[0].have >= res.data[0].num) {
          console.log("已满员");
          this.setData({
            isFull: true
          })
        }
      })
      // 判断当前用户是否为管理员
      console.log(app.globalData);
      console.log(this.data.info);
      if(app.globalData.openID==this.data.info._openid){
        this.setData({
          isAdmin: true
        })
        db.collection("Users").where({
          _openid: db.command.in(this.data.info.member)
        }).get().then(res=>{
          // console.log(res);
          this.setData({
            memberList: res.data
          })
        })
      }
      else{
        // 同时检查_id和member，同时满足则表示已加入队伍
        db.collection("Teams").where({
          _id: this.data.info._id,
          member: app.globalData.openID
        }).get().then(res=>{
          console.log(res);
          if(res.data.length==1){
            this.setData({
              joinOK: true,
            })
          }
         }).then(res=>{
           //从云端获取admin信息
          db.collection("Users").where({
            _openid: this.data.info._openid
          }).get().then(res=>{
            console.log(res);
            this.setData({
              admin: res.data[0].inputInfo,
            })
          })
        })
      }
    })
  },

  subsMessage: function() {
    wx.showModal({
      title: '确认加入该队伍？',
      success: res=> {
        wx.getSetting({
          withSubscriptions: true,
        }).then(res=>{
           console.log(res);
          if(res.subscriptionsSetting.mainSwitch){
            console.log("已授权");
            this.join();
          }
          else {
            wx.requestSubscribeMessage({
              tmplIds: ['ZdutduKwsh4BuFsDQcKGNnBMszdn0VbTvuUbwjpmcV4'],
            }).then(res=> {
              console.log('授权成功',res);
            }).catch(res=> {
              console.log('授权失败',res);
            }).finally(res=> {
              this.join();
            })
          }
        })
      }
    })
  },

  join: function(){
    //更新Teams数据库
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
        },res => {
          console.log("sendMessage");
          wx.cloud.callFunction({
            name: 'sendMessage',
            data: {
              name: "新成员加入",
              openID: this.data.info._openid,
              alteration: "队伍人数："+this.data.info.have+'/'+this.data.info.num,
            },
            success: res=>{
              console.log("发送成功",res)
            }
          })
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
              member: db.command.pull(app.globalData.openID),
              have: db.command.inc(-1)
            }
          }).then(res=>{
            wx.showToast({
              title: '退出成功！',
              icon: "success",
              duration: 1500
            }).then(res=> {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 0,
                })
              }, 1000);
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
              icon: "success",
              duration:1500
            }).then(res=> {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 0,
                })
              }, 1000);
            })
          })
        }
      }
    })
  },
  dismiss: function(e){
    wx.showModal({
      title: "确认移除该成员？"
    }).then(res=>{
      if(res.confirm){
        db.collection("Teams").doc(this.data.info._id).update({
          data: {
            member: db.command.pull(this.data.info.member[e.currentTarget.dataset.index]),
            have: db.command.inc(-1)
          }
        }).then(res => {
          console.log("sendMessage");
          wx.cloud.callFunction({
            name: 'sendMessage',
            data: {
              name: "移出队伍",
              openID: this.data.info.member[e.currentTarget.dataset.index],
              //schedule: "新成员加入",
              alteration: "抱歉您已被移出队伍，请与队伍管理员联系",
            },
            success: res=>{
              console.log("发送成功",res)
            }
          })
        }).then(res=>{
          wx.showToast({
            title: '移除成功！',
          })
          this.data.info.member.splice(e.currentTarget.dataset.index,1)
          db.collection("Teams").where({
            _openid: db.command.in(this.data.info.member)
          }).get().then(res=>{
            this.setData({
              memberList: res.data,
              "info.member": this.data.info.member,
              "info.have" : this.data.info.have-1
            })
          }).then(res=> {
            this.onLoad()
          })
        })
      }
    })
  }
})