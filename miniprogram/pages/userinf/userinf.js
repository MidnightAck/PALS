var app = getApp();
const db = wx.cloud.database();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuId: '',
    stuinf: {
      openid: '', //_id
      id: '', //学号
      name: '', //姓名
      number: '', //联系方式
      school: '', //学院
      major: '', //专业
      tag: [''], //标签
      detail: '', //个人简介
      starnum: 0, //收藏数
      starlist: [''], //收藏任务号
      userInfo: {} //用户信息
    },
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  /*------------------------
  获取用户信息
  ------------------------*/
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   转向我的资料
   */
  userfile:function(){
wx.navigateTo({
  url: '../userfile/userfile?stuinf=' + JSON.stringify(this.data.stuinf),
  success: function(res) {},
  fail: function(res) {},
  complete: function(res) {},
})


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        stuId:app.globalData.stuId,
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /*
    转向注册界面
     */
  rec: function () {
    if(app.globalData.stuId==''){
      wx.navigateTo({
        url: '../rec/rec',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    else{
      wx.showToast({
        title: '您已完成认证',
        icon: 'success',
        image: '',
        duration: 1000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }


  },
  /*
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /*---------------------------
  * 认证页面跳转
  ----------------------------*/
  login: function () {
    wx.navigateTo({
      url: '../rec/rec',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })



  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    console.log(app.globalData.openid)
   
    this.setData({
      stuId:app.globalData.stuId
    })
      
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})