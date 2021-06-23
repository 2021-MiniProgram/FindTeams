// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("add");
  const wxContext = cloud.getWXContext()
  const db=cloud.database()
  db.collection("Users").add({
    data:{
      _id: wxContext.OPENID,
      _openid: wxContext.OPENID,
      inputInfo: event.inputInfo,
      userInfo: event.userInfo
    }
  })
}