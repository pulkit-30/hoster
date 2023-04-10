import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import path from "path";
import cors from "cors";
import connect from "./db/connect";
import auth from "./routes/auth";
import index from "./routes/index";
import user from "./routes/user";
const app: Application = express();

app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.use("public", express.static(path.join(__dirname, "public")));

// app endpoints
app.use("/v1/api/", index);
app.use("/v1/api/auth", auth);
app.use("/v1/api/user", user);

// setup server
const port: number = 80;
app.listen(port, async () => {
  console.log(`app running at port: ${port}`);
  console.log(`visit: http://localhost:${port}/`);
  await connect();
});
