const cloud = require("wx-server-sdk");
cloud.init();
exports.main = async (event, context) => {
  try {
    const { imgUrl } = event;
    const result = await cloud.openapi.ocr.businessLicense({
      imgUrl
    });
    return { ...result, ocrType: "businessLicense" };
  } catch (err) {
    console.log(err);
    return err;
  }
};
