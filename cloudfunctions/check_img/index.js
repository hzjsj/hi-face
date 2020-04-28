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

 try {
  const opts = {
    type: event.type
  }
  return res = await tcb.invokeExtension('CloudInfinite',{
    action:'DetectType',
    cloudPath: fileID, // 需要分析的图像的绝对路径，与tcb.uploadFile中一致
    operations: opts
  })
} catch (err) {
  console.log(JSON.stringify(err, null, 4));
}
}