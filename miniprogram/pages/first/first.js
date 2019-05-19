Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid:''
  },


  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid', complete: res => {
       // console.log('云函数获取到的openid: ', res.result.openId)    
        var openid = res.result.openId;
      }
    })
  },
  

  onLoad() {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res.userInfo)
              wx.switchTab({
                url: '../Square/Square'
                //url:'../square/square'
              })
            }
          })
        }
      }
    })
    this.getOpenid();
    console.log(this.data.openid)
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  }
})