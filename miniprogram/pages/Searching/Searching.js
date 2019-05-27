//index.js
//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js')
var app = getApp()
const db = wx.cloud.database();
const _ = db.command
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
      detailsInf: '',
      length: 0,
      giverInf: ''
    }],
    totalCount: 0,
    tags: [],
    pageSize: 20,
    sinput: ''
  },
  onLoad: function(options) {

    console.log('onLoad')
    this.data.sinput = options.sinput
    var that = this
    console.log(this.data.sinput)
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['拼车', '比赛', '游玩', '推剧本', '约电影']);
    WxSearch.initMindKeys(['拼车', '比赛', '游玩', '推剧本', '约电影']);

  },

  ///////////////////////////搜索框相关///////////////////////////////////
  ///////////////////////////进行搜索/////////////////////////////////////
  wxSearchFn: function(e) {
    console.log('Sfn')
    var that = this
    this.data.sinput = WxSearch.wxSearchAddHisKey(that);

    var stand = this.data.sinput;
    
    switch (stand) {
      case ('拼车'): stand = '2'; break;
      case ('比赛'): stand = '0'; break;
      case ('项目'): stand = '1'; break;
      case ('其他'): stand = '3'; break;
      default: break;
    }
    
    console.log(stand)
    db.collection('taskOngoing').where(_.or([{
      briefInf: db.RegExp({
        regexp: this.data.sinput,
        options: 's',
      })
    },
    {
      detailsInf: db.RegExp({
        regexp: this.data.sinput,
        options: 's',
      })
    },
    {
      category: db.RegExp({
        regexp: this.data.sinput,
        options: 's',
      })
    }
    ])).get({
      success: res => {
        console.log(res.data)
        let taskOngoing = res.data;
        if (taskOngoing) {
          this.setData({
            taskOngoing: taskOngoing
          })
        }
        //console.log(taskOngoing.length)
      },
      fail(res) {
        console.log(fail)
      }
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
    console.log(this.data.sinput)
  

    switch (this.data.sinput) {
      case ('拼车'): this.data.sinput = '2'; break;
      case ('比赛'): this.data.sinput = '0'; break;
      case ('项目'): this.data.sinput = '1'; break;
      case ('其他'): this.data.sinput = '3'; break;
      default: break;
    }

    db.collection('taskOngoing')
      .where(_.or([{
        briefInf: db.RegExp({
          regexp: this.data.sinput,
          options: 's',
        })
      },
      {
        detailsInf: db.RegExp({
          regexp: this.data.sinput,
          options: 's',
        })
      },
      {
        category: db.RegExp({
          regexp: this.data.sinput,
          options: 's',
        })
      }
      ]))
      .count({
        success: function(res) {
          that.data.totalCount = res.total;
          console.log(this.data.totalCount)
        }
      })

    //console.log(taskOngoing.stuId)
    db.collection('taskOngoing')
      .where(_.or([{
        briefInf: db.RegExp({
          regexp: this.data.sinput,
          options: 's',
        })
      },
      {
        detailsInf: db.RegExp({
          regexp: this.data.sinput,
          options: 's',
        })
      },
      {
        category: db.RegExp({
          regexp: this.data.sinput,
          options: 's',
        })
      }
      ]))
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
          .where(_.or([{
            briefInf: db.RegExp({
              regexp: this.data.sinput,
              options: 's',
            })
          },
          {
            detailsInf: db.RegExp({
              regexp: this.data.sinput,
              options: 's',
            })
          },
            {
              category: db.RegExp({
                regexp: this.data.sinput,
                options: 's',
              })
            }
          ]))
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

  showModal: function(e) {
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
    if (e.detail.formId != null) {
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


  joinTeam: function(e) {
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
      success: function(res) {
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
        } else {
          console.log('用户手抖了')
        }
      }
    })
  },

  ///////////////////////收藏队伍///////////////////////
  star: function(e) {
    console.log(e.currentTarget.dataset.target)
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