const db = wx.cloud.database();
const _ = db.command
//wx.cloud.init();
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

  onLoad: function (option) {
    this.setData({
      stuID: app.globalData.stuId,
      taskOngoing: JSON.parse(option.taskongoing),
    })
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
  ///////////显示候选人信息/////////////////
  onShow: function () {
    db.collection('userAll').where({
      userid: _.in(this.data.taskOngoing.Reciverid)
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


  ////////////////选择候选人///////////////////////////
  selectU: function (e) {
    var value1 = this.data.taskOngoing.briefInf
    var candiOpenid = this.data.userlist[e.currentTarget.dataset.index]._openid
    var value3 = this.data.userlist[e.currentTarget.dataset.index].username
    var value4 = this.data.userlist[e.currentTarget.dataset.index].wxid
    console.log(candiOpenid)
    wx.showModal({
      title: '',
      content: '选择这位朋友吗,我们将提醒他,同时将他的微信号复制到您的剪贴板',
      confirmText: "就他了",
      cancelText: "打扰了",
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          wx.setClipboardData({
            data: value4,
          })
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
            _openid: candiOpenid,
            date: _.gt(week) //获取7天内
          }).get().then(res => {
            console.log(res.data)
            var formIdList = res.data
            let date = new Date();
            let data = JSON.stringify({
              "keyword1": {
                "value": "你的组队有了新的消息"
              },
              "keyword2": {
                "value": value1
              },
              "keyword3": {
                "value": value3
              },
              "keyword4": {
                "value": date
              },
            })
            //调用云函数发送模版消息
            wx.cloud.callFunction({
              name: 'moban',
              data: {
                openid: formIdList[0].openid,
                template_id: "tckUPjs60Zy94Ixg9ZBiqPgfhQn24_ZdV0b-WoOKFdY",
                //page: "/pages/fromID/index?sender_openid=" + wx.getStorageSync("openid") + "&value=" + value, //携带参数
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
          wx.showModal({
            title: '申请成功',
            content: '我们已经告诉候选人啦',
            showCancel: false,
            confirmText: '确认'
          })
        }
        else {
          console.log('用户手抖了')
        }
      }
    })
  },

  /////////////////发送候选人申请/////////////////////
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
      _openid: " otd9Z5Fkv946-8C9VChCzsJgMjcw",
      date: _.gt(week) //获取7天内
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
  ///////////////////删除用过的formid///////////////////
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