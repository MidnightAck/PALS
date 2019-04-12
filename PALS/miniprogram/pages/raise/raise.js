var app = getApp();
wx.cloud.init();
const db = wx.cloud.database();
Page({
  data: {
    showTopTips: false,
    value: 1,
    brief: '',

    radioItems: [{
        name: 'cell standard',
        value: '0'
      },
      {
        name: 'cell standard',
        value: '1',
        checked: true
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
    time: "12:01",

    countries: ["比赛", "项目", "拼车", "其他"],
    countryIndex: 0,

    isAgree: false
  },
  briefInf: function(e) {
    this.setData({
      brief: e.detail.value
    })
  },
  bindCountryChange: function(e) {
    this.setData({
      contryIndex: e.detail.value
    })

  },
  raise: function() {
    var that = this;
    let index = that.data.countryIndex;
    let dataIntro = {};
    let key = 'contries[' + that.data.countryIndex + ']';
     // key 可以是任何字符串
    that.setData(dataIntro.countryIndex)

    wx.showToast({
      title: '正在发布中',
      icon: 'loading',
      duration: 10000
    });
    db.collection('tasking').add({
      data: {
        /*库新添项*/
        briefInf: that.data.brief, //简介
        raiserid: app.globalData.stuId, //发起者id
        category:  key//类别,
      },
      success(res) {
        wx.hideToast();
        wx.showModal({
          title: '发布成功',
          content: '去我的任务看看吧',
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
  showTopTips: function() {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
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
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindCountryCodeChange: function(e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  bindCountryChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    })
  },
  bindAccountChange: function(e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      accountIndex: e.detail.value
    })
  },
  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  }
});