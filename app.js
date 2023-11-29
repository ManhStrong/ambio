const express = require("express");
const cors = require("cors");
import dotenv from "dotenv";
import util from "util";

require("./index.js");

// const redis = require("redis");
// const redisUrl = "redis://127.0.0.1:6379";
// let client = redis.createClient(redisUrl);
// client.set = util.promisify(client.set);

const initRoutes = require("./routes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.post("/", async (req, res) => {
//   console.log(req.body, "huhuhu");
//   const { key, value } = req.body;
//   const response = await client.set(key, value);
//   res.json(response);
// });
initRoutes(app);

//app.use("/api/users", userRouter);

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running", process.env.APP_PORT);
});
