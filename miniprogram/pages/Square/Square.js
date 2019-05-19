//index.js
//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js')
var app = getApp()
const db = wx.cloud.database();

Page({
  data: {
    feed: [],
    feed_length: 0,
    category: ['比赛', '项目', '拼车', '其他'],
    taskOngoing: [{
      Giverid: '',
      Reciverid: [],
      _id: '',
      briefInf: '',
      category: '',
      length: 0
    }],
    totalCount: 0,
    tags: [],
    pageSize: 20,
    sinput:''
  },
  
  onLoad: function() {
    console.log('onLoad')
    var that = this
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['拼车', '比赛', '游玩', '推剧本', '约电影']);
    WxSearch.initMindKeys(['拼车', '比赛', '游玩', '推剧本', '约电影']);

    
  },

  ///////////////////////////搜索框相关///////////////////////////////////
  ///////////////////////////进行搜索/////////////////////////////////////
  wxSearchFn: function(e) {
    console.log('Sfn')
    var that = this
    this.data.sinput =WxSearch.wxSearchAddHisKey(that);
    var stand = this.data.sinput
    /*
    switch (this.data.sinput) {
      case ('拼车'): stand = '2'; break;
      case ('比赛'): stand = '0'; break;
      case ('项目'): stand = '1'; break;
      case ('其他'): stand = '3'; break;
      default:break;
    }
    */
    wx.navigateTo({
      url: '../Searching/Searching?sinput=' + stand,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  ///////////////////////////搜索框输入/////////////////////////////////////
  wxSearchInput: function(e) {
    console.log('Sinput')
    var that = this
    WxSearch.wxSearchInput(e, that).value
    
  },
  wxSerchFocus: function(e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function(e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function(e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function(e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function(e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function(e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },



  ///////////////////////////显示数据库内容/////////////
  onShow: function() {
    var that = this
    console.log(app.globalData.openid)
    console.log(app.globalData.stuId)
    const db = wx.cloud.database();
    db.collection('taskOngoing').count({
      success: function(res) {
        that.data.totalCount = res.total;
      }
    })

    //console.log(taskOngoing.stuId)
    db.collection('taskOngoing')
      .get({
        success: res => {
          let taskOngoing = res.data;
          if (taskOngoing) {
            this.setData({
              taskOngoing: taskOngoing
            })
          }
        },
        fail(res) {
          console.log(fail)
        }
      })
  },

  /////////////////////////////////获取后续内容//////////////////////
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var temp = [];
    // 获取后面二十条
    if (this.data.taskOngoing.length < this.data.totalCount) {
      try {
        const db = wx.cloud.database();
        db.collection('taskOngoing')
          .skip(20)
          .limit(that.data.pageSize)
          .get({
            success: function(res) {


              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var tempTopic = res.data[i];
                  console.log(tempTopic);
                  temp.push(tempTopic);
                }

                var totaltaskOngoing = {};
                totaltaskOngoing = that.data.taskOngoing.concat(temp);

                console.log(totaltaskOngoing);
                that.setData({
                  taskOngoing: totaltaskOngoing,
                })
              } else {
                wx.showToast({
                  title: '没有更多数据了',
                })
              }
            },
            fail: function(event) {
              console.log("======" + event);
            }
          })
      } catch (e) {
        console.error(e);
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
      })
    }

  },

  /////////////////////////////////显示任务详情//////////////////////
  detailedInf: function(event) {
    var that = this
    //console.log(that.data.taskOngoing[event.currentTarget.dataset.index])
    wx.navigateTo({
      url: '../details/details?index=' + event.currentTarget.dataset.index + '&taskongoing=' + JSON.stringify(that.data.taskOngoing[event.currentTarget.dataset.index]),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },
})