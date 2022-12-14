/**
 * 环境配置
 * Author：Gonwe
 * Date：202107192106
 */

const env = import.meta.env.MODE || "prod";

const EnvConfig = {
  dev: {
    baseApi: "/api",
    mockApi: "https://www.fastmock.site/mock/9597762193a6565a648a7ed2b27d9994/api",
  },
  test: {
    baseApi: "https://www.fastmock.site/mock/9597762193a6565a648a7ed2b27d9994/api",
    mockApi: "https://www.fastmock.site/mock/9597762193a6565a648a7ed2b27d9994/api",
  },
  prod: {
    baseApi: "https://www.fastmock.site/mock/9597762193a6565a648a7ed2b27d9994/api",
    mockApi: "https://www.fastmock.site/mock/9597762193a6565a648a7ed2b27d9994/api",
  },
};
export default {
  env,
  mock: false,
  namespace: "koa-manger",
  ...EnvConfig[env],
};

console.log(`当前环境：${env}`,import.meta.env);