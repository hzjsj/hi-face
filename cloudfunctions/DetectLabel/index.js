// 云函数入口文件
const extCi = require("@cloudbase/extension-ci");
const tcb = require("tcb-admin-node");

tcb.init({
  env: "svip9"
});
tcb.registerExtension(extCi);

// 云函数入口函数
exports.main = async (event, context) => {
  const fileID = event.fileID;
  console.log('fileID :', fileID);
  try {

    let imgID = fileID.replace('cloud://', '')
    let index = imgID.indexOf('/')
    let cloudPath = imgID.substr(index)

    const res = await tcb.invokeExtension("CloudInfinite", {
      action: "DetectLabel",
      cloudPath: cloudPath // 需要分析的图像的绝对路径，与tcb.uploadFile中一致
    });
    return 
    console.log(JSON.stringify(res.data, null, 4));
  } catch (err) {
    console.log(JSON.stringify(err, null, 4));
  }
}