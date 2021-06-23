// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openID,
        lang: 'zh_CN',
        page: 'pages/manage/manage',
        data: {
          thing1: {
            value: event.name
          },
          // phrase2: {
          //   value: '新成员加入'
          // },
          thing3: {
            value: '请及时打开小程序查看队伍信息'
          },
          thing4: {
            value:  event.alteration
          }
        },
        templateId: 'ZdutduKwsh4BuFsDQcKGNnBMszdn0VbTvuUbwjpmcV4',
        miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}