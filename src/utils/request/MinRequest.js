const config = Symbol("config");
const isCompleteURL = Symbol("isCompleteURL");
const requestBefore = Symbol("requestBefore");
const requestAfter = Symbol("requestAfter");

class MinRequest {
  [config] = {
    baseURL: "",
    header: {
      "content-type": "application/json",
    },
    method: "GET",
    dataType: "json",
    responseType: "text",
    timeout: "120000", // 单位：ms 默认120s
    isShowLoading: true, // 是否显示loading动画
  };

  interceptors = {
    request: (func) => {
      if (func) {
        MinRequest[requestBefore] = func;
      } else {
        MinRequest[requestBefore] = (request) => request;
      }
    },
    response: (func) => {
      if (func) {
        MinRequest[requestAfter] = func;
      } else {
        MinRequest[requestAfter] = (response) => response;
      }
    },
  };

  static [requestBefore](config) {
    return config;
  }

  static [requestAfter](response) {
    return response;
  }

  static [isCompleteURL](url) {
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);
  }

  setConfig(func) {
    this[config] = func(this[config]);
  }

  request(options = {}) {
    options.baseURL = options.baseURL || this[config].baseURL;
    options.dataType = options.dataType || this[config].dataType;
    options.url = MinRequest[isCompleteURL](options.url)
      ? options.url
      : options.baseURL + options.url;
    options.data = options.data || {};
    options.header = { ...options.header, ...this[config].header };
    options.method = options.method || this[config].method;
    options.isShowLoading =
      options.isShowLoading !== null
        ? options.isShowLoading
        : this[config].isShowLoading;

    options = { ...options, ...MinRequest[requestBefore](options) };
    return new Promise((resolve, reject) => {
      options.success = function (res) {
        resolve(MinRequest[requestAfter](res, { ...options }));
      };
      options.fail = function (err) {
        reject(MinRequest[requestAfter](err, { ...options }));
      };
      uni.request(options);
    });
  }

  get(url, data, isShowLoading = true, options = {}) {
    options.url = url;
    options.data = data;
    options.method = "GET";
    options.isShowLoading = isShowLoading;
    return this.request(options);
  }

  post(url, data, isShowLoading = true, options = {}) {
    options.url = url;
    options.data = data;
    options.method = "POST";
    options.isShowLoading = isShowLoading;
    return this.request(options);
  }
}

export default MinRequest;
