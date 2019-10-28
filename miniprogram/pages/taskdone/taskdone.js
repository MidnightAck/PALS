//tapbar:我的
var app = getApp()
Page({
  data: {
    category: ['比赛', '项目', '拼车', '其他'],
    taskOngoing: [{
      Giverid: '',
      Reciverid: [{
        userid: '',
        major: '',
        school: '',
        username: ''
      }],
      _id: '',
      briefInf: '',
      category: '',
      taskid: '',
      stuId: ''
    }],
  },
  /*------------------------
  页面显示时加载最新数据库
  索引：Giverid or Reciverid
  ------------------------*/
  onShow: function () {
    var that = this
    const db = wx.cloud.database();
    const _ = db.command
    db.collection('taskDone').where(_.or([{
      Giverid: app.globalData.stuId
    },
    {
      Reciverid: app.globalData.stuId
    }
    ])).get({
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
  },
  /*------------------------
  点击任务卡片后显示详情页面跳转和传参
  ------------------------*/
  detailedInf: function (event) {
    var that = this
    console.log(that.data.taskOngoing[event.currentTarget.dataset.index])
    wx.navigateTo({
      url: '../taskinf/taskinf?index=' + event.currentTarget.dataset.index + '&taskongoing=' + JSON.stringify(that.data.taskOngoing[event.currentTarget.dataset.index]),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  onHide: function () {
    console.log("usercenter page onhide")
  },
});