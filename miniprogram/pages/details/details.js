var app = getApp()
const db = wx.cloud.database();
const _ = db.command
//wx.cloud.init();
Page({
  data: {
    disabled:false,
    index: 0,
    stuID: '',
    category: ['比赛', '项目', '拼车', '其他'],
    taskOngoing: {
      Giverid: '',
      Reciverid: [],
      _id: '',
      briefInf: '',
      category: '',
      taskid: ''
    }

  },
  onLoad: function (option) {
    this.setData({
      index: option.index,
      stuID: app.globalData.stuId,
      taskOngoing: JSON.parse(option.taskongoing)
    })
    console.log(this.data.taskOngoing)
    ///////////////////////能否加入队伍///////////////////////
    var newid = []
    newid = this.data.taskOngoing.Reciverid
    if (newid.indexOf(this.data.stuID) != -1) {
      this.setData({
        disabled: true
      })
    }
  },
  onHide: function () {
    console.log("taskinf page onhide")
  },



  ///////////////////////加入队伍///////////////////////
  joinTeam:function(){
    var newid = []
    newid = this.data.taskOngoing.Reciverid
    newid.push(this.data.stuID)
    var taskid = this.data.taskOngoing._id;
    wx.showModal({
      title: '',
      content: '确认加入队伍吗',
      confirmText: "那当然",
      cancelText: "打扰了",
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          
          db.collection('taskOngoing').doc(taskid).update({
            data: {
              Reciverid: newid
            },
            success: res => {
              this.setData({
                Reciverid: newid
              })
            },
            fail: err => {
              icon: 'none',
                console.error('[数据库] [更新记录] 失败：', err)
            }
          })
          wx.showModal({
            title: '申请成功',
            content: '我们已经告诉发起人啦',
            showCancel: false,
            confirmText: '确认'
          })
        }
        else {
          console.log('用户手抖了')
        }
      }
    })
  }
});