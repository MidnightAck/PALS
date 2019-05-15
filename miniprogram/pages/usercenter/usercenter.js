var app = getApp()
//wx.cloud.init();

Page({
  data: {
    category: ['比赛', '项目', '拼车', '其他'],
    taskOngoing: [{
      Giverid: '',
      Reciverid: '',
      _id: '',
      briefInf: '',
      category: '',
      taskid: ''
    }]
  },
  onShow: function() {
    var that = this
    const db = wx.cloud.database();
    const _ = db.command
    db.collection('taskOngoing').where(_.or([{
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
  detailedInf: function(event) {
    var that = this
    wx.navigateTo({
      url: '../taskinf/taskinf?index=' + event.currentTarget.dataset.index + '&taskongoing=' + JSON.stringify(that.data.taskOngoing[event.currentTarget.dataset.index]),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  userinf: function() {
    wx.navigateTo({
      url: '../userinf/userinf',
      success: function(res) {
        "login relaunch success"
      },
      fail: function(res) {
        "login relaunch fail"
      },
      complete: function(res) {
        "login relaunch complete"
      },
    })

  }
});