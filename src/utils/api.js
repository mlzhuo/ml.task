import { config } from "@/config";
import axios from "axios";
axios.defaults.adapter = function(config) {
  return new Promise((resolve, reject) => {
    let data = config.method === "get" ? config.params : config.data;
    wx.request({
      url: config.url,
      method: config.method,
      data: data,
      header: config.headers,
      success: res => {
        return resolve(res);
      },
      fail: err => {
        return reject(err);
      }
    });
  });
};

export async function $axios({ method, url, data, headers }) {
  try {
    const response = await axios({
      url: config.apiURL + url,
      method,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
        ...headers
      },
      data
    });
    return response.data;
  } catch (e) {
    console.error("$axios exception:", e);
  }
}
