var app = getApp()
const db = wx.cloud.database();
const _ = db.command
//wx.cloud.init();
Page({
  data: {
    stuID: '',
    category: ['比赛', '项目', '拼车', '其他'],
    taskOngoing: {
      Giverid: '',
      Reciverid: [],
      _id: '',
      briefInf: '',
      category: '',
      taskid: ''
    },
    users:{
      major:'',
      school:'',
      username:'',
      userid:''
    },
    userlist:[]
  },
  onLoad: function (option) {
    this.setData({
      stuID: app.globalData.stuId,
      taskOngoing: JSON.parse(option.taskongoing),
    })
  },
///////////显示候选人信息/////////////////
///////////有bug未解决//////////////////
  onShow:function(){
    var list =[]
    list= this.data.taskOngoing.Reciverid
    console.log(list)
    for(let candi of list){
      console.log(candi)
      db.collection('userAll').where({
        "userid" : candi
      })
      .get({
        success: res => {
          let temp=res.data
          
          this.data.userlist.push(temp)
          
        },
        fail(res) {
          console.log(fail)
        }
      })
    }
    console.log(this.data.userlist)
  }

})