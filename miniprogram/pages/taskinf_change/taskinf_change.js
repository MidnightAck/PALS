var app = getApp()
const db = wx.cloud.database();
//wx.cloud.init();
Page({
  data: {
    index: 0,
    stuID: '',
    date: "2019-09-01",
    countries: ["比赛", "项目", "拼车", "其他"],
    taskOngoing: {
      Giverid: '',
      Reciverid: '',
      _id: '',
      briefInf: '',
      category: '',
      taskid: ''
    },
    values: 0, 
    showTopTips: false,
    brief: '',
    details: '',
    checkboxItems: [{
        name: '禁止发布在广场中（仅发起者和被转发者可见）',
        value: '0'
      },
      {
        name: '指定标签可见',
        value: '1'
      },
      {
        name: '要求候选人填写说明',
        value: '2'
      }
    ],

  },
  /*taskinf_change页面加载时更新信息*/
  onLoad: function(option) {
    this.setData({
      //index: option.index,
      stuID: app.globalData.stuId,
      taskOngoing: JSON.parse(option.taskongoing),
    })
  },
  /*taskinf_change页面隐藏 */
  onHide: function() {
    console.log("taskinf page onhide")
  },
  /*高级选项更改 */
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.taskOngoing.checkboxItems,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      'taskOngoing.checkboxItems': checkboxItems
    });
  },
  /*任务类型更改 */
  bindCountryChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      'taskOngoing.category': e.detail.value
    })
    console.log(this.data.taskOngoing.category)
  },
  /*任务开始时间更改提示 */
  bindDateChange: function(e) {
    this.setData({
      'taskOngoing.dateInf': e.detail.value
    })
  },
  /*需要人数变更提示 */
  handleChange({
    detail
  }) {
    this.setData({
      'taskOngoing.teammate': detail.value
    })
  },
  /*队伍简述更改 */
  briefInf: function(e) {
    this.setData({
      'taskOngoing.briefInf': e.detail.value
    })
  },
  /*队伍详细内容更改 */
  detailsInf: function(e) {
    this.setData({
      'taskOngoing.detailsInf': e.detail.value
    })
  },
  /*保存：把修改后的信息更新到数据库，给出成功提示，返回usercenter页面 */
  save: function() {
    var that = this;
    wx.showToast({
      title: '正在发布中',
      icon: 'loading',
      duration: 10000
    });
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'update',
      // 传递给云函数的参数
      data: that.data.taskOngoing,
      success: res => {
        wx.hideToast();
        wx.showModal({
          title: '修改成功',
          content: '您的修改信息已经同步发送给组员',
          showCancel: false,
          confirmText: '确认',
          confirmColor: '',
          success: function (res) { 
            if(res.confirm){//保存修改后
              wx.switchTab({
                url: '../usercenter/usercenter'
              })
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: err => {
        // handle error
      },
      complete: () => {
        // ...
      }
    })
    
    /*db.collection('taskOngoing').doc('988c1b1b5cbe7aee04ea226d2c9e116f').update({
        data: {

          briefInf: that.data.taskOngoing.briefInf, //简介
          category: that.data.taskOngoing.category, //类别,
          detailsInf: that.data.taskOngoing.detailsInf, //具体info
          dateInf: that.data.taskOngoing.dateInf, //日期
          teammate: that.data.taskOngoing.teammate, //队友人数
          checkboxItems: that.data.taskOngoing.checkboxItems //高级设置
        },
        success(res) {
          
        }
      })*/
  




  },
});