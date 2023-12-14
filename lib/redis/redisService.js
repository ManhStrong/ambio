const client = require("./initRedis");
module.exports = {
  setRedis: async ({ key, value }) => {
    try {
      return new Promise((resolve, reject) => {
        client.set(key, value, (err, rs) => {
          return !err ? resolve(rs) : reject(err);
        });
      });
    } catch (error) {}
  },

  getRedis: async (key) => {
    try {
      return new Promise((resolve, reject) => {
        client.get(key, (err, rs) => {
          return !err ? resolve(rs) : reject(err);
        });
      });
    } catch (error) {}
  },
};
