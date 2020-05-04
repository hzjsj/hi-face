const GENDER_STATUS = ['未知', '男', '女']
const EXPRESS_MOOD = ['黯然伤神', '半嗔半喜', '似笑非笑', '笑逐颜开', '莞尔一笑', '喜上眉梢', '眉开眼笑', '笑尽妖娆', '心花怒放', '一笑倾城']
const HAVE_STATUS = ['无', '有']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color:"",
    tips:'上传带人脸的正面照',
    currentShapeIndex:-1,
    pageMainColor: '',
    faceFileID:'',
    faceImageUrl: '',
    FaceInfos:[],
    shapeList: [],
    labelList: [],
    showCutList: [],
    shape:{}
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  //显示和隐藏人脸魅力
  onChooseShape(e){
    let index = e.currentTarget.dataset.index
    let currentShapeIndex = this.data.currentShapeIndex === index ? -1 : index
    this.setData({
      currentShapeIndex,
      tips:currentShapeIndex >= 0 ? '点击红色人脸框，可隐藏人脸魅力值' : '点击人脸框，可以显示人脸魅力值'
    })
  },

  //人脸图片裁剪
  cutList:function(){
    let faceImageUrl = this.data.faceImageUrl
    let FaceInfos = this.data.FaceInfos
    let  showCutList = FaceInfos.map((item, shapeIndex) => {
      const { X, Y, Height, Width } = item
      let rule = '|imageMogr2/cut/' + Width + 'x' + Height + 'x' + X + 'x' + Y
      return {
        shapeIndex,
        cutFileUrl: faceImageUrl + rule,
        x: X,
        y: Y,
        width: Width,
        height: Height,
      }
    })

    let shapeList = FaceInfos.map((item, shapeIndex) => {
      const { X, Y, Height, Width, FaceAttributesInfo = {} } = item
      const { Gender, Age, Expression, Beauty, Glass, Hat, Mask } = FaceAttributesInfo

      return {
        shapeIndex,
        left: X,
        top: Y,
        width: Width,
        height: Height,
        age: Age,
        genderStr: GENDER_STATUS[Gender],
        expressionStr: EXPRESS_MOOD[parseInt(Expression / 10, 10)],
        beauty: Beauty,
        glassStr: HAVE_STATUS[Number(Glass)],
        hatStr: HAVE_STATUS[Number(Hat)],
        maskStr: HAVE_STATUS[Number(Mask)],
      }
    })
    
    this.setData({
      showCutList:showCutList,
      shapeList:shapeList,
      tips:'点击人脸框，可以显示人脸魅力值'
    })
  },

  //获取图片信息
  imgFace:function(e){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'detect-face',
      // 传给云函数的参数
      data: {
        fileID: e
      },
    })
    .then(res => {
      
      console.log(res)
      if(res.result.status != 0){
        return wx.showToast({
          title: res.result.message,
          icon: 'none',
          duration: 2000
        })
      }
      let data = res.result.data
      this.setData({
        faceFileID:data.faceFileID,
        faceImageUrl:data.faceImageUrl,
        FaceInfos:data.FaceInfos
      })
      this.cutList()
      this.getColor(e)
      wx.hideLoading()
    })
    .catch(console.error)
  },

  //调用云函数获取图片主色调
  getColor:function(e){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getColor',
      // 传给云函数的参数
      data: {
        fileID: e
      },
    })
    .then(res => {
      console.log(res.result)
      this.setData({
        color:res.result.data.mainColor
      })
    })
    .catch(console.error)
  },
  // 上传图片
  chooseImage: function () {
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

        // 上传图片
        const cloudPath = 'my-image' + `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}` + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            that.imgFace(res.fileID);
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