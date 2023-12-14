const client = require("./initRedis");
module.exports = {
  setRedis: async ({ key, value }) => {
    try {
      return new Promise((resolve, reject) => {
        client.set(key, value, "EX", 60 * 8, (err, rs) => {
          return !err ? resolve(rs) : reject(err);
        });
      });
    } catch (error) {
      throw error;
    }
  },

  getRedis: async (key) => {
    try {
      return new Promise((resolve, reject) => {
        client.get(key, (err, rs) => {
          return !err ? resolve(rs) : reject(err);
        });
      });
    } catch (error) {
      throw error;
    }
  },
};
