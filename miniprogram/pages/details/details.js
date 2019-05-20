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
    },
    candiopenid:''
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

    db.collection('userAll').where({
      userid: this.data.taskOngoing.Giverid
    })
      .get({
        success: res => {
          console.log(res.data)
          this.setData({
            candiopenid: res.data
          })
        }
      })
  },
  onHide: function () {
    console.log("taskinf page onhide")
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


  ///////////////////////加入队伍///////////////////////
  joinTeam:function(e){
    this.button_three(e)
    var newid = []
    var candiopenid=this.data.candiopenid[0]._openid
    console.log(candiopenid)
    newid = this.data.taskOngoing.Reciverid
    console.log(newid)
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
                "value": "已有人加入了你的队伍"
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