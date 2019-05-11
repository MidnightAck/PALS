Page({
  data: {
    cities: []
  },
  onLoad: function() {
    console.log("usercenter page onload")
  },
  onHide: function() {
    console.log("usercenter page onhide")
  },
  userinf: function() {
    wx.navigateTo({
      url: '../userinf/userinf',
      success: function(res) {
        "login relaunch success"
      },
      fail: function(res) {
        "login relaunch fail"
      },
      complete: function(res) {
        "login relaunch complete"
      },
    })

  }
});