var app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    showTopTips: false,
    value: 1,
    brief: '',
    details: '',
    checkboxItems: [{
        name: '禁止发布在广场中（仅发起者和被转发者可见）',
        value: '0'
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

  },
  onLoad:function(){

  },
  briefInf: function(e) {
    this.setData({
      brief: e.detail.value
    })
  },
  detailsInf: function(e) {
    this.setData({
      details: e.detail.value
    })
  },
  dateInf: function(e) {
    this.setData({
      dateBegin: e.detail.value
    })
  },
  bindCountryChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countryIndex: e.detail.value
    })
    console.log(this.data.countryIndex, 'dasas')
  },
  raise: function() {
    var that = this;


    wx.showToast({
      title: '正在发布中',
      icon: 'loading',
      duration: 10000
    });
    db.collection('taskOngoing').add({
      data: {
        /*库新添项*/
        taskid:'',
        briefInf: that.data.brief, //简介
        Giverid: app.globalData.stuId, //发起者id
        Reciverid:[],
        category: that.data.countryIndex.toString(), //类别,
        detailsInf: that.data.details, //具体info
        dateInf: that.data.date,//日期
        teammate: that.data.value,//队友人数
        checkboxItems: that.data.checkboxItems//高级设置
      },
      success(res) {
        wx.hideToast();
        wx.showModal({
          title: '发布成功',
          content: '去我的任务看看吧',
          showCancel:false,
          success: function (res) {
            if (res.confirm) {//发布成功后
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
  handleChange({
    detail
  }) {
    this.setData({
      value: detail.value
    })
  },
  checkboxChange: function(e) {
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
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindCountryChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countryIndex: e.detail.value
    })
  }
});