// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  console.log("getUser成功");
  //返回用户在数据库中存储的信息
  return db.collection("Users").doc(wxContext.OPENID).get()
}