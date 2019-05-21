//我的资料
var app = getApp();
const db = wx.cloud.database();
const _ = db.command
Page({
  /*-----------------
   * 页面的初始数据
   ----------------*/
  data: {
    stuinf: {
      openid: '', //_id
      id: '', //学号
      name: '', //姓名
      number: '', //联系方式
      school: '', //学院
      major: '', //专业
      tag: [], //标签
      detail: '', //个人简介
      starnum: 0, //收藏数
      starlist: [''], //收藏任务号
      userInfo: {} //用户信息
    },
    taskOngoing: [{
      Giverid: '',
      Reciverid: [],
      _id: '',
      briefInf: '',
      category: '',
      length: 0
    }],
  },
  onLoad: function(option) {
   
    var that = this
    this.setData({
      stuinf: JSON.parse(option.stuinf),
    })
    console.log(this.data.stuinf.starlist)
    db.collection('taskOngoing').where({
      _id:_.in(this.data.stuinf.starlist)
    }).get({
      success: res => {
        console.log(res.data)
        let taskOngoing = res.data;
        if (taskOngoing) {
          this.setData({
            taskOngoing: taskOngoing
          })
        }
      },
      fail(res) {
        console.log(fail)
      }
    })
  }
})