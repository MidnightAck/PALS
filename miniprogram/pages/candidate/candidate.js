var app = getApp()
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
    users:{
      major:'',
      openid: '',
      school:'',
      userid:'',
      username: '',
      
    },
    userlist:[],
    tar_openid:''
  },
  onLoad: function (option) {
    this.setData({
      stuID: app.globalData.stuId,
      taskOngoing: JSON.parse(option.taskongoing),
    })
  },
///////////显示候选人信息/////////////////
///////////有bug未解决//////////////////
  onShow:function(){
    ///////////获取目标openid///////////////////
    db.collection('userAll').where({
      userid: '1754026',
    })
    .get({
        success: res => {
          console.log(res.data)
          let users=res.data
          this.data.users=res.data
          console.log(this.data.users)
        },
        fail(res) {
          console.log(fail)
        }
      })
    
    
  },

/////////////////发送候选人申请/////////////////////
  makeCandi(e) {
    let week = new Date() - (1000 * 60 * 60 * 24 * 7) //建立7天时间戳
    //////////储存formId，并打时间戳/////////////////
    db.collection('formId').add({
      data: {
        openid: this.users.openid,
        formId: e.detail.formId,
        date: (new Date()).valueOf()
      }
    })
      .then(res => {
        console.log(res)
      })

    ///////////获取formId数据 //////////////////
    db.collection('formId').where({
      _openid: this.data.user.openid,
      date: _.gt(week) //获取7天内
    }).get().then(res => {
      console.log(res.data)
      var formIdList = res.data
      let date = new Date();
      let data = JSON.stringify({
        "keyword1": {
          "value": this.data.taskOngoing.briefInf
        },
        "keyword2": {
          "value": date
        },
        "keyword3": {
          "value": this.data.users.username
        },
        "keyword4": {
          "value": "13896547502"
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