const cloud = require("wx-server-sdk");
cloud.init();
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.img.aiCrop({ imgUrl: event.imgUrl });
    console.log("aiCrop----->>>" + result);

    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};
