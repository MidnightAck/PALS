//login.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    console.log("login page onload")
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  onHide:function(){
    console.log("login page onhide")
  },
  mes:function(){
  wx.reLaunch({
    url: '../message/message',    
  })
  }
})
