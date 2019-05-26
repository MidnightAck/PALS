//我的资料
var app = getApp();
const db = wx.cloud.database();
const _ = db.command
Page({
  /*-----------------
   * 页面的初始数据
   ----------------*/
  data: {
    stuinf: {
      openid: '', //_id
      id: '', //学号
      name: '', //姓名
      number: '', //联系方式
      school: '', //学院
      major: '', //专业
      tag: ["牛逼", "你好"], //标签
      detail: '', //个人简介
      starnum: 0, //收藏数
      starlist: [''], //收藏任务号
      userInfo: {} //用户信息
    },
    temp: {
      openid: '', //_id
      id: '', //学号
      name: '', //姓名
      number: '', //联系方式
      school: '', //学院
      major: '', //专业
      tag: [''], //标签
      detail: '', //个人简介
      starnum: 0, //收藏数
      starlist: [''], //收藏任务号
      userInfo: {} //用户信息
    },
    tag_copy: [],
    stu_tag_copy: [],
    tag_temp: '', //增加的tag
    userInfo: {},
    tag_length: 0,
    ischanged: false, //是否发生修改
    tag_chosen: false, //是否发生标签选择
    tag_text: '选择',
    add_text: '增加',
    advice_text: '标签',
    ColorList: app.globalData.ColorList
  },
  /*--------------------------
  显示修改框
  ---------------------------*/
  showModal(e) {
    var that = this
    if (that.data.tag_chosen == true) { //如果点击不删了
      that.setData({
        tag_chosen: false,
        tag_text: '选择',
        add_text: '增加',
        advice_text: '标签',
      })
      var length = this.data.stuinf.tag.length;
      console.log(length)
      for (let i = 0; i < length; i++) {
        var change_index_chosen = "temp.tag[" + i + "].chosen"
        this.setData({
          [change_index_chosen]: false
        })
        console.log("改变")
      }
    } else {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }

  },
  /*--------------------------
  隐藏修改框
  ---------------------------*/
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /*--------------------------
  修改联系方式
  ---------------------------*/
  number_change: function(e) {
    this.setData({
      "temp.number": e.detail.value
    })
  },
  /*--------------------------
修改学院
---------------------------*/
  school_change: function(e) {
    this.setData({
      "temp.school": e.detail.value
    })
  },
  /*--------------------------
修改专业
---------------------------*/
  major_change: function(e) {
    this.setData({
      "temp.major": e.detail.value
    })
  },
  /*--------------------------
保存基本信息修改
---------------------------*/
  basic_save: function() {
    var that = this
    this.setData({
      "stuinf.number": this.data.temp.number,
      "stuinf.school": this.data.temp.school,
      "stuinf.major": this.data.temp.major,
      modalName: null,
      ischanged: true
    })
    console.log(this.data.ischanged)
    if (this.data.ischanged == true) {
      console.log("修改")
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'update_user',
        // 传递给云函数的参数
        data: that.data.stuinf,
        success: res => {
          console.log("我的资料修改保存成功")
        },
        fail: err => {
          console.log("没成功")
        },
        complete: () => {
          // ...
        }
      })
    }
  },
  /*--------------------------
   * 生命周期函数--监听页面加载
   *--------------------------*/
  onLoad: function(option) {
    console.log(option)

    this.setData({
      stuinf: JSON.parse(option.stuinf),
      temp: JSON.parse(option.stuinf),

    })
    var length = this.data.stuinf.tag.length;
    this.setData({
      tag_length: length
    })
    console.log(length)
    for (let i = 0; i < length; i++) {
      var change_index_name = "temp.tag[" + i + "].name"
      var change_index_chosen = "temp.tag[" + i + "].chosen"
      this.setData({
        [change_index_name]: this.data.stuinf.tag[i],
        [change_index_chosen]: false
      })
    }
  },
  /*--------------------------
   隐藏页面时上传新数据
   *--------------------------*/
  onHide: function() {

  },
  /*--------------------------
   标签输入框同步
   *--------------------------*/
  tag_add: function(e) {
    this.setData({
      tag_temp: e.detail.value
    })
  },
  /*--------------------------
新增标签
*--------------------------*/
  tag_add_save: function() {
    var that = this

    this.data.stuinf.tag.push(this.data.tag_temp)
    var length = this.data.stuinf.tag.length;
    console.log(length)
    for (let i = 0; i < length; i++) {
      var change_index_name = "temp.tag[" + i + "].name"
      var change_index_chosen = "temp.tag[" + i + "].chosen"
      this.setData({
        [change_index_name]: this.data.stuinf.tag[i],
        [change_index_chosen]: false
      })
    }
    console.log("改变")
    console.log(this.data.temp.tag)
    console.log(this.data.stuinf.tag)
    var length2 = this.data.stuinf.tag.length;
    this.setData({
      modalName: null,
      ischanged: true,
      tag_length: length2
    })
    if (this.data.ischanged == true) {
      console.log("修改")
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'update_user',
        // 传递给云函数的参数
        data: that.data.stuinf,
        success: res => {
          console.log("我的资料修改保存成功")
        },
        fail: err => {},
        complete: () => {
          // ...
        }
      })
    }


  },
  /*--------------------------
   标签选择
   *--------------------------*/
  tag_tap: function(e) {
    if (this.data.tag_chosen == true) { //如果进入选择模式
      var i = e.currentTarget.dataset.index
      console.log(i)
      if (this.data.temp.tag[i].chosen == false) { //点击变镂空
        var change_index_chosen = "temp.tag[" + i + "].chosen"
        this.setData({
          [change_index_chosen]: true
        })
        console.log(this.data.temp.tag[i].chosen)
      } else { //再次点击回实心
        var change_index_chosen = "temp.tag[" + i + "].chosen"
        console.log("?")
        this.setData({
          [change_index_chosen]: false
        })
      }
      console.log("改变")
      console.log(this.data.temp.tag[i].chosen)
    }
  },
  /*--------------------------
   标签删除
   *--------------------------*/
  tag_chose_del: function() {
    var that = this
    console.log(this.data.temp)

    if (that.data.tag_chosen == false) {
      that.setData({
        tag_chosen: true,
        tag_text: '删除空心项',
        add_text: '不删了',
        advice_text: '点击要删除的标签'
      })
    } else {
      var length = that.data.stuinf.tag.length;
      var j = 0
      for (let i = 0; i < length; i++) {
        if (that.data.temp.tag[i].chosen == false) {
          var change_index_name = "tag_copy[" + j + "].name"
          var change_index_chosen = "tag_copy[" + j + "].chosen"
          var change_index_stutag = "stu_tag_copy[" + j + "]"
          this.setData({
            [change_index_name]: that.data.stuinf.tag[i],
            [change_index_stutag]: that.data.stuinf.tag[i],
            [change_index_chosen]: false
          })
          j++;
        }
      }

      if(j==length){
        that.setData({
          tag_chosen: false, //是否发生标签选择
          tag_text: '选择',
          add_text: '增加',
          advice_text: '标签',
          tag_length: j
        })
        return 

      }
      that.setData({
        "stuinf.tag": this.data.stu_tag_copy,
        "temp.tag": this.data.tag_copy,
        tag_chosen: false, //是否发生标签选择
        tag_text: '选择',
        add_text: '增加',
        advice_text: '标签',
        tag_length: j
      })

      console.log(that.data.tag_length)
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'update_user',
        // 传递给云函数的参数
        data: that.data.stuinf,
        success: res => {
          console.log("我的资料修改保存成功")
        },
        fail: err => {},
        complete: () => {
          // ...
        }
      })

    }


  },
  /*--------------------------
个人简介修改
---------------------------*/
  detail_input: function(e) {
    this.setData({
      "temp.detail": e.detail.value
    })
  },

  /*--------------------------
个人简介保存
---------------------------*/
  detail_save: function () {
    var that = this
    this.setData({
      "stuinf.detail": this.data.temp.detail,
      modalName: null,
      ischanged: true
    })
    if (this.data.ischanged == true) {
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'update_user',
        // 传递给云函数的参数
        data: that.data.stuinf,
        success: res => {
          console.log("我的资料修改保存成功")
        },
        fail: err => { },
        complete: () => {
          // ...
        }
      })
    }
  },
  /*
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 生命周期函数--监听页  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})