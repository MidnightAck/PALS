var app = getApp()
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    receiveDataShow: true, //接收框开关
    stuID: '',
    category: ['比赛', '项目', '拼车', '其他'],
    taskOngoing: {
      Giverid: '',
      Reciverid: [],
      _id: '',
      briefInf: '',
      category: '',
      taskid: ''
    },
    userlist: [],
    tar_openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      stuID: app.globalData.stuId,
      taskOngoing: JSON.parse(option.taskongoing),
    })

    //调用云函数获取openid
    wx.cloud.callFunction({
      name: 'login1',
      data: {},
      success: res => {
        console.log('[云函数] [login1] user openid: ', res.result.openid)
        wx.setStorageSync("openid", res.result.openid)
      },
      fail: err => {
        console.error('[云函数] [login1] 调用失败', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  ///////////显示候选人信息/////////////////
  onShow: function () {
    db.collection('userAll').where({
      id: _.in(this.data.taskOngoing.Reciverid)
    })
      .get({
        success: res => {
          console.log(res.data)
          this.setData({
            userlist: res.data
          })
          console.log(this.data.userlist)
        },
        fail(res) {
          console.log(fail)
        }

      })
  },

  candidetail: function (event) {
    var that = this
    console.log(that.data.userlist[event.currentTarget.dataset.index])
    wx.navigateTo({
      url: '../candiinf/candiinf?index=' + event.currentTarget.dataset.index + '&userlist=' + JSON.stringify(that.data.userlist[event.currentTarget.dataset.index]),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
})