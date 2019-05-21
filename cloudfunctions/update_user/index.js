// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  await db.collection('userAll').where({
    openid: event.openid
  })
    .update({
      data: {
        openid: event.openid, //_id
        id: event.id, //学号
        name: event.name, //姓名
        number: event.number, //联系方式
        school: event.school, //学院
        major: event.major, //专业
        tag: event.tag, //标签
        detail: event.detail, //个人简介
        starnum: event.starnum, //收藏数
        starlist: event.starlist, //收藏任务号
        userInfo: event.userInfo //用户信息
      }
    })
}