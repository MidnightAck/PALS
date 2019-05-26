//index.js
//获取应用实例

var WxSearch = require('../../wxSearch/wxSearch.js')
var app = getApp()
const db = wx.cloud.database();
const _ = db.command
Page({
  data: {
    tabbar: {},
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
    sinput: '',
    candiopenid:'',
    stuinf: {
      openid: '', //_id
      id: '', //学号
      name: '', //姓名
      number: '', //联系方式
      school: '', //学院
      major: '', //专业
      tag: [''], //标签
      detail: '', //个人简介
      starnum: 0, //收藏数
      starlist: [], //收藏任务号
      userInfo: {} //用户信息
    },
    starman: {
      openid: '', //_id
      id: '', //学号
      name: '', //姓名
      number: '', //联系方式
      school: '', //学院
      major: '', //专业
      tag: [''], //标签
      detail: '', //个人简介
      starnum: 0, //收藏数
      starlist: [], //收藏任务号
      userInfo: {} //用户信息
    },
    disabled:false,
    star_disabled: false,
    index: 0,
    stuID: ''
  },

  onLoad: function() {
    console.log('onLoad')
    app.editTabbar();
    var that = this
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['拼车', '比赛', '游玩', '推剧本', '约电影']);
    WxSearch.initMindKeys(['拼车', '比赛', '游玩', '推剧本', '约电影']);
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res.userInfo)
              /*wx.navigateTo({
                url: '../Square/Square'
              })
              /*
              wx.switchTab({
                url: '../Square/Square'
                //url:'../square/square'
              })*/
            }
          })
        } else {
          wx.showModal({
            title: '',
            content: '还未认证用户，是否前往认证',
            confirmText: "就现在",
            cancelText: "等一会",
            success: function(res) {
              console.log(res)
              if (res.confirm) {
                console.log(res)
                wx.navigateTo({
                  url: '../userinf/userinf'
                })
              }

            }
          })
        }
      }
    })
     

  },
  ///////////////////////////搜索框相关///////////////////////////////////
  ///////////////////////////进行搜索/////////////////////////////////////
  wxSearchFn: function(e) {
    console.log('Sfn')
    var that = this
    this.data.sinput = WxSearch.wxSearchAddHisKey(that);
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
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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
    console.log("hi")
    this.setData({
      stuID:app.globalData.stuId
    })
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

  showModal:function(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      modalIndex: e.currentTarget.dataset.index
    })
    console.log("触发任务名:" + this.data.taskOngoing[this.data.modalIndex].briefInf)
    console.log("触发任务名:" + this.data.taskOngoing[this.data.modalIndex]._openid)
    db.collection('userAll').where({
      openid: this.data.taskOngoing[this.data.modalIndex]._openid
    }).get({
      success: res => {
        console.log(res.data)
        this.setData({
          stuinf: res.data[0]
        })
      },
      fail(res) {
        console.log(fail)
      }
    })
/////////////////////////收藏//////////////
    db.collection('userAll').where({
      openid: app.globalData.openid
    }).get({
      success: res => {
        console.log(res.data)
        if (res.data)
          this.setData({
            starman: res.data[0]
          })
        if (this.data.starman.starlist.indexOf(this.data.taskOngoing[this.data.modalIndex]._id) != -1 || app.globalData.stuId == '') {
          this.setData({
            star_disabled: true
          })
        }
      },
      fail(res) {
        console.log(fail)
      }
    })
    console.log(this.data.taskOngoing[this.data.modalIndex])
    ///////////////////////能否加入队伍///////////////////////
    var newid = []
    newid = this.data.taskOngoing[this.data.modalIndex].Reciverid
    console.log(newid)
    console.log(app.globalData.stuId)
    if (newid.indexOf(app.globalData.stuId) != -1) {
      this.setData({
        disabled: true
      })
    }
    console.log(this.data.disabled)
    db.collection('userAll').where({
      id: this.data.taskOngoing[this.data.modalIndex].Giverid
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
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },


  /////////////////////////添加formid/////////////
  button_three(e) {
    console.log(e.detail.formId)
    console.log(new Date())
    if (e.detail.formId!=null) {
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
    }
  },


  joinTeam: function (e) {
    this.button_three(e)
    console.log(this.data.candiopenid[0])
    var newid = []
    var candiopenid = this.data.candiopenid[0]._openid
    console.log(candiopenid)
    newid = this.data.taskOngoing[this.data.modalIndex].Reciverid
    console.log(newid)
    newid.push(app.globalData.stuId)
    console.log(newid)
    var taskid = this.data.taskOngoing[this.data.modalIndex]._id;
    wx.showModal({
      title: '',
      content: '确认加入队伍吗',
      confirmText: "那当然",
      cancelText: "打扰了",
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          /////////////////////////////////////
          wx.cloud.callFunction({
            name: 'join',
            data: {
              _id: taskid,
              newid: newid
            },
            success: res => {
              console.log('更新数据成功')
            },
            fail: res => {
              console.log('mei成功')
            }
          })
          ////////////////////////////////////

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
  },

  ///////////////////////收藏队伍///////////////////////
  star: function () {
    var that = this
    console.log(app.globalData.openid)
    console.log(this.data.starman.starlist)
    this.setData({
      star_disabled: true
    })
    db.collection('userAll').doc(this.data.stuinf._id).update({
      data: {
        starlist: _.push(this.data.taskOngoing[this.data.modalIndex]._id),
        starnum: this.data.stuinf.starnum + 1
      }
    })

  },
})