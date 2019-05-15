var app = getApp()
const db = wx.cloud.database();
//wx.cloud.init();
Page({
  data: {
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
  onLoad: function(option) {

    this.setData({
      index: option.index,
      stuID: app.globalData.stuId,
      taskOngoing: JSON.parse(option.taskongoing)
    })
  },
////////////////更新队伍信息///////////////////////
  update:function(event){
    var that = this
    wx.navigateTo({
      url: '../taskinf_change/taskinf_change?taskongoing=' + JSON.stringify(that.data.taskOngoing),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
////////////////解散队伍///////////////////////
  dismiss: function() {
    var that = this;
    wx.showModal({
      title: '',
      content: '一旦解散队伍将不能再恢复',
      confirmText: "确认解散",
      cancelText: "手抖",
      success: function(res) {
        console.log(res);
        if (res.confirm) {
          db.collection('taskOngoing').doc(that.data.taskOngoing._id).remove({
            success(res) {
              wx.showToast({
                title: '解散成功！',
                icon: 'success',
                duration: 2000
              });
            }
          })
          wx.hideToast();
          wx.switchTab({
            url: '../usercenter/usercenter'
          })
        } else {
          console.log('用户手抖了')
        }
      }
    });
  },
////////////////查看候选人///////////////////////
  seeCandi:function(){
    var that = this
    wx.navigateTo({
      url: '../candidate/candidate?taskongoing=' + JSON.stringify(that.data.taskOngoing),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
});