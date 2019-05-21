//校友认证页面
var app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    authenticated: false,
    img: '',
    stuinf: {
      openid: '', //_id
      id: '', //学号
      name: '', //姓名
      number: '', //联系方式
      school: '', //学院
      major: '', //专业
      tag: [], //标签
      detail: '', //个人简介
      starnum: 0,//收藏数
      starlist: [''],//收藏任务号
      userInfo: {} //用户信息
    },
    userInfo: {},
    hasUserInfo: false,
    rec_change: 0 //条件渲染使能值 0为上传照片 1为修改信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "stuinf.userInfo": app.globalData.userInfo,
      "stuinf.openid":app.globalData.openid
    })
  },
  /**
   * 更新微信号
   */
  number: function (e) {
    var that = this
    that.setData({
      "stuinf.number": e.detail.value
    })


  },
  /**
   * 更新学院
   */
  school: function (e) {
    var that = this
    that.setData({
      "stuinf.school": e.detail.value
    })
  },
  /**
   * 更新专业
   */
  major: function (e) {
    var that = this
    that.setData({
      "stuinf.major": e.detail.value
    })


  },
  imageBase64: function (e) {
    var that = this
    const fileManager = wx.getFileSystemManager();
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['camera', 'album'],
      success: function (res) {
        wx.showLoading({
          title: '识别中',
          mask: true
        })
        that.setData({
          img: res.tempFilePaths[0]
        })
        var base64 = fileManager.readFileSync(res.tempFilePaths[0], 'base64')
        wx.request({
          url: 'https://ocrdiy.market.alicloudapi.com/api/predict/ocr_sdt',
          method: 'POST',
          header: {
            'Authorization': 'APPCODE 0b0bb30f62ba4f0f8800559b055b322a',
            'Content-Type': 'application/json; charset=UTF-8'
          },
          data: {
            image: base64,
            configure: {
              template_id: 'd5f36dee-6075-4fc0-9e6d-22f8b0817bbb1556179865'
            }
          },
          success(res) {//OCR获取一卡通的姓名和学号赋值本地
            console.log(res)
            that.setData({
              "stuinf.id": res.data.items.stu_ID,
              "stuinf.name": res.data.items.stu_name
            })
            that.setData({
              rec_change: 1
            })

            wx.hideLoading()
          }
        })
      }
    })
  },
  save: function () {
    var that = this
    db.collection('userAll').where({
      id:that.data.stuinf.id // 填入当前用户 openid
    }).get({
      success(res) {
        console.log(res.data)
        if (res.data.length == 1) {
          wx.showModal({
            title: '保存失败',
            content: '认证已经存在',
            showCancel: true,
            cancelText: '填错了',
            confirmText: '我要申诉',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }

            },
            fail: function (res) { },
            complete: function (res) { }
          })
        } else {
          wx.showLoading({
            title: '正在保存',
          })
          app.globalData.stuId = that.data.stuinf.id;
          app.globalData.stuname = that.data.stuinf.name;
          db.collection('userAll').add({
            data: {
              /*库新添项*/
              openid: that.data.stuinf.openid,
              id: that.data.stuinf.id,
              name: that.data.stuinf.name,
              number: that.data.stuinf.number,
              school: that.data.stuinf.school,
              major: that.data.stuinf.major,
              tag: that.data.stuinf.tag,
              detail: that.data.stuinf.detail,
              starnum: that.data.stuinf.starnum,
              starlist: that.data.stuinf.starlist,
              userInfo: that.data.stuinf.userInfo,
            },
            success(res) {
              wx.hideLoading();
              wx.showToast({
                title: '认证成功！',
              })
              wx.navigateTo({
                url: '../userinf/userinf',
              })
              console.log(res)
            },
          })


        }

      }
    })



  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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