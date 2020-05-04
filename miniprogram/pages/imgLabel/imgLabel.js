// pages/imgLabel/imgLabel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:'',
    labels:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //图片标签
  imgLabel:function(e){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'imgLabel',
      // 传给云函数的参数
      data: {
        fileID:e
      },
    })
    .then(res => {
      this.setData({
        labels:res.result.data.list
      })
      wx.hideLoading()
    })
    .catch(error => {
      wx.showToast({
        title: '识别识别',
        icon: 'none',
        duration: 2000
      })
    })
  },
    //图像安全审核
    imgCheck:function(e){
      let that = this
      let fileID = e
      wx.cloud.callFunction({
        // 云函数名称
        name: 'imgCheck',
        // 传给云函数的参数
        data: {
          fileID: fileID
        },
      })
      .then(res => {
        if(res.result.status == 0){
          this.imgLabel(fileID)
        }else{
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: res.result.message+'，请重新上传',
            showCancel:false,
            success (res) {
              if (res.confirm) {
                that.setData({
                  image:''
                })
                console.log('用户点击确定')
              } 
            }
          })
        }
        console.log(res) 
      })
      .catch(console.error)
    },
    // 上传图片
    doUpload: function () {
      let that = this;
      // 选择图片
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
         
          wx.showLoading({
            title: '识别中',
          })
  
          const filePath = res.tempFilePaths[0]
          that.setData({
            image:filePath,
            labels:[]
          })
          // 上传图片
          const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功：', res)
  
              that.imgCheck(res.fileID);
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              
            }
          })
  
        },
        fail: e => {
          console.error(e)
        }
      })
    }
})