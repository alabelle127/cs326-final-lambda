import dotenv from "dotenv";
import express, { Express } from "express";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
