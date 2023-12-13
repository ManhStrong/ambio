const { createClient } = require("redis");
const dotenv = require("dotenv");
dotenv.config();

const client = createClient({
  url: process.env.REDIS_URI,
});
client.ping(function (err, result) {
  console.log(result);
});
client.on("connect", () => {
  console.log("Redis client connect wirh URI");
});
client.on("error", (error) => {
  console.error(error);
});
module.exports = client;
