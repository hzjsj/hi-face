// pages/storageConsole/storageConsole.js

const app = getApp()

Page({

  data: {
    fileID: '',
    cloudPath: '',
    imagePath: '',
    RecognitionResult: {},
    PornInfo:'',
    TerroristInfo:''
  },

  onLoad: function (options) {
    const {
      fileID,
      cloudPath,
      imagePath,
    } = app.globalData

    this.setData({
      fileID,
      cloudPath,
      imagePath,
    })
    wx.showLoading({
      title: '识别中...',
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'check_img',
      // 传递给云函数的event参数
      data: {
        type:"porn,terrorist,politics",
        fileID: this.data.cloudPath
      }
    }).then(res => {
      console.log(res)
      let data = res.result.data.RecognitionResult;
      this.setData({
        PornInfo:JSON.stringify(data.PornInfo),
        TerroristInfo:JSON.stringify(data.TerroristInfo),
        PoliticsInfo: JSON.stringify(data.PoliticsInfo),
      })
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      // handle error
    })
  },

})