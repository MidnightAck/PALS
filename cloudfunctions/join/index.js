// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.error("我进来了")
    return await db.collection("taskOngoing").doc(event._id).update({
      data: {
        Reciverid: event.newid
      }
    })
  } catch (e) {
    console.error(e)
  }
}
