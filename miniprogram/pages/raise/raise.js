var app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    value: 1,
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
    date: "2019-09-01",
    //time: "12:01"
    countries: ["比赛", "项目", "拼车", "其他"],
    countryIndex: 0,
    isAgree: false
  },
  onShow: function () {
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
  },
  onLoad: function () {
  },
  /*------------------------
  任务简述setdata
  ------------------------*/
  briefInf: function (e) {
    this.setData({
      brief: e.detail.value
    })
  },
  /*------------------------
  任务详情setdata
  ------------------------*/
  detailsInf: function (e) {
    this.setData({
      details: e.detail.value
    })
  },
  /*------------------------
  任务时间setdata
  ------------------------*/
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  /*------------------------
  任务类别改变setdata
  ------------------------*/
  bindCountryChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countryIndex: e.detail.value
    })
  },
  /*------------------------
  任务人数setdata
  ------------------------*/
  handleChange({
    detail
  }) {
    this.setData({
      value: detail.value
    })
  },
  /*------------------------
  高级设置setdata
  ------------------------*/
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.checkboxItems,
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
      checkboxItems: checkboxItems
    });
  },
////////////////////////添加formid///////////////////////
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

  /*------------------------
  发起任务 在数据库中添加记录
  ------------------------*/
  raise: function (e) {
    this.button_three(e)
    var that = this;
    if (this.data.brief == '') {
      wx.showModal({
        title: '提示',
        content: '请输入任务简述',
        confirmColor: '#7a378b',
        showCancel: false
      })
      return
    }
    if (this.data.details == '') {
      wx.showModal({
        title: '提示',
        content: '请输入任务详情',
        confirmColor: '#7a378b',
        showCancel: false
      })
      return
    }
    wx.showToast({
      title: '正在修改中',
      icon: 'loading',
      duration: 10000
    });
    db.collection('taskOngoing').add({
      data: {
        /*库新添项*/
        taskid: app.globalData.stuId + '1',
        briefInf: that.data.brief, //简介
        Giverid: app.globalData.stuId, //发起者id
        Reciverid: [],
        category: that.data.countryIndex.toString(), //类别,
        detailsInf: that.data.details, //具体info
        dateInf: that.data.date, //日期
        teammate: that.data.value, //队友人数
        checkboxItems: that.data.checkboxItems //高级设置
      },
      success(res) {
        wx.hideToast();
        wx.showModal({
          title: '发布成功',
          content: '去我的任务看看吧',
          showCancel: false,
          success: function (res) {
            if (res.confirm) { //发布成功后
              wx.switchTab({
                url: '../usercenter/usercenter'
              })
            }
          },
        })
        console.log(res)
      },
    })
  },
});