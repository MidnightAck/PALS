// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async(event, context) => {
  await db.collection('taskOngoing').where({
      taskid: event.taskid
    })
    .update({
      data: {
        briefInf: event.briefInf, //简介
        category: event.category, //类别,
        detailsInf: event.detailsInf, //具体info
        dateInf: event.dateInf, //日期
        teammate: event.teammate, //队友人数
        checkboxItems: event.checkboxItems //高级设置
      },
    })
}