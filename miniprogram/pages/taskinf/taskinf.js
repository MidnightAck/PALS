var app = getApp()
const db = wx.cloud.database();
const _ = db.command
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
    },
    candiopenid: [],
    stuinf: {
      openid: '', //_id
      id: '', //学号
      name: '', //姓名
      number: '', //联系方式
      school: '', //学院
      major: '', //专业
      tag: [], //标签
      detail: '', //个人简介
      starnum: 0, //收藏数
      starlist: [''], //收藏任务号
      userInfo: {} //用户信息
    },
  },
  onLoad: function (option) {

    this.setData({
      index: option.index,
      stuID: app.globalData.stuId,
      taskOngoing: JSON.parse(option.taskongoing)
    })

    db.collection('userAll').where({
      id: _.in(this.data.taskOngoing.Reciverid)
    }).get({
      success: res => {
        console.log(res.data)
        let candiopenid = this.data.candiopenid
        candiopenid.push(res.data[0]._openid)
        if (candiopenid) {
          this.setData({
            candiopenid: candiopenid
          })
        }
      }
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
  ////////////////更新队伍信息///////////////////////
  update: function (event) {
    var that = this
    wx.navigateTo({
      url: '../taskinf_change/taskinf_change?taskongoing=' + JSON.stringify(that.data.taskOngoing),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  ////////////////解散队伍///////////////////////
  dismiss: function () {
    var that = this;
    wx.showModal({
      title: '',
      content: '一旦解散队伍将不能再恢复',
      confirmText: "确认解散",
      cancelText: "手抖",
      success: function (res) {
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

  ////////////////退出队伍///////////////////////
  quit: function () {
    var taskid = this.data.taskOngoing._id
    var newid = this.data.taskOngoing.Reciverid
    console.log(newid)
    let i = newid.indexOf(app.globalData.stuID)
    newid.splice(i, 1)
    console.log(newid)
    var that = this;

    wx.showModal({
      title: '',
      content: '真的要退出吗',
      confirmText: "是的",
      cancelText: "手抖",
      success: function (res) {
        console.log(res);
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
  ////////////////完成任务///////////////////////
  complete: function (e) {
    console.log(this.data.candiopenid)
    var that = this
    for (var i = 0; i < this.data.candiopenid.length; i++) {
      that.button_two(e, i)
    }
    wx.showToast({
      title: '正在处理',
      icon: 'loading',
      duration: 5000
    });
    db.collection('taskDone').add({
      data: {
        /*库新添项*/
        taskid: that.data.taskOngoing._id,
        briefInf: that.data.taskOngoing.briefInf, //简介
        Giverid: that.data.taskOngoing.Giverid, //发起者id
        Reciverid: that.data.taskOngoing.Reciverid,
        category: that.data.taskOngoing.category, //类别,
        detailsInf: that.data.taskOngoing.detailsInf, //具体info
        dateInf: that.data.taskOngoing.dateInf, //日期
        teammate: that.data.taskOngoing.teammate, //队友人数
        checkboxItems: that.data.taskOngoing.checkboxItems //高级设置
      },
      success(res) {
        db.collection('taskOngoing').doc(that.data.taskOngoing._id).remove({
          success(res) {
            wx.hideToast();
            /////////////////////////////////
            //在这里加入队员通知////////////////

            /////////////////////////////////
            wx.showModal({
              title: '组队完成',
              content: '已通知您的队员',
              showCancel: false,
              success: function (res) {
                if (res.confirm) { //发布成功后
                  wx.switchTab({
                    url: '../usercenter/usercenter'
                  })
                }
              },
            })
          }
        })
      },
    })

  },
  ////////////////////////////发送消息/////////////////////
  button_two: function (e, i) {
    var candiopenid = this.data.candiopenid[i]
    console.log(candiopenid)
    var wxid = this.data.stuinf.number


    console.log(candiopenid)
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
      _openid: candiopenid,
      date: _.gt(week) //获取7天内
    }).get().then(res => {
      console.log(res.data)
      var formIdList = res.data
      let date = new Date();
      let data = JSON.stringify({
        "keyword1": {
          "value": "组队已完成！"
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
          // page: "/pages/fromID/index?sender_openid=" + wx.getStorageSync("openid") + "&value=" + value, //携带参数
          form_id: formIdList[0].formId,
          data,
          emphasis_keyword: "keyword1.DATA"
        },
        success: res => {
          console.log('模版消息发送成功: ', res)
          var id = formIdList[0]._id
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
        },
        fail: err => {
          console.error('模版消息发送失败：', err)
        }
      })
    })



  },
  ////////////////查看候选人///////////////////////
  seeCandi: function () {
    var that = this
    wx.navigateTo({
      url: '../candidate/candidate?taskongoing=' + JSON.stringify(that.data.taskOngoing),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
});