const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    receiveDataShow: true //接收框开关
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.sender_openid) {
      that.setData({
        receiveData: options, //接收数据
        receiveDataShow: false //打开接受信息页面
      })
    }
    console.log((new Date()).valueOf())
    console.log(new Date() - (1000 * 60 * 60 * 24 * 7))
    console.log(new Date(new Date() - (1000 * 60 * 60 * 24 * 7)))
    //调用云函数获取openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        wx.setStorageSync("openid", res.result.openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //发送给自己模版消息
  button_one(e) {
    let form_id = e.detail.formId
    let date = new Date();
    let data = JSON.stringify({
      "keyword1": {
        "value": date
      },
      "keyword2": {
        "value": "2015年01月05日 12:30"
      }
    })
    //调用云函数发送模版消息
    wx.cloud.callFunction({
      name: 'moban',
      data: {
        openid: wx.getStorageSync("openid"),
        template_id: "tckUPjs60Zy94Ixg9ZBiqPgfhQn24_ZdV0b-WoOKFdY",
        page: "",
        form_id,
        data,
        emphasis_keyword: "keyword1.DATA"
      },
      success: res => {
        console.log('[云函数] [login] : ', res)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  //调用云函数发送给指定用户
  button_two(e) {
    console.log(e.detail.value.input)
    let value = e.detail.value.input //获取输入
    let week = new Date() - (1000 * 60 * 60 * 24 * 7) //建立7天时间戳
    //储存formId，并打时间戳
    db.collection('formId').add({
      data: {
        openid: wx.getStorageSync("openid"),
        formId: e.detail.formId,
        date: (new Date()).valueOf()
      }
    })
      .then(res => {
        console.log(res)
      })
    //获取formId数据 
    db.collection('formId').where({
      _openid: "otd9Z5HK9TfPGRZK7PKzFFlP4nwU",
      date: _.gt(week) //获取7天内
    }).get().then(res => {
      console.log(res.data)
      var formIdList = res.data
      let date = new Date();
      let data = JSON.stringify({
        "keyword1": {
          "value": "fasfasf"
        },
        "keyword2": {
          "value": date
        }
      })
      //调用云函数发送模版消息
      wx.cloud.callFunction({
        name: 'moban',
        data: {
          openid: formIdList[0].openid,
          template_id: "tckUPjs60Zy94Ixg9ZBiqPgfhQn24_ZdV0b-WoOKFdY",
          page: "/pages/fromID/index?sender_openid=" + wx.getStorageSync("openid") + "&value=" + value, //携带参数
          form_id: formIdList[0].formId,
          data,
          emphasis_keyword: "keyword1.DATA"
        },
        success: res => {
          console.log('模版消息发送成功: ', res)
          this.remove(formIdList[0]._id); //调用删除formId函数
        },
        fail: err => {
          console.error('模版消息发送失败：', err)
        }
      })
    })
  },
  button_three(e) {
    console.log(e.detail.formId)
    console.log(new Date())
    db.collection('formId').add({
      data: {
        openid: wx.getStorageSync("openid"),
        formId: e.detail.formId,
        date: (new Date()).valueOf()
      }
    })
      .then(res => {
        console.log(res)
      })
  },
  //回复消息
  receive(e) {
    console.log(e.detail.value.input)
    let value = e.detail.value.input
    let week = new Date() - (1000 * 60 * 60 * 24 * 7)
    db.collection('formId').add({
      data: {
        openid: wx.getStorageSync("openid"),
        formId: e.detail.formId,
        date: (new Date()).valueOf()
      }
    })
      .then(res => {
        console.log(res)
      })
    db.collection('formId').where({
      _openid: this.data.receiveData.sender_openid,
      date: _.gt(week)
    }).get().then(res => {
      console.log(res.data)
      var formIdList = res.data
      let date = new Date();
      let data = JSON.stringify({
        "keyword1": {
          "value": value
        },
        "keyword2": {
          "value": date
        }
      })
      wx.cloud.callFunction({
        name: 'moban',
        data: {
          openid: formIdList[0].openid,
          template_id: "Lwh1NYwTUzHIjDwWlbPVhUJWQLW__nLkj31p2lMH8AM",
          page: "/pages/fromID/index?sender_openid=" + wx.getStorageSync("openid") + "&value=" + value,
          form_id: formIdList[0].formId,
          data,
          emphasis_keyword: "keyword1.DATA"
        },
        success: res => {
          console.log('模版消息发送成功: ', res)
          this.remove(formIdList[0]._id);
        },
        fail: err => {
          console.error('模版消息发送失败：', err)
        }
      })
    })
  },
  //调用云函数删除使用过的formId数据
  remove(id) {
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        id,
      },
      success: res => {
        console.log('删除成功：', res)
        if (res.result.stats.removed == 1) {
          wx.showToast({
            title: '删除formId成功',
          })
        }
      },
      fail: err => {
        console.log('删除失败：', err)
      }
    })
  }
})