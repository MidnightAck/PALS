/*usercenter.js*/
var app = getApp()
const db = wx.cloud.database();
const _ = db.command
Page({
  data: {
    tabbar: {},
    currentTab:0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 1,
    scrollLeft: 0,
   
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
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //////自定义tabbar切换/////////////////
  tabChange: function(e) {
    var key = e.detail.key
    if (key == 'new') {
      wx.navigateTo({
        url: '../raise/raise',
      })
    } else if (key == 'home') {
      wx.navigateTo({
        url: '../Square/Square',
      })

    }
  },

  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      modalIndex: e.currentTarget.dataset.index
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  /*------------------------
  页面显示时加载最新数据库
  索引：Giverid or Reciverid
  ------------------------*/
  onShow: function() {
    if (app.globalData.stuId == '')
      wx.showModal({
        title: '不能发起',
        content: '请先进行校友认证',
        showCancel: true,
        confirmText: '去认证',
        cancelText: '再看看',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../userinf/userinf'
            })
          }
          else if (res.cancel) {
            wx.switchTab({
              url: '../Square/Square'
            })
          }
        },
      })


    console.log(app.globalData.userInfo)
    var that = this
   
    this.setData({
      stuId :app.globalData.stuId,
      stuname: app.globalData.stuname,
      userInfo: app.globalData.userInfo,
    })
    console.log(app.globalData.stuId)
    db.collection('taskOngoing').where(_.or([{
        Giverid: this.data.stuId
      },
      {
        Reciverid: this.data.stuId
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
    var that = this
    console.log(app.globalData.openid)
    db.collection('userAll').where({
      openid: app.globalData.openid
    }).get({
      success: res => {
        console.log(res.data)
        if (res.data)
          this.setData({
            stuinf: res.data[0]
          })

      },
      fail(res) {
        console.log(fail)
      }
    })
  },
  /*------------------------
  点击任务卡片后显示详情页面跳转和传参
  ------------------------*/
  detailedInf: function(event) {
    var that = this
    console.log(that.data.taskOngoing[event.currentTarget.dataset.index])
    wx.navigateTo({
      url: '../taskinf/taskinf?index=' + event.currentTarget.dataset.index + '&taskongoing=' + JSON.stringify(that.data.taskOngoing[event.currentTarget.dataset.index]),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  onLoad:function(){
    app.editTabbar();
  },
  onHide: function() {
    console.log("usercenter page onhide")
  },
  /*------------------------
  点击个人中心
  ------------------------*/
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