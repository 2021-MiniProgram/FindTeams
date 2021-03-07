// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openID,
        lang: 'zh_CN',
        data: {
          thing1: {
            DATA: event.name
          },
          phrase2: {
            DATA: "人数"+event.schedule
          },
          thing3: {
            DATA: '请及时打开小程序查看队伍信息'
          },
          thing4: {
            DATA:  event.alteration
          }
        },
        templateId: 'ZdutduKwsh4BuFsDQcKGNvMvUdxlIkCfbP6XtPUWdSM',
        miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}