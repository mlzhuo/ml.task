const cloud = require("wx-server-sdk");
exports.main = async (event, context) => {
  // 这里获取到的 openId、 appId 和 unionId 是可信的，注意 unionId 仅在满足 unionId 获取条件时返回
  return new Promise((resolve, reject) => {
    let { ENV, OPENID, APPID, UNIONID } = cloud.getWXContext();
    resolve({
      ENV,
      OPENID,
      APPID,
      UNIONID
    });
  });
};
