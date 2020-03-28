const cloud = require("wx-server-sdk");
cloud.init();
exports.main = async (event, context) => {
  console.log(event.imgUrl);
  
  try {
    const result = await cloud.openapi.ocr.printedText({
      type: "photo",
      imgUrl: event.imgUrl
    });
    console.log("------>>>>" + result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};
