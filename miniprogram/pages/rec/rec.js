var app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    authenticated: false,
    img: '',
    stu_name: '',
    stu_ID: '',
    rec_change: 0//条件渲染使能值 0为上传照片 1为修改信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
          success(res) {
            console.log(res)
            that.setData({
              stu_ID: res.data.items.stu_ID,
              stu_name: res.data.items.stu_name
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
      userid: this.data.stu_ID // 填入当前用户 openid
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
        }
        else {
          wx.showLoading({
            title: '正在保存',
          })
          app.globalData.stuId = that.data.stu_ID;
          app.globalData.stuname = that.data.stu_name;
          console
          db.collection('userAll').add({
            data: {
              /*库新添项*/
              userid: that.data.stu_ID,
              username: that.data.stu_name
            },
            success(res) {
              wx.hideLoading();
              wx.showToast({
                title: '认证成功！',
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