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
      wx.hideLoading()
      console.log(res) 
      this.setData({
        labels:res.result.data.list
      })
    })
    .catch(console.error)
  },
    //图像安全审核
    imgCheck:function(e){
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
                this.setData({
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
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})